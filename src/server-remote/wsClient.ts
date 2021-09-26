import SockJS = require("sockjs-client");

export class WSClient<TRequest = any, TResponse = any> {
    public sock: WebSocket;
    public messageQueue: string[] = [];
    constructor(prefix: string, onMessage: (data: TResponse) => any) {
        this.sock = new SockJS(`http://localhost:${9999}/${prefix}`);
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
