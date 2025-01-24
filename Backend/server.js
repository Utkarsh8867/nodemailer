import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js'
import authRouter from "./routes/AuthRoutes.js";
import bodyParser from 'body-parser';
import router from "./routes/categoryRoutes.js";
import productrouter from "./routes/productRoutes.js";
import allUserRouter from "./routes/userRoutes.js";
import cartrouter from "./routes/categoryRoutes.js";

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}))
const port = process.env.PORT || 3000;
connectDB();

// ROUTES
app.get('/test',(req,res)=> res.send("API Working"));
app.use('/api/auth', authRouter);
app.use('/api/products', productrouter);
app.use('/api/category', router);
app.use('/api/all-user', allUserRouter);
app.use('/api', cartrouter);


app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);
    
});