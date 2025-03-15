import {Sequelize} from "@sequelize/core";
import {User} from "./models/User";
import {OverlayModel} from "./models/OverlayModel";
import {MapModel} from "./models/MapModel";
import {applicationLogger} from "./Logger";
import {PostgresDialect} from "@sequelize/postgres";
import {UnitModel} from "./models/UnitModel";

export const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: process.env.DATABASE_NAME || "postgres",
    host: process.env.DATABASE_HOST || "127.0.0.1",
    user: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    models: [User, MapModel, OverlayModel, UnitModel],
});

export async function populate() {
    applicationLogger.info('All models were synchronized successfully.');
}