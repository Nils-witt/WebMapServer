import {Router} from "express";
import {MapModel} from "../models/MapModel";
import {OverlayModel} from "../models/OverlayModel";


export const apiRouter = Router()

/* GET home page. */
apiRouter.get('/maps', async (req, res, next) => {

    const maps = await MapModel.findAll();
    res.json(maps);
});

apiRouter.get('/overlays', async (req, res, next) => {

    const overlays = await OverlayModel.findAll();
    res.json(overlays);
});
