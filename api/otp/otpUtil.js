
import otpModel from "../model/otpSchema.js";
import axios from "axios";
import dotenv from 'dotenv';
import urlencode from 'rawurlencode'
dotenv.config()



const getnerateOTP=()=>{
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOTP=async (phone)=>{
    const otp=getnerateOTP();
    const expiresAt=new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() +5); //otp validity for 5 min
    console.log('Generated OTP:', otp);
    try{
        // Save the OTP and its expiration time to the database
        await otpModel.create({phone,otp,expiresAt})
        const message = `${otp} is your Goldsikka Verification Code. Do not share with any one`;
        let encodedMessage=urlencode(message)
        let TEXTLOCAL_API_KEY=encodeURIComponent(process.env.TEXTLOCAL_TRANSACTIONAL_API_KEY)
         let MSG_IDENTIFIER=encodeURIComponent(process.env.MSG_IDENTIFIER)
        const response = await axios.post(
            'https://api.textlocal.in/send',
            `apikey=${TEXTLOCAL_API_KEY}&numbers=${phone}&message=${encodedMessage}&sender=${MSG_IDENTIFIER}`
          );
          return response.data;
    }catch(error){
        console.error('Error sending OTP:', error.message);
    }
   
}

export const verifyOTP=async(phone,otp)=>{
   try{
   const  otpRecord=await otpModel.findOne({ phone, otp, expiresAt: { $gt: new Date() } });
     if(!otpRecord){
        return false; //OTP verification failed
     }
     await otpModel.updateOne({ _id: otpRecord._id }, { $set: { isUsed: true } });
     return true; //otp verification successful

   }catch(error){
    console.error('Error verifying OTP:', error.message);
    throw error;
   }

}

