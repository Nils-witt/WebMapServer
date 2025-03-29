import path from "node:path";
import express, {Express, NextFunction, Request, Response} from "express";
import {indexRouter} from "./routes";
import cookieParser from "cookie-parser";
import {populate, sequelize} from "./Database";
import session from "express-session";
import {applicationLogger} from "./Logger";
import {apiRouter} from "./routes/api";
import {config} from "./config";
import cors from "cors";

export const app: Express = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'test'
}))
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(config.datadir));
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    applicationLogger.info(req.method + " " + req.url);
    next()
})

app.use('/', indexRouter);
app.use('/api', apiRouter);
// app.use('/overlays', overlaysRouter);
// app.use('/maps', mapsRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Not Found');
});