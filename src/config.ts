import path from "node:path";

type Config = {
    datadir: string,
    sync: boolean,
    syncUrl: string,
    syncInterval: number,
    edpSync: boolean,
    edpHost: string,
    edpPort: number,
    edpUser: string,
    edpPassword: string,
    edpDatabase: string,
    edpSyncInterval: number,
}

export const config: Config = {
    datadir: process.env.DATA_DIR || path.join('data'),
    sync: process.env.SYNC == 'true',
    syncUrl: process.env.SYNC_URL || "http://localhost:3001",
    syncInterval: parseInt(process.env.SYNC_INTERVAL || "") || 60,
    edpSync: process.env.EDP_SYNC == "true",
    edpHost: process.env.EDP_SYNC_HOST || "localhost",
    edpPort: parseInt(process.env.EDP_SYNC_PORT || "") || 3306,
    edpUser: process.env.EDP_SYNC_USERNAME || "root",
    edpPassword: process.env.EDP_SYNC_PASSWORD || "example",
    edpDatabase: process.env.EDP_SYNC_DB || "edpdb",
    edpSyncInterval: parseInt(process.env.EDP_SYNC_INTERVAL || "") || 60,
}