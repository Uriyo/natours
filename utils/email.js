const nodemailer=require('nodemailer');
const pug=require('pug');
const htmlToText=require('html-to-text');

module.exports=class Email{
    
    constructor(user,url){
        this.to=user.email;
        this.firstName=user.name.split(' ')[0];
        this.url=url;
        this.from=process.env.EMAIL_FROM;
    }
     
  newTransport(){
        if(process.env.NODE_ENV ==='production'){
            // Sendgrid
            // console.log( process.env.SENDGRID_USERNAME);
            // console.log( process.env.SENDGRID_PASSWORD);
            return nodemailer.createTransport({
                service: 'SendGrid',
                // host: 'smtp.sendgrid.net',
                // port: 587,
                auth:{
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            }); 
        }
        
        return nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            auth:{
                user:process.env.EMAIL_USERNAME,
                pass:process.env.EMAIL_PASSWORD
            }
    
        });
    }

    async send(template,subject){
        //send ACTUAL EMAIL
        //1 render html 
        const html=pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
            firstName:this.firstName,
            url:this.url,
            subject
        });
        console.log(this.to);
        //2 define the email options
        const mailOptions={
            from:this.from,
            to: this.to,
            subject,
            html, 
            text: htmlToText.fromString(html)
            //html:
        };
        //3create a transport and send email
        try{
        await this.newTransport().sendMail(mailOptions);
        console.log('Email sent successfully');
        }catch(err){
            console.log('Email sending failed:', err);
        } 
    }

   async sendWelcome(){
        await this.send('welcome','Welcome to the Natours Family');
    }

    async sendPasswordReset(){
        await this.send('passwordReset','Your password reset token (valid for 10 minutes)'
        );
    }
};


