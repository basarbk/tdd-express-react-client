import React, { useState, useEffect } from "react";
import { requestReset } from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { useTranslation } from "react-i18next";

const PasswordResetPage = (props) => {
  const [email, setEmail] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [validationErr, setValidationErr] = useState({});
  const [successMessage, setSuccessMessage] = useState();

  useEffect(() => {
    setErrorMessage();
    setValidationErr({})
  }, [email])
  
  const { t } = useTranslation();

  const pendingApiCall = useApiProgress(
    "post",
    "/api/1.0/user/password",
    true
  );

  const onClickReset = async (e) => {
    e.preventDefault();
    setErrorMessage();
    requestReset(email).then(r => {
      setSuccessMessage(r.data.message);
    }).catch(e => {
      setErrorMessage(e.response.data.message);
      if(e.response.status === 400) {
        setValidationErr(e.response.data.validationErrors);
      }
    })
  };

  if(successMessage) {
    return (
    <div className="container">
      <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 card p-0 mt-5">
        <div className="alert alert-success text-center m-0">
          <div>
            <i className="material-icons" style={{ fontSize: '48px' }}>
              done_outline
            </i>
          </div>
          <span>{successMessage}</span>
        </div>
      </div>
    </div>
    )
  }

  let message;
  if(errorMessage && !validationErr.email){
    message = (
      <div className="alert alert-danger text-center mt-3 mb-0">
      <div>
        <i className="material-icons" style={{ fontSize: '48px' }}>
          error
        </i>
      </div>
      {errorMessage}
    </div>
    )
  }

  return (
    <div className="container">
      <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 card p-0 mt-5">
        <h3 className="text-center card-header">{t('Reset your password')}</h3>
        <div className="card-body">
          <form>
            <Input label={t('E-Mail')} onChange={e => setEmail(e.target.value)} error={validationErr.email} />
            <div className="text-center">
              <ButtonWithProgress text={t('Reset')} onClick={onClickReset} disabled={pendingApiCall} pendingApiCall={pendingApiCall}/>
            </div>
          </form>
          {message && message}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
