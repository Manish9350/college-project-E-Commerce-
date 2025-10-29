const express = require('express');
const stripe = require('../config/stripe');
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    // Validate order exists and belongs to user
    if (orderId) {
      const order = await Order.findOne({ 
        _id: orderId, 
        user: req.user.id 
      });
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: req.user.id,
        orderId: orderId || 'direct-payment'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ 
      message: 'Payment processing error', 
      error: error.message 
    });
  }
});

// Create checkout session (for Stripe Checkout)
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { items, successUrl, cancelUrl, orderId } = req.body;

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          images: [item.product.images[0]],
          description: item.product.description.substring(0, 100),
          metadata: {
            productId: item.product._id.toString()
          }
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}${cancelUrl}`,
      customer_email: req.user.email,
      client_reference_id: orderId,
      metadata: {
        userId: req.user.id,
        orderId: orderId
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'IN'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'usd',
            },
            display_name: 'Next day air',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 1,
              },
            },
          },
        },
      ],
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ 
      message: 'Error creating checkout session', 
      error: error.message 
    });
  }
});

// Retrieve checkout session
router.get('/checkout-session/:sessionId', auth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId,
      {
        expand: ['line_items', 'payment_intent']
      }
    );

    res.json(session);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving session', 
      error: error.message 
    });
  }
});

// Handle Stripe webhooks
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentIntentFailed(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Webhook handlers
const handleCheckoutSessionCompleted = async (session) => {
  try {
    const orderId = session.client_reference_id;
    const userId = session.metadata.userId;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'completed';
        order.orderStatus = 'processing';
        order.stripePaymentIntentId = session.payment_intent;
        await order.save();

        console.log(`Order ${orderId} payment completed via checkout session`);
      }
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
};

const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (orderId && orderId !== 'direct-payment') {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'completed';
        order.orderStatus = 'processing';
        await order.save();

        console.log(`Order ${orderId} payment completed via payment intent`);
      }
    }
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
};

const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (orderId && orderId !== 'direct-payment') {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();

        console.log(`Order ${orderId} payment failed`);
      }
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
};

// Get payment methods
router.get('/payment-methods', auth, async (req, res) => {
  try {
    // In a real app, you might store customer IDs in your user model
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId, // You'd need to create and store this
      type: 'card',
    });

    res.json(paymentMethods.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving payment methods', 
      error: error.message 
    });
  }
});

// Refund payment
router.post('/refund', auth, async (req, res) => {
  try {
    const { paymentIntentId, amount } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    // Update order status
    await Order.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      { 
        paymentStatus: 'refunded',
        orderStatus: 'cancelled'
      }
    );

    res.json({ message: 'Refund processed successfully', refund });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error processing refund', 
      error: error.message 
    });
  }
});

module.exports = router;