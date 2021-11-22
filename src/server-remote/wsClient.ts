import SockJS = require("sockjs-client");

const SERVER_URL = process.env.SERVER_URL || `http://localhost:9999`;
console.log("SERVER_URL", SERVER_URL);

export class WSClient<TRequest = any, TResponse = any> {
    public sock: WebSocket;
    public messageQueue: string[] = [];
    constructor(prefix: string, onMessage: (data: TResponse) => any) {
        this.sock = new SockJS(`${SERVER_URL}/${prefix}`);
        this.sock.onmessage = (message) => onMessage(JSON.parse(message.data));
    }

    connected() {
        return new Promise((resolve) => {
            this.sock.onopen = resolve;
        });
    }

    send(data: TRequest) {
        this.sock.send(JSON.stringify(data));
    }
}
``