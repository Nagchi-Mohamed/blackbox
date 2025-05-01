import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ShareButton = ({ achievement }) => {
  const { t, i18n } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);

  const shareToSocial = (platform) => {
    const message = t('share.message', { achievement: achievement.name[i18n.language] });
    const url = window.location.href;
    
    switch(platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: achievement.name[i18n.language],
            text: message,
            url: url
          });
        }
    }
  };

  return (
    <div className="share-container">
      <button onClick={() => setShowOptions(!showOptions)} className="share-button">
        {t('share.button')}
      </button>
      {showOptions && (
        <div className="share-options">
          <button onClick={() => shareToSocial('twitter')}>Twitter</button>
          <button onClick={() => shareToSocial('facebook')}>Facebook</button>
          <button onClick={() => shareToSocial('native')}>{t('share.other')}</button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;