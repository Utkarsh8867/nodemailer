import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
   host :'smtp.gmail.com',
   port:465,
   secure:true,
   auth:{
    user : process.env.SMTP_USER,
    pass : process.env.SMTP_PASS,
   },
   
   debug: true,
    logger: true,
});

export default transporter;