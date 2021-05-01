import { Request,Response } from "express";
import {Types} from 'mongoose';
import { validationResult } from "express-validator";
import Clothe, { IClothe } from "../models/clothe";
import ClothePicture from '../models/clothePicture';
export const getClothesByModel = async (req:Request,res:Response) => {
    const modelId = Types.ObjectId(req.params.id);
    try {
        const clothes = await Clothe
            /*.find({
                status:true,
                clotheModel: modelId
            })
            .populate('size')
            .populate('color')
            .populate('clothePicture');*/
            .aggregate([
                {
                    $match:{
                        clotheModel:  modelId
                    }
                },
                {
                    $lookup:{
                        from:'sizes',
                        localField:'size',
                        foreignField:'_id',
                        as:'size'
                    }
                },
                {
                    $lookup:{
                        from:'colors',
                        localField:'color',
                        foreignField:'_id',
                        as:'color'
                    }
                },
                {
                    $lookup:{
                        from:'clothepictures',
                        localField:'clothePicture',
                        foreignField:'_id',
                        as:'clothePicture'
                    }
                },
                {
                    $unwind:{
                        path:'$size',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind:{
                        path:'$color',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind:{
                        path:'$clothePicture',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group:{
                        _id:'$color._id',
                        clothes: {
                            $push: {
                                _id: '$_id',
                                stock: '$stock',
                                clothePicture: '$clothePicture',
                                color:'$color',
                                size: '$size',
                            }
                        }
                    },
                },
                
            ])
        return res.status(200).json({clothes});
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server Error"})
    }
}

export const getClothe = async(req:Request,res:Response) => {
    try {
        const clotheId = req.params.id;
        const clothe = await Clothe
            .findById(clotheId)
            .populate('size')
            .populate('color')
            .populate('clothePicture');
        if(!clothe) return res.status(404).json({msg:'Clothe not found'});
        return res.status(200).json({clothe});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createClothe = async(req:Request,res:Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }
    const {clotheModel,size,color} = req.body;
    
    const size2 = JSON.parse(size);
    try {
        if (size.length > 0){
            for (const current in size2) {
                const newClothe = new Clothe({
                    clotheModel: clotheModel,
                    color: color,
                    size: size2[current]
                });
                if(req.file) {
                    console.log(req.file.path);
                    const newPicture = new ClothePicture();
                    newPicture.path = req.file.path;
                    newClothe.clothePicture = newPicture._id;
                    await newPicture.save();
                }
                await newClothe.save();
            }
        }
        return res.status(201).json({msg:'created succesifully'})
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

export const updateClothe = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }
    const clotheId = req.params.id;
    const {clotheModel,size,color} = req.body;
    const newClothe = new Clothe({_id:clotheId});
    if(clotheModel) newClothe.clotheModel = clotheModel;
    if(size) newClothe.size = JSON.parse(size);
    if(color) newClothe.color = color;

    try {
        const existClothe = await Clothe.findById(clotheId);
        if (!existClothe) return res.status(404).json({msg:'not found'});
        if(req.file) {
            const newPicture = new ClothePicture();
            newPicture.path = req.file.path;
            newClothe.clothePicture = newPicture._id;
            await newPicture.save();
            if(existClothe.clothePicture) await ClothePicture.findByIdAndRemove(existClothe.clothePicture);
        }
        const updatedClothe = await Clothe.findByIdAndUpdate(
            {_id:clotheId},
            {$set:newClothe},
            {new:true}
        );
        return res.status(202).json({updatedClothe});
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

export const desactivateClothe = async (req:Request,res:Response) => {
    try {
        const clotheId = req.params.id;
        const clothe = await Clothe.findById(clotheId);
        if(!clothe) return res.status(404).json({msg:'clothe not found'});
        await Clothe.findByIdAndUpdate(
            {_id:clotheId},
            {status:false},
            {new:true}
        )
        return res.status(202).json({msg:'desactivated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const activateClothe = async (req:Request,res:Response) => {
    try {
        const clotheId = req.params.id;
        const clothe = await Clothe.findById(clotheId);
        if(!clothe) return res.status(404).json({msg:'clothe not found'});
        await Clothe.findByIdAndUpdate(
            {_id:clotheId},
            {status:true}
        )
        return res.status(202).json({msg:'activated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}
