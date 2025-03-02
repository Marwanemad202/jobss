import multer from 'multer';

export const uploadFileDisk = () => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            console.log({ file });

            cb(null, file.originalname)
        }
    })


    return multer({ det: 'tempath', storage })
}