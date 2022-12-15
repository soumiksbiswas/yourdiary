const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser'); // we need to access 'middleware' folder which is outside the scope of the current folder, so we use '../'

const JWT_SECRET = "ajbvahjajcbaahbcja";

// THIS IS OUR FIRST END-POINT, name of this end point is 'createuser'
// Route 1: Create a user using: POST "/api/auth/createuser". No login required

router.post(
  "/createuser",
  [
    // THE BELOW PART IS COPIED FROM "express validator" DOCUMENTATION

    //name must have at least 3 letters
    body("name", "Enter a valid name").isLength({ min: 3 }),
    // email must be valid
    body("email", "Enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body("password", "Password length must be atleast 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    console.log(req.body);

    // THE BELOW PART IS COPIED FROM "express validator" DOCUMENTATION

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() }); // if there is some error in our entry, report error
    }

    // now here we need to check whether user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email }); // this is a promise, so we use await
      if (user) {
        // if user is not null, i.e. if the email already exists
        return res
          .status(400)
          .json({ success, errors: "Sorry, a user with this email already exists!" });
      }

      const salt = await bcrypt.genSalt(10); // genSalt() and hash() return promises, so await must be used
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass, // we create a new variable- securedPass
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET); // this is a sync method, so 'await' not required

      success = true;
      // if someone sends this authToken, we will be able to get the 'data' and using 'JWT_SECRET', we will be able to know if anyone has tampered with the user id
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }

    // since we are using an async function, it does not make any sense to use '.then'
    // .then(user => res.json(user))
    // .catch(err=>{
    //     console.log(err);
    //     res.json({
    //         error:'Please enter a unique email',
    //         message: err.message
    //     });
    // });
  }
);

// THIS IS OUR SECOND END-POINT, name of the end point is 'login'
// Route 2: Authenticate a user using: POST "/api/auth/login". No login required

router.post(
  "/login",
  [
    // email must be valid
    body("email", "Enter a valid email").isEmail(), // if the email is not valid, we will not proceed further anymore
    // password cannot be blank
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    let success =false;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // if there is some error in our entry, report error
    }

    const { email, password } = req.body; // destructuring
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password); // returns true/false, this is a promise, so use await
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "Please try to login with correct credentials" });
      }

      // Now if the credentials entered are correct, then we need to return payload

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET); // this is a sync method, so 'await' not required

      // if someone sends this authToken, we will be able to get the 'data' and using 'JWT_SECRET', we will be able to know if anyone has tampered with the user id
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error!");
    }
  }
);

// THIS IS OUR THIRD END-POINT, name of the end point is 'getuser'
// Route 3: Authenticate a user using: POST "/api/auth/getuser". Login required

// here, we will receive the authToken, and now, we somehow need to extract the userId from the authToken (since we have passed the userId in the jwt.sign() function. But, if we write the function to get the username here itself, we will have to write it again and again at every place we need authentication, so we rather create a middleware, that we will fetch again and again every time we need authentication)
router.post("/getuser", fetchuser, async (req, res) => { 
  
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
});
module.exports = router;
