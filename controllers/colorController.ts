import { Request,Response } from "express"
import { validationResult } from "express-validator"
import Color, { IColor } from "../models/color"
export const getColors = async (req:Request,res:Response) => {
    try {
        const colors = await Color.find({status:true});
        return res.status(200).json({colors});
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const getColor = async(req:Request,res:Response) => {
    try {
        const colorId = req.params.id;
        const color = await Color.findOne({
            id:colorId
        });
        if(!color) return res.status(404).json({msg:'color not found'});
        return res.status(200).json({color});

    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createColor = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }

    const {color,value} = <IColor>req.body;

    try {
        const existColor = await Color.findOne({color:color});
        if(existColor) return res.status(400).json({msg:'El nombre del color ya existe'});
        const newColor = new Color();
        newColor.color = color;
        if(value) newColor.value = value;
        await newColor.save();
        return res.status(201).json({newColor});
    } catch (error) {
        res.status(500).send('server error')
    }
}

export const updateColor = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }

    const {color,value} = <IColor>req.body;
    const colorId = req.params.id;

    const newColor = new Color({_id:colorId});

    if(color) newColor.color = color;
    if(value) newColor.value = value;

    try {
        let updatedColor = await Color.findById(colorId);
        if(!updatedColor) return res.status(404).json({msg:'Color not found'})
        updatedColor = await Color.findByIdAndUpdate(
            {_id:colorId},
            {$set:newColor},
            {new:true}
        );
        return res.status(202).json({updatedColor});
    } catch (error) {
        res.status(500).send('server error')
    }
}

export const desactivateColor = async (req:Request,res:Response) => {
    const colorId = req.params.id;
    try {
        const color = await Color.findById(colorId);
        if(!color) return res.status(404).json({msg:'color not found'});
        await Color.findByIdAndUpdate(
            {_id:colorId},
            {status:false}
        );
        return res.status(203).json({msg:'color desactivated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const activateColor = async (req:Request,res:Response) => {
    const colorId = req.params.id;
    try {
        const color = await Color.findById(colorId);
        if(!color) return res.status(404).json({msg:'color not found'});
        await Color.findByIdAndUpdate(
            {_id:colorId},
            {status:true}
        );
        return res.status(203).json({msg:'color activated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}