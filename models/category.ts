import {model,Schema,Document} from 'mongoose'


export interface ICategory extends Document{
    category:string
}

const categorySchema = new Schema<ICategory>({
    category:{
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

export default model('Category',categorySchema);