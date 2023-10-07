import stripe from 'stripe';
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (customerEmail) => {
  const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: customerEmail,
  });
  return session.id;
};
