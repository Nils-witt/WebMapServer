import {Router} from "express";
import {MapModel} from "../../models/MapModel";


export const apiMapsRouter = Router();

apiMapsRouter.get('/', async (req, res, next) => {

    const maps = await MapModel.findAll();
    res.json(maps);
});
