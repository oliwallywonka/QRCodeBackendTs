import {model,Schema,Document,Types} from "mongoose";

import { IColor } from "./color"
import { IClotheModel } from "./clotheModel";
import { ISize } from "./size";
import { IClothePicture } from "./clothePicture";

export interface IClothe extends Document{
    clotheModel:Types.ObjectId|IClotheModel,
    size:Types.ObjectId|ISize,
    color:Types.ObjectId|IColor,
    clothePicture:Types.ObjectId|IClothePicture,
    stock:number,
    status:boolean
}

const clotheSchema = new Schema<IClothe>({
    clotheModel:{
        type:Types.ObjectId,
        ref:'ClotheModel'
    },
    size:{
        type:Types.ObjectId,
        ref:'Size'
    },
    color:{
        type:Types.ObjectId,
        ref:'Color'
    },
    clothePicture:{
        type:Types.ObjectId,
        ref:'ClothePicture'
    },
    stock:{
        type:Number,
        default: 0
    },
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false
});

export default model('Clothe',clotheSchema);