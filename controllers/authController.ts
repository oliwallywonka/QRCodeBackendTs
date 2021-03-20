import {Request,Response} from "express"
import {generateJWT} from './jwt'

import User from "../models/user"
import Rol from "../models/rol"

export const signUp = async (req:Request,res:Response) => {
    try {
        const {user,email,password,rol}:{user:string,email:string,password:string,rol:string} = req.body;

        const userexist = await User.findOne({email});

        if(userexist) return res.status(400).json({message:"User already exist"});
        

        const newUser = new User({
            user,
            email,
            password
        })

        if(rol){
            const foundRol = await Rol.findOne({rol})
            if(foundRol){

                newUser.rol = foundRol._id;
            }else{
                return res.status(404).json({message:"rol not found"});
            }
        }else{
            const rol = await Rol.findOne({rol:"admin"})
            if(rol){

                newUser.rol  = rol._id;
            }else{
                return res.status(404).json({message:"rol not found"});
            }
            
        }

        const savedUser = await newUser.save()

        const payload:{[key:string]:string} = {
            id:savedUser._id
        }

        const token = await generateJWT(payload)

        res.status(200).json({token});
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"server Error"})
    }
}

export const signIn = async (req:Request,res:Response) => {
    
    try {
        const userFound = await User.findOne({email:req.body.email}).populate('rol');

        if(!userFound) return res.status(400).json({message:"User not found"})

        const isMatch = await userFound.comparePassword(req.body.password,userFound.password);

        if(!isMatch) return res.status(401).json({token:null,message:"invalid password"});

        const payload:{[key:string]:string} = {
            id:userFound.id
        }

        const token = await generateJWT(payload);
        
        res.status(200).json({token: token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"server Error"});
    }
}

export const renewToken = async(req:Request,res:Response) =>{

    try {
        const payload:{[key:string]:string} = {
            id:req.userId
        }

        const token = await generateJWT(payload);

        res.json({token});

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"server Error"});
    }
}