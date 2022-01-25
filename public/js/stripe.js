/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51KLjkeSCEbkOJRmlbVg1SACKVNEYWwMkgpQdAH2L7jLYYTJvFCcKncSU8aBdeMF9Ipqckzk99rJfgWn0hkHHn4t30054IasWtr'
);

export const bookTour = async (tourid) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourid}`
    );
    console.log(session);

    // 2) Create checkout Form + charge the credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log(err);
    showAlert('error', 'Something went wrong!');
  }
};
