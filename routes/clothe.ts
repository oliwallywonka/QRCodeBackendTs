import {Router} from "express"
import {check} from "express-validator"

import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getClothesByModel,
    getClothe,
    updateClothe,
    createClothe,
    activateClothe,
    desactivateClothe
} from "../controllers/clotheController"

const router = Router();

router.get(
    '/model/:id',
    verifyToken,
    isAdmin,
    getClothesByModel
);
router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getClothe
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    [
        check('clotheModel','Model is required').not().isEmpty(),
        check('clotheModel','La marca debe ser minimo de 20 caracteres').isLength({min:20})
    ],
    createClothe
);
router.put(
    '/:id',
    verifyToken,
    isAdmin,
    [
        check('clotheModel','Model is required').not().isEmpty(),
        check('clotheModel','La marca debe ser minimo de 20 caracteres').isLength({min:20})
    ],
    updateClothe
);
router.put(
    '/desactivate/:id',
    verifyToken,
    isAdmin,
    desactivateClothe
);
router.put(
    '/activate/:id',
    verifyToken,
    isAdmin,
    activateClothe
);

export default router;
