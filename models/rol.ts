import {model,Schema,Document} from "mongoose";

export interface IRol extends Document{
    rol:string
}

const rolSchema:Schema = new Schema({
    rol:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    }
},{
    timestamps:true,
    versionKey:false
});

export default model<IRol>('Rol',rolSchema);