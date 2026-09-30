import React from "react";
import { Link } from "react-router-dom";
import { HiCheckCircle } from "react-icons/hi2";

const CheckoutSuccess = () => {
  return (
    <section className="bg-hero flex min-h-[70vh] items-center py-16">
      <div className="container">
        <div className="card animate-fade-up mx-auto max-w-lg p-8 text-center sm:p-12">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-50 ring-8 ring-accent-50/60">
            <HiCheckCircle className="h-12 w-12 text-accent-500" aria-hidden="true" />
          </span>
          <span className="badge mt-6 bg-accent-50 text-accent-600 ring-1 ring-inset ring-accent-100">
            Payment confirmed
          </span>
          <h1 className="mt-4 text-[28px] font-bold leading-tight text-ink md:text-[32px]">
            Payment done!
          </h1>
          <p className="mt-3 text-[16px] leading-7 text-muted">
            Thank you for completing your secure online payment. Have a great
            day!
          </p>
          <div className="mt-8">
            <Link to="/home" className="btn-primary">
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSuccess;
