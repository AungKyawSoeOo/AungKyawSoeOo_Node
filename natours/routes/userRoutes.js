import express from "express";
import{
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto
} from "../controllers/userController.js";

import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo
} from "../controllers/authController.js";
 


const userRouter=express.Router();
// user routes
userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.get('/logout',logout);
userRouter.post('/forgotPassword',forgotPassword);
userRouter.patch('/resetPassword/:token',resetPassword);

// auth require
// will protect any routes below this and not above
// because middleware comes in sequence
userRouter.use(protect);
userRouter.patch('/updateMyPassword',updatePassword);
userRouter.get('/me',getMe,getUser);
userRouter.patch('/updateMe',uploadUserPhoto,resizeUserPhoto,updateMe);
userRouter.delete( '/deleteMe',deleteMe);

// need to login and have to be admin for routes below
userRouter.use(restrictTo('admin'));
userRouter.route("/")
  .get(getAllUsers)
  .post(createUser)

userRouter.route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)


export default userRouter;