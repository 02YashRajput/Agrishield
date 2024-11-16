import React from 'react';
import Avatar from '@mui/material/Avatar';

interface ProfileAvatarProps {
  profileImage: string | undefined;
}

const HeaderAvatar: React.FC<ProfileAvatarProps> = ({ profileImage }) => {
  const profileImg =  profileImage ||  "/assets/img/defaultProfile.jpg"

  return (
    <Avatar
      src={profileImg}
      alt="Profile Avatar"
      sx={{ width: 56, height: 56 }} // Adjust size as needed
    />
  );
};

export default HeaderAvatar;
