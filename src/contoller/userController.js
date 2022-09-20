const userModel = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

const createUser = async function (req, res) {
  try {
    let data = req.body;

    const userData = await userModel.create(data);
    res.status(201).send({ status: true, message: userData });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
/*------------------------------------------------------------------------------------------------------------------------------------*/
const loginUser = async function (req, res) {
  try {
    data = req.body;
    let userName = data.email;
    let password = data.password;

    //if give nothing inside req.body
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide email & password to login.",
        });
    }
    if (Object.keys(data).length > 2) {
      return res
        .status(400)
        .send({ status: false, message: "Only email & password is required." });
    }
    //---------------------------------------------//
    //if no Email inside req.
    if (!userName) {
      return res
        .status(400)
        .send({ status: false, message: "please provide an Email !" });
    }
    //if no password inside req.body
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "please enter password !" });
    }
    //-------------------------------------//

    //if not user
    let user = await userModel.findOne({ email: userName });
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "username is not corerct" });
    }
    //if password not correct
    let pass = await userModel.findOne({ password: password });
    if (!pass) {
      return res
        .status(400)
        .send({ status: false, message: "password is not corerct" });
    }
    //---------------------//
    //success creation starting

    let token = jwt.sign(
      {
        userId: user._id.toString(),
        batch: "project3",
        organisation: "group37",
      },
      "functionup-plutonium",
      { expiresIn: "24h" }
    );

    res.status(200).send({ status: true, message: "Success", data: token });
  } catch (err) {
    res.status(500).send({ message: "server error", error: err });
  }
};

module.exports = { createUser, loginUser };