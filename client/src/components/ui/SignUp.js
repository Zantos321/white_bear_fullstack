import React from "react";
import classnames from "classnames";
import hash from "object-hash";
import { v4 as getUuid } from "uuid";
import { EMAIL_REGEX } from "../../utils/helpers";
import { withRouter } from "react-router-dom";
import axios from "axios";
import actions from "../../store/actions";
import { connect } from "react-redux";

class SignUp extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isDisplayingInputs: false,
         emailError: "",
         passwordError: "",
         hasEmailError: false,
         hasPasswordError: false,
      };
   }

   showInputs() {
      this.setState({
         isDisplayingInputs: true,
      });
   }

   async setEmailState(emailInput) {
      //Email Cannot be blank
      //must have valid email regex
      const lowerCasedEmailInput = emailInput.toLowerCase();

      if (emailInput === "")
         this.setState({
            emailError: "Please enter your email address.",
            hasEmailError: true,
         });
      else if (EMAIL_REGEX.test(lowerCasedEmailInput) === false) {
         this.setState({
            emailError: "Not a valid email address.",
            hasEmailError: true,
         });
      } else {
         this.setState({ emailError: "", hasEmailError: false });
      }
   }

   //pulls locat part of the email and checks to see if the password is contained in the local email
   checkHasLocalPart(passwordInput, emailInput) {
      const localPart = emailInput.split("@")[0];
      if (localPart === "") return false;
      else if (localPart.length < 4) return false;
      else return passwordInput.includes(localPart);
   }

   async setPasswordState(passwordInput, emailInput) {
      // can't be blank
      // must be at least 9 charcters
      // cannot contain the local-part of the email
      // must have at least 3 unique characters

      const uniqChars = [...new Set(passwordInput)];
      if (passwordInput === "") {
         this.setState({
            passwordError: "Please create a password.",
            hasPasswordError: true,
         });
      } else if (passwordInput.length < 9) {
         this.setState({
            passwordError: "Your password must be at least 9 characters.",
            hasPasswordError: true,
         });
      } else if (this.checkHasLocalPart(passwordInput, emailInput)) {
         // return true if has local part in the password
         // set error state
         this.setState({
            passwordError:
               "For your safety, your password cannot contain your email address.",
            hasPasswordError: true,
         });
      } else if (uniqChars.length < 3) {
         this.setState({
            passwordError:
               "For your safety, your password must contain at least 3 unique characters.",
            hasPasswordError: true,
         });
      } else {
         this.setState({ passwordError: "", hasPasswordError: false });
      }
   }

   async validateAndCreateUser() {
      const emailInput = document.getElementById("signup-email-input").value;
      const passwordInput = document.getElementById("signup-password-input")
         .value;
      await this.setEmailState(emailInput);
      await this.setPasswordState(passwordInput, emailInput);
      if (
         this.state.hasEmailError === false &&
         this.state.hasPasswordError === false
      ) {
         const user = {
            id: getUuid(),
            email: emailInput,
            password: hash(passwordInput),
            createdAt: Date.now(),
         };
         console.log("Created user object for POST", user);
         // Mimic API response
         axios
            .get(
               "https://raw.githubusercontent.com/Zantos321/white-bear-mpa/master/src/mock-data/user.json"
            )
            .then((res) => {
               // handle success
               const currentUser = res.data;
               console.log(currentUser);
               this.props.dispatch({
                  type: actions.UPDATE_CURRENT_USER,
                  payload: res.data,
               });
            })
            .catch((error) => {
               // handle error
               console.log(error);
            });
         this.props.history.push("/create-answer");
      }
   }

   render() {
      return (
         <div className="offset-1 col-10 offset-sm-1 col-sm-9 offset-md-1 col-md-4 offset-lg-2 col-lg-4 offset-xl-2 col-xl-4 mb-6">
            <div className="card">
               <div className="card-body">
                  <div className="landing-card">
                     <h2 className="card-title">Nice to meet you</h2>
                     <p className="card-text mb-5">
                        Sign up for White Bear.Free Forever.
                     </p>

                     {!this.state.isDisplayingInputs && (
                        <button
                           className="btn btn-success btn-landing btn-block hide-me"
                           aria-expanded="false"
                           aria-controls="#signup-collapse"
                           id="signupButton"
                           onClick={() => {
                              this.showInputs();
                           }}
                        >
                           Sign up
                        </button>
                     )}

                     {this.state.isDisplayingInputs && (
                        <>
                           <p className="signup-text mb-4">
                              Lets get you signed up.
                           </p>
                           <div className="form-group">
                              <label
                                 className="input-text"
                                 htmlFor="signup-email-input"
                              >
                                 Email address
                              </label>
                              <input
                                 type="email"
                                 className={classnames({
                                    "form-control": true,
                                    "is-invalid": this.state.hasEmailError,
                                 })}
                                 id="signup-email-input"
                                 aria-describedby="email-help"
                              />

                              {this.state.hasEmailError && (
                                 <div
                                    className="alert alert-danger"
                                    role="alert"
                                    id="signup-email-alert"
                                 >
                                    {this.state.emailError}
                                 </div>
                              )}
                           </div>
                           <div className="form-group">
                              <label
                                 className="input-text"
                                 htmlFor="password-input"
                              >
                                 Create a password
                              </label>
                              <input
                                 type="password"
                                 className={classnames({
                                    "form-control": true,
                                    "is-invalid": this.state.hasPasswordError,
                                 })}
                                 id="signup-password-input"
                              />
                              {this.state.hasPasswordError && (
                                 <div
                                    className="alert alert-danger"
                                    role="alert"
                                    id="signupPasswordAlert"
                                 >
                                    {this.state.passwordError}
                                 </div>
                              )}
                           </div>
                           <button
                              to="/create-answer"
                              id="signupVerify"
                              type="button"
                              className="btn btn-success btn-landing btn-block mt-5"
                              onClick={() => {
                                 this.validateAndCreateUser();
                              }}
                           >
                              Lets go!
                           </button>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

function mapStateToProps(state) {
   return {};
}

export default withRouter(connect(mapStateToProps)(SignUp));
