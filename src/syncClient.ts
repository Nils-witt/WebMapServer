import {config} from "./config";
import {MapModel} from "./models/MapModel";
import {OverlayModel} from "./models/OverlayModel";


type SyncInfo = {
    maps: MapModel[],
    overlays: OverlayModel[],
}

export class SyncClient {


    running: boolean = false;
    runningInterval: NodeJS.Timeout | null = null;
    
    
    async syncMap(map: MapModel): Promise<void> {
        //TODO: implement
    }

    async run(): Promise<void> {
        this.running = true;
        console.log("sync started");

        let raw = await fetch(config.syncUrl + "/api/sync");
        let syncConf: SyncInfo = await raw.json();
        
        for await (const map of syncConf.maps) {
            await this.syncMap(map);
        }

        for await (const overlay of syncConf.overlays) {
            console.log(overlay.name)
        }
        
        this.running = false;
    }


    start(): void {
        this.run();
        this.runningInterval = setInterval(() => {
            this.run();
        }, config.syncInterval * 1000);
    }

    stop(): void {
        //TODO: implement
    }

}