import {model,Schema,Document} from "mongoose";

export interface IColor extends Document{
    color:string,
    value:string
}

const colorSchema = new Schema({
    color:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true
    },
    value:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true
    },
    status:{
        type:Boolean,
        default: true
    }
},{
    timestamps:true,
    versionKey:false
});

export default model<IColor>('Color',colorSchema);