import {Router} from "express";
import {OverlayModel} from "../../models/OverlayModel";
import multer from "multer";
import {applicationLogger} from "../../Logger";
import * as fs from "node:fs";
import {rmSync} from "node:fs";
import path from "node:path";
import * as yauzl from "yauzl";

export const apiOverlaysRouter = Router();

apiOverlaysRouter.get('/', async (req, res, next) => {

    const overlays = await OverlayModel.findAll();
    res.json(overlays);
});

apiOverlaysRouter.post('/', async (req, res, next) => {
    let data: OverlayModel = req.body;
    let overlay = await OverlayModel.create({
        name: data.name,
        url: data.url,
        minZoom: data.minZoom,
        maxZoom: data.maxZoom,
        status: data.status,
        isRemote: data.isRemote
    });

    res.json(overlay);
});

apiOverlaysRouter.get('/:id', async (req, res, next) => {
    let id = req.params.id;
    let overlay = await OverlayModel.findByPk(id);
    res.json(overlay);
});

apiOverlaysRouter.post('/:id', async (req, res, next) => {
    let id = req.params.id;
    let overlay = await OverlayModel.findByPk(id);

    if (!overlay) {
        res.status(404).send("Overlay not found");
        return;
    }
    let data: OverlayModel = req.body;
    overlay.name = data.name;
    overlay.url = data.url;
    overlay.minZoom = data.minZoom;
    overlay.maxZoom = data.maxZoom;
    overlay.isRemote = data.isRemote;
    res.json(overlay);
});

const upload = multer({dest: 'uploads/'});

apiOverlaysRouter.post('/:id/upload', upload.single('datazip'), async (req, res, next) => {
    let id = req.params.id;

    applicationLogger.info("Upload overlay " + id + " " + req.file?.path);
    let overlay = await OverlayModel.findByPk(id);
    if (!overlay) {
        res.status(404).send("Overlay not found");

        if (req.file) {
            rmSync("uploads/" + req.file.filename);
        }
        return;
    }

    const basedir = path.join('data', 'overlay', req.params.id);
    const zipName = path.join('data', 'overlay', req.params.id + '.zip');


    let file = req.file;
    if (file && file.mimetype == 'application/zip') {

        fs.copyFileSync(file.path, zipName);


        fs.mkdirSync(basedir, {
            recursive: true,
        });
        applicationLogger.info("Unzipping " + zipName + " to " + basedir);
        yauzl.open(zipName, {lazyEntries: true}, (err, zipfile) => {
            if (err) {
                applicationLogger.error("Error opening zip file " + err);
                return;
            }
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

    res.json(overlay);
});