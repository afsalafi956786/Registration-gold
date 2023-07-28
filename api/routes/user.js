import express from 'express';
import { userRegister,userLogin,verifyotp,reSendOtp,verifyLogin,getAlluser,googleAuthentication } from '../controller/user.js';
import { userAuthentication } from '../middleware/authentication.js';
import { googleOAuth2Client } from '../Google/google.js';

const router=express.Router();

router.post('/register',userRegister);
router.post('/verify-otp',verifyotp)
router.post('/login',userLogin);
router.post('/resend-otp',reSendOtp);
router.post('/verify-login',verifyLogin);
router.get('/',userAuthentication,getAlluser);

router.get('/google', (req, res) => {
    // Handle the initial Google authentication request
    const authUrl = googleOAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
        redirect_uri: 'http://localhost:2000/api/user/auth/google/callback',
    });
    res.status(200).json({ authUrl });
});

router.get('/auth/google/callback', googleAuthentication);






export default router;