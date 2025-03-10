import * as yauzl from 'yauzl';
import * as fs from "node:fs";
import path from "node:path";


let basedir = 'test/'

fs.mkdirSync(basedir, {
    recursive: true,
});

yauzl.open("data/1.zip", {lazyEntries: true}, function (err, zipfile) {
    zipfile.readEntry();
    zipfile.on("entry", function (entry) {

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
                    }catch(err) {
                        zipfile.readEntry();
                    }
                });
            } catch (e) {
                zipfile.readEntry();
            }
        }
    });
});
