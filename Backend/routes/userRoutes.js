import express from 'express';
import { getAllUsers } from '../controllers/userController.js';

const allUserRouter = express.Router();

// Route to get all users
allUserRouter.get('/', getAllUsers);

export default allUserRouter;
