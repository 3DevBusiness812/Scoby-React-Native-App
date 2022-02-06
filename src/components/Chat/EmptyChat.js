/* eslint-disable no-use-before-define */
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import Verified from 'assets/svg/feed/verifiedIcon.svg';
import Colors from 'src/constants/Colors';
import img from 'assets/images/profile/avatarPlaceholder.png';
import Fonts from 'src/constants/Fonts';

const Wrapper = styled.View({
  transform: 'scaleY(-1)',
  paddingTop: 24,
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 75,
});

const Img = styled.View({borderRadius: 50, width: 70, height: 70});

const NameWrapper = styled.View({flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 5});

const Name = styled.Text({
  ...Fonts.avenir,
  color: Colors.white,
  fontSize: 16,
});

const Profile = styled.Text({...Fonts.avenir, color: Colors.white, fontSize: 16, opacity: 0.5});

const Btn = styled.TouchableOpacity({
  backgroundColor: Colors.newPink,
  marginTop: 19,
  width: 180,
  height: 32,
  paddingVertical: 8,
  borderRadius: 4,
});

const BtnText = styled.Text({...Fonts.avenir, color: Colors.white, fontSize: 12, textAlign: 'center'});

const EmptyChat = ({name, role, image, profile, id, navigation}) => {
  const goToUserDetails = () => navigation.navigate('UserDetailInfoModal', {userID: id});

  return (
    <Wrapper>
      <Img>
        <Image source={image ? {uri: image} : img} resizeMode="cover" style={styles.img} />
      </Img>
      <NameWrapper>
        <Name>{name}</Name>
        {role && <Verified width={12} height={12} style={styles.verified} />}
      </NameWrapper>
      <Profile>@{profile}</Profile>
      <Btn onPress={goToUserDetails}>
        <BtnText>View Profile</BtnText>
      </Btn>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  verified: {marginLeft: 8},
  img: {width: 70, height: 70, borderRadius: 50},
});

export default EmptyChat;
