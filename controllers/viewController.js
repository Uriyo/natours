const Tour = require('../models/tourModel');
const catchAsync=require('../utils/catchAsync');
const User=require('../models/userModel');
const  AppError=require('../utils/appError');

exports.getOverview=catchAsync(async (req,res,next)=>{
   //1 gett tour data from, collection
    const tours=await Tour.find();
    
   //2 build template

   //3 render that template using tour data from 1
    
    res.status(200).render('overview',{
      title: 'All Tours',
      tours
    });
  });
 
exports.getTour=catchAsync (async(req,res,next)=>{
    //1 get the data for the requested tour including reviews and guides
        const tour=await Tour.findOne({slug:req.params.slug}).populate({
            path:'reviews',
            fields:'review rating user'
        });
    
    if(!tour){
      return next(new AppError('there is no tour by that name'))
    }
    
        //2 Build template
        
    

    //3 render template using data
    res.status(200).render('tour',{
      title: `${tour.name} tour`,
      tour
    });
  });

  exports.getLoginForm=(req,res)=>{
    res.status(200).render('login',{
      title:'Log into yout account'
    });
  };  

  exports.getAccount=(req,res)=>{
    res.status(200).render('account',{
      title:'your account'
    });
  };

  exports.updateUserData=catchAsync(async(req,res,next)=>{
    const updatedUser=await User.findByIdAndUpdate(req.user.id,{
      name: req.body.name,
      email: req.body.email
    },
    {
      new:true,
      runValidators:true
    });
    
    res.status(200).render('account',{
      title:'your account',
      user: updatedUser
    });
  });