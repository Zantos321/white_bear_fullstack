import React from "react";
import saveIcon from "../../icons/save.svg";
import { Link } from "react-router-dom";
import toDisplayDate from "date-fns/format";
import AppTemplate from "../ui/AppTemplate";
import classnames from "classnames";
import { connect } from "react-redux";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import isEmpty from "lodash/isEmpty";
import without from "lodash/without";
import actions from "../../store/actions";
import axios from "axios";

class Edit extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         answerText: this.props.editableCard.card.answer,
         imageryText: this.props.editableCard.card.imagery,
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

   saveCard() {
      if (!this.checkHasInvalidCharCount()) {
         const memoryCard = { ...this.props.editableCard.card };
         memoryCard.answer = this.state.answerText;
         memoryCard.imagery = this.state.imageryText;

         // db PUT this card in our axios req
         axios
            .put(`/api/v1/memory-cards/${memoryCard.id}`, memoryCard)
            .then((res) => {
               console.log("Memory Card Updated");

               const cards = [...this.props.queue.cards];
               cards[this.props.queue.index] = memoryCard;

               // update redux queue
               this.props.dispatch({
                  type: actions.UPDATE_QUEUED_CARDS,
                  payload: cards,
               });
               // TODO: Display success overlay
               // on success:
               this.props.history.push(this.props.editableCard.prevRoute);
            })
            .catch((err) => {
               const { data } = err.response;
               console.log(data);
               // Display error overlay
               // Hide error overlay for 5 seconds
            });
      }
   }

   deleteCard() {
      const memoryCard = { ...this.props.editableCard.card };
      // query database to delete card
      axios
         .delete(`/api/v1/memory-cards/${memoryCard.id}`)
         .then((res) => {
            console.log(res.data);
            const deletedCard = this.props.editableCard.card;
            const cards = this.props.queue.cards;
            const filteredCards = without(cards, deletedCard);
            this.props.dispatch({
               type: actions.UPDATE_QUEUED_CARDS,
               payload: filteredCards,
            });
            //TODO: Display success overlay
            if (this.props.editableCard.prevRoute === "/review-answer") {
               if (filteredCards[this.props.queue.index] === undefined) {
                  this.props.history.push("/review-empty");
               } else {
                  this.props.history.push("/review-imagery");
               }
            }
            if (this.props.editableCard.prevRoute === "/all-cards") {
               this.props.history.push("/all-cards");
            }
         })
         .catch((err) => {
            console.log(err.response.data);
            // TODO: Display error overlay
         });
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
                  <button
                     className={classnames(
                        "btn btn-primary btn-lg float-right",
                        {
                           disabled: this.checkHasInvalidCharCount(),
                        }
                     )}
                     onClick={() => this.saveCard()}
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
