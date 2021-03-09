import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import { getUser } from '../api/apiCalls';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApiProgress } from '../shared/ApiProgress';
import Spinner from '../components/Spinner';
import HoaxFeed from '../components/HoaxFeed';

const UserPage = () => {
  const [user, setUser] = useState({});
  const [notFound, setNotFound] = useState(false);

  const { userid } = useParams();

  const { t } = useTranslation();

  const pendingApiCall = useApiProgress('get', '/api/1.0/users/' + userid, true);

  useEffect(() => {
    setNotFound(false);
  }, [user]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setNotFound(false);
        const response = await getUser(userid);
        setUser(response.data);
      } catch (error) {
        setNotFound(true);
      }
    };
    loadUser();
  }, [userid]);

  if (notFound) {
    return (
      <div className="container">
        <div className="alert alert-danger text-center">
          <div>
            <i className="material-icons" style={{ fontSize: '48px' }}>
              error
            </i>
          </div>
          {t('User not found')}
        </div>
      </div>
    );
  }

  // eslint-disable-next-line eqeqeq
  if (pendingApiCall || user.id != userid) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <ProfileCard user={user} />
        </div>
        <div className="col">
          <HoaxFeed />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
