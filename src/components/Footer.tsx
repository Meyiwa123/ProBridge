import React from "react";

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent text-gray-500 text-sm text-center p-10">
      <div className="container mx-auto">
        <p>&copy; {currentYear} ProBridge. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
