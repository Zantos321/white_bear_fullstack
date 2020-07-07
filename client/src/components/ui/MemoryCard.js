import React from "react";
import editIcon from "../../icons/edit.svg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../../store/actions";

class MemoryCard extends React.Component {
   storeEditableCard() {
      console.log("storing editable card");
      this.props.dispatch({
         type: actions.STORE_EDITABLE_CARD,
         payload: {
            card: this.props.card,
            prevRoute: "/all-cards",
         },
      });
   }

   render() {
      return (
         <div className="d-flex align-items-start mb-5">
            <div className="flex-fill">
               <div className="card bg-primary">
                  <div className="card-body all-card-body-text">
                     {this.props.card.imagery}
                  </div>
               </div>
               <div className="card bg-secondary">
                  <div className="card-body all-card-body-text">
                     {this.props.card.answer}
                  </div>
               </div>
            </div>
            <Link
               to="/edit"
               className="btn btn-link ml-4 d-flex mt-n2"
               role="button"
               onClick={() => {
                  this.storeEditableCard();
               }}
            >
               <img
                  src={editIcon}
                  width="20px"
                  style={{ marginTop: "2px", marginRight: "8px" }}
                  alt=""
               />
               <div className="d-inline">Edit</div>
            </Link>
         </div>
      );
   }
}

function mapStateToProps(state) {
   return {};
}

export default connect(mapStateToProps)(MemoryCard);
