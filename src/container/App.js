import React, { useEffect, useState } from 'react';
import UserSignupPage from '../pages/UserSignupPage';
import LoginPage from '../pages/LoginPage';
import LanguageSelector from '../components/LanguageSelector';
import HomePage from '../pages/HomePage';
import UserPage from '../pages/UserPage';
import PasswordResetRequestPage from '../pages/PasswordResetRequestPage';
import PasswordResetPage from '../pages/PasswordResetPage';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useSelector, useDispatch } from 'react-redux';
import { loginHandler } from '../redux/authActions';
import Spinner from '../components/Spinner';

const App = () => {

  const dispatch = useDispatch();
  const { email, password, isLoggedIn, token } = useSelector(store => ({
    email: store.email,
    password: store.password,
    isLoggedIn: store.isLoggedIn,
    token: store.token
  }));

  const [validatingLogin, setValidatingLogin] = useState(true);


  useEffect(() => {
    if(isLoggedIn && token) {
      const creds = {
        email,
        password
      };
      dispatch(loginHandler(creds)).then(s => setValidatingLogin(false)).catch(c => setValidatingLogin(false));
    } else {
      setValidatingLogin(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(validatingLogin){
    return <Spinner />
  }

  return (
    <div>
      <Router>
        <TopBar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          {!isLoggedIn && <Route path="/login" component={LoginPage} />}
          <Route path="/signup" component={UserSignupPage} />
          <Route path="/user/:userid" component={UserPage} />
          <Route path="/password-reset-request" component={PasswordResetRequestPage} />
          <Route path="/password-reset" component={PasswordResetPage} />
          <Redirect to="/" />
        </Switch>
      </Router>
      <LanguageSelector />
    </div>
  );
};

export default App;
