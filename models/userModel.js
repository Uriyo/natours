const crypto=require('crypto');
const  mongoose= require('mongoose');
const validator= require('validator');
const bcrypt=require('bcryptjs');

// mongoose.connect('mongodb+srv://kush:HT2KH7bKJNKiCxmp@cluster0.vb7pyds.mongodb.net/natours?retryWrites=true&w=majority')
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
 
const userSchema=new mongoose.Schema({
     name: {
         type: String,
         required:[true,'Please Tell us your name!']
     },
     email: {
         type: String,
         required:[true,'Please provide your email'],
         unique: true,
         lowercase: true,
         validate:[validator.isEmail,'Please provide valid email']
     },     
     photo:{
        type: String ,
         default: 'default.jpg'
        },
     role:{
        type:String,
        enum:['user' , 'guide' , 'lead-guide' , 'admin'],
        default:'user'
     },
     password:{
         type: String,
         required:[true,'Please provide a password'],
         minlength:8,
         select:false
     },
     passwordConfirm:{
         type: String,
         required:[true,'Please confirm your password'],
        
//IMPORTANT-- it will not work during the process of resetting the password
// because  the validate field is only triggered on document
// creation and update operations (i.e., calls to save() and create()). 
//When you're resetting a password, you're updating an existing document in the database rather than creating a new one, 
//so the validate field won't be triggered.

         validate:{
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords are not same!'
         }
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
 
 userSchema.pre('save', async function(next){
    
    //only run this function if password was actually modified
    
    if(!this.isModified('password')) return next();

    //Hash the password with cost of 12

    this.password=await bcrypt.hash(this.password,12)

    //Delete passwordConfirm field

    this.passwordConfirm=undefined;
    next();
 });
 
 userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });

 userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
  });



//imp
 userSchema.methods.correctPassword= 
    async function(candidatePassword,userPasword){
        return await bcrypt
            .compare(candidatePassword,userPasword);
 }

 userSchema.methods.changedPasswordAfter= function(JWTTimestamp){
    if(this.passwordChangedAt){
        console.log(this.passwordChangedAt,JWTTimestamp);
         const changedTimestamp= parseInt(
             this.passwordChangedAt.getTime() / 1000,
             10
        );
       
        return JWTTimestamp < changedTimestamp;  //100<200
    }
   //not changed 
    return false;
 };


 userSchema.methods.createPasswordResetToken=function(){
    
    const resetToken=crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

     // console.log({resetToken},this.passwordResetToken);

    this.passwordResetExpires=Date.now() + 10 * 60 * 1000;

    return resetToken;

 };

 const User=mongoose.model('User',userSchema);

 module.exports=User;