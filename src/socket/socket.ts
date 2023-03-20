import {WebSocketServer} from 'ws';
const socketserver = new WebSocketServer({ port: 8080 })


socketserver.on('connection', ws => { 
  ws.send('connection established')
  ws.on('close', () => console.log('Client has disconnected!'))

  ws.onerror = function () {
    console.log('websocket error')
  }
 })

export { socketserver }