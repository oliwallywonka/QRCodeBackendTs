import * as jwt from "jsonwebtoken"
import { IUser } from "../models/user"

export const generateJWT = (payload:{[key:string]:string}) =>{
    try {
        return new Promise((resolve,reject)=>{
            jwt.sign(
                payload,
                process.env.SECRET||"",
                {expiresIn:'24h'},
                async(err,token) =>{
                    if(err){
                        reject('cant generate JWT');
                    }else{
                        resolve(token);
                    }
                }
            )
        });
    } catch (error) {
        console.log(error);
    }
}

export const checkJWT = (token:string) => {
    try {
        const {id} = <IUser>jwt.verify(
            token,
            process.env.SECRET || ""
        )
        return [true,id];
    } catch (error) {
        return [false,null];
    }
}


