import mongoose from "mongoose";


const businessSchema=new mongoose.Schema({
    organization_type:{
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
        required:true,
    },
    referral_code:{
        type:String,
    },
    loginAttempts:{
        type:Number,
        default:0,
    },
    lastLoginAttempts:{
        type:Date,
        default:null,
    },
    org_name:{
    type:String,

  },
  org_registration_number:{
    type:String,
    required:true,
  },
  org_description:{
    type:String,
    required:true,
  },
  org_city:{
    type:String,
    required:true,
  },
  org_state:{
    type:String,
    required:true,
  },
  org_zip_code:{
    type:String,
    required:true,
  },
  org_photo:{
    type:String,
    required:true,
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
  via_registration:{
    type:String,
  },

  password:{
    type:String,
    required:true,
    minlength: 8,
  },
  confirmPassword:{
    type:String,
    required:true,
  },
  isBlocked:{
    type:Boolean,
    default:false,
  },
  isVerified:{
    type:Boolean,
    default:false,
  },



},{
    timestamps:true
})

const BusinessModel= mongoose.model('business',businessSchema);
export default BusinessModel;