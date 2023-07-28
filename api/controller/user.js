
import { googleOAuth2Client, verifyGoogleToken } from "../Google/google.js";
import userModel from "../model/userSchema.js";
import { sendOTP,verifyOTP } from "../otp/otpUtil.js";
import jwt from 'jsonwebtoken';




export async function userRegister(req, res) {
  try {
    const { name, email, phone, accountType, hearedAboutUs, referralCode } = req.body;
    let registerPhone = /^\d{10}$/;
    if (name && email && phone && accountType && hearedAboutUs) {
      if (
        !accountType ||
        (accountType !== "Personal Account" &&
          accountType !== "Business Account")
      ) {
        res.status(400).json({ message: "Invalid Account type selected!" });
      }
      if (registerPhone.test(phone)) {
        let existEmail = await userModel.findOne({ email: email });
        let existPhone = await userModel.findOne({ phone: phone });
        if (!existEmail) {
          if (!existPhone) {
            if (referralCode && referralCode.length !== 6) {
              return res.status(400).json({ message: "Referral code must be 6 characters long." });
            } else {
               sendOTP(phone);
                let user={
                    name:name,
                    email:email,
                    phone:phone,
                    accountType:accountType,
                    referralCode:referralCode,
                    hearedAboutUs:hearedAboutUs,
                }
                res.status(200).json({message:'Details are submitted sending otp',user})
            }
          } else {
            res.status(500).json({ message: "This Mobile number is Already Taken!" });
          }
        } else {
          res.status(500).json({ message: "This Email is Already Taken!" });
        }
      } else {
        res.status(500).json({ message: "Mobile number must have exactly 10 digits!" });
      }
    } else {
      res.status(400).json({ message: "This field is required" });
    }
  } catch (error) {
    console.log(error.message);
  }
}


export async function reSendOtp(req,res){
    try{
      const {user}=req.body;
      if(user){
        const phone=user.phone;
        const response= sendOTP(phone);
          return res.json(response)
      }else{
        res.status(400).json({message:"user not found!"})
      }
    }catch(error){
        console.log(error.message)
    }
}

export async function verifyotp(req,res){
    try{
        const {user,otp}=req.body;
        let phone=user.phone;
        if(otp && user){
            const isOTPverified= await verifyOTP(phone,otp);
            if(isOTPverified){
                const userData=await userModel.create(user);
               const  userId=userData._id;
               const token=jwt.sign({userId},process.env.SECRET_KEY,{
                expiresIn:'3d',
               })
                res.status(200).json({message:'Registration successful..',userData,token})
            }else{
                res.status(401).json({message:'Invalid OTP!'})
            }
        }else{
           res.status(400).json({message:'This field is required!'})
        }
    }catch(error){
        console.log(error.message);
    }
}


export async function userLogin(req,res){
    try{
        const {emailOrMobile }=req.body;
        if(emailOrMobile){
        let user;
        let isValidEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        let isValidMobileNumber= /^\d{10}$/
      if(isValidEmail.test(emailOrMobile)){
        user=await userModel.findOne({email:emailOrMobile});
      }else if(isValidMobileNumber.test(emailOrMobile)){
        user=await userModel.findOne({phone:emailOrMobile})
      }else{
        return res.status(400).json({ message: 'Invalid email or mobile number format' });
      }
      if(user){
        let phone=user.phone;
        sendOTP(phone);
        res.status(200).json({message:'Details are submitted sending otp your number',user})
      }else{
        return res.status(500).json({ message: "Oops! We couldn't find that user!" });
      }
        }else{
            res.status(400).json({message:"This field required! "})
        }
    }catch(error){
        console.log(error.message)
    }

}

export async function verifyLogin(req,res){
  try{
    const {user,otp}=req.body;
    let phone=user.phone;
    if(otp && user){
      const isOTPverified=await verifyOTP(phone,otp);
      if(isOTPverified){
        const userId=user._id;
        const token=jwt.sign({userId},process.env.SECRET_KEY,{expiresIn:'3d'});
        res.status(200).json({message:'Login successful',user,token})
      }else{
        res.status(401).json({message:'Invalid OTP!'})
      }
    }else{
      res.status(400).json({message:'This field is required!'})
    }

  }catch(error){
    console.log(error.message)
  }
}
export async function getAlluser(req,res){
  try{
    const users=await userModel.find();
    res.status(200).json({message:'user finded',users})

  }catch(error){
    console.log(error.message)
  }
}




export async function googleAuthentication(req,res){
  try{
     const {code}=req.query;
     console.log(code,'Rcieved')
     const encodedcode=encodeURIComponent(code)
     console.log(encodedcode,'____')
     const tokenResponse=await googleOAuth2Client.getToken(encodedcode);
     console.log('Token Response:', tokenResponse);
     const tokenData=tokenResponse.tokens;
     console.log('Token Data:', tokenData);
     console.log('Received token data:', tokenData);

     const userProfile=await verifyGoogleToken(tokenData.id_token);

     //check if the user exist in the database
     let user=await userModel.findOne({email:userProfile.email})
     if(user){
        res.status(200).json({message:'login successful',user})
     }else{
      return res.status(404).json({ message: 'User not found' });
     }

  }catch(error){
    console.log(error.message)
  }
}