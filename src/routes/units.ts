import {Router} from "express";
import {OverlayModel} from "../models/OverlayModel";
import {UnitModel} from "../models/UnitModel";
import {einheiten, fachaufgaben, grundzeichen, organisationen} from "taktische-zeichen-core";


export const unitRouter = Router()

unitRouter.get('/', async (req, res, next) => {
    let units = await UnitModel.findAll();
    res.render('units/index', {values: units})
});

unitRouter.get('/create', async (req, res, next) => {
    res.render('units/create');
});

unitRouter.post('/create', async (req, res, next) => {
    let overlayModel = await OverlayModel.create({
        name: req.body.name,
        path: req.body.path,
        minZoom: req.body.minZoom,
        maxZoom: req.body.maxZoom,
        status: 'Created',
    })
    res.redirect('/units/' + overlayModel.id);
});

unitRouter.get('/:id', async (req, res, next) => {
    let unit = await UnitModel.findByPk(req.params.id);
    res.render('units/details', {unit: unit, grundzeichen: grundzeichen, einheiten: einheiten,organisationen: organisationen, fachaufgaben: fachaufgaben });
});