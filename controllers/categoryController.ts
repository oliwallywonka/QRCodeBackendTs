import { Request,Response } from "express"
import { validationResult } from "express-validator";
import Category from "../models/category";
export const getCategories = async (req:Request,res:Response) => {

    try {
        const categories = await Category.find({status:true});
        return res.status(200).json({categories});
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const getCategory = async(req:Request,res:Response) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById({
            _id:categoryId
        });
        if(!category) return res.status(404).json({msg:'category not found'});
        return res.status(200).json({category});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createCategory = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }
    const {category} = req.body;
    try {
        const newCategory = new Category();
        newCategory.category = category;
        await newCategory.save();
        return res.status(201).json({newCategory});
    } catch (error) {
        res.status(500).send('server error')
    }
}

export const updateCategory = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }
    const {category} = req.body;
    const categoryId = req.params.id;

    const newCategory = new Category({
        _id: categoryId
    });
    newCategory.category = category;

    try {
        let updatedCategory = await Category.findById(categoryId);
        if(!updatedCategory) return res.status(404).json({msg:'category not found'});

        updatedCategory = await Category.findByIdAndUpdate(
            {_id:categoryId},
            {$set: newCategory},
            {new:true}
        );
        return res.status(203).json({updatedCategory});
    } catch (error) {
        res.status(500).send('server error')
    }
}

export const desactivateCategory = async (req:Request,res:Response) => {

    const categoryId = req.params.id;

    try {
        let category = await Category.findById(categoryId);
        if(!category) return res.status(404).json({msg:'category not found'});

        await Category.findByIdAndUpdate(
            {_id:categoryId},
            {status:false}
        );
        return res.status(203).json({msg:'category desactivated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const activateCategory = async (req:Request,res:Response) => {

    const categoryId = req.params.id;

    try {
        let category = await Category.findById(categoryId);
        if(!category) return res.status(404).json({msg:'category not found'});

        await Category.findByIdAndUpdate(
            {_id:categoryId},
            {status:true}
        );
        return res.status(203).json({msg:'category activated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}