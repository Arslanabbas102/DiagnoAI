import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";

export const getCheckoutSession = async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({
      success: false,
      message:
        "Online payments aren't set up yet, so appointments can't be booked right now.",
    });
  }

  try {
    //get currently booked doctor
    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "This doctor could not be found." });
    }
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Please log in with a patient account to book an appointment.",
      });
    }

    // console.log("Doctor ticket price:", doctor.ticketPrice);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_SITE_URL}/doctors/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: doctor.ticketPrice * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: session.id,
    });
    await booking.save();
    res
      .status(200)
      .json({ success: true, message: "Successfully paid", session });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        success: false,
        message: "We couldn't start the payment. Please try again later.",
      });
  }
};
