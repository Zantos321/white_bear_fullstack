// The memory-cards resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectAllCards = require("../../queries/selectAllCards");

// @route       GET api/v1/memory-cards
// @desc        Get all memory cards for a user by search term and order
// @access      Public
router.get("/", (req, res) => {
   console.log(req.query);
   const { userId, searchTerm } = req.query;
   db.query(
      selectAllCards(userId, searchTerm, "`memory_cards`.`created_at` DESC")
   )
      .then((dbRes) => {
         res.json(dbRes);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
