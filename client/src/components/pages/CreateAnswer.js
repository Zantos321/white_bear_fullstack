import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";

export default class CreateAnswer extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         answerText: "",
      };
   }
   checkHasInvalidCharCount() {
      if (
         this.state.answerText.length > MAX_CARD_CHARS ||
         this.state.answerText.length === 0
      ) {
         return true;
      } else {
         return false;
      }
   }

   setAnswerText(e) {
      this.setState({ answerText: e.target.value });
   }

   render() {
      return (
         <AppTemplate>
            <div className="text-center text-muted my-4">
               <h4>Add an answer</h4>
            </div>

            <div className="mb-2">
               <div className="card bg-secondary">
                  <div className="card-body">
                     <textarea
                        rows="6"
                        autoFocus={true}
                        defaultValue=""
                        onChange={(e) => this.setAnswerText(e)}
                     ></textarea>
                  </div>
               </div>
            </div>

            <div className="float-right mb-5">
               <span
                  className={classnames({
                     "text-danger": checkIsOver(
                        this.state.answerText,
                        MAX_CARD_CHARS
                     ),
                  })}
               >
                  {this.state.answerText.length}/{MAX_CARD_CHARS}
               </span>
            </div>
            <div className="clearfix"></div>

            <div className="float-right mb-4">
               <Link
                  id="nextButton"
                  className={classnames("btn btn-lg btn-outline-primary", {
                     disabled: this.checkHasInvalidCharCount(),
                  })}
                  role="button"
                  to="/create-imagery"
               >
                  Next
               </Link>
            </div>
         </AppTemplate>
      );
   }
}
