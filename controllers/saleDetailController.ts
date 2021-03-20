import { Request,Response } from "express"
import { validationResult } from "express-validator"

import SaleDetail from "../models/saleDetail";
export const getSaleDetailsBySale = async (req:Request,res:Response) => {
    try {
        const saleId = req.params.id;
        const saleDetails = await SaleDetail
            .find({sale:saleId})
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
        return res.status(200).json({saleDetails});
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}
