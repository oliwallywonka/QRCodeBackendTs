import { Request,Response } from "express"
import { validationResult } from "express-validator";
import User, { IUser } from "../models/user";
import Rol from "../models/rol"
export const getUsers = async (req:Request,res:Response) => {
    try {
        const users = await User
            .find()
            .select(['-password','-status'])
            .where({status:true})
            .populate('rol');
        return res.status(200).json({users});
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const getUser = async(req:Request,res:Response) => {
    try {
        const userId = req.params.id;
        const user = await User
            .findById(userId)
            .select(['-password','-status'])
            .populate('rol');
        if(!user) return res.status(404).json({msg:'user not found'});
        return res.status(200).json({user});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const createUser = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errores:errors.array()});
    }

    const {email,password,user,rol}:{email:string,password:string,user:string,rol:string} = req.body;
    const newUser = new User();

    try {
        const userexist = await User.findOne({email});

        if(userexist) return res.status(400).json({msg:"User already exist"});
        
        if(rol){
            if(rol == 'admin') {
                const rol = await Rol.findOne({rol:'admin'});
                if(!rol) return res.status(404).json({msg:'rol not found'});
                newUser.rol = rol.id;
            }
            if(rol == 'employee'){
                const rol = await Rol.findOne({rol:'employee'});
                if(!rol) return res.status(404).json({msg:'rol not found'});
                newUser.rol = rol.id;
            }
        }
    
        newUser.email = email;
        newUser.password = password;
        newUser.user = user;

        await newUser.save();
        return res.status(201).json({newUser});
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
}

export const updateUser = async(req:Request,res:Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errores:errors.array()});
    }
    const {email,password,user,rol}:{email:string,password:string,user:string,rol:string} = req.body;
    const userId = req.params.id;
    const newUser = new User({_id:userId});

    if(email) newUser.email = email;
    if(password) newUser.password = password;
    if(user) newUser.user = user;

    try {
        const userexist = await User.findOne({email});

        if(userexist){
            return res.status(400).json({msg:"El email introducido es el mismo o ya existe"});
        }

        if(rol){
            if(rol == 'admin') {
                const rol = await Rol.findOne({rol:'admin'});
                if(!rol) return res.status(404).json({msg:'rol not found'});
                newUser.rol = rol.id;
            }
            if(rol == 'employee'){
                const rol = await Rol.findOne({rol:'employee'});
                if(!rol) return res.status(404).json({msg:'rol not found'});
                newUser.rol = rol.id;
            }
        }

        let updatedUser = await User.findById(userId);
        if(!updatedUser) return res.status(404).json({msg:'user not found'});


        updatedUser = await User.findOneAndUpdate(
            {_id:userId},
            {$set:newUser},
            {new:true}
        );

        return res.status(202).json({updatedUser});

    } catch (error) {
        res.status(500).send('server error');
    }
}

export const desactivateUser = async (req:Request,res:Response) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({msg:'user not found'});
        await User.findOneAndUpdate(
            {_id:userId},
            {status:false}
        );
        return res.status(202).json({msg:'user has been desactivated successfully'});
    } catch (error) {
        res.status(500).send('server error');
    }
}

export const activateUser = async (req:Request,res:Response) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({msg:'user not found'});
        await User.findByIdAndUpdate(
            {_id:userId},
            {status:true}
        );
        return res.status(202).json({msg:'user has been activated successfully'});
    } catch (error) {
        res.status(500).send('server error');
    }
}