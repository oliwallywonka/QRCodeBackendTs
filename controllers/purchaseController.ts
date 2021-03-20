import { Request,Response } from "express"
import { validationResult } from "express-validator"

import Purchase from '../models/purchase'
import PurchaseDetail from "../models/purchaseDetail"
import Clothe from '../models/clothe';

export const getPurchases = async (req:Request,res:Response) => {
    try {
        const purchases = await Purchase.find({status:true});
        return res.status(200).json({purchases});
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const getPurchase = async(req:Request,res:Response) => {
    try {
        const purchaseId = req.params.id;
        const purchase = await Purchase
            .findOne({
                _id:purchaseId
            })
            .populate('user')
            .populate('wholeseller');
        if(!purchase) return res.status(404).json({msg:'purchse not found'});
        return res.status(200).json({purchase});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createPurchase = async(req:Request,res:Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }
    const {wholeseller,user,clothes} = req.body;
    const newPurchase = new Purchase();
    newPurchase.wholeseller = wholeseller;
    newPurchase.user = user;
    try {
        if(clothes.length>0){
            let total:number = 0;
            for(const clothe in clothes){
                const newPurchaseDetail = new PurchaseDetail({
                    purchase: newPurchase._id,
                    clothe: clothes[clothe].id,
                    quantity: clothes[clothe].quantity,
                    price: clothes[clothe].price,
                    subTotal: clothes[clothe].price*clothes[clothe].quantity
                });
                const updatedClothe = await Clothe.findById(clothes[clothe].id);
                if(updatedClothe){
                    await Clothe.findByIdAndUpdate(
                        {_id:clothes[clothe].id},
                        {stock: updatedClothe.stock + clothes[clothe].quantity},
                    );
                }else{
                    res.status(404).json({msg:'clothe not found'});
                }
                await newPurchaseDetail.save();
                total = (total + newPurchaseDetail.subTotal);
            }
            newPurchase.total = total;
            await newPurchase.save();
        }
        return res.status(202).json({newPurchase});
    } catch (error) {
        res.status(500).send('server error');
    }
}
