import {Router} from "express";
import {OverlayModel} from "../../models/OverlayModel";


export const apiOverlaysRouter = Router();

apiOverlaysRouter.get('/', async (req, res, next) => {

    const overlays = await OverlayModel.findAll();
    res.json(overlays);
});
