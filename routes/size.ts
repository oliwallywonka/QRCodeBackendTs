import {Router} from "express"
import {check} from "express-validator"

import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getSizes,
    getSize,
    updateSize,
    createSize,
    activateSize,
    desactivateSize
} from "../controllers/sizeController"

const router = Router();

router.get(
    '/',
    verifyToken,
    isAdmin,
    getSizes
);
router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getSize
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    [
        check('size','Size is required').not().isEmpty(),
        check('size','La talla debe ser minimo de 2 caracteres').isLength({min:2})
    ],
    createSize
);
router.put(
    '/:id',
    verifyToken,
    isAdmin,
    [
        check('size','La talla debe ser minimo de 2 caracteres').isLength({min:2})
    ],
    updateSize
);
router.put(
    '/desactivate/:id',
    verifyToken,
    isAdmin,
    desactivateSize
);
router.put(
    '/activate/:id',
    verifyToken,
    isAdmin,
    activateSize
);

export default router;