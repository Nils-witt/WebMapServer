import {Router} from "express";
import {MapModel} from "../models/MapModel";
import {OverlayModel} from "../models/OverlayModel";
import * as fs from "node:fs";
import {config} from "../config";
import path from "node:path";


export const apiSyncRouter = Router()

/* GET home page. */
apiSyncRouter.get('/', async (req, res, next) => {
    let maps = await MapModel.findAll();
    let overlays = await OverlayModel.findAll();
    
    res.json({
        maps: maps,
        overlays: overlays,
    });
});

apiSyncRouter.get('/map/:id', async (req, res, next) => {

    const id = req.params.id;
    let map = await MapModel.findByPk(id);
    let tiles: string[] = [];

    let zooms = fs.readdirSync(path.join(config.datadir, 'map', id))
    for await (let zoom of zooms) {
        let xTiles = fs.readdirSync(path.join(config.datadir, 'map', id, zoom))
        for await(let xTile of xTiles) {
            let xTiles = fs.readdirSync(path.join(config.datadir, 'map', id, zoom))
            for await (let xTile of xTiles) {
                let yTiles = fs.readdirSync(path.join(config.datadir, 'map', id, zoom, xTile))
                for await (let yTile of yTiles) {
                    tiles.push(path.join(path.join(id, zoom, xTile, yTile)))
                }
            }
        }
    }
    res.json({
        map: map,
        tiles: tiles,
    });
});

apiSyncRouter.get('/overlay/:id', async (req, res, next) => {

    const id = req.params.id;
    let overlay = await OverlayModel.findByPk(id);
    let tiles: string[] = [];

    let zooms = fs.readdirSync(path.join(config.datadir, 'overlay', id))
    for await (let zoom of zooms) {
        let xTiles = fs.readdirSync(path.join(config.datadir, 'overlay', id, zoom))
        for await(let xTile of xTiles) {
            let xTiles = fs.readdirSync(path.join(config.datadir, 'overlay', id, zoom))
            for await (let xTile of xTiles) {
                let yTiles = fs.readdirSync(path.join(config.datadir, 'overlay', id, zoom, xTile))
                for await (let yTile of yTiles) {
                    tiles.push(path.join(path.join(id, zoom, xTile, yTile)))
                }
            }
        }
    }
    res.json({
        overlay: overlay,
        tiles: tiles,
    });
});
