import {Router} from "express"
import {check} from "express-validator"

import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getWholeSellers,
    getWholeSeller,
    updateWholeSeller,
    createWholeSeller,
    activateWholeSeller,
    desactivateWholeSeller
} from "../controllers/wholesellerController"

const router = Router();

router.get(
    '/',
    verifyToken,
    isAdmin,
    getWholeSellers
);
router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getWholeSeller
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    [
        check('name','nombre is required').not().isEmpty(),
        check('name','El nombre debe ser minimo de 2 caracteres').isLength({min:2}),
        check('phone','El telefono debe ser minimo de 6 digitos').isLength({min:6}),
    ],
    createWholeSeller
);
router.put(
    '/:id',
    verifyToken,
    isAdmin,
    [
        check('name','El nombre debe ser minimo de 2 caracteres').isLength({min:2}),
        check('phone','El telefono debe ser minimo de 6 digitos').isLength({min:6}),
    ],
    updateWholeSeller
);
router.put(
    '/desactivate/:id',
    verifyToken,
    isAdmin,
    desactivateWholeSeller
);
router.put(
    '/activate/:id',
    verifyToken,
    isAdmin,
    activateWholeSeller
);

export default router;