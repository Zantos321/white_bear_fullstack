import React from "react";
import saveIcon from "../../icons/save.svg";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";

export default class CreateImagery extends React.Component {
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
      } else {
         return false;
      }
   }

   setImageryText(e) {
      this.setState({ imageryText: e.target.value });
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
                     One morning, when Gregor Samsa woke from troubled dreams,
                     he found himself transformed in his bed into a horrible
                     vermin. He lay on his armour-like back, and if he lifted
                     his head a little he could see his brown belly, slightly
                     domed and divided by arches into stiff sections.
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
            <Link
               to="/review-imagery"
               className={classnames(
                  "btn btn-primary btn-lg float-right mb-4",
                  { disabled: this.checkHasInvalidCharCount() }
               )}
               id="save-imagery"
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
         </AppTemplate>
      );
   }
}
