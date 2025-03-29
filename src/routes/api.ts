import {Router} from "express";
import {apiSyncRouter} from "./api/sync";
import {apiUnitsRouter} from "./api/units";
import {apiOverlaysRouter} from "./api/overlays";
import {apiMapsRouter} from "./api/maps";


export const apiRouter = Router()
apiRouter.use('/sync', apiSyncRouter);
apiRouter.use('/maps', apiMapsRouter);
apiRouter.use('/overlays', apiOverlaysRouter);
apiRouter.use('/units', apiUnitsRouter);

