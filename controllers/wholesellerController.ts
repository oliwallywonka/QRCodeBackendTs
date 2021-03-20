import { Request,Response } from "express"
import { validationResult } from "express-validator";

import WholeSeller, { IWholeSeller } from "../models/wholeseller"
export const getWholeSellers = async (req:Request,res:Response) => {
    try {
        const wholeSellers = await WholeSeller.find({status:true});
        return res.status(200).json({wholeSellers});
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const getWholeSeller = async(req:Request,res:Response) => {
    try {
        const wholeSellerId = req.params.id;
        const wholeSeller = await WholeSeller.findById(wholeSellerId);
        if(!wholeSeller) return res.status(404).json({msg:'wholeseller not found'});
        return res.status(200).json({wholeSeller});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createWholeSeller = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }

    const {name,phone,location,latitude,longitude} = <IWholeSeller>req.body;
    const newWholeSeller = new WholeSeller();

    if(name) newWholeSeller.name = name;
    if(phone) newWholeSeller.phone = phone;
    if(location) newWholeSeller.location = location;
    if(latitude) newWholeSeller.latitude = latitude;
    if(longitude) newWholeSeller.longitude = longitude;

    try {
        await newWholeSeller.save();
        return res.status(201).json({newWholeSeller});

    } catch (error) {
        res.status(500).send('server error')
    }
}

export const updateWholeSeller = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }

    const wholeSellerId = req.params.id;
    const {name,phone,location,latitude,longitude} = <IWholeSeller>req.body;
    const newWholeSeller = new WholeSeller({_id:wholeSellerId});

    if(name) newWholeSeller.name = name;
    if(phone) newWholeSeller.phone = phone;
    if(location) newWholeSeller.location = location;
    if(latitude) newWholeSeller.latitude = latitude;
    if(longitude) newWholeSeller.longitude = longitude;

    try {
        let updatedWholeSeller = await WholeSeller.findById(wholeSellerId);
        if(!updatedWholeSeller) return res.status(404).json({msg:'wholeseller not found'});
        updatedWholeSeller = await WholeSeller.findByIdAndUpdate(
            {_id:wholeSellerId},
            {$set:newWholeSeller},
            {new:true}
        );
        return res.status(202).json({updatedWholeSeller});
    } catch (error) {
        res.status(500).send('server error')
    }
}

export const desactivateWholeSeller = async (req:Request,res:Response) => {
    const wholeSellerId = req.params.id;
    try {
        const wholeSeller = await WholeSeller.findById(wholeSellerId);
        if(!wholeSeller) return res.status(404).json({msg:'wholeSeller not found'});
        await WholeSeller.findByIdAndUpdate(
            {_id:wholeSellerId},
            {status:false}
        );
        return res.status(203).json({msg:'wholeSeller desactivated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const activateWholeSeller = async (req:Request,res:Response) => {
    const wholeSellerId = req.params.id;
    try {
        const wholeSeller = await WholeSeller.findById(wholeSellerId);
        if(!wholeSeller) return res.status(404).json({msg:'wholeSeller not found'});
        await WholeSeller.findByIdAndUpdate(
            {_id:wholeSellerId},
            {status:true}
        );
        return res.status(203).json({msg:'wholeSeller activated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}