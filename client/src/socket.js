export default class SocketClient {

    #serverConnection;

    constructor({ host, port, protocol }) {
        this.host = host;
        this.port = port;
        this.protocol = protocol;
    }

    async createConnection() {
        const options = {
            port: this.port,
            host: this.host,
            headers: {
                Connection: 'Upgrade',
                Upgrade: 'websocket'
            }
        }
    
        const http = await import(this.protocol);
        const req = http.request(options);
        req.end();
        
        return new Promise(resolver => {
            req.once('upgrade', (res, socket) => {
                resolver(socket);
                /*socket.on('data', data => console.log('client received', data.toString()));
        
                setInterval(() => {
                    socket.write('Hello!');
                }, 500)*/
            });
        })
        
    }

    async initialize() {
        this.#serverConnection = await this.createConnection();
        console.log('I connected to the server!!');
    }

}