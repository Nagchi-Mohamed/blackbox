import React, { useContext } from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { LanguageContext } from '../../contexts/LanguageContext';

const { Option } = Select;

export const LanguageSelector = () => {
  const { language, changeLanguage } = useContext(LanguageContext);
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' }
  ];

  return (
    <Select
      value={language}
      onChange={changeLanguage}
      style={{ width: 120 }}
      suffixIcon={<GlobalOutlined />}
    >
      {languages.map(lang => (
        <Option key={lang.code} value={lang.code}>
          {lang.name}
        </Option>
      ))}
    </Select>
  );
}; 