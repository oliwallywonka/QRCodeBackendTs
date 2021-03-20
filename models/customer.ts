import {model,Schema,Document} from 'mongoose'

export interface ICustomer extends Document{
    name:string,
    ci:string,
    nit:string
}

const customerSchema = new Schema<ICustomer>({
    name:{
        type:String,
        lowercase:true,
        trim:true
    },
    ci:{
        type:String,
        trim:true,
        lowercase:true
    },
    nit:{
        type:String,
        trim:true,
        lowercase:true
    },
    status:{
        type:Boolean,
        default: true
    }
},{
    timestamps:true,
    versionKey: false
});

export default model('Customer',customerSchema);