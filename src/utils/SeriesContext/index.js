import React, {useState} from 'react';

export const SeriesContext = React.createContext();

export const SeriesProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);

  return <SeriesContext.Provider value={{isLoading, setIsLoading}}>{children}</SeriesContext.Provider>;
};
