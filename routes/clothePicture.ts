import {Router} from "express"
import {check} from "express-validator"

import {verifyToken,isAdmin, isEmployee} from "../middleware/auth"
import upload from "../libs/multer"
import {
    getPictures,
    getPicture,
    updatePicture,
    createPicture,
    activatePicture,
    desactivatePicture
} from "../controllers/clothePictureController"

const router = Router();

router.get(
    '/',
    verifyToken,
    isAdmin,
    getPictures
);
router.get(
    '/:id',
    verifyToken,
    isAdmin||isEmployee,
    getPicture
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    [
        check('picture','name picture is required').not().isEmpty(),
        check('picture','the naame debe ser minimo de 2 caracteres').isLength({min:2})
    ],
    upload.single('image'),
    createPicture
);
router.put(
    '/:id',
    verifyToken,
    isAdmin,
    [
        check('brand','La marca debe ser minimo de 2 caracteres').isLength({min:2})
    ],
    upload.single('image'),
    updatePicture
);
router.put(
    '/desactivate/:id',
    verifyToken,
    isAdmin,
    desactivatePicture
);
router.put(
    '/activate/:id',
    verifyToken,
    isAdmin,
    activatePicture
);

export default router;
