import {Router} from "express"
import {check} from "express-validator"

import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getCategories,
    getCategory,
    updateCategory,
    createCategory,
    activateCategory,
    desactivateCategory
} from "../controllers/categoryController"

const router = Router();

router.get(
    '/',
    verifyToken,
    isAdmin,
    getCategories
);
router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getCategory
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    [
        check('category','Categoria is required').not().isEmpty(),
        check('category','La categoria debe ser minimo de 2 caracteres').isLength({min:2})
    ],
    createCategory
);
router.put(
    '/:id',
    verifyToken,
    isAdmin,
    [
        check('category','La marca debe ser minimo de 2 caracteres').isLength({min:2})
    ],
    updateCategory
);
router.put(
    '/desactivate/:id',
    verifyToken,
    isAdmin,
    desactivateCategory
);
router.put(
    '/activate/:id',
    verifyToken,
    isAdmin,
    activateCategory
);

export default router;