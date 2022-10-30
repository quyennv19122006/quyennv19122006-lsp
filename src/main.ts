import { WebSocketServer } from 'ws';
import * as rpc from 'vscode-ws-jsonrpc';
import { launch } from './launch';
import { port } from './configs';

const wss = new WebSocketServer({ port });

console.log(`Language server is running on ws://localhost:${port}`);

wss.on('connection', (webSocket) => {
  console.log('Connected to client!');

  const socket: rpc.IWebSocket = {
    send: (content) =>
      webSocket.send(content, (error) => {
        if (error) throw error;
      }),
    onMessage: (callback) => webSocket.on('message', callback),
    onError: (callback) => webSocket.on('error', callback),
    onClose: (callback) => webSocket.on('close', callback),
    dispose: () => webSocket.close()
  };
  if (webSocket.readyState === webSocket.OPEN) {
    launch(socket);
  } else {
    webSocket.on('open', () => launch(socket));
  }
});
