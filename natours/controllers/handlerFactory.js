import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
export const deleteOne= Model =>catchAsync(async (req, res,next) => {
    const doc=await Model.findByIdAndDelete(req.params.id);
    if(!doc){
      return next(new AppError('No document found with that ID',404))
    }
    res.status(204).json({
      // 204 -> no content
      status: 'success',
      data: null,
    });
});

export const updateOne= Model=>catchAsync(async(req,res,next)=>{
  const doc= await Model.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  });
  if(!doc){
    return next(new AppError('No document found with that ID',404));

  }
  res.status(200).json({
    status:'success',
    data:{
      data: doc
    }
  })
})

export const createOne= Model =>catchAsync(async (req, res,next) => {
  const doc = await Model.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
  
});

export const getOne=(Model,popuOptions)=>catchAsync(async (req, res,next) => {
  let query=Model.findById(req.params.id);
  if(popuOptions){
    query=query.populate(popuOptions);
    
  }  
  const doc =await query;
  // const doc = await Model.findById(req.params.id).populate('reviews'); 
    if(!doc){
      return next(new AppError('No doc found with that ID',404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        data:doc 
      },
    });
});

export const getAll= Model =>catchAsync(async (req, res,next) => {
  // To allow for nested Get reviews on tour
  let filter={};
  if(req.params.tourId){
      filter={tour:req.params.tourId}
  } 
  const features = new APIFeatures(Model.find(filter), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const doc = await features.query;
// to check how many have scanned to retrieve 
// compare nReturned and totalDocsExamine
// const doc = await features.query.explain();
res.status(200).json({
  status: 'success',
  requestedAt: req.requestTime,
  results: doc.length, 
  data: {
    data:doc
  },
}); 
  // method chaining mongoose
  // const query =  Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');
});