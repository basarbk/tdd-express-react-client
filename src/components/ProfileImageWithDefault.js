import React from 'react';
import defaultPicture from '../assets/profile.png';

const ProfileImageWithDefault = props => {
  const { image, tempimage } = props;

  let imageSource = defaultPicture;
  if (image) {
    if(image.length > 64) {// base64 
      imageSource = 'data:image/png;base64,' + image;
    } else {
      imageSource = 'images/' + image;
    }
  }
  return (
    <img
      alt={`Profile`}
      src={tempimage || imageSource}
      {...props}
      onError={event => {
        // event.target.src = defaultPicture;
      }}
    />
  );
};

export default ProfileImageWithDefault;
