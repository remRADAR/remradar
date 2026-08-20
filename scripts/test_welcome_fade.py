import json
import sys
import time
from urllib.request import urlopen, Request

import websocket

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 9333
URL = 'http://127.0.0.1:3000/?preview=welcome-fade-test'

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
for _ in range(40):
    time.sleep(0.2)
    state = evaluate("document.readyState === 'complete' && Boolean(document.querySelector('.radar-welcome-gate'))")
    if state:
        break

samples = []
for _ in range(75):
    samples.append(evaluate("""(() => {
      const gate = document.querySelector('.radar-welcome-gate');
      const style = gate ? getComputedStyle(gate) : null;
      return {
        time: Math.round(performance.now()),
        present: Boolean(gate),
        className: gate?.className ?? null,
        opacity: style?.opacity ?? null,
        visibility: style?.visibility ?? null,
        pointerEvents: style?.pointerEvents ?? null,
        overflow: getComputedStyle(document.documentElement).overflow,
        homepageVisible: Boolean(document.querySelector('#main'))
      };
    })()"""))
    time.sleep(0.1)

interesting = []
last = None
for sample in samples:
    if not sample:
        continue
    if last is None or sample['className'] != last['className'] or sample['present'] != last['present']:
        interesting.append(sample)
    elif sample['className'] and 'is-exiting' in sample['className'] and len(interesting) < 12:
        interesting.append(sample)
    last = sample

print(json.dumps({'transitionSamples': interesting, 'final': samples[-1]}, indent=2))
ws.close()
