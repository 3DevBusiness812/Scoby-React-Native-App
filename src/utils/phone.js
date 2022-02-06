import {PhoneNumberUtil, PhoneNumberFormat} from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export const phoneGetCountryCode = (phone) => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(phone);
    return phoneUtil.getRegionCodeForNumber(number);
  } catch (e) {
    return '';
  }
};

export const phoneFormat = (phone, countryCode) => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(phone, countryCode);
    return phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL);
  } catch (e) {
    return '';
  }
};

export const phoneRemoveFormat = (phone, countryCode) => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(phone, countryCode);
    return phoneUtil.format(number, PhoneNumberFormat.E164);
  } catch (e) {
    return '';
  }
};
