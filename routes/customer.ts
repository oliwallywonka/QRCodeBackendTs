import {Router} from "express"
import {check} from "express-validator"

import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getCustomers,
    getCustomer,
    updateCustomer,
    createCustomer,
    activateCustomer,
    desactivateCustomer
} from "../controllers/customerController"

const router = Router();

router.get(
    '/',
    verifyToken,
    isAdmin,
    getCustomers
);
router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getCustomer
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    [
        check('name','name is required').not().isEmpty(),
        check('name','El nombre debe ser minimo de 4 caracteres').isLength({min:4})
    ],
    createCustomer
);
router.put(
    '/:id',
    verifyToken,
    isAdmin,
    [
        check('name','El nombre debe ser minimo de 4 caracteres').isLength({min:4})
    ],
    updateCustomer
);
router.put(
    '/desactivate/:id',
    verifyToken,
    isAdmin,
    desactivateCustomer
);
router.put(
    '/activate/:id',
    verifyToken,
    isAdmin,
    activateCustomer
);

export default router;