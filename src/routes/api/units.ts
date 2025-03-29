import {UnitModel} from "../../models/UnitModel";
import {Router} from "express";

export const apiUnitsRouter = Router();

apiUnitsRouter.get('/', async (req, res, next) => {
    const units = await UnitModel.findAll();
    res.json(units);
});

apiUnitsRouter.post('/', async (req, res, next) => {
    let data: UnitModel = req.body;

    let unit = await UnitModel.create({
        tz: data.tz,
        name: data.name,
        status: data.status,
        latitude: data.latitude,
        longitude: data.longitude
    });
    
    res.json(unit);
});

apiUnitsRouter.get('/:id', async (req, res, next) => {
    let unit = await UnitModel.findByPk(req.params.id);
    res.json(unit);
});


apiUnitsRouter.post('/:id', async (req, res, next) => {
    let unit = await UnitModel.findByPk(req.params.id);
    let data: UnitModel = req.body;
    if (!unit) {
        res.status(404).send("Unit not found");
        return;
    }
    unit.tz = data.tz;
    unit.name = data.name;
    unit.status = data.status;
    unit.latitude = data.latitude;
    unit.longitude = data.longitude;

    await unit.save();

    res.json(unit);
});