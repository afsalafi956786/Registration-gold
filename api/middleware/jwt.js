import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function userAuthentication(req,res,next){
    try{
        let token=req.headers['usertoken'];
        if(token){
            jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
                if(err) return res.status(403).json({message:'Invalid token!'})
                req.userId=decoded.userId;
                next();
            })
        }else{
            return res.status(401).json({ message: 'Access denied. No token provided!' });
        }
    }catch(error){
        console.log(error.message)
    }
}
