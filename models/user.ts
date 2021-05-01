import {model,Schema,Document,Types, Query} from "mongoose"
import bcrypt ,{compare}from "bcryptjs"

import { IRol } from "./rol"

export interface IUser extends Document{
    //id:string,
    email:string,
    password:string,
    user:string,
    rol:Types.ObjectId|IRol,
    name: string,
    lastName: string,
    ci: string,
    comparePassword: (password:string,changedPassword:string) => Promise<boolean>

}

const userSchema = new Schema<IUser>({
    rol:{
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        index: true
    },
    user:{
        type:String,
        require:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        trim:true
    },
    lastName:{
        type:String,
        trim:true
    },
    ci:{
        type:String,
        trim:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    }
},{
    timestamps:true,
    versionKey:false
});

userSchema.pre('save', async function(next):Promise<void>{
    const user = this;
    if(user.isModified('password')) {

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password,salt);
        user.password = hash;
        next();
    }
});

userSchema.methods.comparePassword = async function (password:string,recivedPassword:string):Promise<boolean>{
    return await compare(password,recivedPassword);
}

export default model('User',userSchema);