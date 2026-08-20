import json
import sys
import time
from urllib.request import urlopen, Request

import websocket

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 9333
WIDTH = int(sys.argv[2]) if len(sys.argv) > 2 else 390
HEIGHT = int(sys.argv[3]) if len(sys.argv) > 3 else 844
URL = 'http://127.0.0.1:3000/?preview=welcome-mobile-test'

def rect(node):
    if not node:
        return None
    r = node.getBoundingClientRect()
    return {'x': r.x, 'y': r.y, 'width': r.width, 'height': r.height, 'right': r.right, 'bottom': r.bottom}

target = json.load(urlopen(Request(f'http://127.0.0.1:{PORT}/json/new?{URL}', method='PUT'), timeout=10))
ws = websocket.create_connection(target['webSocketDebuggerUrl'], timeout=20)
message_id = 0

def send(method, params=None):
    global message_id
    message_id += 1
    ws.send(json.dumps({'id': message_id, 'method': method, 'params': params or {}}))
    while True:
        payload = json.loads(ws.recv())
        if payload.get('id') == message_id:
            return payload.get('result', {})

def evaluate(expression):
    result = send('Runtime.evaluate', {'expression': expression, 'returnByValue': True, 'awaitPromise': True})
    return result.get('result', {}).get('value')

send('Page.enable')
send('Runtime.enable')
send('Emulation.setDeviceMetricsOverride', {'width': WIDTH, 'height': HEIGHT, 'deviceScaleFactor': 1, 'mobile': True})
send('Emulation.setTouchEmulationEnabled', {'enabled': True, 'configuration': 'mobile'})
send('Page.navigate', {'url': URL})
for _ in range(30):
    time.sleep(0.2)
    if evaluate("document.readyState === 'complete' && Boolean(document.querySelector('.radar-welcome-gate'))"):
        break

time.sleep(0.4)
initial = evaluate(r'''(() => {
  const gate = document.querySelector('.radar-welcome-gate');
  const skip = document.querySelector('.radar-welcome-gate__skip');
  const video = document.querySelector('.radar-welcome-gate__video');
  const r = (n) => n ? (() => { const x = n.getBoundingClientRect(); return {x:x.x,y:x.y,width:x.width,height:x.height,right:x.right,bottom:x.bottom}; })() : null;
  return {
    viewport: { width: innerWidth, height: innerHeight },
    gate: r(gate),
    video: r(video),
    skip: r(skip),
    skipMinHeight: skip ? getComputedStyle(skip).minHeight : null,
    overflow: { html: getComputedStyle(document.documentElement).overflow, body: getComputedStyle(document.body).overflow },
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    scrollY: window.scrollY,
  };
})()''')

skip = initial.get('skip') if initial else None
if skip:
    x = skip['x'] + skip['width'] / 2
    y = skip['y'] + skip['height'] / 2
    send('Input.emulateTouchFromMouseEvent', {'type': 'mousePressed', 'x': x, 'y': y, 'button': 'left', 'clickCount': 1})
    send('Input.emulateTouchFromMouseEvent', {'type': 'mouseReleased', 'x': x, 'y': y, 'button': 'left', 'clickCount': 1})
    time.sleep(1)

post_touch = evaluate(r'''(() => ({
  gatePresent: Boolean(document.querySelector('.radar-welcome-gate')),
  gateExiting: Boolean(document.querySelector('.radar-welcome-gate.is-exiting')),
  activeClass: document.documentElement.classList.contains('radar-welcome-active'),
  scrollWidth: document.documentElement.scrollWidth,
  bodyScrollWidth: document.body.scrollWidth,
  viewportWidth: innerWidth,
  scrollY: window.scrollY,
}))()''')
if post_touch.get('gatePresent'):
    evaluate("document.querySelector('.radar-welcome-gate__skip')?.click()")
    time.sleep(1)
post_click = evaluate(r'''(() => ({
  gatePresent: Boolean(document.querySelector('.radar-welcome-gate')),
  gateExiting: Boolean(document.querySelector('.radar-welcome-gate.is-exiting')),
  activeClass: document.documentElement.classList.contains('radar-welcome-active'),
  scrollWidth: document.documentElement.scrollWidth,
  bodyScrollWidth: document.body.scrollWidth,
  viewportWidth: innerWidth,
  scrollY: window.scrollY,
}))()''')
print(json.dumps({'requestedViewport': {'width': WIDTH, 'height': HEIGHT}, 'initial': initial, 'postTouch': post_touch, 'postProgrammaticClick': post_click}, indent=2))
ws.close()
