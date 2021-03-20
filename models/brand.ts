
import {model,Schema,Document} from "mongoose";

export interface IBrand extends Document {
    brand:string
}

const brandSchema = new Schema({
    brand:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true
    },
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false
});

export default model<IBrand>('Brand',brandSchema);