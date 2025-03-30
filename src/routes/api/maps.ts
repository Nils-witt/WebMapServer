import {Router} from "express";
import {MapModel} from "../../models/MapModel";
import {OverlayModel} from "../../models/OverlayModel";


export const apiMapsRouter = Router();

apiMapsRouter.get('/', async (req, res, next) => {

    const maps = await MapModel.findAll();
    res.json(maps);
});

apiMapsRouter.post('/', async (req, res, next) => {
    let data: OverlayModel = req.body;
    let overlay = await MapModel.create({
        name: data.name,
        url: data.url,
        minZoom: data.minZoom,
        maxZoom: data.maxZoom,
        status: data.status,
        isRemote: data.isRemote
    });

    res.json(overlay);
});