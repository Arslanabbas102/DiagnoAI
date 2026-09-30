import React, { useState } from "react";
import { LuPlus } from "react-icons/lu";

const FaqItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccording = () => {
    setIsOpen(!isOpen); // Toggle isOpen between true and false
  };

  return (
    <li
      className={`mb-4 list-none rounded-2xl bg-white ring-1 transition duration-300 ${
        isOpen ? "shadow-soft ring-brand-200" : "ring-line hover:ring-brand-200"
      }`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-5 rounded-2xl p-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 lg:px-6"
        onClick={toggleAccording}
      >
        <h4 className="text-base font-semibold leading-7 text-ink lg:text-lg">
          {item.question}
        </h4>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition duration-300 ${
            isOpen
              ? "rotate-45 bg-brand-600 text-white ring-brand-600"
              : "bg-brand-50 text-brand-600 ring-brand-100"
          }`}
        >
          <LuPlus className="h-4 w-4" />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[15px] leading-7 text-muted lg:px-6 lg:text-base">
            {item.content}
          </p>
        </div>
      </div>
    </li>
  );
};

export default FaqItem;
