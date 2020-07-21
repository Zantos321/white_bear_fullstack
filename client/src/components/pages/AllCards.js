import React from "react";
import AppTemplate from "../ui/AppTemplate";
import MemoryCard from "../ui/MemoryCard";
import axios from "axios";

export default class AllCards extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         order: "memory_cards.created_at%20DESC",
         memoryCards: [],
         searchTerm: "",
      };
   }

   componentDidMount() {
      this.setMemoryCards();
   }

   setOrder(e) {
      const newOrder = e.target.value;
      this.setState({ order: newOrder }, () => {
         this.setMemoryCards();
      });
   }

   setSearchTerm() {
      const searchInput = document.getElementById("search-input").value;
      this.setState({ searchTerm: searchInput }, () => this.setMemoryCards());
   }

   setMemoryCards() {
      axios
         .get(
            `/api/v1/memory-cards?searchTerm=${this.state.searchTerm}&order=${this.state.order}`
         )
         .then((res) => {
            // handle success
            console.log(res.data);
            this.setState({
               memoryCards: res.data,
            });
         })
         .catch((error) => {
            // handle error
            console.log(error);
         });
   }

   hasNoCards() {
      if (this.state.memoryCards.length === 0) return true;
      else return false;
   }

   render() {
      return (
         <AppTemplate>
            <form className="row d-flex mt-5">
               <div className="form-group col-8">
                  <input
                     id="search-input"
                     className="form-control"
                     type="text"
                     placeholder="Search for a word"
                     aria-label="Search"
                  />
               </div>
               <div className="form-group d-inline col-4 float-left">
                  <button
                     id="allCardsSearchButton"
                     className="btn btn-primary btn-sm btn-block"
                     type="button"
                     onClick={() => this.setSearchTerm()}
                  >
                     Search
                  </button>
               </div>
            </form>
            <form className="row d-flex mt-4 mb-4">
               <div className="col-4 mt-2">
                  <span className="text-nowrap">
                     <p className="text-muted">Sort cards by</p>
                  </span>
               </div>
               <div className="form-group col-8">
                  <select
                     value={this.state.order}
                     className="form-control"
                     onChange={(e) => this.setOrder(e)}
                  >
                     <option value="memory_cards.created_at%20DESC">
                        Most Recent
                     </option>
                     <option value="memory_cards.created_at%20ASC">
                        Oldest
                     </option>
                     <option value="memory_cards.total_successful_attempts%20ASC,%20memory_cards.created_at%20ASC">
                        Hardest
                     </option>
                     <option value="memory_cards.total_successful_attempts%20DESC,%20memory_cards.created_at%20DESC">
                        Easiest
                     </option>
                  </select>
               </div>
            </form>
            {this.state.memoryCards.map((memoryCard) => {
               return <MemoryCard card={memoryCard} key={memoryCard.id} />;
            })}

            {this.hasNoCards() && (
               <p className="lead text-muted text-center">
                  You have zero cards. Please create a card and it will show up
                  here.
               </p>
            )}
         </AppTemplate>
      );
   }
}
