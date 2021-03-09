import React, { useState, useEffect, useRef } from "react";
import Input from "../components/Input";
import { useTranslation } from "react-i18next";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { useApiProgress } from "../shared/ApiProgress";
import { putPassword } from "../api/apiCalls";

const PasswordResetPage = (props) => {
  const [form, setForm] = useState({
    password: null,
    passwordRepeat: null,
  });
  const [errors, setErrors] = useState({});
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  
  let redirectTimer = useRef();

  useEffect(() => {
    if(passwordUpdated) {
       redirectTimer.current = setTimeout(() => {
        props.history.push("/login");
      }, 5000);
    }
    return function cleanup() {
      clearTimeout(redirectTimer.current);
    }
  }, [passwordUpdated, props.history])

  useEffect(() => {
    if (!props.location.search) {
      props.history.push("/password-reset-request");
    }
  }, [props.location.search, props.history]);

  const onChange = (event) => {
    const { name, value } = event.target;

    setErrors((previousErrors) => ({ ...previousErrors, [name]: undefined }));
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  };

  const onClick = async (event) => {
    event.preventDefault();

    const { password } = form;

    const token = props.location.search.substring(7);

    const body = {
      password,
      passwordResetToken: token,
    };
    setErrors({});

    try {
      await putPassword(body);
      setPasswordUpdated(true);
    } catch (error) {
      const errorStatus = error.response.status;
      if (errorStatus === 400) {
        // validation
        setErrors(error.response.data.validationErrors);
      } else {
        console.log(error);
      }
    }
  };

  const pendingApiCall = useApiProgress("put", "/api/1.0/user/password", true);

  const { t } = useTranslation();

  if (passwordUpdated) {
    return (
      <div className="container">
        <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 card p-0 mt-5">
          <div className="alert alert-success text-center m-0">
            <div>
              <i className="material-icons" style={{ fontSize: "48px" }}>
                done_outline
              </i>
            </div>
            <span>
              {t(
                "Your password is updated. Page will be redirected to Login Page"
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const { password: passwordError } = errors;

  let passwordRepeatError;
  if (form.password !== form.passwordRepeat) {
    passwordRepeatError = t("Password mismatch");
  }
  return (
    <div className="container">
      <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 card p-0 mt-5">
        <h3 className="text-center card-header">{t("Set New Password")}</h3>
        <div className="card-body">
          <form>
            <Input
              name="password"
              label={t("Password")}
              error={passwordError}
              onChange={onChange}
              type="password"
            />
            <Input
              name="passwordRepeat"
              label={t("Password Repeat")}
              error={passwordRepeatError}
              onChange={onChange}
              type="password"
            />
            <div className="text-center">
              <ButtonWithProgress
                onClick={onClick}
                disabled={pendingApiCall || passwordRepeatError !== undefined}
                pendingApiCall={pendingApiCall}
                text={t("Set Password")}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
