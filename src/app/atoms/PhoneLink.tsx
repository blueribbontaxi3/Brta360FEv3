import React from "react";

interface PhoneLinkProps {
  phone: string;
}

const PhoneLink: React.FC<PhoneLinkProps> = ({ phone }) => {
  return <a href={`tel:${phone}`}>{phone}</a>;
};

export default PhoneLink;
