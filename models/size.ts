import {model,Schema,Document} from "mongoose"

export interface ISize extends Document {
    size:number
}

const sizeSchema = new Schema<ISize>({
    size:{
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

export default model('Size',sizeSchema);