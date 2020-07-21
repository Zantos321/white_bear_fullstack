import React from "react";
import saveIcon from "../../icons/save.svg";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import { connect } from "react-redux";
import actions from "../../store/actions";
import axios from "axios";

class CreateImagery extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         imageryText: "",
      };
   }

   checkHasInvalidCharCount() {
      if (
         this.state.imageryText.length > MAX_CARD_CHARS ||
         this.state.imageryText.length === 0
      ) {
         return true;
      } else return false;
   }

   setImageryText(e) {
      this.setState({ imageryText: e.target.value });
   }

   updateCreatableCard() {
      if (!this.checkHasInvalidCharCount()) {
         console.log("updating creatable card");
         const creatableCard = { ...this.props.creatableCard };
         creatableCard.imagery = this.state.imageryText;

         this.props.dispatch({
            type: actions.UPDATE_CREATABLE_CARD,
            payload: creatableCard,
         });
         // save to the database (make an API call)
         axios
            .post("/api/v1/memory-cards", creatableCard)
            .then((res) => {
               console.log("Memory Card Created");
               // TODO: Display success overlay
               // Clear createableCard from redux
               this.props.dispatch({
                  type: actions.UPDATE_CREATABLE_CARD,
                  payload: {},
               });
               // route to "/create-answer"
               this.props.history.push("/create-answer");
            })
            .catch((err) => {
               const { data } = err.response;
               console.log(data);
               // Display error overlay
               // Hide error overlay for 5 seconds
            });
      }
   }

   render() {
      return (
         <AppTemplate>
            <div className="text-center text-muted my-4">
               <h4>Add memorable imagery</h4>
            </div>

            <div className="mb-2">
               <div className="card bg-primary">
                  <div className="card-body">
                     <textarea
                        rows="6"
                        autoFocus={true}
                        defaultValue=""
                        onChange={(e) => this.setImageryText(e)}
                     ></textarea>
                  </div>
               </div>

               <div className="card bg-secondary">
                  <div className="card-body">
                     {this.props.creatableCard.answer}
                  </div>
               </div>
            </div>

            <div className="float-right mb-5">
               <span
                  className={classnames({
                     "text-danger": checkIsOver(
                        this.state.imageryText,
                        MAX_CARD_CHARS
                     ),
                  })}
               >
                  {this.state.imageryText.length}/{MAX_CARD_CHARS}
               </span>
            </div>
            <div className="clearfix"></div>

            <Link to="/create-answer" className="btn btn-link" id="save-error">
               Back to answer
            </Link>
            <button
               className={classnames(
                  "btn btn-primary btn-lg float-right mb-4",
                  { disabled: this.checkHasInvalidCharCount() }
               )}
               onClick={() => {
                  this.updateCreatableCard();
               }}
            >
               <img
                  src={saveIcon}
                  width="20px"
                  style={{ marginBottom: "3px" }}
                  className="mr-2"
                  alt=""
               />
               Save
            </button>
         </AppTemplate>
      );
   }
}

function mapStateToProps(state) {
   return { creatableCard: state.creatableCard };
}

export default connect(mapStateToProps)(CreateImagery);
