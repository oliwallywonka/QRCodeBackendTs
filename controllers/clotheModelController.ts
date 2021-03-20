import { Request,Response } from "express"
import { validationResult } from "express-validator"
import QRCode from "qrcode"
import path from 'path'
import pdf from 'html-pdf'

import ClotheModel, { IClotheModel } from "../models/clotheModel"
export const getClotheModels = async (req:Request,res:Response) => {
    try {
        const clotheModels = await ClotheModel
            /*.find({status:true})
            .populate('brand')
            .populate('category')*/
            .aggregate([
                {
                    $lookup:{
                        from: 'clothes',
                        localField: '_id',
                        foreignField: 'clotheModel',
                        as: 'clothes'
                    }
                },{
                    $lookup:{
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category'
                    }
                },{
                    $lookup:{
                        from: 'brands',
                        localField: 'brand',
                        foreignField: '_id',
                        as: 'brand'
                    }
                },{
                    $unwind:
                    {
                        path: "$brand",
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $unwind:{
                        path: '$category',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ])
        return res.status(200).json({clotheModels});
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server Error"})
    }
}

export const getClotheModel = async(req:Request,res:Response) => {
    try {
        const clotheModelId = req.params.id;
        const clotheModel = await ClotheModel
            .findById(clotheModelId)
            .populate('brand')
            .populate('category');
        return res.status(200).json({clotheModel});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createClotheModel = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }

    const {brand,category,clotheModel,refPrice,gender} = <IClotheModel>req.body;

    const newClotheModel = new ClotheModel();

    if(brand) newClotheModel.brand = brand;
    if(category) newClotheModel.category = category;
    if(clotheModel) newClotheModel.clotheModel = clotheModel;
    if(refPrice) newClotheModel.refPrice = refPrice;
    if(gender) newClotheModel.gender = gender;

    try {
        await QRCode.toFile(path.join(__dirname,`../../public/models/${newClotheModel._id}.png`),`http://localhost:8000/api/clothe/model/${newClotheModel._id}`);

        newClotheModel.qr = `/public/models/${newClotheModel._id}.png`;

        await newClotheModel.save();
        return res.status(201).json({newClotheModel});
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

export const updateClotheModel = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }

    const clotheModelId = req.params.id;
    const {brand,category,clotheModel,refPrice,gender} = <IClotheModel>req.body;

    const newClotheModel = new ClotheModel({_id: clotheModelId});

    if(brand) newClotheModel.brand = brand;
    if(category) newClotheModel.category = category;
    if(clotheModel) newClotheModel.clotheModel = clotheModel;
    if(refPrice) newClotheModel.refPrice = refPrice;
    if(gender) newClotheModel.gender = gender;

    try {
        let existClotheModel = await ClotheModel.findById(clotheModelId);
        if(!existClotheModel) return res.status(404).json({msg:'modelo not found'});

        existClotheModel = await ClotheModel.findByIdAndUpdate(
            {_id: clotheModelId},
            {$set: newClotheModel},
            {new:true}
        );
        return res.status(203).json({existClotheModel});
    } catch (error) {
        res.status(500).send('server error')
    }
}

export const desactivateClotheModel = async (req:Request,res:Response) => {
    const clotheModelId = req.params.id;
    try {
        let clotheModel = await ClotheModel.findById(clotheModelId);
        if(!clotheModel) return res.status(404).json({msg:'model not found'});
        await ClotheModel.findByIdAndUpdate(
            {_id:clotheModelId},
            {status:false}
        );
        return res.status(202).json({msg:'model has been desactivated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const activateClotheModel = async (req:Request,res:Response) => {
    const clotheModelId = req.params.id;
    try {
        let clotheModel = await ClotheModel.findById(clotheModelId);
        if(!clotheModel) return res.status(404).json({msg:'model not found'});
        await ClotheModel.findByIdAndUpdate(
            {_id:clotheModelId},
            {status:true}
        );
        return res.status(202).json({msg:'model has been activated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}