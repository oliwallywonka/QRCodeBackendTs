import { model,Schema,Document } from "mongoose"

export interface IWholeSeller extends Document {
    name:string,
    phone:string
    location:string,
    latitude:string,
    longitude:string,
    status:boolean
}

const wholeSellerSchema = new Schema<IWholeSeller>({
    name:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
    },
    location:{
        type:String
    },
    latitude:{
        type:String
    },
    longitude:{
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

export default model('WholeSeller',wholeSellerSchema);