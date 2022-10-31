import { WebSocketServer, ServerOptions } from 'ws';
import { launch } from './launch';
import { port } from './configs';
import { start } from './start';

interface Server {
  wss: WebSocketServer;
  port: ServerOptions['port'];
  start: Function;
  launch: Function;
}

class Server {
  constructor(port: number) {
    this.port = port;
    this.wss = new WebSocketServer({ port });
    this.start = start;
    this.launch = launch;
    start(this.wss, this.launch, this.port);
  }
}

const server = new Server(port);
