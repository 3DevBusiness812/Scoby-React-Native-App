import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {CloseWhiteIco} from 'assets/svg';
import SearchInput from 'src/components/SearchInput';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import Fonts from 'src/constants/Fonts';
import Follow from 'src/components/Follow';
import {Header, TitleHeaderText} from './components/Header';

const Wrapper = styled.View({
  width: '100%',
  height: '100%',
  backgroundColor: colors.blueBackgroundSession,
  marginTop: 50,
});

const CloseButton = styled.TouchableOpacity({
  left: 0,
  margin: 0,
});

const UserRow = styled.TouchableOpacity({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 24,
  paddingBottom: 0,
  flex: 1,
});

const UserDetails = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
});

const Avatar = styled.Image`
  width: 45px;
  height: 45px;
  resize-mode: cover;
  border-radius: 40px;
  margin-right: 16px;
`;

const ListText = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: colors.white,
  textAlign: 'left',
  flex: 1,
});

const UserActions = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 8,
});

const FollowButton = styled(Follow)({
  width: 96,
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  ...Fonts.avenirSemiBold,
});

const SeriesMembers = ({route, navigation}) => {
  const {subscribedUsers} = route.params;
  const members = subscribedUsers;
  const [data, setData] = useState(subscribedUsers);
  const [query, setQuery] = useState('');

  const handleSearch = (text) => {
    setQuery(text);
    const formattedText = text.toLowerCase();
    setData(
      members.filter(({username, fullName}) => username.includes(formattedText) || fullName.includes(formattedText)),
    );
  };
  return (
    <Wrapper>
      <ScrollView>
        <CloseButton onPress={() => navigation.goBack()}>
          <CloseWhiteIco />
        </CloseButton>
        <Header>
          <TitleHeaderText>Members Joined</TitleHeaderText>
        </Header>
        <SearchInput value={query} onChangeText={handleSearch} autoCorrect={false} />
        {data.map((item) => (
          <UserRow key={item.id} activeOpacity={1}>
            <UserDetails>
              <Avatar source={item.avatar ? {uri: item.avatar} : avatarSrc} />
              <ListText>{item.fullName || `@${item.username}`}</ListText>
            </UserDetails>
            <UserActions>
              <FollowButton user={item} navigation={navigation} />
            </UserActions>
          </UserRow>
        ))}
      </ScrollView>
    </Wrapper>
  );
};

export default SeriesMembers;
