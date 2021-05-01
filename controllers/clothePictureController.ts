import { Request,Response } from "express"
import { validationResult } from "express-validator"
import fs from "fs-extra"
import path from "path"

import ClothePicture from "../models/clothePicture"
import Clothe from "../models/clothe"
export const getPictures = async (req:Request,res:Response) => {
    try {
        const getPictures = await ClothePicture.find();
        return res.json({getPictures});
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const getPicture = async(req:Request,res:Response) => {
    try {
        const pictureId = req.params.id;
        const picture = await ClothePicture.findById(pictureId);
        return res.json({picture});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createPicture = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }

    const pathPicture = req.file.path;

    try {
        const newPicture = new ClothePicture();
        newPicture.path = pathPicture;
        await newPicture.save();
        return res.json({
            newPicture
        });
    } catch (error) {
        res.status(500).send('server error')
    }
}

export const updatePicture = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }

    const pictureId = req.params.id;
    const {picture} = req.body;
    const pathPicture = req.file.path;

    try {
        let updatedPicture = await ClothePicture.findById(pictureId);

        if(!updatedPicture) return res.status(404).json({msg:'picture not found'});

        const newPicture = new ClothePicture({_id:pictureId});
        if(pathPicture) {
            newPicture.path = pathPicture;
            await fs.unlink(path.resolve(updatedPicture.path));
        }
        if(picture) newPicture.picture = picture;

        updatedPicture = await ClothePicture.findByIdAndUpdate(
            {_id:pictureId},
            {$set:newPicture},
            {new:true}
        );

        return res.status(201).json({updatedPicture});
    } catch (error) {
        res.status(500).send('server error')
    }
}

export const desactivatePicture = async (req:Request,res:Response) => {
    const pictureId = req.params.id;
    try {
        const picture = await ClothePicture.findByIdAndRemove(pictureId)
        if (picture){
            await fs.unlink(path.resolve(picture.path));
            await ClothePicture.findByIdAndRemove(pictureId);
        }
        //await Clothe.find({clothePicture: pictureId}).updateMany({clotheModel: "null"});

        return res.status(202).json({msg:'picture has been deleted in all dependecies'});
    } catch (error) {
        console.log(error)
        res.status(500).send('server error');
    }
}

export const activatePicture = async (req:Request,res:Response) => {

    try {
        
    } catch (error) {
        res.status(500).send('server error');
    }
}