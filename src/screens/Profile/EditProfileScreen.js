import React, {useCallback, useContext, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet} from 'react-native';
import {useMutation, useQuery} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import {UPDATE_PROFILE, UPLOAD_AVATAR, UPLOAD_COVER} from 'src/graphql/mutations/profile';
import {GET_USER_PROFILE} from 'src/graphql/queries/profile';
import EditName from 'src/screens/Profile/components/EditName';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {UNKNOWN_ERROR_TEXT} from 'src/constants/Texts';
import {FollowersContext} from 'src/containers/followers';
import {tabsHeight} from 'src/navigation/tabs';
import EditNickName from './components/EditNickName';
import EditBio from './components/EditBio';
import EditLocation from './components/EditLocation';
import EditWebsite from './components/EditWebsite';
import EditTopic from './components/EditTopic';
import EditEmail from './components/EditEmail';
import EditableHeaderWithImage from './components/EditableHeaderWithImage';
import {
  Header,
  HeaderTitleText,
  HeaderLeftButton,
  HeaderRightButton,
  HeaderButtonText,
  HeaderButtonTextPrimary,
} from './components/Header';

export const List = styled.View`
  margin-top: 16px;
`;

const Wrapper = styled.View({
  flex: 1,
  backgroundColor: colors.blueBackgroundSession,
});

const Form = styled.ScrollView({
  flex: 1,
  marginTop: 8,
  marginHorizontal: 24,
});

const initialProfile = {
  username: '',
  fullName: '',
  bio: '',
  location: '',
  topics: [],
  website: '',
  avatar: null,
  backgroundImage: null,
  email: '',
};

function buildFile(uri) {
  return new ReactNativeFile({
    uri,
    name: 'image.jpg',
    type: 'image/jpeg',
  });
}

function EditProfileScreen({navigation}) {
  const {currentUserProfile, setCurrentUserProfile} = useContext(FollowersContext);
  const [userProfile, setUserProfile] = useState(initialProfile);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [cover, setCover] = useState(userProfile.backgroundImage);
  const {data, loading, error} = useQuery(GET_USER_PROFILE, {
    onCompleted(response) {
      setCurrentUserProfile(response.getUserProfile);
      setUserProfile(response.getUserProfile);
      setAvatar(response.getUserProfile.avatar);
      setCover(response.getUserProfile.backgroundImage);
    },
  });

  const [updateUserProfile] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{query: GET_USER_PROFILE}],
    onError(e) {
      const message = e.graphQLErrors[0].extensions?.details[0].message;
      if (message) {
        Alert.alert(e.message, message);
      } else {
        Alert.alert(UNKNOWN_ERROR_TEXT, e.message);
      }
    },
    onCompleted() {
      navigation.navigate('Profile');
    },
  });

  const [uploadAvatar] = useMutation(UPLOAD_AVATAR, {
    refetchQueries: [{query: GET_USER_PROFILE}],
    onCompleted(response) {
      setCurrentUserProfile({
        ...currentUserProfile,
        avatar: response.uploadFile.avatar,
      });
    },
  });

  const [uploadCover] = useMutation(UPLOAD_COVER, {
    refetchQueries: [{query: GET_USER_PROFILE}],
  });

  const setProfile = useCallback(
    (key, value) => {
      const newProfile = {...userProfile};
      if (key === 'topics') {
        newProfile[key] = value.map((id) => ({id}));
      } else {
        newProfile[key] = value;
      }
      setUserProfile(newProfile);
    },
    [userProfile],
  );

  const {getUserProfile: {bio, fullName, location, topics, username, website, email} = initialProfile} = data;

  const handleSave = useCallback(async () => {
    if (avatar && avatar.length && avatar !== userProfile.avatar) {
      await uploadAvatar({
        variables: {
          avatar: buildFile(avatar),
        },
      });
    }
    if (cover && cover.length && cover !== userProfile.backgroundImage) {
      await uploadCover({
        variables: {
          backgroundImage: buildFile(cover),
        },
      });
    }
    await updateUserProfile({
      variables: {
        profile: {
          fullName: userProfile.fullName,
          username: userProfile.username,
          email: userProfile.email,
          bio: userProfile.bio,
          location: userProfile.location,
          website: userProfile.website,
          topics: userProfile.topics.map((topic) => topic.id),
        },
      },
    });
  }, [
    userProfile.fullName,
    userProfile.username,
    userProfile.email,
    userProfile.bio,
    userProfile.location,
    userProfile.website,
    userProfile.topics,
    userProfile.avatar,
    userProfile.backgroundImage,
    avatar,
    cover,
    updateUserProfile,
    uploadAvatar,
    uploadCover,
  ]);

  const styles = StyleSheet.create({
    form: {
      paddingBottom: tabsHeight,
    },
  });

  if (error) {
    return <Wrapper />;
  }

  if (loading) {
    return (
      <Wrapper>
        <ActivityIndicator color={colors.white} size="large" />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header>
        <HeaderLeftButton onPress={navigation.goBack}>
          <HeaderButtonText>Cancel</HeaderButtonText>
        </HeaderLeftButton>
        <HeaderTitleText>Edit Profile</HeaderTitleText>
        <HeaderRightButton onPress={handleSave}>
          <HeaderButtonTextPrimary>Save</HeaderButtonTextPrimary>
        </HeaderRightButton>
      </Header>
      <EditableHeaderWithImage avatar={avatar} setAvatar={setAvatar} cover={cover} setCover={setCover} />
      <Form contentContainerStyle={styles.form}>
        <EditName fullName={fullName} setProfile={setProfile} />
        <EditNickName nickname={username} setProfile={setProfile} />
        <EditEmail value={email} setProfile={setProfile} />
        <EditBio bio={bio} setProfile={setProfile} />
        <EditLocation value={location} setProfile={setProfile} />
        <EditWebsite website={website} setProfile={setProfile} />
        <EditTopic value={topics} setProfile={setProfile} navigation={navigation} />
      </Form>
    </Wrapper>
  );
}

export default EditProfileScreen;
