export class RemoteClient {
    constructor(accessToken, wsUrl = 'ws://ursa-minor.owuh.dev:8000/ws/terminal') {
        this.accessToken = accessToken;
        this.wsUrl = wsUrl;
        this.ws = null;
        this.decoder = new TextDecoder('utf-8');
        this.encoder = new TextEncoder();
    }

    connect() {
        this.ws = new WebSocket(`${this.wsUrl}`);

        this.ws.onopen = () => {
            this.ws.send("Bearer " + this.accessToken);
            console.log('WebSocket connected');
            window.connected = true;
        };

        this.ws.onmessage = (event) => {
            window.term.write(event.data);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = (event) => {
            console.log('WebSocket closed:', event.code, event.reason);
        };
    }

    // Send terminal input (keyboard, etc.)
    sendInput(text) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const data = this.encoder.encode(text);
            this.ws.send(data);
        }
    }

    // Resize terminal
    resize(cols, rows) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({
                action: 'resize',
                cols: cols,
                rows: rows
            });
            this.ws.send(message); // Send as text message
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}
