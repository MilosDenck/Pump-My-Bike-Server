import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id = file.originalname.split('.')[0];
    const dir = path.join('Images', id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename:(req, file, cb) => {
    const id = file.originalname.split('.')[0];
    const filename = `${id}_${Date.now()}.jpg`
    req.generatedFilename = filename;
    req.locationId = id;
    cb(null, filename);
  }
});

export default multer({ storage });
