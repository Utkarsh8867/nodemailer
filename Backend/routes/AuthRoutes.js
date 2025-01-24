import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyemail } from '../controllers/Authcontroller.js';
import mongoose from "mongoose";
import userAuth from '../middleware/userauth..js';


const authRouter = express.Router();

// USER CONTROLLER

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth ,sendVerifyOtp);
authRouter.post('/verify-acount',userAuth,verifyemail);
authRouter.post('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',userAuth,sendResetOtp);
authRouter.post('/reset-password',userAuth,resetPassword);


export default authRouter;