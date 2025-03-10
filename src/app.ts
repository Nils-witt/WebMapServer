import path from "node:path";
import express, {Express, NextFunction, Request, Response} from "express";
import {indexRouter} from "./routes";
import cookieParser from "cookie-parser";



export const app: Express = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'data')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Not Found');
});