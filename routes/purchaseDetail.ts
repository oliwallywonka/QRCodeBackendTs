import {Router} from "express"
import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getPurchaseDetailsBySale
} from "../controllers/purchaseDetailController"

const router = Router();

router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getPurchaseDetailsBySale
);

export default router;
