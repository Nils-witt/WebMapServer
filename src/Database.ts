import {Sequelize} from "@sequelize/core";
import {User} from "./models/User";
import {OverlayModel} from "./models/OverlayModel";
import {MapModel} from "./models/MapModel";
import {applicationLogger} from "./Logger";
import {PostgresDialect} from "@sequelize/postgres";

export const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    models: [User, MapModel, OverlayModel],
});

export async function populate() {
    applicationLogger.info('All models were synchronized successfully.');
}