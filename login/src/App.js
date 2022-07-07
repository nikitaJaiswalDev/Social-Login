import { useEffect, useState } from 'react';
import linkedin from './images/in.png';
import Google from './images/google.png';
import Twitter from './images/twiiter.png';
import Facebook from './images/facebook.jpg';
import axios from 'axios';
import './App.css'
import { LoginSocialGoogle, LoginSocialTwitter, LoginSocialFacebook} from 'reactjs-social-login';

const CLIENT_ID = '*',
REDIRECT_URL = '*', 
OAUTH_URL = '*',
SCOPE = '*',
STATE = '*',
GOOGLE_CLIENT_ID = '*';

function App() {
  
  const [provider, setProvider] = useState('');

  const getCodeFromWindowURL = url => {
    const popupWindowURL = new URL(url);
    return popupWindowURL.searchParams.get("code");
  };

  const handlePostMessage = event => {
    if (event.data.type === 'code') {
      getUserCredentials(event.data.code);
    }
  };

  const  getUserCredentials = code => {
    axios
      .get(`http://localhost:5000/getUserCredentials?code=${code}`)
      .then(res => {
        setProvider(res.data.userProfile.localizedFirstName + " " + res.data.userProfile.localizedLastName)
      });
  };

  const showPopup = () => {
    const oauthUrl = `${OAUTH_URL}&client_id=${CLIENT_ID}&scope=${SCOPE}&state=${STATE}&redirect_uri=${REDIRECT_URL}`;

    const width = 450,
      height = 730,
      left = window.screen.width / 2 - width / 2,
      top = window.screen.height / 2 - height / 2;
      window.open(
        oauthUrl,
        'Linkedin',
        'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left
      );
  };

  useEffect(() => {
    console.log('window.opener',  window.opener !== window);
    if (window.opener && window.opener !== window) {
      const code = getCodeFromWindowURL(window.location.href);
      window.opener.postMessage({'type': 'code', 'code': code}, 'http://localhost:3000')
      window.close();
    }
    window.addEventListener('message', handlePostMessage);
}, [provider])

  return (
    <div className="App">
      <h1 onClick={()=> console.log(provider)}>Social Login</h1>
      {provider ===  '' ? 
        <div className='social-login'>
          <div className="linkedin">
            <img onClick={showPopup } src={linkedin} alt="Linkedin"/>
          </div>
          <div className="google">
            <LoginSocialGoogle
                client_id={GOOGLE_CLIENT_ID}
                onResolve={( (provider) => {
                  console.log('provider', provider);
                  setProvider(provider.data.given_name + " " + provider.data.family_name)
                })}
            >
                <img src={Google} alt="google"/>
            </LoginSocialGoogle>
          </div>
        </div>
        : 
        <h1>{provider}</h1>
      }
    </div>
  );
}

export default App;
