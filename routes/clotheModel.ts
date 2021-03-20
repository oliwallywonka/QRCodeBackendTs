import {Router} from "express"
import {check} from "express-validator"

import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getClotheModels,
    getClotheModel,
    updateClotheModel,
    createClotheModel,
    activateClotheModel,
    desactivateClotheModel
} from "../controllers/clotheModelController"

const router = Router();

router.get(
    '/',
    verifyToken,
    isAdmin,
    getClotheModels
);
router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getClotheModel
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    [
        check('model','Brand is required').not().isEmpty(),
        check('model','el modelo debe ser minimo de 2 caracteres').isLength({min:2})
    ],
    createClotheModel
);
router.put(
    '/:id',
    verifyToken,
    isAdmin,
    [
        check('model','La marca debe ser minimo de 2 caracteres').isLength({min:2})
    ],
    updateClotheModel
);
router.put(
    '/desactivate/:id',
    verifyToken,
    isAdmin,
    desactivateClotheModel
);
router.put(
    '/activate/:id',
    verifyToken,
    isAdmin,
    activateClotheModel
);

export default router;