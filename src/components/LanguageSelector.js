import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../api/apiCalls';
import axios from 'axios';

const LanguageSelector = props => {

  const [supportedLanguages, setSupportedLanguages] = useState([]);

  useEffect(() => {
    axios.get('/locales/supported-languages.json').then(res => {
      setSupportedLanguages(res.data);
    }).catch(err => {
    })
  }, [])

  const { i18n } = useTranslation();

  const onChangeLanguage = language => {
    i18n.changeLanguage(language);
    changeLanguage(language);
  };

  return (
    <div className="container">
      {supportedLanguages.map(lang => {
        return <img key={lang.language} src={lang.flag} alt="flag" onClick={() => onChangeLanguage(lang.language)} style={{ cursor: 'pointer' }}/>
      })}
      {/* <img
        src="https://www.countryflags.io/tr/flat/24.png"
        alt="Turkish Flag"
        onClick={() => onChangeLanguage('tr')}
        style={{ cursor: 'pointer' }}
      ></img>
      <img src="https://www.countryflags.io/us/flat/24.png" alt="USA Flag" onClick={() => onChangeLanguage('en')} style={{ cursor: 'pointer' }}></img> */}
    </div>
  );
};

export default LanguageSelector;
