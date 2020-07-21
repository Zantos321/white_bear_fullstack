// The memory-cards resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectAllCards = require("../../queries/selectAllCards");
const validateJwt = require("../../utils/validateJwt");
const insertMemoryCard = require("../../queries/insertMemoryCard");
const updateMemoryCard = require("../../queries/updateMemoryCard");
const deleteMemoryCardById = require("../../queries/deleteMemoryCardById");

// @route       GET api/v1/memory-cards
// @desc        Get all memory cards for a user by search term and order
// @access      Private
router.get("/", validateJwt, (req, res) => {
   console.log(req.query);
   const { searchTerm, order } = req.query;
   const userId = req.user.id;
   let constructedSearchTerm;
   if (searchTerm === "" || searchTerm === undefined) {
      constructedSearchTerm = "%%";
   } else {
      constructedSearchTerm = `%${searchTerm}%`;
   }
   db.query(selectAllCards, [
      userId,
      constructedSearchTerm,
      constructedSearchTerm,
      { toSqlString: () => order },
   ])
      .then((memoryCards) => {
         const camelCaseMemoryCards = memoryCards.map((memoryCard) => {
            return {
               id: memoryCard.id,
               imagery: memoryCard.imagery,
               answer: memoryCard.answer,
               userId: memoryCard.user_id,
               createdAt: memoryCard.created_at,
               nextAttemptAt: memoryCard.next_attempt_at,
               lastAttemptAt: memoryCard.last_attempt_at,
               totalSuccessfulAttempts: memoryCard.total_successful_attempts,
               level: memoryCard.level,
            };
         });
         return res.json(camelCaseMemoryCards);
      })
      .catch((err) => {
         console.log(err);
         return res.status(400).json(err);
      });
});

// @route       POST api/v1/memory-cards
// @desc        POST a memory card to the memory cards resource
// @access      Private
router.post("/", validateJwt, (req, res) => {
   const user = req.user;
   const {
      id,
      imagery,
      answer,
      createdAt,
      nextAttemptAt,
      lastAttemptAt,
      totalSuccessfulAttempts,
      level,
   } = req.body;
   const memoryCard = {
      id,
      imagery,
      answer,
      user_id: user.id,
      created_at: createdAt,
      next_attempt_at: nextAttemptAt,
      last_attempt_at: lastAttemptAt,
      total_successful_attempts: totalSuccessfulAttempts,
      level,
   };
   console.log(memoryCard);

   db.query(insertMemoryCard, memoryCard)
      .then((dbRes) => {
         //success
         console.log("Created memory card in the db", dbRes);
         //return with a status response
         return res.status(200).json({ success: "card created" });
      })
      .catch((err) => {
         //error
         console.log(err);
         // return with an error response
         const dbError = `${err.code} ${err.sqlMessage}`;
         return res.status(400).json({ dbError });
      });
});

// @route       PUT api/v1/memory-cards/:id
// @desc        UPDATE a memory card to the memory cards resource
// @access      Private
router.put("/:id", validateJwt, (req, res) => {
   const id = req.params.id;
   const user = req.user;
   const {
      imagery,
      answer,
      createdAt,
      nextAttemptAt,
      lastAttemptAt,
      totalSuccessfulAttempts,
      level,
   } = req.body;
   const memoryCard = {
      id,
      imagery,
      answer,
      user_id: user.id,
      created_at: createdAt,
      next_attempt_at: nextAttemptAt,
      last_attempt_at: lastAttemptAt,
      total_successful_attempts: totalSuccessfulAttempts,
      level,
   };
   console.log(memoryCard);
   db.query(updateMemoryCard, [memoryCard, id])
      .then((dbRes) => {
         //success
         console.log("Updated memory card in the db", dbRes);
         //return with a status response
         return res.status(200).json({ success: "card updated" });
      })
      .catch((err) => {
         //error
         console.log(err);
         // return with an error response
         const dbError = `${err.code} ${err.sqlMessage}`;
         return res.status(400).json({ dbError });
      });
});

// @route       DELETE api/v1/memory-cards/:id
// @desc        Delete a memory card to the memory cards resource by id
// @access      Private
router.delete("/:id", validateJwt, (req, res) => {
   const id = req.params.id;
   db.query(deleteMemoryCardById, id)
      .then(() => {
         return res.status(200).json({ success: "card deleted" });
      })
      .catch((err) => {
         console.log(err);
         const dbError = `${err.code} ${err.sqlMessage}`;
         return res.status(500).json({ dbError });
      });
});
module.exports = router;
