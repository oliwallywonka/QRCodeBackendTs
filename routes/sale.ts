import {Router} from "express"
import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getSales,
    getSale,
    createSale,
} from "../controllers/saleController"

const router = Router();

router.get(
    '/',
    verifyToken,
    isAdmin,
    getSales
);
router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getSale
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    createSale
);

export default router;
