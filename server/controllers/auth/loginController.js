const User = require("../../model/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
  try {
    const { email, password, oauth } = req.body;
    if (!email) return res.status(401).json({ message: "Invalid Login" });
    const foundUser = await User.findOne({ email: email });
    if (!foundUser || foundUser.oauth != oauth)
      return res.status(401).json({ message: "Credentials does not match" }); //unauthorized

    const match = oauth || (await bcrypt.compare(password, foundUser.password));
    if (match) {
      const accessToken = jwt.sign(
        {
          email: foundUser.email,
          id: foundUser.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        {
          email: foundUser.email,
          id: foundUser.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" }
      );

      await User.updateOne(
        { _id: foundUser["_id"] },
        { refreshToken: refreshToken },
        { runValidators: true }
      );

      res.cookie("jwt", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
      const loginData = {
        accessToken,
        name: foundUser.name,
        email: foundUser.email,
        id: foundUser.id,
      };
      console.log(loginData);
      res.json(loginData);
    } else {
      res.status(401).json({ message: "Credentials does not match" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

module.exports = handleLogin;
