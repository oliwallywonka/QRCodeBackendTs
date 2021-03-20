import { Request,Response } from "express"
import { validationResult } from "express-validator";
import Size, { ISize } from "../models/size";
export const getSizes = async (req:Request,res:Response) => {
    try {
        const sizes = await Size.find({status:true});
        return res.status(200).json({sizes});
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const getSize = async(req:Request,res:Response) => {
    try {
        const sizeId = req.params.id;
        const size = await Size.findOne({
            _id:sizeId
        });
        if(!size) return res.status(404).json({msg:'size not found'});
        return res.status(200).json({size});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createSize = async(req:Request,res:Response) => {

    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()});
    }

    const {size} = <ISize>req.body;

    try {
        const newSize = new Size();
        newSize.size = size;
        await newSize.save();
        return res.status(201).json({newSize});
    } catch (error) {
        res.status(500).send('server error')
    }
}

export const updateSize = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }
    const sizeId = req.params.id;
    const {size} = <ISize>req.body;

    const newSize = new Size({_id:sizeId});
    newSize.size = size;

    try {
        let updatedSize = await Size.findById(sizeId);
        if(!updatedSize) return res.status(404).json({msg:'Size not found'});

        updatedSize = await Size.findByIdAndUpdate(
            {_id:sizeId},
            {$set:newSize},
            {new:true}
        );

        return res.status(202).json({updatedSize});

    } catch (error) {
        res.status(500).send('server error')
    }
}

export const desactivateSize = async (req:Request,res:Response) => {

    const sizeId = req.params.id;

    try {
        const size = Size.findById(sizeId);
        if(!size) return res.status(404).json({msg:'size not found'});

        await Size.findByIdAndUpdate(
            {_id:sizeId},
            {status:false}
        );
        return res.status(202).json({msg:'size has been desactivaded successifully'});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const activateSize = async (req:Request,res:Response) => {

    const sizeId = req.params.id;

    try {
        const size = Size.findById(sizeId);
        if(!size) return res.status(404).json({msg:'size not found'});

        await Size.findByIdAndUpdate(
            {_id:sizeId},
            {status:true}
        );
        return res.status(202).json({msg:'size has been activaded successifully'});
    } catch (error) {
        res.status(500).send('server error');
    }
}