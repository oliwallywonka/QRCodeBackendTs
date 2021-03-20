import { Request,Response } from "express"
import { validationResult } from "express-validator";

import Brand, { IBrand } from "../models/brand"
export const getBrands = async (req:Request,res:Response) => {
    try {
        const brands = await Brand.find({status:true});

        return res.status(200).json({brands});
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const getBrand = async(req:Request,res:Response) => {
    try {
        const brandId = req.params.id;
        const brand = await Brand.findOne({
            _id:brandId
        });
        if(!brand) return res.status(404).json({msg:'brand not found'});
        return res.status(200).json({brand});

    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createBrand = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }

    const {brand} = <IBrand>req.body;

    if(!brand){
        return res.status(400).json({msg:'brand must be provided'});
    }

    try {
        const existBrand = await Brand.findOne({brand});
        if(existBrand) return res.status(400).json({msg:"ya existe una marca con este nombre"});
        const newBrand = new Brand();
        newBrand.brand = brand;
        await newBrand.save();
        return res.status(201).json({newBrand});
    } catch (error) {
        res.status(500).send('server error')
    }
}

export const updateBrand = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }
    const {brand} = <IBrand>req.body;
    const brandId = req.params.id;

    const newBrand = new Brand({_id:brandId});
    newBrand.brand = brand;

    try {
        let updatedBrand = await Brand.findById(brandId);
        if(!updatedBrand){
            return res.status(404).json({msg:'Brand not found'});
        }

        updatedBrand = await Brand.findByIdAndUpdate(
            {_id: brandId},
            {$set: newBrand},
            {new:true}
        );

        return res.status(203).json({updatedBrand});

    } catch (error) {
        res.status(500).send('server error')
    }
}

export const desactivateBrand = async (req:Request,res:Response) => {

    const brandId = req.params.id;
    try {
        let brand = await Brand.findById(brandId);
        if(!brand) return res.status(404).json({msg:'brand not found'});

        await Brand.findByIdAndUpdate(
            {_id:brandId},
            {status:false}
        );
        return res.status(200).json({msg:'brand desactivated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const activateBrand = async (req:Request,res:Response) => {

    const brandId = req.params.id;
    try {
        let brand = await Brand.findById(brandId);
        if(!brand) return res.status(404).json({msg:'brand not found'});

        await Brand.findByIdAndUpdate(
            {_id:brandId},
            {status:true}
        );
        res.status(200).json({msg:'brand activated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}