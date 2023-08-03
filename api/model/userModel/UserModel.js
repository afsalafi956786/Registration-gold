import mongoose from "mongoose";


const userSchema=new mongoose.Schema({
    roleType:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
        maxlength: 255,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
    },
    heard_us:{
        type:String,
    },
    referral_code:{
        type:String,
    },
    loginAttempts:{
        type:Number,
        default:0,
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    maskedPhone: {
      type: String,
    },
    lastLoginAttempts:{
        type:Date,
        default:null,
    },
  gc_user:{
    type:String,

  },
  gsPin:{
    type:Boolean,
    default:false
  },
  gc_hierarchical_id:{
    type:String,
  },
  via_registration:{
    type:String,
  },
  social:{
    type:String,
  },
  device_ip:{
    type:String,
  },
  device_id:{
    type:String,
  },
  latitude:{
    type:String,
  },
  longitude:{
    type:String
  },
  zipcode:{
    type:String
  },
  address:{
    type:String,
  },
  password:{
    type:String,
    required:true,
    minlength: 6
  },
  confirmPassword:{
    type:String,
    required:true,
  },
  orgType: String,
  demoAccount: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
  },
  isBlocked:{
    type:Boolean,
    default:false,
  },
  customerId: {
    type: String,
  },
  isVerified:{
    type:Boolean,
    default:false,
  },
    organization_type:{
        type:String,
      
    },
     org_name:{
    type:String,

  },
  org_registration_number:{
    type:Number,
  },
  org_description:{
    type:String,
  },
  org_city:{
    type:String,
  },
  org_state:{
    type:String,
  },
  org_zip_code:{
    type:String,
  },
  org_photo:{
    type:String,
  
  },
  referral_code:{
    type:String
  },
  gc_user:{
    type:String
  },
  gc_hierarchical_id:{
    type:String,
  },


},{
    timestamps:true
})

const userModel= mongoose.model('User',userSchema);
export default userModel;



