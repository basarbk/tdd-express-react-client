import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useTranslation } from 'react-i18next';
import Input from './Input';
import { updateUser, deleteUser } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress';
import { updateSuccess, logoutSuccess } from '../redux/authActions';
import Modal from './Modal';

const ProfileCard = props => {
  const [inEditMode, setInEditMode] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState();
  const { id: loggedInUserId } = useSelector(store => ({ id: store.id }));
  const { userid } = useParams();
  const [user, setUser] = useState({});
  const [editable, setEditable] = useState(false);
  const [newImage, setNewImage] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    setEditable(userid == loggedInUserId);
  }, [loggedInUserId, userid]);

  useEffect(() => {
    setValidationErrors(previousValidationErrors => ({
      ...previousValidationErrors,
      username: undefined
    }));
  }, [updatedUsername]);

  useEffect(() => {
    setValidationErrors(previousValidationErrors => ({
      ...previousValidationErrors,
      image: undefined
    }));
  }, [newImage]);

  const { id, username, image } = user;

  const pendingApiCallDeleteUser = useApiProgress('delete', `/api/1.0/users/${id}`, true);

  const { t } = useTranslation();

  useEffect(() => {
    if (!inEditMode) {
      setUpdatedUsername(undefined);
      setNewImage(undefined);
    } else {
      setUpdatedUsername(username);
    }
  }, [inEditMode, username]);

  const onClickSave = async () => {
    let image;
    if (newImage) {
      image = newImage.split(',')[1];
    }

    const body = {
      username: updatedUsername,
      image
    };
    try {
      const response = await updateUser(userid, body);
      setInEditMode(false);
      if(response.data) {
        setUser(response.data);
        dispatch(updateSuccess(response.data));
      } else {
        const upToDate = {
          ...user,
          username: updatedUsername
        }
        setUser(upToDate)
        dispatch(updateSuccess(upToDate));
      }
    } catch (error) {
      if(error.response.status === 400) {
        setValidationErrors(error.response.data.validationErrors);
      } else {
        setValidationErrors({image: error.response.data.message})
      }
    }
  };

  const onChangeFile = event => {
    if (event.target.files.length < 1) {
      return;
    }
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setNewImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const onClickCancel = () => {
    setModalVisible(false);
  };

  const onClickDeleteUser = async () => {
    await deleteUser(id);
    setModalVisible(false);
    dispatch(logoutSuccess());
    history.push('/');
  };
  const pendingApiCall = useApiProgress('put', '/api/1.0/users/' + userid);

  const { username: usernameError, image: imageError } = validationErrors;

  return (
    <div className="card text-center">
      <div className="card-header">
        <ProfileImageWithDefault
          className="rounded-circle shadow"
          width="200"
          height="200"
          alt={`${username} profile`}
          image={image}
          tempimage={newImage}
        />
      </div>
      <div className="card-body">
        {!inEditMode && (
          <>
            <h3>
              {username}
            </h3>
            {editable && (
              <>
                <button className="btn btn-success d-inline-flex" onClick={() => setInEditMode(true)}>
                  <i className="material-icons">edit</i>
                  {t('Edit')}
                </button>
                <div className="pt-2">
                  <button className="btn btn-danger d-inline-flex" onClick={() => setModalVisible(true)}>
                    <i className="material-icons">directions_run</i>
                    {t('Delete My Account')}
                  </button>
                </div>
              </>
            )}
          </>
        )}
        {inEditMode && (
          <div>
            <Input
              label={t('Change Username')}
              defaultValue={username}
              onChange={event => {
                setUpdatedUsername(event.target.value);
              }}
              error={usernameError}
            />
            <Input type="file" onChange={onChangeFile} error={imageError} />
            <div>
              <ButtonWithProgress
                className="btn btn-primary d-inline-flex"
                onClick={onClickSave}
                disabled={pendingApiCall}
                pendingApiCall={pendingApiCall}
                text={
                  <>
                    <i className="material-icons">save</i>
                    {t('Save')}
                  </>
                }
              />
              <button className="btn btn-light d-inline-flex ml-1" onClick={() => setInEditMode(false)} disabled={pendingApiCall}>
                <i className="material-icons">close</i>
                {t('Cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal
        visible={modalVisible}
        title={t('Delete My Account')}
        okButton={t('Delete My Account')}
        onClickCancel={onClickCancel}
        onClickOk={onClickDeleteUser}
        message={t('Are you sure to delete your account?')}
        pendingApiCall={pendingApiCallDeleteUser}
      />
    </div>
  );
};

export default ProfileCard;
