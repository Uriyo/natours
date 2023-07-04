const express = require('express');
const multer=require('multer');
const path = require('path');
const morgan = require('morgan');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean'); 
const hpp=require('hpp');
const cookieParser=require('cookie-parser');
const cors=require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes'); 
const reviewRouter=require('./routes/reviewRoutes');
 //const bookingRouter=require('./routes/bookingRoutes');
const viewRouter=require('./routes/viewRoutes');

//Start express app
const app = express();
app.use(
  cors({ 
  origin: "*",
}));
// app.use(function(req, res, next) { res.setHeader( 'Content-Security-Policy', "script-src 'self' cdnjs.cloudflare.com" ); return next(); });
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
// 1) Global MIDDLEWARES
//serving static files
app.use(express.static(path.join(__dirname,'public')));

//set security HTTP headers
app.use(helmet())

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


//-----------to limit the brute force heackers

const limiter=rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:'Too many requuests from this IP, please try again in an hour!'
});
app.use('/api',limiter);
 
//Body parser , reading data from body into req.body
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({ extended: true, limit: '10kb'}));
app.use(cookieParser());


//Data santization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(hpp({
  whitelist:[
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
    ] 
  })
);

 
//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
    
  // res.cookie('jwt',token);
  // req.cookies.email=req.body.email;
  // req.cookies.password=req.body.password;
  // req.cookies.name="anm";
  // console.log(req.cookies);
  res.setHeader( 'Content-Security-Policy', "script-src 'self' cdnjs.cloudflare.com  ");
  res.setHeader('Cross-Origin-Opener-Policy', 'cross-origin');
  // res.setHeader("Access-Control-Allow-Origin", "https://js.stripe.com/v3/");
  // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

// add the new route handler

// 3) ROUTES 

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
 //app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
 