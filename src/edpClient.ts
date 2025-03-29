import {createPool} from "mariadb";
import {config} from "./config";
import {UnitModel} from "./models/UnitModel";
import {applicationLogger} from "./Logger";

const pool = createPool({
    host: config.edpHost,
    user: config.edpUser,
    password: config.edpPassword,
    port: config.edpPort,
    database: config.edpDatabase,
    connectionLimit: 2
});


type Unit = {
    latitude: number,
    longitude: number,
    status: number,
    name: string,
}

export class EdpClient {

    running: boolean = false

    constructor() {
    }


    async syncUnits() {
        this.running = true;

        let remUnits = await getUnits();

        for await (const unit of remUnits) {
            applicationLogger.info("EDP Client: Sync unit: " + unit.name);
            let locUnits = await UnitModel.findAll({
                where: {
                    name: unit.name,
                },
            });

            if (locUnits.length > 0) {
                let locUnit = locUnits[0];
                locUnit.longitude = unit.longitude;
                locUnit.latitude = unit.latitude;
                locUnit.status = unit.status;
                await locUnit.save()
            } else {
                await UnitModel.create({
                    name: unit.name,
                    latitude: unit.latitude,
                    longitude: unit.longitude,
                    status: unit.status,
                    tz: "",
                })
            }
        }

        this.running = false;
    }

    start() {
        applicationLogger.info("EDP Client started");
        this.syncUnits();
    }
    
    stop() {
        //TODO: implement
    }
}

export async function getUnits(): Promise<Unit[]> {
    let conn;
    var units: Unit[] = [];
    try {

        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM einsatzmittel WHERE einsatzmittel.KOORDY is not null AND einsatzmittel.KOORDX is not null and DISPOSITION = '1'");
        units = rows.map((row: any) => {
            return {
                latitude: row['KOORDY'],
                longitude: row['KOORDX'],
                status: parseInt(row['STATUS']),
                name: row['RUFNAME'],
            }
        })
    } finally {
        if (conn) conn.release(); //release to pool
    }
    return units;
}