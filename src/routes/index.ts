import {Router} from "express";


export const indexRouter = Router()

/* GET home page. */
indexRouter.get('/', (req, res, next) => {
    res.render('index', {title: 'Express'});
});
/* GET home page. */
indexRouter.get('/mapview', (req, res, next) => {
    res.render('map', {title: 'Map'});
});