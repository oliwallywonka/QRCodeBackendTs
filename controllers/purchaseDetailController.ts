import { Request,Response } from "express"

import PurchaseDetail from "../models/purchaseDetail";
export const getPurchaseDetailsBySale = async (req:Request,res:Response) => {
    try {
        const purchaseId = req.params.id;
        const purchaseDetails = await PurchaseDetail
            .find({purchase:purchaseId})
            .populate([
                {
                    path: 'clothe',
                    populate: {
                        path: 'color'
                    }
                },
                {
                    path: 'clothe',
                    populate: {
                        path: 'size'
                    }
                }
            ]);
        return res.status(200).json({purchaseDetails});
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

