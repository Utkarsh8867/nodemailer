import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import transporter from "../config/nodemailer.js";
import mongoose from "mongoose";

// Register User
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User Already Exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

         // sgdhjj
         const mailOptions = {
            from: process.env.SENDER_EMAIL , // Sender's email address
            to: email, // Recipient's email
            subject: 'Welcome to Farmer Marketplace Product Store',
            text: `Welcome to Farmer Marketplace Product Store. Your account has been created with email ID: ${email}`,
           }
        
       
             await transporter.sendMail(mailOptions);
            // console.log('Email sent successfully:', info.response);
       
        

        res.json({ success: true, message: "User Registered Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Login User
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and Password are required" });
    }

    try {
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid Email or Password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Email or Password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // sgdhjj
     
        // const mailOption = {
        //     from:process.env.SENDER_EMAIL,
        //     to: email,
        //     subject:'Login to Farmer marketplace product Store ',
        //     text:`Welcom to Farmer Marketplace Product Store. Your account has been login sucessfully with email id:${email}`
        // }
 
        // await transporter.sendMail(mailOption);

        res.json({ success: true, message: "Login Successful" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Logout User
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
        });
        res.json({ success: true, message: "Logged Out Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const sendVerifyOtp = async (req,res)=>{
    try {
        const {userId} = req.body;

        if (!userId || !mongoose.isValidObjectId(userId)) {
          return res.status(400).json({ success: false, message: "Invalid or missing userId" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        if(user.isAccountVerifyed){
            return res.json({success: false ,message:"Account Already verified"})
        }
      const Otp =String ( Math.floor(100000 + Math.random()*900000))

      user.verifyOtp = Otp;
      user.verifyOtpExpireAT= Date.now() + 24*60*60*1000
      // user.isAccountVerifyed=true;
      await user.save();

      const mailOption = {
        from: process.env.SENDER_EMAIL , // Sender's email address
        to: user.email, // Recipient's email
        subject: 'Account Verification OTP  ',
         text: `Your OTP is ${Otp}.Verify your account using this OTP`,
      }

      await transporter.sendMail(mailOption)

      res.json({sucess:true,message:'Verification OTP Sent on Email'})
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}

export const verifyemail = async (req,res)=>{
    const {userId,Otp} = req.body; 
    if(!userId || !Otp){
        return res.json({sucess:false,message:'Missing Details'});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:'user not found'})
        }
        if(user.verifyOtp === '' || user.verifyOtp !== Otp){
            return res.json({success:false,message:'Invalid OTP'})
        }
        if(user.verifyOtpExpireAT <Date.now()){
            return res.json({success:false,message:'OTP Expired'})
        }

        user.isAccountVerifyed =true;
        user.verifyOtp = '';
        user.verifyotpExpireAt=0;

        await user.save();
        return res.json({sucess:true,message:'Email verified Sucessfully'})

    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}


// check auth
export const isAuthenticated = async (req,res)=>{
try {

  return res.json({success:true});
} catch (error) {
  res.json({sucess:false,message:error.message})
}
}

// pass reset

export const sendResetOtp= async (req,res)=>{
  const {email} = req.body;

  if(!email){
    return res.json({sucess:false,message:'Email is Required'})
  }

  try {
    const user = await userModel.findOne({email});
    if(!user){
      return res.json({sucess:false,message:'User not found'})
    }

    const Otp =String ( Math.floor(100000 + Math.random()*900000))

      user.resetOtp = Otp;
      user.resetOtpExpireAt= Date.now() + 15*60*1000
      // user.isAccountVerifyed=true;
      await user.save();

      const mailOption = {
        from: process.env.SENDER_EMAIL , // Sender's email address
        to: user.email, // Recipient's email
        subject: 'Password Reset OTP  ',
         text: `Your OTP for reseting your password is ${Otp}. Use this OTP to proceed with resetting your Password`,
      }
      await transporter.sendMail(mailOption);

      return res.json({success:true,message:'OTP sent to your email'});

  } catch (error) {
    res.json({sucess:false,message:error.message})
  }
}

// reset user password

export const resetPassword = async(req,res)=>{
   const {email,Otp,newPassword}= req.body;
   if(!email || !Otp || !newPassword){
    return res.json({success:false,message:'Email ,OTP,and New password are required'});
   }

   try {
    const user = await userModel.findOne({email});
    if(!user){
      return res.json({success:false,message:'User is not Found'})
    }

    if(user.resetOtp === "" || user.resetOtp !== Otp){
      return res.json({success:false,message:'Invalid OTP'})
    }
    if(user.resetOtpExpireAt<Date.now()){
      return res.json({success:false,message:'OTP Expired'})
    }

    const hashedPassword = await bcrypt.hash(newPassword,10);

    user.password= hashedPassword;
    user.resetOtp='';
    user.resetOtpExpireAt=0;

    await user.save();

    return res.json({success:true,message:'Password has been reset successfully '});

   } catch (error) {
    res.json({sucess:false,message:error.message})
   }
}