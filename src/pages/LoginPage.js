import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import { useTranslation } from 'react-i18next';
import ButtonWithProgress from '../components/ButtonWithProgress';
import { useApiProgress } from '../shared/ApiProgress';
import { useDispatch } from 'react-redux';
import { loginHandler } from '../redux/authActions';
import { activate } from '../api/apiCalls';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

const LoginPage = props => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [accountStatus, setAccountStatus] = useState('done') // active, failed
  const pendingApiCall = useApiProgress('post', '/api/1.0/auth');

  const dispatch = useDispatch();

  useEffect(() => {

    const sendActivation = async (token) => {
      try {
        await activate(token)
        setAccountStatus('active');
        setTimeout(() => {
          setAccountStatus('done');
        }, 5000)
      } catch (err) {
        setAccountStatus('failed')
      }
    }
    if(props.location.search){
      setAccountStatus('activating')
      sendActivation(props.location.search.substring(7));
    } else {
      setAccountStatus('done');
    }
  }, [props.location.search])

  useEffect(() => {
    setError(undefined);
  }, [email, password]);

  const onClickLogin = async event => {
    event.preventDefault();
    const creds = {
      email,
      password
    };

    const { history } = props;
    const { push } = history;

    setError(undefined);
    try {
      await dispatch(loginHandler(creds));
      push('/');
    } catch (apiError) {
      setError(apiError.response.data.message);
    }
  };

  const { t } = useTranslation();

  if(accountStatus === 'failed') {
    return (
    <div className="container">
      <div className="alert alert-danger text-center">
        <div>
          <i className="material-icons" style={{ fontSize: '48px' }}>
            error
          </i>
        </div>
        {t('Account activation failure')}
      </div>
    </div>
    )
  }

  let message;
  if(accountStatus === 'activating') {
    message = (
      <div className="alert alert-info text-center">
        <Spinner />
        <span>{t('Activation in progress')}</span>
      </div>
    )
  } else if (accountStatus === 'active'){
    message = (
      <div className="alert alert-success text-center">
        <div>
          <i className="material-icons" style={{ fontSize: '48px' }}>
            done_outline
          </i>
        </div>
        <span>{t('Your account is activated')}</span>
      </div>
    )
  }

  

  const buttonEnabled = email && password;

  return (
    <div className="container">
      {message && message}
      <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 card p-0 mt-5">
        <h1 className="text-center card-header">{t('Login')}</h1>
        <div className="card-body">
          <form>
            <Input label={t('E-Mail')} onChange={event => setEmail(event.target.value)} />
            <Input label={t('Password')} type="password" onChange={event => setPassword(event.target.value)} />
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="text-center">
              <ButtonWithProgress onClick={onClickLogin} disabled={!buttonEnabled || pendingApiCall} pendingApiCall={pendingApiCall} text={t('Login')} />
            </div>
          </form>
          <div className="text-center mt-3">
            <Link to="/password-reset-request" >{t('Forget password?')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
