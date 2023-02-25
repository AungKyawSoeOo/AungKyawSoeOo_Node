import express, { Router } from "express";
import { 
    getAllReview,
    createReview, 
    deleteReview,
    updateReview,
    setTourUserIds,
    getReview
} 
from "../controllers/reviewController.js";

import { 
    protect,
    restrictTo
 } from "../controllers/authController.js";
 // merge param from other router
 
// Post /tour/234af/reviews
// Post /reviews
const reviewRouter =express.Router({mergeParams:true});
reviewRouter.use(protect);
reviewRouter.route('/')
    .get(getAllReview)
    .post(restrictTo('user'),setTourUserIds,createReview)

reviewRouter.route('/:id')
    .get(getReview)
    .patch(restrictTo('user','admin'),updateReview)
    .delete(restrictTo('user','admin'),deleteReview)
export default reviewRouter;  