/* eslint-disable no-use-before-define */
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Colors from 'src/constants/Colors';
import Verified from 'assets/svg/feed/verifiedIcon.svg';
import Dots from 'assets/svg/dotsHorizontal.svg';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import Fonts from 'src/constants/Fonts';
import styled from 'styled-components/native';

const Wraper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: 17,
  paddingHorizontal: 36,
  marginTop: 60,
  borderBottomColor: Colors.backgroundSearchBar,
  borderBottomWidth: 2,
  marginBottom: 10,
});

const Options = styled.TouchableOpacity({
  padding: 5,
});

const UserWrapper = styled.View({flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'});

const NameWrapper = styled.View({flexDirection: 'row', alignItems: 'center', marginBottom: 5});

const Name = styled.Text({
  ...Fonts.avenir,
  color: Colors.white,
  fontSize: 16,
});

const Profile = styled.Text({
  ...Fonts.avenir,
  color: Colors.white,
  opacity: 0.5,
  fontSize: 16,
});

const Img = styled.View({
  borderRadius: 50,
  width: 32,
  height: 32,
  marginRight: 13,
});

const Contact = ({image, sender, profile, role, toggleModal}) => (
  <>
    <Wraper>
      <UserWrapper>
        <Img>
          <Image source={image ? {uri: image} : avatarSrc} resizeMode="cover" style={styles.img} />
        </Img>
        <View>
          <NameWrapper>
            <Name>{sender}</Name>
            {role && <Verified width={12} height={12} style={styles.verified} />}
          </NameWrapper>
          <Profile>@{profile}</Profile>
        </View>
      </UserWrapper>
      <Options onPress={toggleModal}>
        <Dots />
      </Options>
    </Wraper>
  </>
);

const styles = StyleSheet.create({
  verified: {marginLeft: 8},
  img: {width: 32, height: 32, borderRadius: 50},
});

export default Contact;
