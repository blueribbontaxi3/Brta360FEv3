import React from "react";

interface EmailLinkProps {
  email: string;
}

const EmailLink: React.FC<EmailLinkProps> = ({ email }) => {
  return <a href={`mailto:${email}`}>{email}</a>;
};

export default EmailLink;
