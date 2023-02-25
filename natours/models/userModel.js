import { Schema, model } from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
const userShema = new Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true, // change email to lowercase
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo:{
    type:String,
    default:'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on create and save !!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active:{
    type:Boolean,
    default:true,
    select:false
  }
});

//encryption
userShema.pre('save', async function (next) {
  // Only run this if password was actually modified
  if (!this.isModified('password')) return next();
  // hash the password with saltRound 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
// instance method (available on all user documents)
userShema.pre('save',function(next){
  if(!this.isModified('password') || this.isNew) return next();
  // make sure token is created after password changed ,sometimes db actions can slow
  this.passwordChangedAt=Date.now() - 1000  ;
  next();
});


// for deleteMe
userShema.pre(/^find/,function(next){
  // this points to the current query
  this.find({active:{$ne:false}});
  next();
});


userShema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); // true / false
};

userShema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // change date to milliseconds  .. ,10 mean base 10
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp,JWTTimestamp);
    return JWTTimestamp < changedTimestamp; // true / false
  }
  // False means NOT changed
  return false;
};

userShema.methods.createPasswordResetToken = function () {
 const resetToken = crypto.randomBytes(32).toString('hex');
 this.passwordResetToken= crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex');
  console.log({resetToken},this.passwordResetToken)
 this.passwordResetExpires=Date.now()+ 10* 60 *1000; // 10 minute in ms
 return resetToken;
};
export default model('User', userShema);
