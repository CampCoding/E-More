import React from 'react';
import { Redirect } from 'react-router-dom';

const ExternalRedirectGuard = ({ children }) => {
  // const handleNavigation = (event) => {
  //   const { target } = event;
  //   if (target.tagName === 'A' && !target.getAttribute('href').startsWith('/')) {
  //     // Prevent navigation to external URLs
  //     event.preventDefault();
  //   }
  // };

  return (
    <div onClick={()=>{

    }}>
      {children}
    </div>
  );
};

export default ExternalRedirectGuard;
