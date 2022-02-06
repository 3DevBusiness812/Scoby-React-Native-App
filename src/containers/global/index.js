import React, {createContext, useState} from 'react';

export const defaultGlobalContext = {
  isLogged: false,
  initialLink: null,
  setIsLogged: () => {},
  setInitialLink: () => {},
  userId: null,
};

export const GlobalContext = createContext(defaultGlobalContext);

export default function GlobalProvider({children}) {
  const [isLogged, setIsLogged] = useState(defaultGlobalContext.isLogged);
  const [initialLink, setInitialLink] = useState(defaultGlobalContext.initialLink);
  const [id, setId] = useState(defaultGlobalContext.userId);

  return (
    <GlobalContext.Provider value={{isLogged, initialLink, setIsLogged, setInitialLink, id, setId}}>
      {children}
    </GlobalContext.Provider>
  );
}
