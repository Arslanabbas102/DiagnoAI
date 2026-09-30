import React from "react";
import { services } from "./../../assets/data/services";
import ServiceCard from "./ServiceCard";
const ServiceList = () => {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
      {services.map((item, index) => (
        <ServiceCard item={item} index={index} key={index} />
      ))}
    </div>
  );
};

export default ServiceList;
