import winston, {createLogger} from "winston";

export const applicationLogger = createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
        new winston.transports.File({filename: 'logs/combined.log'}),
        new winston.transports.Console({
            format: winston.format.cli(),
        }),
    ],
});