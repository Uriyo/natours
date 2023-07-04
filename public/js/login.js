/* eslint-disable */
// import axios from 'axios';
// const axios=require('axios');

import axios from 'axios';
import { showAlert } from './alerts';
export const login =async (email,password)=>{
     try{
         const res = await axios({
             method: 'POST',
             url: 'http://127.0.0.1:300/api/v1/users/login',
             data:{
                 email, 
                 password
             }  
         }); 
         
         
         if(res.data.status==='success'){
            showAlert('success','Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1000)
            // to go to home page after login successfully
         }
         console.log(res.data);
     }catch(err){
         showAlert('error',err.response.data.message);
     } 
 }; 

 export const logout=async ()=>{
    try{
        const res=await axios({
            method:'GET',
            url: 'http://127.0.0.1:300/api/v1/users/logout',

        }); 
        console.log(res.data.status);
        if(res.data.status=='succes'){
            location.reload(true);
        }
    }catch(err){
        console.log(err.response);
        showAlert('error','Error logging out');
    }
 }
 
 