import {Router} from "express";


export const indexRouter = Router()

/* GET home page. */
indexRouter.get('/', (req, res, next) => {
    res.render('index', {title: 'Express'});
});

/* GET home page. */
indexRouter.get('/maps', (req, res, next) => {
    res.json([
        {
            "name": "BaseMapDE",
            "url": "/map/basemap/{z}/{x}/{y}.png",
            "minZoom": 10,
            "maxZoom": 19
        }
    ]);
});

/* GET home page. */
indexRouter.get('/overlays', (req, res, next) => {
    res.json([
        {
            "name": "2024 Pützchens Markt",
            "url": "/overlay/2024_09_puetzchen/{z}/{x}/{y}.png",
            "minZoom": 10,
            "maxZoom": 20
        },
        {
            "name": "2024 Bonn Marathon",
            "url": "/overlay/2024_04_06_marathon/{z}/{x}/{y}.png",
            "minZoom": 10,
            "maxZoom": 18
        }
    ]);
});
/* GET home page. */
indexRouter.get('/mapview', (req, res, next) => {
    res.render('map', {title: 'Map'});
});