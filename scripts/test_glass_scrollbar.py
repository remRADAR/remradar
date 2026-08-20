import json
import sys
import time
from urllib.request import urlopen, Request

import websocket

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 9333
URL = 'http://127.0.0.1:3000/?preview=glass-scrollbar'
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
send('Page.navigate', {'url': URL})
time.sleep(2)
initial = evaluate("""(() => {
  const bar = document.querySelector('.radar-glass-scrollbar');
  const thumb = document.querySelector('.radar-glass-scrollbar__thumb');
  const style = bar ? getComputedStyle(bar) : null;
  const thumbStyle = thumb ? getComputedStyle(thumb) : null;
  return {present:Boolean(bar), active:bar?.className.includes('is-active') ?? false, opacity:style?.opacity ?? null, width:style?.width ?? null, thumbHeight:thumbStyle?.height ?? null, bodyScrollHeight:document.body.scrollHeight, viewport:innerHeight};
})()""")
evaluate("window.scrollTo(0, Math.min(400, document.documentElement.scrollHeight)); window.dispatchEvent(new Event('scroll'))")
time.sleep(0.15)
active = evaluate("""(() => { const bar=document.querySelector('.radar-glass-scrollbar'); const s=bar?getComputedStyle(bar):null; return {active:bar?.className.includes('is-active') ?? false, opacity:s?.opacity ?? null}; })()""")
time.sleep(0.9)
inactive = evaluate("""(() => { const bar=document.querySelector('.radar-glass-scrollbar'); const s=bar?getComputedStyle(bar):null; return {active:bar?.className.includes('is-active') ?? false, opacity:s?.opacity ?? null, homepagePresent:Boolean(document.querySelector('#main'))}; })()""")
print(json.dumps({'initial':initial,'duringScroll':active,'afterIdle':inactive}, indent=2))
ws.close()
