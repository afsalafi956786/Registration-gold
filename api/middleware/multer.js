import multer from 'multer';

const storage = multer.diskStorage({ 
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
     const {originalname}=file;
    const splitted=originalname.split('.'); //afsal.jpg
    const extension=splitted[splitted.length -1 ];
    const newPath=splitted[0]+Date.now()+ "." + extension;
    req.filePath = newPath
    cb(null, newPath)
    }
});
export const imageMiddleWare = multer({storage});