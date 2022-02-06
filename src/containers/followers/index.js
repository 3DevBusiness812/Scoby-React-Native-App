import React, {createContext, useState} from 'react';

export const defaultFollowersContext = {
  currentUserProfile: {id: null},
  setCurrentUserProfile: () => {},
  notifications: 0,
  setNotifications: () => {},
};

export const FollowersContext = createContext(defaultFollowersContext);

export default function FollowersProvider({children}) {
  const [currentUserProfile, setCurrentUserProfile] = useState(defaultFollowersContext.currentUserProfile);
  const [notifications, setNotifications] = useState(defaultFollowersContext.notifications);
  return (
    <FollowersContext.Provider value={{currentUserProfile, setCurrentUserProfile, notifications, setNotifications}}>
      {children}
    </FollowersContext.Provider>
  );
}
