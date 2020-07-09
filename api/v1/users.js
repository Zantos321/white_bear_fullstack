// The users resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectUser = require("../../queries/selectUser");
const { toJson, toSafeParse, toHash } = require("../../utils/helpers");

// @route       GET api/v1/users
// @desc        Get a valid user based via email and password
// @access      Public
router.get("/", (req, res) => {
   db.query(selectUser("eljoe1985@gmail.com", "replace_me"))
      .then((dbRes) => {
         const user = toSafeParse(toJson(dbRes))[0];
         console.log(user);
         res.json(user);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

// @route       POST api/v1/users
// @desc        Create a new user
// @access      Public
router.post("/", (req, res) => {
   const user = req.body;
   const newPassword = toHash(user.password);
   user.password = newPassword;
   console.log(user);
});

module.exports = router;
