import {Router} from "express"
import {check} from "express-validator"

import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getBrands,
    getBrand,
    updateBrand,
    createBrand,
    activateBrand,
    desactivateBrand
} from "../controllers/brandController"

const router = Router();

router.get(
    '/',
    verifyToken,
    isAdmin,
    getBrands
);
router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getBrand
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    [
        check('brand','Brand is required').not().isEmpty(),
        check('brand','La marca debe ser minimo de 2 caracteres').isLength({min:2})
    ],
    createBrand
);
router.put(
    '/:id',
    verifyToken,
    isAdmin,
    [
        check('brand','La marca debe ser minimo de 2 caracteres').isLength({min:2})
    ],
    updateBrand
);
router.put(
    '/desactivate/:id',
    verifyToken,
    isAdmin,
    desactivateBrand
);
router.put(
    '/activate/:id',
    verifyToken,
    isAdmin,
    activateBrand
);

export default router;



