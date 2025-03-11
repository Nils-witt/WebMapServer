import {Router} from "express";
import multer from "multer";
import {MapModel} from "../models/MapModel";

const upload = multer({dest: 'uploads/'})

export const mapsRouter = Router()

mapsRouter.get('/', async (req, res, next) => {
    let overlays = await MapModel.findAll();
    res.render('maps/index', {values: overlays})
});

mapsRouter.get('/create', async (req, res, next) => {
    res.render('maps/create');
});

mapsRouter.post('/create', async (req, res, next) => {
    let map = await MapModel.create({
        name: req.body.name,
        path: req.body.path,
        minZoom: req.body.minZoom,
        maxZoom: req.body.maxZoom,
        status: 'Created',
    })
    res.redirect('/maps/' + map.id);
});

mapsRouter.get('/:id', async (req, res, next) => {
    let map = await MapModel.findByPk(req.params.id);
    res.render('maps/details', {map: map});
});
mapsRouter.post('/:id', async (req, res, next) => {
    let map = await MapModel.findByPk(req.params.id);
    if (map instanceof MapModel) {
        map.name = req.body.name;
        map.path = req.body.path;
        map.minZoom = req.body.minZoom;
        map.maxZoom = req.body.maxZoom;
    }
    res.render('maps/details', {map: map});
});
mapsRouter.delete('/:id', async (req, res, next) => {
    let map = await MapModel.findByPk(req.params.id);
    map?.destroy();
    res.redirect('/maps/');
});

