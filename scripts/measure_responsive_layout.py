import json
import sys
import time
from urllib.request import urlopen, Request

try:
    import websocket
except ImportError as exc:
    raise SystemExit(f'websocket-client unavailable: {exc}')

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 9222
VIEWPORT_WIDTH = int(sys.argv[2]) if len(sys.argv) > 2 else 390
VIEWPORT_HEIGHT = int(sys.argv[3]) if len(sys.argv) > 3 else 844
TARGET_URL = f'http://127.0.0.1:{PORT}/json/new?http://127.0.0.1:3000/?preview=responsive-measure'

try:
    target = json.load(urlopen(Request(TARGET_URL, method='PUT'), timeout=10))
except Exception:
    target = json.load(urlopen(f'http://127.0.0.1:{PORT}/json', timeout=10))[0]

ws = websocket.create_connection(target['webSocketDebuggerUrl'], timeout=15)
message_id = 0

def send(method, params=None):
    global message_id
    message_id += 1
    ws.send(json.dumps({'id': message_id, 'method': method, 'params': params or {}}))
    while True:
        payload = json.loads(ws.recv())
        if payload.get('id') == message_id:
            return payload.get('result', {})

send('Page.enable')
send('Runtime.enable')
send('Emulation.setDeviceMetricsOverride', {'width': VIEWPORT_WIDTH, 'height': VIEWPORT_HEIGHT, 'deviceScaleFactor': 1, 'mobile': VIEWPORT_WIDTH <= 640})
send('Page.navigate', {'url': 'http://127.0.0.1:3000/?preview=responsive-measure'})
time.sleep(5)

script = r'''(() => {
  const rect = (node) => node ? (() => { const r = node.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; })() : null;
  const outer = {
    viewport: {width: innerWidth, height: innerHeight, scrollY},
    iframe: rect(document.querySelector('iframe')),
    footer: rect(document.querySelector('.radar-circular-footer')),
    footerScroll: rect(document.querySelector('.radar-circular-footer-scroll')),
    footerLinks: [...document.querySelectorAll('.radar-circular-footer-link')].map(rect),
    bodyWidth: document.body.scrollWidth,
    docWidth: document.documentElement.scrollWidth,
    bodyHeight: document.body.scrollHeight,
  };
  const frame = document.querySelector('iframe');
  if (frame?.contentDocument) {
    const doc = frame.contentDocument;
    outer.framer = {
      bodyWidth: doc.body.scrollWidth,
      bodyHeight: doc.body.scrollHeight,
      articleSlot: rect(doc.querySelector('#radar-article-stack-slot')),
      articleStack: rect(doc.querySelector('.radar-article-stack')),
      nowReading: [...doc.querySelectorAll('a')].find((a) => a.textContent?.includes('NOW READING')) ? rect([...doc.querySelectorAll('a')].find((a) => a.textContent?.includes('NOW READING'))) : null,
    };
  }
  return outer;
})()'''

result = send('Runtime.evaluate', {'expression': script, 'returnByValue': True, 'awaitPromise': True})
payload = result.get('result', {}).get('value', result)
payload['requestedViewport'] = {'width': VIEWPORT_WIDTH, 'height': VIEWPORT_HEIGHT}
print(json.dumps(payload, indent=2))
ws.close()
