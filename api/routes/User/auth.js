import express from 'express';
import { userRegister,userLogin,reSendOtp,verify_OTP,getAlluser } from '../../controller/User/Authentication/user.js';
import { userAuthentication } from '../../middleware/jwt.js';
// import { imageMiddleWare } from '../../middleware/multer.js';
// import { googleOAuth2Client } from '../Google/google.js';

const router=express.Router();

router.post('/register',userRegister);
router.post('/login',userLogin);
router.post('/resend-otp',reSendOtp);
router.post('/verify-otp',verify_OTP);
router.get('/',userAuthentication,getAlluser);
router.get('/:token/otp/verify/:code')


// router.get('/google', (req, res) => {
//     // Handle the initial Google authentication request
//     const authUrl = googleOAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: ['profile', 'email'],
//         redirect_uri: 'http://localhost:2000/api/user/auth/google/callback',
//     });
//     res.status(200).json({ authUrl });
// });

// router.get('/auth/google/callback', googleAuthentication);






export default router;