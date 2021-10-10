import SockJS = require("sockjs-client");

export class TestClient<TMessageType = any> {
    public sock: WebSocket;
    public messageQueue: string[] = [];
    constructor(prefix: string, port: number) {
        this.sock = new SockJS(`http://localhost:${port}/${prefix}`);
        this.sock.onmessage = this.onmessage;
    }

    connected() {
        return new Promise((resolve) => {
            this.sock.onopen = resolve;
        });
    }

    send(data: TMessageType) {
        this.sock.send(JSON.stringify(data));
    }

    getNextMessage(): Promise<any> {
        if (this.messageQueue.length > 0) {
            return new Promise((resolve) => resolve(this.messageQueue.shift()));
        } else {
            return new Promise((resolve) => {
                this.sock.onmessage = (ev) => {
                    resolve(JSON.parse(ev.data));

                    this.sock.onmessage = this.onmessage;
                };
            });
        }
    }

    private onmessage = (ev: MessageEvent) => {
        this.messageQueue.push(JSON.parse(ev.data));
    };
}
