const express = require('express');
const router = express.Router()
const { json, query } = require('express');
const qs = require('query-string');
const axios = require('axios');


router.get("/", (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});
//linked in
const urlToGetLinkedInAccessToken = 'https://www.linkedin.com/oauth/v2/accessToken';
const urlToGetUserProfile ='https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))'
const urlToGetUserEmail = 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))';


router.get('/getUserCredentials',async(req, res) => {

  const code = req.query.code;
  const accessToken = await getAccessToken(code);
  const userProfile = await getUserProfile(accessToken);
  const userEmail = await getUserEmail(accessToken);
  let resStatus = 400;
  if(!(accessToken === null || userProfile === null || userEmail === null)) {
    user = userBuilder(userProfile, userEmail);
    resStatus = 200;
  }
  // Here, you can implement your own login logic 
  // to authenticate new user or register him
  res.status(resStatus).json({ userProfile });
  
})
  
  
  //get access token
  async function getAccessToken(code) {

    var data = qs.stringify({
      'grant_type': 'authorization_code',
      'redirect_uri': 'http://localhost:3000',
      'client_id': '771uzz96w5lajg',
      'client_secret': 'opyNwAyLi2uP3hyU',
      'code':code
    });
    var config = {
      method: 'post',
      url: 'https://www.linkedin.com/oauth/v2/accessToken',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      data : data
    };
    
    return await axios(config)
    .then(function (response) {
      return response.data.access_token
    })
    .catch(function (error) {
      console.log(error);
      return error
    });
  }
  
  async function getUserProfile(accessToken) {

    var config = {
      method: 'get',
      url: urlToGetUserProfile,
      headers: { 
        'Authorization': 'Bearer '+accessToken
      }
    };
    
    return await axios(config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error;
    });
  }

  async function getUserEmail(accessToken) {
    var config = {
      method: 'get',
      url: urlToGetUserEmail,
      headers: { 
        'Authorization': 'Bearer ' + accessToken
      }
    };
    
    return await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
    
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