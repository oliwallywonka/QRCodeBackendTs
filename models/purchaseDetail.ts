import {model,Schema,Document,Types} from "mongoose"
import { IClothe } from "./clothe";
import { IPurchase } from "./purchase";

export interface IPurchaseDetail extends Document{
    purchase:Types.ObjectId|IPurchase,
    clothe:Types.ObjectId|IClothe,
    quantity:number,
    price:number,
    subTotal:number,
    status:boolean
}

const purchaseDetailSchema = new Schema<IPurchaseDetail>({
    purchase:{
        type:Types.ObjectId,
        ref:'Purchase'
    },
    clothe:{
        type:Types.ObjectId,
        ref:'Clothe'
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    subTotal:{
        type:Number,
    },
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false
});

export default model('PurchaseDetail',purchaseDetailSchema);