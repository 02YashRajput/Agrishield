import { Avatar, IconButton } from '@mui/material';
import React, { useState } from 'react'

interface ProfileAvatarProps {
  src: string | undefined,
  isEditable: boolean
}

const ProfileAvatar :React.FC<ProfileAvatarProps>= ({src,isEditable}) => {
  const [avatarSrc, setAvatarSrc] = useState<string>(
    src || "/assets/img/defaultProfile.jpg"
  );
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <label htmlFor="avatar-input">
    <input
      id="avatar-input"
      type="file"
      accept="image/*"
      disabled={!isEditable}
      style={{ display: "none" }}
      onChange={handleFileChange}
    />
    <IconButton component="span" disabled={!isEditable}>
      <Avatar
        src={avatarSrc}
        alt={"profile Image"}
        sx={{
          width: "7rem",
          height: "7rem",
          border: isEditable ? "3px solid #1976d2" : "none", // Blue ring when editable
          boxShadow: isEditable
            ? "0 0 10px rgba(25, 118, 210, 0.6)"
            : "none", // Glow effect when editable
          transition: "all 0.3s ease", // Smooth transition when isEditable changes
        }}
      />
    </IconButton>
  </label>

  )
}

export default ProfileAvatar