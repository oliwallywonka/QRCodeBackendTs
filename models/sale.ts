import {model,Schema,Document, Types} from 'mongoose'
import { ICustomer } from './customer';
import { IUser } from './user';

export interface ISale extends Document{
    customer:Types.ObjectId|ICustomer,
    user:Types.ObjectId|IUser,
    total:number,
    invoice:string
    status:boolean
}

const saleSchema = new Schema<ISale>({
    customer:{
        type:Types.ObjectId,
        ref:'Customer'
    },
    user:{
        type:Types.ObjectId,
        ref:'User'
    },
    total:{
        type:Number,
        default:0
    },
    invoice:{
        type:String,
        trim:true,
        lowercase:true
    },
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false
});

export default model('Sale',saleSchema);