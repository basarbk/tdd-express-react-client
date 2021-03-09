import React, { useState, useEffect } from 'react';
import { getHoaxes, getOldHoaxes, getNewHoaxes } from '../api/apiCalls';
import { useTranslation } from 'react-i18next';
import HoaxView from './HoaxView';
import { useApiProgress } from '../shared/ApiProgress';
import Spinner from './Spinner';
import { useParams } from 'react-router-dom';

const HoaxFeed = () => {
  const [hoaxPage, setHoaxPage] = useState({ content: [], last: true, number: 0 });
  const [newHoaxCount, setNewHoaxCount] = useState(0);
  const { t } = useTranslation();
  const { userid } = useParams();

  const path = userid ? `/api/1.0/users/${userid}/hoaxes?page=` : '/api/1.0/hoaxes?page=';
  const initialHoaxLoadProgress = useApiProgress('get', path);

  let lastHoaxId = 0;
  let firstHoaxId = 0;
  if (hoaxPage.content.length > 0) {
    firstHoaxId = hoaxPage.content[0].id;

    const lastHoaxIndex = hoaxPage.content.length - 1;
    lastHoaxId = hoaxPage.content[lastHoaxIndex].id;
  }
  const oldHoaxPath = userid ? `/api/1.0/users/${userid}/hoaxes/${lastHoaxId}` : `/api/1.0/hoaxes/${lastHoaxId}`;
  const loadOldHoaxesProgress = useApiProgress('get', oldHoaxPath, true);

  const newHoaxPath = userid
    ? `/api/1.0/users/${userid}/hoaxes/${firstHoaxId}?direction=after`
    : `/api/1.0/hoaxes/${firstHoaxId}?direction=after`;

  const loadNewHoaxesProgress = useApiProgress('get', newHoaxPath, true);

  useEffect(() => {
    const loadHoaxes = async page => {
      try {
        const response = await getHoaxes(userid, page);
        setHoaxPage(previousHoaxPage => ({
          ...response.data,
          content: [...previousHoaxPage.content, ...response.data.content]
        }));
      } catch (error) {}
    };
    loadHoaxes();
  }, [userid]);

  const loadOldHoaxes = async () => {
    const response = await getOldHoaxes(lastHoaxId, userid);
    setHoaxPage(previousHoaxPage => ({
      ...response.data,
      content: [...previousHoaxPage.content, ...response.data.content]
    }));
  };

  const loadNewHoaxes = async () => {
    const response = await getNewHoaxes(firstHoaxId, userid);
    setHoaxPage(previousHoaxPage => ({
      ...previousHoaxPage,
      content: [...response.data, ...previousHoaxPage.content]
    }));
    setNewHoaxCount(0);
  };

  const onDeleteHoaxSuccess = id => {
    setHoaxPage(previousHoaxPage => ({
      ...previousHoaxPage,
      content: previousHoaxPage.content.filter(hoax => hoax.id !== id)
    }));
  };

  const { content, page, totalPages } = hoaxPage;

  const last = page === totalPages - 1;

  if (content.length === 0) {
    return <div className="alert alert-secondary text-center">{initialHoaxLoadProgress ? <Spinner /> : t('There are no hoaxes')}</div>;
  }

  return (
    <div>
      {newHoaxCount > 0 && (
        <div
          className="alert alert-secondary text-center mb-1"
          style={{ cursor: loadNewHoaxesProgress ? 'not-allowed' : 'pointer' }}
          onClick={loadNewHoaxesProgress ? () => {} : loadNewHoaxes}
        >
          {loadNewHoaxesProgress ? <Spinner /> : t('There are new hoaxes')}
        </div>
      )}
      {content.map(hoax => {
        return <HoaxView key={hoax.id} hoax={hoax} onDeleteHoax={onDeleteHoaxSuccess} />;
      })}
      {!last && (
        <div
          className="alert alert-secondary text-center"
          style={{ cursor: loadOldHoaxesProgress ? 'not-allowed' : 'pointer' }}
          onClick={loadOldHoaxesProgress ? () => {} : loadOldHoaxes}
        >
          {loadOldHoaxesProgress ? <Spinner /> : t('Load old hoaxes')}
        </div>
      )}
    </div>
  );
};

export default HoaxFeed;
