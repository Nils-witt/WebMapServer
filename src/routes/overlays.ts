import {Router} from "express";
import {OverlayModel} from "../models/OverlayModel";
import multer from "multer";
import {applicationLogger} from "../Logger";
import * as fs from "node:fs";
import * as yauzl from "yauzl";
import path from "node:path";

const upload = multer({dest: 'uploads/'})

export const overlaysRouter = Router()

overlaysRouter.get('/', async (req, res, next) => {
    let overlays = await OverlayModel.findAll();
    res.render('overlays/index', {values: overlays})
});

overlaysRouter.get('/create', async (req, res, next) => {
    res.render('overlays/create');
});

overlaysRouter.post('/create', async (req, res, next) => {
    let overlayModel = await OverlayModel.create({
        name: req.body.name,
        path: req.body.path,
        minZoom: req.body.minZoom,
        maxZoom: req.body.maxZoom,
        status: 'Created',
    })
    res.redirect('/overlays/' + overlayModel.id);
});

overlaysRouter.get('/:id', async (req, res, next) => {
    let overlay = await OverlayModel.findByPk(req.params.id);
    res.render('overlays/details', {overlay: overlay});
});

overlaysRouter.post('/:id/upload', upload.single('datazip'), async (req, res, next) => {

    applicationLogger.info("Overlay upload successfully");
    applicationLogger.info(JSON.stringify(req.file));
    if (req.file == undefined) {
        res.status(404).send('Not Found');
    } else {
        let file = req.file;
        if (file.mimetype == 'application/zip') {
            let basedir = path.join('data/overlay', req.params.id);
            fs.mkdirSync(basedir, {
                recursive: true,
            });
            yauzl.open(file.path, {lazyEntries: true}, (err, zipfile) => {
                zipfile.readEntry();
                zipfile.on("entry", (entry) => {

                    if (/\/$/.test(entry.fileName)) {
                        fs.mkdirSync(path.join(basedir, entry.fileName), {
                            recursive: true,
                        });
                        zipfile.readEntry();
                    } else {
                        if (entry.fileName.startsWith('__MACOSX')) {
                            zipfile.readEntry();
                            return
                        }
                        try {
                            zipfile.openReadStream(entry, function (err, readStream) {
                                readStream.on("end", function () {
                                    zipfile.readEntry();
                                });
                                try {
                                    let writeStream = fs.createWriteStream(path.join(basedir, entry.fileName), {flags: 'w'});
                                    readStream.pipe(writeStream);
                                } catch (err) {
                                    zipfile.readEntry();
                                }
                            });
                        } catch (e) {
                            zipfile.readEntry();
                        }
                    }
                });
            });


        }
    }
    res.redirect(`/overlays/${req.params.id}`);
});