import Geolocation from 'react-native-geolocation-service';
import {GOOGLE_API_KEY} from 'src/config/common';
import {keysToCamel} from 'src/utils/helpers';

const options = {
  enableHighAccuracy: false,
  timeout: 15000,
  maximumAge: 10000,
};

export const getCurrentPosition = async () =>
  new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve(position.coords);
      },
      () =>
        resolve({
          latitude: 0,
          longitude: 0,
        }),
      options,
    );
  });

export const getAddressByCoordinates = async (longitude, latitude) => {
  try {
    const result = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`,
    );
    const responseJson = await result.json();

    return {
      formattedAddress: responseJson.results[0].formatted_address,
      addressComponents: keysToCamel(responseJson.results[0].address_components),
      placeId: responseJson.results[0].place_id,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }

  return {
    formattedAddress: '',
    placeId: '',
    addressComponents: [],
  };
};

export const getCurrentCountry = async () => {
  const position = await getCurrentPosition();
  const data = await getAddressByCoordinates(position.longitude, position.latitude);
  const component = data.addressComponents.find((item) => item.types.includes('country'));
  if (component) {
    return component.shortName;
  }
  return '';
};
