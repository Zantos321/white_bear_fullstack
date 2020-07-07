import React from "react";
import saveIcon from "../../icons/save.svg";
import { Link } from "react-router-dom";
import memoryCards from "../../mock-data/memory-cards";
import toDisplayDate from "date-fns/format";
import AppTemplate from "../ui/AppTemplate";
import classnames from "classnames";
import { connect } from "react-redux";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import isEmpty from "lodash/isEmpty";
import without from "lodash/without";
import actions from "../../store/actions";

const memoryCard = memoryCards[2];

class Edit extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         answerText: memoryCard.answer,
         imageryText: memoryCard.imagery,
         checked: false,
      };
   }

   checkHasInvalidCharCount() {
      if (
         this.state.answerText.length > MAX_CARD_CHARS ||
         this.state.imageryText.length > MAX_CARD_CHARS ||
         this.state.answerText.length === 0 ||
         this.state.imageryText.length === 0
      ) {
         return true;
      } else {
         return false;
      }
   }

   setImageryText(e) {
      this.setState({ imageryText: e.target.value });
   }

   setAnswerText(e) {
      this.setState({ answerText: e.target.value });
   }

   showDeleteButton() {
      this.setState({
         checked: !this.state.checked,
      });
   }

   deleteCard() {
      // TODO delete from database
      if (this.props.editableCard.prevRoute === "/review-answer") {
         this.deleteCardFromStore();
      }
      if (this.props.editableCard.prevRoute === "/all-cards") {
         this.props.history.push("/all-cards");
      }
   }

   deleteCardFromStore() {
      const deletedCard = this.props.editableCard.card;
      const cards = this.props.queue.cards;
      const filteredCards = without(cards, deletedCard);
      this.props.dispatch({
         type: actions.STORE_QUEUED_CARDS,
         payload: filteredCards,
      });
      if (filteredCards[this.props.queue.index] === undefined) {
         this.props.history.push("/review-empty");
      } else {
         this.props.history.push("/review-imagery");
      }
   }

   render() {
      return (
         <AppTemplate>
            <div className="text-center text-muted my-4">
               <h4>Edit card</h4>
            </div>
            {isEmpty(this.props.editableCard) === false && (
               <>
                  <div className="mb-2">
                     <div className="card bg-primary">
                        <div className="card-body">
                           <textarea
                              rows="4"
                              autoFocus={true}
                              defaultValue={
                                 this.props.editableCard.card.imagery
                              }
                              onChange={(e) => this.setImageryText(e)}
                           ></textarea>
                        </div>
                     </div>

                     <div className="card bg-secondary">
                        <div className="card-body">
                           <textarea
                              rows="4"
                              autoFocus={true}
                              defaultValue={this.props.editableCard.card.answer}
                              onChange={(e) => this.setAnswerText(e)}
                           ></textarea>
                        </div>
                     </div>
                  </div>
                  <div className="row float-right mb-5">
                     <p className="text-muted mr-4">
                        <span
                           className={classnames({
                              "text-danger": checkIsOver(
                                 this.state.imageryText,
                                 MAX_CARD_CHARS
                              ),
                           })}
                        >
                           Top: {this.state.imageryText.length}/{MAX_CARD_CHARS}
                        </span>
                     </p>
                     <p className="text-muted mr-4">
                        <span
                           className={classnames({
                              "text-danger": checkIsOver(
                                 this.state.answerText,
                                 MAX_CARD_CHARS
                              ),
                           })}
                        >
                           Bottom: {this.state.answerText.length}/
                           {MAX_CARD_CHARS}
                        </span>
                     </p>
                  </div>
                  <div className="clearfix"></div>
                  <Link
                     to={this.props.editableCard.prevRoute}
                     className="btn btn-link"
                     role="button"
                  >
                     Discard changes
                  </Link>
                  <Link
                     to={this.props.editableCard.prevRoute}
                     className={classnames(
                        "btn btn-primary btn-lg float-right",
                        {
                           disabled: this.checkHasInvalidCharCount(),
                        }
                     )}
                  >
                     <img
                        src={saveIcon}
                        width="20px"
                        style={{ marginBottom: "3px" }}
                        className="mr-2"
                        alt=""
                     />
                     Save
                  </Link>
                  <div className="text-center text-muted my-6">
                     <h4>Card properties</h4>
                  </div>
                  <div className="row mb-2">
                     <div className="col-4">
                        <p className="text-muted">Created on:</p>
                     </div>
                     <div className="col-8">
                        <p>
                           {toDisplayDate(
                              this.props.editableCard.card.createdAt,
                              "MMM. d, y"
                           )}
                        </p>
                     </div>
                  </div>
                  <div className="row mb-2">
                     <div className="col-4">
                        <p className="text-muted">Last attempt:</p>
                     </div>
                     <div className="col-8">
                        <p>
                           {toDisplayDate(
                              this.props.editableCard.card.lastAttemptAt,
                              "MMM. d, y"
                           )}
                        </p>
                     </div>
                  </div>
                  <div className="row mb-2">
                     <div className="col-4">
                        <p className="text-muted">Next attempt:</p>
                     </div>
                     <div className="col-8">
                        <p>
                           {toDisplayDate(
                              this.props.editableCard.card.nextAttemptAt,
                              "MMM. d, y"
                           )}
                        </p>
                     </div>
                  </div>
                  <div className="row mb-4">
                     <div className="col-4">
                        <p className="text-muted">Consecutives:</p>
                     </div>
                     <div className="col-8">
                        <p>
                           {
                              this.props.editableCard.card
                                 .totalSuccessfulAttempts
                           }
                        </p>
                     </div>
                  </div>
                  <div className="row col mb-4">
                     <div className="custom-control custom-checkbox ">
                        <input
                           type="checkbox"
                           className="custom-control-input delete-verify"
                           id="delete-check"
                           defaultChecked={this.state.checked}
                           onClick={() => {
                              this.showDeleteButton();
                           }}
                        />
                        <label
                           className="custom-control-label delete-verify"
                           htmlFor="delete-check"
                        >
                           Show delete button
                        </label>
                     </div>
                  </div>
                  <div className="row col mb-4">
                     {this.state.checked && (
                        <button
                           className="btn btn-large btn-outline-danger"
                           id="card-delete"
                           onClick={() => {
                              this.deleteCard();
                           }}
                        >
                           Delete this card
                        </button>
                     )}
                  </div>
               </>
            )}
         </AppTemplate>
      );
   }
}

function mapStateToProps(state) {
   return {
      editableCard: state.editableCard,
      queue: state.queue,
   };
}

export default connect(mapStateToProps)(Edit);
/*

editableCard: {
      prevRoute: "",
      card: {
         // all the card properties
      }
}


*/
