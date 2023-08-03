import mongoose from "mongoose";

const otpSchema=new mongoose.Schema({
    phone:{
        type:String,
        required:true,    
    },
    otp:{
        type:String,
        required:true,
    },
    expiresAt: {
         type: Date,
          required: true
         },
})

const otpModel=mongoose.model('otp',otpSchema);

export default otpModel;