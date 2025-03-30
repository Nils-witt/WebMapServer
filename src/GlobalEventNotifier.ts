import {applicationLogger} from "./Logger";

export enum EVENT_TYPE {
    UNIT_ADDED = 'UNIT_ADDED',
    UNIT_REMOVED = 'UNIT_REMOVED',
    UNIT_MOVED = 'UNIT_MOVED',
    UNIT_CHANGED = 'UNIT_CHANGED',

}

export class GlobalEventNotifier {
    static shared = new GlobalEventNotifier();

    listners: Map<EVENT_TYPE, ((event: any) => void)[]> = new Map();

    constructor() {

        for (const eventType in EVENT_TYPE) {
            this.listners.set(eventType as EVENT_TYPE, []);
        }
        console.log("GlobalEventNotifier initialized");
    }


    addListener(eventType: EVENT_TYPE, listener: (event: any) => void) {
        this.listners.get(eventType)?.push(listener);
    }
    
    removeListener(eventType: EVENT_TYPE, listener: (event: any) => void) {
        this.listners.get(eventType)?.splice(this.listners.get(eventType)?.indexOf(listener) ?? -1, 1);
    }
    
    notify(eventType: EVENT_TYPE, payload: any) {
        applicationLogger.info(`Notifying event ${eventType} with data ${JSON.stringify(payload)}`);
        this.listners.get(eventType)?.forEach((listener) => {
            listener({
                event: eventType,
                payload: payload
            });
        });
    }
}