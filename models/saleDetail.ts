import {model, Schema, Document, Types} from 'mongoose'
import { IClothe } from './clothe';
import { ISale } from './sale';

export interface ISaleDetail extends Document{
    sale:Types.ObjectId|ISale,
    clothe:Types.ObjectId|IClothe,
    quantity:number,
    price:number,
    subTotal:number,
    status:boolean,
}

const saleDetailSchema = new Schema<ISaleDetail>({
    sale:{
        type:Types.ObjectId,
        ref:'Sale'
    },
    clothe:{
        type:Types.ObjectId,
        ref:'Clothe'
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    },
    price:{
        type:Number
    },
    subTotal:{
        type:Number
    },
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false
});

export default model('SaleDetail',saleDetailSchema);