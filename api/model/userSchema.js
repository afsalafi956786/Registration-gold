import mongoose from "mongoose";


const userSchema=new mongoose.Schema({
    accountType:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    hearedAboutUs:{
        type:String,
        required:true,
    },
    referralCode:{
        type:String,
    }

},{
    timestamps:true
})

const userModel= mongoose.model('users',userSchema);
export default userModel;



