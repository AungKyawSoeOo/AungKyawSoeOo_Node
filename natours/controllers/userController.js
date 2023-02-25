import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import multer from 'multer';
import sharp from 'sharp';
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../controllers/handlerFactory.js';

// const multerStorage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,'public/img/users');
//   },
//   filename:(req,file,cb)=>{
//     // user-7485858abc57b..-33234434.jpeg
//     const ext=file.mimetype.split('/')[1];
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
// store as buffer
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
export const uploadUserPhoto = upload.single('photo');
export const resizeUserPhoto =catchAsync(async(req, res, next) => {
  if (!req.file) {
    return next();
  }
  req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    // compress quality 90 percent
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`)
  next();
});
// req.body ... name email
const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// Users
export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use / updateMyPassword',
        400
      )
    );
  }
  // 2) Filtered out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }
  // 3) Update user document
  // if use save() , will have validation errors because of required fields
  // don't use req.body because by doing this user can change data like role='admin'

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
export const createUser = (req, res) => {
  // 500 -> internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined . Use signup instead',
  });
};
export const getAllUsers = getAll(User);
export const getUser = getOne(User);
// do not update password with this
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
