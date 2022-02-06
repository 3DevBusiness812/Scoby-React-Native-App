import {Linking, Alert} from 'react-native';

export default async function openLink(url) {
  const re = new RegExp('^(http|https)://', 'i');
  const link = re.test(url) ? url : `https://${url}`;

  const supported = await Linking.canOpenURL(link);

  if (supported) {
    await Linking.openURL(link);
  } else {
    Alert.alert("Sorry, don't know how to open URI:", url);
  }
}
