const utils = require('@iobroker/adapter-core');
const WebSocket = require('ws');

class MyAdapter extends utils.Adapter {
    constructor(options) {
        super({
            ...options,
            name: 'myadapter',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    async onReady() {
        this.log.info('MyAdapter is ready');

        // Websocket-URL für Testzwecke
        const websocketUrl = 'wss://echo.websocket.org';

        this.connectWebsocket(websocketUrl);
    }

    connectWebsocket(url) {
        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            this.log.info('Websocket connection established');
            // Hier können Sie eine Testnachricht senden, wenn nötig
            // this.ws.send('Hello Server');
        });

        this.ws.on('message', data => {
            console.log('Received from websocket:', data.toString());
        });

        this.ws.on('error', error => {
            this.log.error(`Websocket error: ${error}`);
        });

        this.ws.on('close', () => {
            this.log.info('Websocket connection closed');
        });
    }

    onUnload(callback) {
        try {
            if (this.ws) {
                this.ws.close();
            }
            callback();
        } catch (e) {
            this.log.error(`Error during unload: ${e}`);
            callback();
        }
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = options => new MyAdapter(options);
} else {
    // otherwise start the instance directly
    new MyAdapter();
}
