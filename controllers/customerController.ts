import { Request,Response } from "express"
import { validationResult } from "express-validator";
import Customer, { ICustomer } from "../models/customer";
import { updateCategory } from "./categoryController";
export const getCustomers = async (req:Request,res:Response) => {
    try {
        const customers = await Customer.find({status:true});
        return res.status(200).json({customers});
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const getCustomer = async(req:Request,res:Response) => {
    try {
        const customerId = req.params.id;
        const customer = await Customer.findById(customerId);
        if(!customer) return res.status(404).json({msg:'customer not found'});
        return res.status(200).json({customer});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createCustomer = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()})
    }

    const {name,ci,nit} = <ICustomer>req.body;
    const newCustomer = new Customer();
    if(name) newCustomer.name = name;
    if(ci) newCustomer.ci = ci;
    if(nit) newCustomer.nit = nit;

    try {
        await newCustomer.save();
        return res.status(201).json({newCustomer})
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const updateCustomer = async(req:Request,res:Response) => {

    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({errores:errors.array()});
    }

    const {ci,name,nit} = <ICustomer>req.body;
    const customerId = req.params.id;
    const newCustomer = new Customer({_id:customerId});

    if(name) newCustomer.name = name;
    if(ci) newCustomer.ci = ci;
    if(nit) newCustomer.nit = nit;

    try {
        let updatedCustomer = await Customer.findById(customerId);
        if(!updatedCustomer) return res.status(404).json({msg:'Customer not found'});

        updatedCustomer = await Customer.findByIdAndUpdate(
            {_id:customerId},
            {$set:newCustomer},
            {new:true}
        );

        return res.status(202).json({updatedCustomer});

    } catch (error) {
        res.status(500).send('server error');
    }
}

export const desactivateCustomer = async (req:Request,res:Response) => {
    const customerId = req.params.id;
    try {
        const customer = await Customer.findById(customerId);
        if(!customer) return res.status(404).json({msg:'Customer not found'});
        await Customer.findByIdAndUpdate(
            {_id:customerId},
            {status:false}
        ); 
        return res.status(203).json({msg:'customer has been desactivated'});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const activateCustomer = async (req:Request,res:Response) => {
    const customerId = req.params.id;
    try {
        const customer = await Customer.findById(customerId);
        if(!customer) return res.status(404).json({msg:'Customer not found'});
        await Customer.findByIdAndUpdate(
            {_id:customerId},
            {status:true}
        ); 
        return res.status(203).json({msg:'customer has been activated'});
    } catch (error) {
        res.status(500).send('server error');
    } 
}