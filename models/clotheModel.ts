import {model,Schema,Document,Types} from "mongoose"

import { ICategory } from './category';
import { IBrand } from './brand'

export interface IClotheModel extends Document{
    category:Types.ObjectId|ICategory,
    brand:Types.ObjectId|IBrand,
    clotheModel:string,
    refPrice:number,
    gender:boolean,
    qr:string,
    status:boolean,
}

const clotheModelSchema = new Schema<IClotheModel>({
    category:{
        type:Types.ObjectId,
        ref:'Category'
    },
    brand:{
        type:Types.ObjectId,
        ref:'Brand'
    },
    clotheModel:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    refPrice:{
        type:Number
    },
    gender:{
        type:Boolean,
        default:true
    },
    qr:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false
});

export default model('ClotheModel',clotheModelSchema);