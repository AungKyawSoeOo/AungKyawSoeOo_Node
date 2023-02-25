import multer from 'multer';
import sharp from 'sharp';
import Tour from '../models/tourModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
} from '../controllers/handlerFactory.js';

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image!upload only images', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
// upload.single('image) req.file
// upload.array('images',5) req.files
export const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

export const resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next();
  }

  // 1) Cover Image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    // compress quality 90 percent
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        // compress quality 90 percent
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );
  next();
});

// const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));

// val is for .param
// export const checkID=(req,res,next,val)=>{
//   console.log(`Tour id is ${val}`);
//   if (req.params.id * 1 >= tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// }

// export const checkBody=(req,res,next)=>{
//   if(!req.body.name || !req.body.price){
//     return res.status(400).json({
//       status:"fail",
//       message: "Missing name or price"
//     })
//   }
//   next();
// }
// Tour
export const aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  // highest rating , lowest price
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

export const getAllTours = getAll(Tour);

export const getTour = getOne(Tour, { path: 'reviews' });

export const createTour = createOne(Tour);
//can't use this keyword in this one
// export const updateTour = catchAsync(async (req, res,next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if(!tour){
//       return next(new AppError('No tour found with that ID',404))
//     }
//     res.status(200).json({
//       status: 'succes',
//       data: {
//         tour,
//       },
//     });
// });

/*
In this example, the tour document is retrieved using the findById method and then
updated using the set method. After that, the validate method is called to validate
the updated tour, and finally, the save method is used to save the updated document 
to the database.
*/
export const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  tour.set(req.body);
  await tour.validate();
  const updatedTour = await tour.save();
  const populatedTour = await updatedTour.populate('guides');
  res.status(200).json({
    status: 'success',
    data: {
      tour: populatedTour,
    },
  });
});
// export const deleteTour = catchAsync(async (req, res,next) => {
//     const tour=await Tour.findByIdAndDelete(req.params.id);
//     if(!tour){
//       return next(new AppError('No tour found with that ID',404))
//     }
//     res.status(204).json({
//       // 204 -> no content
//       status: 'success',
//       data: null,
//     });
// });
export const deleteTour = deleteOne(Tour);

// aggregation pipeline
export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null, // all summary
        _id: { $toUpper: '$difficulty' }, // summary based on difficulty
        // _id: '$ratingsAverage',
        // numTours 1 will added each Time
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPirce: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      //ascending , -1 descending
      $sort: { avgPrice: 1 },
    },
    // {
    // ne -> not equal
    //   $match:{_id:{$ne:'EASY'}}
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021
  const plan = await Tour.aggregate([
    {
      // [array] to eachDocument ..
      // 9 results to 27
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        // get month from startDates
        // "2022-01-05T03:30:00.000Z", startDate return this , $month retrieve only month
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        // 0 hide , 1 show
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    count: plan.length,
    data: {
      plan,
    },
  });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/400/center/34.111745,-118.113491/unit/mi  -- need to test with this location
// need to set index in tourModel for geo

// get tours within 400 km.. from start location
export const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  // 3963.2 is radius of earth in mile , 6378.1 is in km
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

// get distance of other tours from start location
export const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        // change m to km
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
