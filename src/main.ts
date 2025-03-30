import {app} from "./app";
import * as http from "node:http";
import {applicationLogger} from "./Logger";
import {SyncClient} from "./syncClient";
import {config} from "./config";
import {EdpClient} from "./edpClient";
import {populate, sequelize} from "./Database";
import {Server as WebSocketServer} from "ws";
import {WebSockerHandler} from "./WebSockerHandler";

applicationLogger.info("Starting server");
/**
 * Get port from environment and store in Express.
 */
const syncClient = new SyncClient();
const edpClient = new EdpClient();

sequelize.sync().then(() => {
    applicationLogger.info("Database synced successfully");
    populate()

    if (config.sync) {
        syncClient.start();
    }

    if (config.edpSync) {
        edpClient.start();
    }
})


const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const wsServer = new WebSocketServer({noServer: true});
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


if (WebSockerHandler.shared == undefined) {
    WebSockerHandler.shared = new WebSockerHandler(wsServer);
}

server.on('upgrade', (req, socket, head) => {
    WebSockerHandler.shared.handleUpgrade(req, socket, head);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    if (addr != null) {
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        applicationLogger.info('Listening on ' + bind);
    }
}
