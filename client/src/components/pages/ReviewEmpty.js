import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { connect } from "react-redux";
import actions from "../../store/actions";

class ReviewEmpty extends React.Component {
   goToPreviousCard() {
      this.props.dispatch({ type: actions.DECREMENT_QUEUE_INDEX });
      this.props.history.push("/review-answer");
   }

   getMoreCards() {
      this.props.dispatch({ type: actions.RESET_QUEUE });
      this.props.history.push("/review-imagery");
   }

   render() {
      return (
         <AppTemplate>
            <div className="text-center text-muted my-4">
               <h4>Out of cards</h4>
            </div>
            {this.props.queue.index > 0 && (
               <button
                  to="/review-answer"
                  className="btn btn-link mb-4"
                  onClick={() => {
                     this.goToPreviousCard();
                  }}
               >
                  Previous card
               </button>
            )}
            <div className="float-right">
               <button
                  to="/review-imagery"
                  className="btn btn-outline-primary"
                  onClick={() => {
                     this.getMoreCards();
                  }}
               >
                  Get more cards
               </button>
            </div>
         </AppTemplate>
      );
   }
}

function mapStateToProps(state) {
   return {
      queue: state.queue,
   };
}

export default connect(mapStateToProps)(ReviewEmpty);
