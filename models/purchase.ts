import {model,Schema,Document,Types} from 'mongoose'
import { IUser } from './user';
import { IWholeSeller } from './wholeseller';

export interface IPurchase extends Document{
    wholeseller : Types.ObjectId|IWholeSeller,
    user:Types.ObjectId|IUser,
    total:number,
    status:boolean
}

const purchaseSchema =  new Schema<IPurchase>({
    wholeseller:{
        type:Types.ObjectId,
        ref:'WholeSeller'
    },
    user:{
        type:Types.ObjectId,
        ref:'User'
    },
    total:{
        type:Number,
        required:true,
        default: 0
    },
    status:{
        type:Boolean,
        default:true
    }
},{
    versionKey:false,
    timestamps:true
});

export default model('Purchase',purchaseSchema);