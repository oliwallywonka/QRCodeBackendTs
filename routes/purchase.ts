import {Router} from "express"
import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getPurchases,
    getPurchase,
    createPurchase,
} from "../controllers/purchaseController"

const router = Router();

router.get(
    '/',
    verifyToken,
    isAdmin,
    getPurchases
);
router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getPurchase
);
router.post(
    '/',
    verifyToken,
    isAdmin,
    createPurchase
);

export default router;
