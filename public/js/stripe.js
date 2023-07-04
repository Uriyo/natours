//   /* eslint-disable */ 

// import { loadStripe } from '@stripe/stripe-js';
// import axios from 'axios';
// import { showAlert} from './alerts';
//   const stripe=loadStripe("pk_test_51NPh6jSH1xsBqKj0iPEUhndMVWvgStK7ZIl4jkkCB1wMRASAjwJNvgxAFd62CcT0xyRoRTdvO44Gmq7Yhyouqlix00LxoTRLsZ");

//   export const bookTour= async tourId=>{
//      console.log(tourId);
//      try{
//       //1 get the checkout session from endpoint
//           const session=await axios(`/api/v1/booking/checkout-session/${tourId}`);
//           //console.log(session);
    
//       //2 create checkout form + chanre credit card
//       await stripe.redirectToCheckout({
//           sessionId: session.data.session.id,
//       });

//      }catch(err){
//       console.log(err);
//      showAlert('error',err.response.data.message);
//      };

//  };
