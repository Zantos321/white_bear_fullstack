import React from "react";
import constellationLogo from "../../img/logo-landing.png";
import SignUp from "../ui/SignUp";
import LogIn from "../ui/LogIn";

export default function Landing() {
   return (
      <div className="landing-background">
         <div className="container-fluid">
            <div className="row mb-8 pt-7 ml-2 justify-content-left">
               <div className="header">
                  <img
                     className="img-fluid"
                     src={constellationLogo}
                     alt="white bear constellation"
                  />
                  <h1 className="logo-text d-inline ">White Bear</h1>
               </div>
            </div>

            <div className="row">
               <SignUp />
               <LogIn />
            </div>
         </div>
      </div>
   );
}
