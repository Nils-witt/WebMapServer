import path from "node:path";
import express, {Express, NextFunction, Request, Response} from "express";
import {indexRouter} from "./routes";
import {applicationLogger} from "./Logger";
import {apiRouter} from "./routes/api";
import {config} from "./config";
import cors from "cors";
import {EVENT_TYPE, GlobalEventNotifier} from "./GlobalEventNotifier";
import {UnitModel} from "./models/UnitModel";

export const app: Express = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(config.datadir));
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    applicationLogger.info(req.method + " " + req.url);
    next()
})

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Not Found');
});

if (false) {
    let i = 0;
    setInterval(async () => {
        let unit = await UnitModel.findByPk(2);
        if (unit == null) {
            applicationLogger.error("Unit not found");
            return;
        }
        let payload = {
            id: unit.id,
            latitude: unit.latitude + 0.0001 * i,
            longitude: unit.longitude,
        };
        GlobalEventNotifier.shared.notify(EVENT_TYPE.UNIT_MOVED, payload);
        i++;
    }, 1000);
}