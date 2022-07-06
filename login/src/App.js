import { useEffect, useState } from 'react';
import linkedin from './images/in.png';
import Google from './images/google.png';
import Twitter from './images/twiiter.png';
import Facebook from './images/facebook.jpg';
import axios from 'axios';
import './App.css'
import { LoginSocialGoogle, LoginSocialTwitter, LoginSocialFacebook} from 'reactjs-social-login';
const CLIENT_ID = '771uzz96w5lajg';
const REDIRECT_URL = 'http://localhost:3000';
const OAUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code';
const SCOPE = 'r_liteprofile%20r_emailaddress';
const STATE = '123456';

function App() {
  
  const [providet, setProvider] = useState('');

  const getCodeFromWindowURL = url => {
    const popupWindowURL = new URL(url);
    return popupWindowURL.searchParams.get("code");
  };

  const handlePostMessage = event => {
    if (event.data.type === 'code') {
      const { code } = event.data;
      getUserCredentials(event.data.code);
    }
  };

  const  getUserCredentials = code => {
    axios
      .get(`http://localhost:5000/getUserCredentials?code=${code}`)
      .then(res => {
        const user = res.data;
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
      console.log('code', code);
      window.opener.postMessage({'type': 'code', 'code': code}, 'http://localhost:3000')
      window.close();
    }
    window.addEventListener('message', handlePostMessage);
}, [])

  return (
    <div className="App">
      <div className="linkedin">
        <img onClick={showPopup } src={linkedin} alt="Linkedin"/>
      </div>
      <div className="google">
        <LoginSocialGoogle
            client_id={"79390217356-d6fku2ggv0vk1cgit3rmp8sdebsi1j5b.apps.googleusercontent.com"}
            onResolve={( (provider) => {
              console.log('provider', provider);
              setProvider(provider)
            })}
        >
            <img src={Google} alt="google"/>
        </LoginSocialGoogle>
      </div>
      <div className="twitter">
        <LoginSocialTwitter
            client_id={'eTY2R0FaQ0oxNVZZRlpRSW1ZR0I6MTpjaQ'}
            client_secret={'uKYYzLup3mmSAstvF4lC2MeX7sIepytTmcBDbynXTN86GpSAzP'}
            redirect_uri={"http://localhost:3000/"}
            onResolve={(provider)=> {
              setProvider(provider)
            }}
          >
            <img src={Twitter} alt="twiiter"/>
        </LoginSocialTwitter>
      </div>
      <div className='facebook'>
        <LoginSocialFacebook 
          appId='1432856887142206'
          onResolve={( provider ) => {
            console.log('provider', provider);
            setProvider(provider)
          }}>
          <img src={Facebook} alt="facebook"/>
        </LoginSocialFacebook>
      </div>
    </div>
  );
}

export default App;
