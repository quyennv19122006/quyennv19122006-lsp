import * as rpc from 'vscode-ws-jsonrpc';
import * as server from 'vscode-ws-jsonrpc/server';
import { InitializeRequest } from 'vscode-languageserver';
import { resolve } from 'path';

const isInitializeRequest = (message: rpc.RequestMessage) =>
  message.method === InitializeRequest.type.method;

export const launch = (socket: rpc.IWebSocket) => {
  const reader = new rpc.WebSocketMessageReader(socket);
  const writer = new rpc.WebSocketMessageWriter(socket);

  const socketConnection = server.createConnection(reader, writer, () =>
    socket.dispose()
  );
  const serverConnection = server.createServerProcess(
    'Lua',
    resolve(
      process.cwd(),
      'lua-language-server/.bin/Windows/lua-language-server.exe'
    )
  );
  server.forward(socketConnection, serverConnection!, (message) => {
    if (rpc.Message.isRequest(message) && isInitializeRequest(message)) {
      (message.params as any).processId = process.pid;
    }
    return message;
  });
};
