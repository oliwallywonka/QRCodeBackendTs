import {Router} from "express"
import {check} from "express-validator"

import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getUsers,
    getUser,
    updateUser,
    createUser,
    activateUser,
    desactivateUser
} from "../controllers/userController"

const router = Router();

router.get(
    '/',
    verifyToken,
    isAdmin,
    getUsers
);
router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getUser
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    [   
        check('user','User is required').not().isEmpty(),
        check('user','el ususario debe tener minimo 4 caracteres').isLength({min:4}),
        check('rol','Rol is required').not().isEmpty(),
        check('rol','Rol debe ser minimo de 4 caracteres').isLength({min:4}),
        check('email','Email must be provider').not().isEmpty(),
        check('email','ingrese un email correcto').isEmail(),
        check('password','password must be provided').not().isEmpty(),
        check('password','min password lenght is 4').isLength({min:4})
    ],
    createUser
);
router.put(
    '/:id',
    verifyToken,
    isAdmin,
    updateUser
);
router.put(
    '/desactivate/:id',
    verifyToken,
    isAdmin,
    desactivateUser
);
router.put(
    '/activate/:id',
    verifyToken,
    isAdmin,
    activateUser
);

export default router;