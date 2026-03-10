
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");


router.post("/", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectUrl = "http://localhost:8080/oauth";
  const oauth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
});

// Function to fetch user data from Google
// async function getUserDataByGoogle(access_token) {
//   const response = await fetch(
//     `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
//   );
//   const data = await response.json();
//   console.log(data)
//   return data;
// }
async function getUserDataByGoogle(oauth2Client) {
  const googleResource = await oauth2Client.request({
    url: 'https://www.googleapis.com/oauth2/v3/userinfo',
  });
  return googleResource.data;
}
// Route to handle OAuth callback
router.get("/", async function (req, res, next) {
  try {
    // Extract the authorization code from query parameters
    const code = req.query.code;
    if(!code){
      return res.redirect(`http://localhost:3000/login`);
    }
    const redirectUrl = "http://localhost:8080/oauth";
    const oauth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );

 
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // const data = await getUserDataByGoogle(tokens.access_token);
	const data = await getUserDataByGoogle(oauth2Client);
    let user = await userModel.findOne({ email: data.email });
    if (!user) {
      const password = await bcrypt.hash(data.email + process.env.TOKEN_SECRET_KEY, 10);
      user = new userModel({
        name: data.name,
        profilePic: data.picture,
        role: "GENERAL",
        email: data.email,
        password: password,
        refreshToken: null,
        isGoogleLink: true,
      });
      await user.save();
    }else {
      // If user exists, update profilePic and set isGoogle to true
      user.profilePic = data.picture;
      user.isGoogleLink = true;
      await user.save();
    }


    const tokenData = {
      _id: user._id,
      email: user.email,
    };

    const accessToken = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '24h' });
    const refreshToken = jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    const accessTokenOption = {
      httpOnly: true,
      secure: true,
    };

    res.cookie("accessToken", accessToken, accessTokenOption);

    res.redirect(`http://localhost:3000`);

  } catch (e) {
    
    console.log("Error with sign in with Google ", e);

    
    res.status(500).send("Authentication failed");
  }
});

module.exports = router;

