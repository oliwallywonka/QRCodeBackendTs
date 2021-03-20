
import { Request,Response } from "express"
import { validationResult } from "express-validator"

import Sale from '../models/sale'
import SaleDetail from '../models/saleDetail'
import Clothe from '../models/clothe'
export const getSales = async (req:Request,res:Response) => {
    try {
        const sales = await Sale
            .find({status:true})
            .populate('customer')
            .populate('user');
        return res.status(200).json({sales})
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const getSale = async(req:Request,res:Response) => {
    try {
        const saleId = req.params.id;
        const sale = await Sale
            .findById(saleId)
            .populate('customer')
            .populate('user');
        if(!sale) return res.status(404).json({msg:'sale not found'});
        return res.status(200).json({sale});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createSale = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }
    const {customer,user,clothes} = req.body;
    const newSale = new Sale();
    newSale.customer = customer;
    newSale.user = user;
    try {
        if(clothes.length>0){
            let total:number = 0;
            for (const clothe in clothes){
                const newSaleDetail = new SaleDetail({
                    sale: newSale._id,
                    clothe: clothes[clothe].id,
                    quantity: clothes[clothe].quantity,
                    price: clothes[clothe].price,
                    subTotal: clothes[clothe].price*clothes[clothe].quantity
                });
                const updatedClothe = await Clothe.findById(clothes[clothe].id);
                if(updatedClothe){
                    await Clothe.findByIdAndUpdate(
                        {_id:clothes[clothe].id},
                        {stock: updatedClothe.stock - clothes[clothe].quantity} 
                    );
                }else{
                    res.status(404).json({msg:'clothe not found'});
                }
                await newSaleDetail.save();
                total = 1.16*(total + newSaleDetail.subTotal);
            }
            newSale.total = total;
            await newSale.save();
        }
        return res.status(202).json({newSale});
    } catch (error) {
        res.status(500).send('server error');
    }
}
