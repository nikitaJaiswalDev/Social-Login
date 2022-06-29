const express = require('express');
const router = express.Router()
const { json, query } = require('express');
const qs = require('query-string');
const axios = require('axios');


router.get("/", (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});
//linked in
router.get('/getUserCredentials',async (req, res) => {
    const user = {};
    const code = req.query.code;
    const accessToken = await getAccessToken(code);
    // const userProfile = await getUserProfile(accessToken);
    // const userEmail = await getUserEmail(accessToken);
    res.status(200).json({ accessToken});
    // let resStatus = 400;
  
    // if(!(accessToken === null || userProfile === null || userEmail === null)) {
    //   user = userBuilder(userProfile, userEmail);
    //   resStatus = 200;
    // }
    // res.status(resStatus).json({ user });
})
  
  
  //get access token
  async function getAccessToken(code) {
    let accessToken = null;
    const parameters = {
      "grant_type": "authorization_code",
      "code": code,
      "redirect_uri": 'http://localhost:3000',
      "client_id": '771uzz96w5lajg',
      "client_secret": 'opyNwAyLi2uP3hyU',
    };
    const config = {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
       }
    };
  
    await axios.post('https://www.linkedin.com/oauth/v2/accessToken',qs.stringify(parameters), config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log('error', error);
      return null
    });
  }
  
  async function getUserProfile(accessToken) {
    let userProfile = null;
    const config = {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }
    await axios
      .get(urlToGetUserProfile, config)
      .then(response => {
        userProfile.firstName = response.data["localizedFirstName"];
        userProfile.lastName = response.data["localizedLastName"];
        userProfile.profileImageURL = response.data.profilePicture["displayImage~"].elements[0].identifiers[0].identifier;
        // I mean, couldn't they have burried it any deeper?
      })
      .catch(error => console.log("Error grabbing user profile"))
    return userProfile;
  }
  async function getUserEmail(accessToken) {
    const email = null;
    const config = {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    };
    await axios
      .get(urlToGetUserEmail, config)
      .then(response => {
        email = response.data.elements[0]["handle~"];
      })
      .catch(error => console.log("Error getting user email"))
  
    return email;
  }
  function userBuilder(userProfile, userEmail) {
    return {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      profileImageURL: userProfile.profileImageURL,
      email: userEmail
    }
  }

module.exports = router;