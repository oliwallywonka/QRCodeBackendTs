import {Router} from "express"
import {verifyToken,isAdmin} from "../middleware/auth"
import {
    getSaleDetailsBySale
} from "../controllers/saleDetailController"

const router = Router();

router.get(
    '/:id',
    verifyToken,
    isAdmin,
    getSaleDetailsBySale
);

export default router;
