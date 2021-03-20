import {Router} from "express"
import {check} from "express-validator"

import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getColors,
    getColor,
    updateColor,
    createColor,
    activateColor,
    desactivateColor
} from "../controllers/colorController"

const router = Router();

router.get(
    '/',
    verifyToken,
    isAdmin,
    getColors
);
router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getColor
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    [
        check('color','Color is required').not().isEmpty(),
        check('color','El color debe ser minimo de 2 caracteres').isLength({min:2}),
        check('value','el valor es requerido').not().isEmpty(),
        check('value','El valor debe ser en formato exadecimal ej: #fffff').isHexColor()
    ],
    createColor
);
router.put(
    '/:id',
    verifyToken,
    isAdmin,
    [
        check('color','La marca debe ser minimo de 2 caracteres').isLength({min:2}),
        check('value','El valor debe ser en formato exadecimal ej: #fffff').isHexColor()
    ],
    updateColor
);
router.put(
    '/desactivate/:id',
    verifyToken,
    isAdmin,
    desactivateColor
);
router.put(
    '/activate/:id',
    verifyToken,
    isAdmin,
    activateColor
);

export default router;