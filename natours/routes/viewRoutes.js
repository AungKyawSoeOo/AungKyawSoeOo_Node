import express from "express";
const router=express.Router();
import{
    protect,
    isLoggedIn
}from "../controllers/authController.js"
import{
    getOverview,
    getTour,
    getLoginForm,
    getAccount,
    updateUserData
}from "../controllers/viewsController.js";

router.get('/',isLoggedIn,getOverview);
router.get('/tour/:slug',isLoggedIn,getTour);
router.get('/login',isLoggedIn,getLoginForm);
router.get('/me',protect,getAccount);
router.post('/submit-user-data',protect,updateUserData)
export default router;