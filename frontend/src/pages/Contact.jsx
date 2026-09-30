import React, { useState } from "react";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";

const contactCards = [
  {
    icon: HiOutlineWrenchScrewdriver,
    title: "Technical support",
    text: "Trouble with bookings, reports or your account? Describe the issue and we will help.",
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: "Product feedback",
    text: "Share ideas about beta features and how we can improve your experience.",
  },
  {
    icon: HiOutlineClock,
    title: "Response time",
    text: "Our team typically replies within one business day.",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        toast.success(result.message || "Message sent! We'll get back to you soon.");
      } else {
        toast.error(result.message || "We couldn't send your message. Please try again.");
      }
    } catch (error) {
      toast.error("We couldn't reach the server. Please try again.");
    }
  };

  return (
    <>
      <section className="bg-hero py-14 lg:py-20">
        <div className="container text-center">
          <span className="eyebrow">Contact</span>
          <h1 className="heading mx-auto mt-4 max-w-2xl">
            We&apos;re here to <span className="text-gradient">help</span>
          </h1>
          <p className="text__para mx-auto max-w-xl">
            Got a technical issue? Want to send feedback about a beta feature?
            Let us know.
          </p>
        </div>
      </section>

      <section className="pt-0 lg:pt-0">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
            <div className="space-y-4 lg:col-span-2">
              {contactCards.map(({ icon: Icon, title, text }) => (
                <div key={title} className="card flex gap-4 p-6">
                  <span className="icon-tile shrink-0">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold text-ink">
                      {title}
                    </h3>
                    <p className="mt-1 text-[15px] leading-6 text-muted">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-6 sm:p-8 lg:col-span-3 lg:p-10">
              <h2 className="text-[22px] font-bold text-ink">Send us a message</h2>
              <p className="mt-1 text-[15px] text-muted">
                Fill in the form and we&apos;ll get back to you by email.
              </p>
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className="form__label">
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className="form__input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="form__label">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Let us know about the issue..."
                    className="form__input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="form__label">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    type="text"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    id="message"
                    placeholder="Write the details of your message here..."
                    className="form__input resize-y"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  <HiOutlinePaperAirplane className="h-5 w-5" aria-hidden="true" />
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
