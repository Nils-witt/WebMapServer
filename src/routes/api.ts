import {Router} from "express";
import {MapModel} from "../models/MapModel";
import {OverlayModel} from "../models/OverlayModel";
import {apiSyncRouter} from "./api_sync";
import {UnitModel} from "../models/UnitModel";
import {erzeugeTaktischesZeichen, TaktischesZeichen} from "taktische-zeichen-core";


export const apiRouter = Router()
apiRouter.use('/sync', apiSyncRouter);

/* GET home page. */
apiRouter.get('/maps', async (req, res, next) => {

    const maps = await MapModel.findAll();
    res.json(maps);
});

apiRouter.get('/overlays', async (req, res, next) => {

    const overlays = await OverlayModel.findAll();
    res.json(overlays);
});


apiRouter.get('/units', async (req, res, next) => {
    const units = await UnitModel.findAll();
    res.json(units);
});

apiRouter.get('/units/:id/tz', async (req, res, next) => {
    let unit = await UnitModel.findByPk(req.params.id);
    if (unit == null) {
        res.status(400).send({})
        return
    }else {
        console.log(unit.tz);

        const tz = erzeugeTaktischesZeichen(JSON.parse(unit.tz));
        res.send(tz.toString())
    }
});

apiRouter.post('/units/:id/tz', async (req, res, next) => {
    let data: TaktischesZeichen = req.body;
    let unit = await UnitModel.findByPk(req.params.id);
    if (unit == null) {
        res.status(400).send({})
    }else {
        console.log()
        unit.tz = JSON.stringify(data);
        await unit.save();
    }
    res.send(data)
});