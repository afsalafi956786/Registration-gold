// import { googleOAuth2Client, verifyGoogleToken } from "../Google/google.js";
import userModel from "../../../model/userModel/UserModel.js";
import { sendOTP, verifyOTP } from "./otp/otpUtil.js";
import jwt from "jsonwebtoken";
// import uuid from 'uuid'


export async function userRegister(req, res, next) {
  try {
    const { roleType } = req.body;
    let registerPhone = /^\d{10}$/;
    const blockDuration = 24 * 60 * 60 * 1000;
    const validationErrors = {};

    if (!roleType) {
      return res.status(422).json({
        message: "The given data was invalid",
        errors: { roleType: ["The role type field is required."] },
      });
    }
    let intRoleType = parseInt(roleType);
    if (isNaN(intRoleType)) {
      return res.status(422).json({
        message: "The given data was invalid.",
        errors: {
          roleType: [
            "The role type must be a number.",
            "The selected role type is invalid.",
          ],
        },
      });
    }

    //BUSINESS ACCOUNT VALIDATION
    if (roleType == "2") {
      const {
        name,
        mobile,
        email,
        password,
        confirmPassword,
        organization_type,
        org_name,
        org_registration_number,
        org_description,
        org_city,
        org_state,
        gc_hierarchical_id,
        via_registration,
        org_address,
        heard_us,
        org_zip_code,
        org_photo,
        referral_code,
        org_registraion_photo,
        gc_user,
      } = req.body;

      //  checking a user block or not
      const userDetails = await userModel.findOne({ email: email });
      // If the user is not found (i.e., user is null), set a default value for lastLoginAttempts
      const lastLoginAttempts = userDetails
        ? userDetails.lastLoginAttempts
        : new Date();
      if (userDetails && userDetails.isBlocked) {
        const now = new Date();
        if (lastLoginAttempts.getTime() + blockDuration <= now.getTime()) {
          // Time expired, unblock the user
          await userModel.updateOne(
            { _id: userDetails._id },
            { $set: { isBlocked: false } }
          );
          return res.status(200).json({ message: "your account unolocked" });
        } else {
          return res.status(403).json({
            message: `Your Account has been suspended for security reasons, please contact Goldsikka.com`,
          });
        }
      }

      if (!name) {
        validationErrors.name = ["The name field is required."];
      }
      if (!email) {
        validationErrors.email = ["The email field is required."];
      }
      if (!mobile) {
        validationErrors.mobile = ["The mobile field is required."];
      }
      if (!password) {
        validationErrors.password = ["The password field is required."];
      }
      if (!confirmPassword) {
        validationErrors.confirmPassword = ["The confirm password field is required."];
      }
      if (!roleType) {
        validationErrors.roleType = ["The roleType field is required."];
      }
       if (!organization_type) {
        validationErrors.organization_type = ["The organization field is required."];
      }
       if (!org_name) {
        validationErrors.org_name = ["The org name field is required."];
      }
       if (!org_registration_number) {
        validationErrors.org_registration_number = ["The org registration field is required."];
      }
       if (!org_description) {
        validationErrors.org_description = ["The org description field is required."];
      }
       if (!org_address) {
        validationErrors.org_address = ["The org address field is required."];
      }
       if (!org_city) {
        validationErrors.org_city = ["The org city field is required."];
      }
       if (!org_state) {
        validationErrors.org_state = ["The org state field is required."];
      }
      if (!org_zip_code) {
        validationErrors.org_zip_code = ["The org zip code field is required."];
      }
      if (!org_photo) {
        validationErrors.org_photo = ["The org photo field is required."];
      }
      if (!org_registraion_photo) {
        validationErrors.org_registraion_photo = ["The org  registraion photo field is required."];
      }
        if (Object.keys(validationErrors).length > 0) {
          return res.status(422).json({
            message: "The given data was invalid.",
            errors: validationErrors,
          });
        }

        
        if (registerPhone.test(mobile)) {
          if (registerPhone.test(registeredNumber)) {
            let existEmail = await userModel.findOne({email: email,  isVerified: true,   });
            let Notverified = await userModel.findOne({
              email: email,
              isVerified: false,
            });
            let existPhone = await userModel.findOne({ mobile: mobile });

            if (!existEmail && !Notverified) {
              if (!existPhone) {
                // sendOTP(mobile);
                const user = new userModel({
                  name,
                  mobile,
                  email,
                  password,
                  confirmPassword,
                  organization_type,
                  org_name,
                  org_registration_number,
                  org_description,
                  org_city,
                  org_state,
                  gc_hierarchical_id,
                  via_registration,
                  org_address,
                  heard_us,
                  org_zip_code,
                  org_photo,
                  referral_code,
                  org_registraion_photo,
                  gc_user,
                  // photo
                });
                await user.save();
                //unblock after 24 hours
                setTimeout(async () => {
                  await userModel.updateOne( { _id: user._id }, { $set: { isBlocked: false } });
                }, blockDuration);
                return res
                  .status(200)
                  .json({ message: "Details are submitted sending otp", user });
              } else {
                return res
                  .status(500)
                  .json({ message: "This Mobile number is Already Taken!" });
              }
            } else {
              if (Notverified) {
                // sendOTP(phone);
                const user = await userModel.findOneAndUpdate(
                  { email },
                  {
                    name,
                    mobile,
                    password,
                    confirmPassword,
                    organization_type,
                    org_name,
                    org_registration_number,
                    org_description,
                    org_city,
                    org_state,
                    gc_hierarchical_id,
                    via_registration,
                    org_address,
                    heard_us,
                    org_zip_code,
                    org_photo,
                    referral_code,
                    org_registraion_photo,
                    gc_user,
                  }
                );
                // Unblock the user after 24 hours
                setTimeout(async () => {
                  await userModel.updateOne( { _id: user._id }, { $set: { isBlocked: false } });
                }, blockDuration);

                return res
                  .status(200)
                  .json({ message: "Details are submitted sending otp", user });
              } else {
                return res
                  .status(500)
                  .json({ message: "This Email is Already Taken!" });
              }
            }
          } else {
            return res.status(500).json({
              message: "Registered Number  must have exactly 10 digits!",
            });
          }
        } else {
          return res
            .status(500)
            .json({ message: "Mobile number must have exactly 10 digits!" });
        }
      
    } else if (roleType == "1") {

      //PERSONAL ACCOUNT VALIDATION

      const {
        name,
        mobile,
        email,
        password,
        confirmPassword,
        via_registration,
        referral_code,
        gc_user,
        gc_hierarchical_id,
        heard_us,
        social,
        device_ip,
        device_id,
        latitude,
        longitude,
        zipcode,
        address,
      } = req.body;


      if (!name) {
        validationErrors.name = ["The name field is required."];
      }
       if (!email) {
        validationErrors.email = ["The email field is required."];
      }
       if (!mobile) {
        validationErrors.mobile = ["The mobile field is required."];
      }
      if (!password) {
        validationErrors.password = ["The password field is required."];
      }
      if (!confirmPassword) {
        validationErrors.confirmPassword = ["The confirm password field is required."];
      }
      if (Object.keys(validationErrors).length > 0) {
        return res.status(422).json({
          message: "The given data was invalid.",
          errors: validationErrors,
        });
      }
      //  if (referralCode && referralCode.length !== 6) {
        
      // } else {

        if (registerPhone.test(mobile)) {
          let existEmail = await userModel.findOne({ email: email,isVerified: true,});
          let Notverified = await userModel.findOne({email: email,isVerified: false,});
          let existPhone = await userModel.findOne({ mobile: mobile });

          if (!existEmail && !Notverified) {
            if (!existPhone) {
              // sendOTP(phone);
              const user = new userModel({
                name,
                mobile,
                email,
                password,
                roleType,
                confirmPassword,
                via_registration,
                referral_code,
                gc_user,
                gc_hierarchical_id,
                heard_us,
                social,
                device_ip,
                device_id,
                latitude,
                longitude,
                zipcode,
                address,

              });
              await user.save();
              // unblock after 24 hours
              setTimeout(async () => {
                await userModel.updateOne(  { _id: user._id }, { $set: { isBlocked: false } } );
                 }, blockDuration);

              return res
                .status(200)
                .json({ message: "Details are submitted sending otp", user });
            } else {
              return res
                .status(500)
                .json({ message: "This Mobile number is Already Taken!" });
            }
          } else {
            if (Notverified) {
              // sendOTP(phone);
              const user = await userModel.findOneAndUpdate(
                { email },
                {
                  name,
                  mobile,
                  password,
                  confirmPassword,
                  via_registration,
                  referral_code,
                  gc_user,
                  gc_hierarchical_id,
                  heard_us,
                  social,
                  device_ip,
                  device_id,
                  latitude,
                  longitude,
                  zipcode,
                  address,
                }
              );
              // Unblock the user after 24 hours
              setTimeout(async () => {
                await userModel.updateOne({ _id: user._id }, { $set: { isBlocked: false } } );
              }, blockDuration);

              return res
                .status(200).json({ message: "Details are submitted sending otp", user });
            } else {
              return res
                .status(500).json({ message: "This Email is Already Taken!" });
            }
          }
        } else {
          return res
            .status(500).json({ message: "Mobile number must have exactly 10 digits!" });
        }
      // }
    } else {
      return res.status(422).json({ message: "The given data was invalid",  errors: { roleType: ["The role type field is required."] } });
    }
  } catch (error) {
    next(error);
  }
}

export async function reSendOtp(req, res, next) {
  try {
    const { user } = req.body;
    if (user) {
      const phone = user.phone;
      const response = sendOTP(phone);
      return res.json(response);
    } else {
      return res.status(400).json({ message: "user not found!" });
    }
  } catch (error) {
    next(error);
  }
}

export async function userLogin(req, res, next) {
  try {
    const {
      email,
      loginType,
      latitude,
      address,
      longitide,
      device_ip,
      zipcode,
      deviceType,
      appVersion,
      device_id,
    } = req.body;
    if (email) {
      //  checking a user block or not
      const userData = await userModel.findOne({ email: email });
      // If the user is not found (i.e., user is null), set a default value for lastLoginAttempts
      const lastLoginAttempt = userData  ? userData.lastLoginAttempts : new Date();
      if (userData && userData.isBlocked) {
        const now = new Date();
        if (lastLoginAttempt.getTime() + blockDuration <= now.getTime()) {
          // Time expired, unblock the user
          await userModel.updateOne({ _id: userData._id },  { $set: { isBlocked: false } }  );
          return res.status(200).json({ message: "your account unolocked" });
        } else {
          return res.status(403).json({
            message: `Your Account has been suspended for security reasons, please contact Goldsikka.com`,
          });
        }
      }

      let user;
      let isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let isValidMobileNumber = /^\d{10}$/;
      const blockDuration = 24 * 60 * 60 * 1000;

      if (isValidEmail.test(email)) {
        user = await userModel.findOne({ email: email });
      } else if (isValidMobileNumber.test(email)) {
        user = await userModel.findOne({ phone: email });
      }
      if (user) {
        if (user.isBlocked) {
          const now = new Date();
          if ( user.lastLoginAttempts.getTime() + blockDuration <= now.getTime() ) {
            // Time expired, unblock the user
            await userModel.updateOne( { _id: user._id }, { $set: { isBlocked: false } } );
          } else {
            return res.status(403).json({
              message: `Your Account has been suspended for security reasons, please contact Goldsikka.com`,errors:[]  });
          }
        }
        //  unblocking user after 24 hours
        setTimeout(async () => {
          await userModel.updateOne( { _id: userData._id }, { $set: { isBlocked: false } } );
        }, blockDuration);
         
        const userId = user._id;
        const expiresIn = 126400;
        const accessToken = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn });
        return res.status(200) .json({
          accessToken,
          tokenType:'bearer',
          expiresIn,
          name:user.name,
          gsPin:user.gsPin,
          roleId:user.roleType,
          accountVerified:user.accountVerified,
          maskedPhone:user.maskedPhone,
          referralCode:user.referral_code,
          messageStatus:user.messageStatus,
          customerId:user.customerId,
          orgType:user.orgType,
          demoAccount:user.demoAccount,
          verifyToken:user.verifyToken
         });
        // sendOTP(phone);
      } else {
        return res
          .status(500)
          .json({ message: "Oops! We couldn't find that user!", errors: [] });
      }
    } else {
      return res.status(400).json({ message: "The given data was invalid.",errors:{email:["The email field is required."]} });
    }
  } catch (error) {
    next(error);
  }
}

export async function verify_OTP(req, res, next) {
  try {
    const { user, otp } = req.body;
    let phone = user.phone;
    const maxLoginAttempts = 3;
    if (otp && user) {
      const isOTPverified = await verifyOTP(phone, otp);
      if (isOTPverified) {
        await userModel.updateOne(
          { phone },
          { $set: { loginAttempts: 0, isVerified: true } }
        );
        const userId = user._id;
        const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
          expiresIn: "3d",
        });
        return res
          .status(200)
          .json({ message: "Login successful", user, token });
      } else {
        const userData = await userModel.findOne({ phone });
        await userModel.updateOne(
          { phone },
          {
            $inc: { loginAttempts: 1 },
            $set: { lastLoginAttempts: new Date() },
          }
        );
        // if the login attempt max block the user
        if (userData.loginAttempts + 1 >= maxLoginAttempts) {
          await userModel.updateOne({ phone }, { $set: { isBlocked: true } });
          return res.status(403).json({
            message: `Your Account has been suspended for security reasons, please contact Goldsikka.com`,
          });
        }
        return res.status(401).json({ message: "Invalid OTP!" });
      }
    } else {
      return res.status(400).json({ message: "This field is required!" });
    }
  } catch (error) {
    next(error);
  }
}

export async function getAlluser(req, res, next) {
  try {
    const users = await userModel.find();
    return res.status(200).json({ message: "user finded", users });
  } catch (error) {
    next(error);
  }
}

// export async function googleAuthentication(req,res){
//   try{
//      const {code}=req.query;
//      console.log(code,'Rcieved')
//      const encodedcode=encodeURIComponent(code)
//      console.log(encodedcode,'____')
//      const tokenResponse=await googleOAuth2Client.getToken(encodedcode);
//      console.log('Token Response:', tokenResponse);
//      const tokenData=tokenResponse.tokens;
//      console.log('Token Data:', tokenData);
//      console.log('Received token data:', tokenData);

//      const userProfile=await verifyGoogleToken(tokenData.id_token);

//      //check if the user exist in the database
//      let user=await userModel.findOne({email:userProfile.email})
//      if(user){
//       return  res.status(200).json({message:'login successful',user})
//      }else{
//       return res.status(404).json({ message: 'User not found' });
//      }

//   }catch(error){
//     console.log(error.message)
//   }
// }
