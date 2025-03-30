import {applicationLogger} from "./Logger";
import WebSocket, {Server} from "ws";
import {Duplex} from "stream";
import * as http from "node:http";
import {GlobalEventNotifier} from "./GlobalEventNotifier";


export class WebSockerHandler {

    static shared: WebSockerHandler;

    clients: Map<number, WebSocket.WebSocket> = new Map();

    wsServer: Server

    constructor(wsServer: Server) {
        this.wsServer = wsServer;

    }

    onMessage(clientId: number, message: string) {
        try {
            applicationLogger.info(`Received message => ${message}`);
            const data = JSON.parse(message);
            if (data.event == "SUBSCRIBE") {
                applicationLogger.info(`Subscribing to ${data.event_type}`);
                GlobalEventNotifier.shared.addListener(data.event_type, (event: any) => {
                    applicationLogger.info(`Sending message To CL ${clientId} => ${JSON.stringify(event)}`);
                    this.clients.get(clientId)?.send(JSON.stringify(event));
                });
            }
        } catch (error) {

        }

    }

    onClose(clientId: number) {
        this.clients.delete(clientId);
    };

    upgradeDone(client: WebSocket.WebSocket, request: http.IncomingMessage) {
        this.wsServer.emit('connection', client, request);
        let clientId = Math.floor(Math.random() * 1000000);
        applicationLogger.info("New WS connection: " + clientId);

        this.clients.set(clientId, client);
        client.on('message', (message: string) => {
            this.onMessage(clientId, message);
        });
        client.on('close', () => {
            applicationLogger.info(`Connection closed`);
            this.onClose(clientId);
        });
    }

    /**
     * Handle the upgrade request for WebSocket connections.
     * @param request The HTTP request object.
     * @param socket The socket object.
     * @param upgradeHead The buffer containing the upgrade data.
     */
    public handleUpgrade(request: http.IncomingMessage, socket: Duplex, upgradeHead: Buffer,) {
        this.wsServer.handleUpgrade(request, socket, upgradeHead, this.upgradeDone.bind(this));
    }
}