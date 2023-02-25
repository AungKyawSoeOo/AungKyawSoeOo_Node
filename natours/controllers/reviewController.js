import Review from "../models/reviewModel.js";
// import catchAsync from "../utils/catchAsync.js";
import {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
  } from "../controllers/handlerFactory.js";

export const setTourUserIds=(req,res,next)=>{
     // Allow nested routes
     if(!req.body.tour){
        req.body.tour=req.params.tourId;
    }
    if(!req.body.user){
        req.body.user=req.user.id;
    }
    next();
}
export const getAllReview=getAll(Review);

export const getReview=getOne(Review);

export const createReview=createOne(Review);

export const updateReview = updateOne(Review); 

export const deleteReview=deleteOne(Review);