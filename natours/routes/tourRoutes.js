import express from 'express';
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTour,
  getTourStats, 
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages
} from '../controllers/tourController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import reviewRouter from './reviewRoutes.js';

const tourRouter = express.Router();

// tourRouter.param("id",checkID);

// Get  /tour/234af/reviews
// Get  /tour/234af/reviews/968fd
// tourRouter.route('/:tourId/reviews')
//   .post(protect,restrictTo('user'),createReview);
tourRouter.use('/:tourId/reviews', reviewRouter);

// tour routes
tourRouter.route('/top-5-cheap').get(aliasTopTour, getAllTours);
tourRouter.route('/tour-stats').get(getTourStats);
tourRouter
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide','guide'), getMonthlyPlan);

  // /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/400/center/34.111745,-118.113491/unit/mi  -- need to test with this location
tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

tourRouter.route('/distances/:latlng/unit/:unit')
  .get(getDistances)

tourRouter
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'),uploadTourImages,resizeTourImages, updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default tourRouter;
