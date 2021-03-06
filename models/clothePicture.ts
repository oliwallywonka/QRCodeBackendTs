import {model,Schema,Document} from "mongoose"

export interface IClothePicture extends Document{
    picture:string,
    path:string
}

const clotheSchema = new Schema<IClothePicture>({
    path:{
        type:String,
        required:true
    }
},{
    timestamps:true,
    versionKey:false
});

export default model('ClothePicture',clotheSchema);