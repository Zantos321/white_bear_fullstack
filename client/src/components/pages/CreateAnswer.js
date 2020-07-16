import React from "react";
import AppTemplate from "../ui/AppTemplate";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS, defaultLevel } from "../../utils/helpers";
import { connect } from "react-redux";
import actions from "../../store/actions";
import { v4 as getUuid } from "uuid";
import getNextAttemptAt from "../../utils/getNextAttemptAt";

class CreateAnswer extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         answerText: this.props.creatableCard.answer || "",
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

   setCreatableCard() {
      if (!this.checkHasInvalidCharCount()) {
         const currentTime = Date.now();
         this.props.dispatch({
            type: actions.UPDATE_CREATABLE_CARD,
            payload: {
               // the card itself
               id: getUuid(),
               imagery: "",
               answer: this.state.answerText,
               userId: this.props.currentUser.id,
               createdAt: currentTime,
               nextAttemptAt: getNextAttemptAt(defaultLevel, currentTime), //
               lastAttemptAt: currentTime,
               totalSuccessfulAttempts: 0,
               level: 1,
            },
         });
         this.props.history.push("/create-imagery");
      }
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
                        defaultValue={this.state.answerText}
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
               <button
                  id="nextButton"
                  className={classnames("btn btn-lg btn-outline-primary", {
                     disabled: this.checkHasInvalidCharCount(),
                  })}
                  onClick={() => {
                     this.setCreatableCard();
                  }}
               >
                  Next
               </button>
            </div>
         </AppTemplate>
      );
   }
}

function mapStateToProps(state) {
   return {
      currentUser: state.currentUser,
      creatableCard: state.creatableCard,
   };
}

export default connect(mapStateToProps)(CreateAnswer);
