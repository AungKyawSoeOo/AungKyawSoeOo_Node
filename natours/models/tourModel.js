// Model
import mongoose, { Schema,model } from 'mongoose';
import slugify from "slugify";
import User from "../models/userModel.js";
// import validator from "validator";
const tourSchema=new Schema({
    name:{
      type: String,
      required: [true,'A tour must have a name'],
      unique:true,
      trim: true,
      maxlength: [40,'A tour name must have at most 40 characters'],
      minlength: [10,'A tour name must have at most 10 characters']
      // validate:[validator.isAlpha,'Tour name must only contain chars']
    },
    slug:String,
    duration:{
      type: Number,
      required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
      type: Number,
      required:[true,'A tour must have a group size']
    },
    difficulty:{
      type: String,
      required:[true, 'A tour must have a difficulty'],
      enum:{
        values:['easy','medium','difficult'],
        message:'Only easy,medium or difficult for difficulty'
      }
    },
    ratingsAverage: {
      type:Number,
      default:4.5,
      min:[1,'Rating must be above 1.0'],
      max:[5,'Rating must be below 5.0'],
      // normal round work 4.6666=>5
      // we want 4.6666=>4.7 ... 4.6666*10 =46.666, rounded to 47,
      // 47/10 =4.7
      set: val => Math.round(val*10) /10  
    },
    ratingsQuantity:{
      type: Number,
      default: 0
    },
    price:{ 
      type:Number,
      required:[true,'A tour must have a price']
    },
    priceDiscount:{
      type:Number,
      validate:{
        validator:function(val){
          // this only points to current doc on New document creation
          console.log("price discount : "+ val);
          console.log("price : "+this.price);
          console.log(val<this.price);

          return val< this.price;
        },
        message:'Discount price {VALUE} should below regular price'
      }
    } ,
    summary:{ 
      type: String,
      trim: true
    }, 
    description:{
      type: String,
      trim: true,
      required: [true,'A tour must have a description']
    },
    imageCover:{
      type: String,
      required:[true,'A tour must have a cover image']
    },
    images:[String], 
    createdAt:{
      type: Date,
      default: Date.now(),
      select:false // exclude this field
    },
    startDates:[Date],
    secretTour:{
      type: Boolean,
      default: false
    },
    startLocation:{
      // GeoJSON
      type:{
        type:String,
        default:'Point',
        enum:['Point']
      },
      coordinates:[Number],
      address:String, 
      description:String
    },
    locations:[
      {
        type:{
          type:String,
          default:'Point',
          enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
      }
    ],
    // guides:Array // embedded
    // reference
    guides:[
      {
        type:mongoose.Schema.ObjectId,
        ref:'User' 
      }
    ],
    // child referencing
    // reviews:[
    //   {
    //     type:mongoose.Schema.ObjectId,
    //     ref:'Review'
    //   }
    // ]

  
  },{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  });

  // indexing make query more faster
  // 1 is ascending order
  // tourSchema.index({price:1})
  // combine index can use both for single and multiple index
  tourSchema.index({price:1,ratingsAverage:-1});
  tourSchema.index({slug:1});
  // for geo spatial
  tourSchema.index({startLocation:'2dsphere'});
  //virtual properties
  tourSchema.virtual('durationWeeks')
    .get(function(){
      // we use normal fuction cause arrow function doesn't have (this) keyword
      return this.duration/7;
    })

  // virtual populate
  // we do this because we have only parent referencing at reviews to tour and user
  // tour doesn't know review , we can do child referencing but it can exceed database limit 60mb
  // so we don't do it in first place , best solution is to use virtual populate
  // that way tour can reference to review
  tourSchema.virtual('reviews',{
    ref:'Review',
    // Review-> tour (connect) Tour._id
    foreignField:'tour',
    localField:'_id'
  })

  //document middleware: runs before .save() and .create() 
 
  tourSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true});
    next(); 
  });
  // for embedding users in tours
  // tourSchema.pre('save',async function(next){
  //   const guidesPromises=this.guides.map(async id=>await User.findById(id));
  //   this.guides=await Promise.all(guidesPromises);
  //   next();
  // }) 


  // tourSchema.pre('save',function(next){
  //   console.log("Will save document...");
  //   next();
  // })
  // post run after save
  // tourSchema.post('save',function(doc,next){
  //   next();
  // });

  // query middleware
  // all start with find eg .find(),findOne,findByIdAndUpdate,...
  tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}})
    this.start=Date.now();
    next();
  });

  // to populate guides data in tour
  tourSchema.pre(/^find/,function(next){
      this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
      });
      next();
  });

  tourSchema.post(/^find/,function(docs,next){
    console.log(`Query took ${Date.now()-this.start} milliseconds`);
    // console.log(docs);
    next();
  });

  //aggregation middleware
  // geo must be first in pipeline , so this will prevent geo
  // tourSchema.pre('aggregate',function(next){
  //   this.pipeline().unshift({
  //     $match:{secretTour:{$ne:true}}
  //   })
  //   next();
  // })
  export default model('Tour',tourSchema); 