// The users resource
require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../../db");
const insertUser = require("../../queries/insertUser");
const selectUserById = require("../../queries/selectUserById");
const selectUserByEmail = require("../../queries/selectUserByEmail");
const { toHash } = require("../../utils/helpers");
const getSignUpEmailError = require("../../validation/getSignUpEmailError");
const getSignUpPasswordError = require("../../validation/getSignUpPasswordError");
const getLoginEmailError = require("../../validation/getLoginEmailError");
const getLoginPasswordError = require("../../validation/getLoginPasswordError");
const jwt = require("jsonwebtoken");

// @route       POST api/v1/users
// @desc        Create a new user
// @access      Public
router.post("/", async (req, res) => {
   const { id, email, password, createdAt } = req.body;
   const emailError = await getSignUpEmailError(email);
   const passwordError = getSignUpPasswordError(password, email);
   let dbError = "";
   if (emailError === "" && passwordError === "") {
      const user = {
         id,
         email,
         password: await toHash(password),
         created_at: createdAt,
      };

      db.query(insertUser, user)
         .then(() => {
            db.query(selectUserById, id)
               .then((users) => {
                  const user = users[0];
                  res.status(200).json({
                     id: user.id,
                     email: user.email,
                     createdAt: user.created_at,
                  });
               })
               .catch((err) => {
                  console.log(err);
                  dbError = `${err.code} ${err.sqlMessage}`;
                  res.status(400).json({ dbError });
               });
         })
         .catch((err) => {
            console.log(err);
            dbError = `${err.code} ${err.sqlMessage}`;
            res.status(400).json({ dbError });
         });
   } else {
      res.status(400).json({ emailError, passwordError });
   }
});

// @route       POST api/v1/users/auth
// @desc        Check this user againtst the db via email and password
// @access      Public
router.post("/auth", async (req, res) => {
   const { email, password } = req.body;
   const emailError = getLoginEmailError(email);
   const passwordError = await getLoginPasswordError(password, email);
   let dbError = "";
   if (emailError === "" && passwordError === "") {
      // return the user to the client
      db.query(selectUserByEmail, email)
         .then((users) => {
            // TODO: repeat when creating a user
            const user = {
               id: users[0].id,
               email: users[0].email,
               createdAt: users[0].created_at,
            };
            const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
               expiresIn: "100m",
            });

            res.status(200).json(accessToken);
         })
         .catch((err) => {
            console.log(err);
            dbError = `${err.code} ${err.sqlMessage}`;
            res.status(400).json({ dbError });
         });
   } else {
      // return a 400 status to the client
      res.status(400).json({ emailError, passwordError });
   }
});

module.exports = router;
