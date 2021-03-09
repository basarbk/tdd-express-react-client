import React, { useState } from 'react';
import Input from '../components/Input';
import { useTranslation } from 'react-i18next';
import ButtonWithProgress from '../components/ButtonWithProgress';
import { useApiProgress } from '../shared/ApiProgress';
import { signup } from '../api/apiCalls';
import { Link } from 'react-router-dom';

const UserSignupPage = (props) => {
  const [form, setForm] = useState({
    username: null,
    email: null,
    password: null,
    passwordRepeat: null,
  });
  const [errors, setErrors] = useState({});
  const [externalFailure, setExternalFailure] = useState(false);
  const [readyForActivation, setReadyForActivation] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;

    setErrors((previousErrors) => ({ ...previousErrors, [name]: undefined }));
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  };

  const { t } = useTranslation();

  const onClickSignup = async (event) => {
    event.preventDefault();

    const { username, email, password } = form;

    const body = {
      username,
      email,
      password,
    };
    setExternalFailure();
    setErrors({});

    try {
      await signup(body);
      setReadyForActivation(true);
    } catch (error) {
      const errorStatus = error.response.status;
      if(errorStatus === 400) { // validation
        setErrors(error.response.data.validationErrors);
      } else if (errorStatus === 502) {
        setExternalFailure(true);
      }
    }
  };

  const { username: usernameError, email: emailError, password: passwordError } = errors;
  const pendingApiCallSignup = useApiProgress('post', '/api/1.0/users');
  const pendingApiCallLogin = useApiProgress('post', '/api/1.0/auth');

  const pendingApiCall = pendingApiCallSignup || pendingApiCallLogin;

  let passwordRepeatError;
  if (form.password !== form.passwordRepeat) {
    passwordRepeatError = t('Password mismatch');
  }

  if (readyForActivation) {
    return (
      <div className="container">
        <div className="alert alert-success text-center">
          <div>
            <i className="material-icons" style={{ fontSize: '48px' }}>
              done_outline
            </i>
          </div>
          {t('Activation E-mail sent', {address: form.email})}
        </div>
      </div>
        )
  }

  return (
    <div className="container">
      <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 card p-0 mt-5">
        <h1 className="text-center card-header">{t('Sign Up')}</h1>
        <div className="card-body">
          <form>
            <Input name="username" label={t('Username')} error={usernameError} onChange={onChange} />
            <Input name="email" label={t('E-mail')} error={emailError} onChange={onChange} />
            <Input name="password" label={t('Password')} error={passwordError} onChange={onChange} type="password" />
            <Input name="passwordRepeat" label={t('Password Repeat')} error={passwordRepeatError} onChange={onChange} type="password" />
            {externalFailure && (
              <div className="alert alert-danger text-center">
                <div>
                  <i className="material-icons" style={{ fontSize: '48px' }}>
                    error
                  </i>
                </div>
                {t('E-mail verification failure')}
              </div>
            )}
            <div className="text-center">
              <ButtonWithProgress
                onClick={onClickSignup}
                disabled={pendingApiCall || passwordRepeatError !== undefined}
                pendingApiCall={pendingApiCall}
                text={t('Sign Up')}
              />
            </div>
          </form>
          <div className="text-center mt-3">
            <Link to="/login" >{t('Already have an account?')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignupPage;
