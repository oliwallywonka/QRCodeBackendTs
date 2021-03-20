import { Request,Response } from "express"
import { validationResult } from "express-validator"
import Clothe, { IClothe } from "../models/clothe"
export const getClothesByModel = async (req:Request,res:Response) => {
    const modelId = req.params.id;
    try {
        const clothes = await Clothe
            .find({
                status:true,
                clotheModel: modelId
            })
            .populate('size')
            .populate('color')
            .populate('clothePicture');
        return res.status(200).json({clothes});
    } catch (error) {
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
    const {clotheModel,size,color,clothePicture} = req.body;
    try {
        if (size.length > 0){
            for (const current in size) {
                const newClothe = new Clothe({
                    clotheModel: clotheModel,
                    color: color,
                    size: size[current]
                });
                if(clothePicture) newClothe.clothePicture = clothePicture;
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
    const {clotheModel,size,color,clothePicture} = req.body;
    const newClothe = new Clothe({_id:clotheId});
    if(clotheModel) newClothe.clotheModel = clotheModel;
    if(size) newClothe.size = size;
    if(color) newClothe.color = color;
    if(clothePicture) newClothe.clothePicture = clothePicture;
    try {
        const existClothe = await Clothe.findById(clotheId);
        if (!existClothe) return res.status(404).json({msg:'not found'});
        const updatedClothe = await Clothe.findByIdAndUpdate(
            {_id:clotheId},
            {$set:newClothe},
            {new:true}
        );
        return res.status(202).json({updatedClothe});
    } catch (error) {
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
