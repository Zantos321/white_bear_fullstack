import React from "react";
import classnames from "classnames";
import { v4 as getUuid } from "uuid";
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

   async validateAndCreateUser() {
      const emailInput = document.getElementById("signup-email-input").value;
      const passwordInput = document.getElementById("signup-password-input")
         .value;

      // Create user obj
      const user = {
         id: getUuid(),
         email: emailInput,
         password: passwordInput,
         createdAt: Date.now(),
      };
      console.log("Created user object for POST", user);
      // Post to API
      axios
         .post("/api/v1/users", user)
         .then((res) => {
            console.log(res.data);
            // Update current user in global state with API response
            this.props.dispatch({
               type: actions.UPDATE_CURRENT_USER,
               payload: res.data,
            });

            this.props.history.push("/create-answer");
         })
         .catch((err) => {
            const { data } = err.response;
            console.log(data);
            const { emailError, passwordError } = data;
            if (emailError !== "") {
               this.setState({ hasEmailError: true, emailError });
            } else {
               this.setState({ hasEmailError: false, emailError });
            }
            if (passwordError !== "") {
               this.setState({ hasPasswordError: true, passwordError });
            } else {
               this.setState({ hasPasswordError: false, passwordError });
            }
         });
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
                                 <br />
                                 <span className="text-muted">
                                    Must be at least 9 characters
                                 </span>
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
