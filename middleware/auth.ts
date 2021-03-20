import {Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken"

import Rol from "../models/rol"
import User,{ IUser } from "../models/user"

declare global{
    namespace Express {
        interface Request {
            userId:string
        }
    }
}

export const verifyToken = async (req:Request,res:Response,next:NextFunction) => {
    try {
        
        const token = <string>req.headers["x-access-token"];
        if(!token) return res.status(403).json({message:"no token provided"});
        const {id} = <IUser>jwt.verify(
            token,
            process.env.SECRET||""
        );

        req.userId = id;

        const user = await User.findById(id,{password:0});
        if(!user) return res.status(404).json({message:'no user found'});

        next();

    } catch (error) {
        return res.status(401).json({message:'Unauthorize'});
    }
}

export const isAdmin = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const user = await User.findById(req.userId);
        if(user){

            const rolBase = await Rol.findOne({_id:user.rol});

            if(rolBase){

                if(rolBase.rol == "admin" ){
                    next();
                    return;
                }
            }else{
                return res.status(404).json({message:'Invalid token and unexist rol'})
            }

        }else{
            return res.status(404).json({message:'Invalid token and unexist user'})
        }

        return res.status(403).json({message:'invalid rol admin, unauthorized rol'});
    } catch (error) {
        return res.status(401).json({message:'Unauthorized token'});
    }
}

export const isEmployee = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const user = await User.findById(req.userId);
        if(user){

            const rolBase = await Rol.findOne({_id:user.rol});

            if(rolBase){

                if(rolBase.rol == "employee" ){
                    next();
                    return;
                }
            }else{
                return res.status(404).json({message:'Invalid token and unexist rol'})
            }

        }else{
            return res.status(404).json({message:'Invalid token and unexist user'})
        }

    } catch (error) {
        return res.status(401).json({message:'Unauthorized token'});
    }
}