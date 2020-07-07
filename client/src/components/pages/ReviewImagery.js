import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";

class ReviewImagery extends React.Component {
   constructor(props) {
      super(props);
      if (props.queue.cards.length === 0) {
         axios
            .get(
               "https://raw.githubusercontent.com/Zantos321/white-bear-mpa/master/src/mock-data/memory-cards.json"
            )
            .then((res) => {
               // handle success
               props.dispatch({
                  type: actions.STORE_QUEUED_CARDS,
                  payload: res.data,
               });
            })
            .catch((error) => {
               // handle error
               console.log(error);
            });
      }
      if (props.queue.index > props.queue.cards.length) {
         this.props.history.push("/review-empty");
      }
   }

   goToPreviousCard() {
      this.props.dispatch({ type: actions.DECREMENT_QUEUE_INDEX });
      this.props.history.push("/review-imagery");
   }

   render() {
      const memoryCard = this.props.queue.cards[this.props.queue.index];
      return (
         <AppTemplate>
            <div className="mb-5"></div>
            <div className="mb-5">
               <div className="card bg-primary">
                  <div className="card-body">
                     {memoryCard && memoryCard.imagery}
                  </div>
               </div>
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
               <Link
                  to="/review-answer"
                  className="btn btn-lrg btn-outline-primary"
               >
                  Show answer
               </Link>
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

export default connect(mapStateToProps)(ReviewImagery);
