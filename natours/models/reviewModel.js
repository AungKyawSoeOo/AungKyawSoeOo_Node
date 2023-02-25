import mongoose, { Schema, model } from 'mongoose';
import Tour from '../models/tourModel.js';
const reviewShema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// to protect duplicate reviews
// each combination of tour and user will be unique
// sometimes it takes some time to work . It can't set immediately
reviewShema.index({tour:1,user:1},{unique:true});


reviewShema.pre(/^find/, function (next) {
  // this
  // .populate({
  //     path:'tour',
  //     select:'name'
  // })
  // .populate({
  //     path:'user',
  //     select:'name photo'
  // })
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// We use static because it can access to current model
reviewShema.statics.calcAverageRatings = async function (tourId) {
  // this keyword in statics point to model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5
      });
  }
};
reviewShema.post('save', function () {
  //this point to current review model by using this.constructor. ..
  // normally this refer to current document in save hook
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate short-hand of findOneAndUpdate
// findByIdAndDelete
/*
In this code, the Mongoose middleware functions are used to add pre and post hooks for the findOneAnd queries.

The reviewSchema.pre(/^findOneAnd/) middleware function is executed before the query is executed, 
and it uses the this.model.findOne method to access the document middleware. This method returns 
a query object which is used to find the document that matches the query. The this.getQuery() 
method is used to get the query object from the this context, which is the query being executed.

In the reviewSchema.post(/^findOneAnd/) middleware function, the this.doc property which was set in
the pre middleware function is used to access the document that was updated or deleted by the query.
This is because the post middleware function is executed after the query has been executed. The 
this.doc.constructor.calcAverageRatings method is then called to calculate the average ratings of 
the tour that the review belongs to, using the tour id (this.doc.tour) of the document that was updated or deleted.

So essentially, the pre middleware is used to retrieve the document before the query is executed, and
the post middleware is used to access the document after the query has been executed, allowing you to
perform additional operations on the document.
*/
reviewShema.pre(/^findOneAnd/, async function (next) {
  // we have only access to query middle in query hook
  // so use this.model.findOne to access document middleware (trick)
  // we use this.doc instead of doc to access in post hook
  this.doc = await this.model.findOne(this.getQuery());
//   console.log(this.doc);
  next();
});

reviewShema.post(/^findOneAnd/, async function (next) {
  //await this.model.findOne(this.getQuery()); doen't work here, query has already executed
  await this.doc.constructor.calcAverageRatings(this.doc.tour);
});

export default model('Review', reviewShema);
