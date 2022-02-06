import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import {CheckIco} from 'assets/ico';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {
  SUBTITLE_SHARE_SESSION,
  ALL_FOLLOWERS,
  NEW_SESSION_INVITE_FOLLOWERS_SELECT,
  NO_FOLLOWERS,
  NO_FOLLOWERS_1,
  NO_FOLLOWERS_2,
  NO_FOLLOWERS_3,
  NO_FOLLOWERS_4,
  NEW_SESSION_INVITE_FOLLOWERS_TITLE,
} from 'src/constants/Texts';
import Fonts from 'src/constants/Fonts';
import SearchInput from './SearchInput';

const Wrapper = styled.View({
  marginBottom: 45,
});

const Title = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  color: colors.white,
  paddingVertical: 12,
});

const EmptyTitle = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 24,
  color: colors.white,
  paddingVertical: 12,
});

const SuggestedText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 15,
  color: colors.white,
  paddingTop: 16,
  paddingBottom: 24,
});

const TextAllFollow = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: colors.white,
  flex: 1,
  paddingHorizontal: 24,
});

const Avatar = styled.Image({
  width: 45,
  height: 45,
  resizeMode: 'cover',
  borderRadius: 40,
});

const AvatarAllFollow = styled.Image(({borderColor}) => ({
  width: 45,
  height: 45,
  resizeMode: 'cover',
  borderRadius: 40,
  borderWidth: 2,
  marginTop: 8,
  borderColor: borderColor || colors.blueBackgroundSession,
}));

const ButtonConfirm = styled.View({
  width: 20,
  height: 20,
  borderRadius: 40,
  alignSelf: 'center',
  borderColor: colors.white,
  borderWidth: 1,
});

const ListText = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: colors.white,
});

const ListSubText = styled.Text({
  ...Fonts.avenir,
  fontSize: 13,
  color: colors.white,
});

const Username = styled.View({
  flexDirection: 'column',
  flex: 1,
  paddingHorizontal: 24,
});

const InviteAllRow = styled.TouchableOpacity({
  alignItems: 'center',
  flexDirection: 'row',
});

const FollowersContainer = styled.FlatList({
  width: '100%',
});

const EmptyFollowersContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: 24,
});

const EmptyFollowersText = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: colors.white,
  textAlign: 'center',
});

const SearchPanelLink = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: colors.pink,
});

const InviteFollowers = ({
  getFollowerUsers,
  selectedFollowers,
  setSelectedFollowers,
  avatarBorderColor,
  query,
  setQuery,
}) => {
  const [checkedBox, setCheckedBox] = useState(false);

  const selectFollowers = (idFollower) => {
    let followersArray = [...selectedFollowers];

    if (selectedFollowers.includes(idFollower)) {
      followersArray = followersArray.filter((i) => i !== idFollower);
    } else {
      followersArray.push(idFollower);
    }

    if (
      followersArray.length === getFollowerUsers.data.length ||
      (checkedBox && followersArray.length !== getFollowerUsers.data.length)
    ) {
      setCheckedBox(!checkedBox);
    }

    setSelectedFollowers(followersArray);
  };

  const selectAllFollowers = useCallback(() => {
    setCheckedBox(!checkedBox);
    const followersArray = [];

    if (!checkedBox) {
      getFollowerUsers.data.forEach((item) => followersArray.push(item.id));
    }

    setSelectedFollowers(followersArray);
  }, [checkedBox, getFollowerUsers, setSelectedFollowers]);

  const arrayImgAvatar = [];
  const [data, setData] = useState([]);

  if (getFollowerUsers && getFollowerUsers.data && getFollowerUsers.data.length > 0) {
    getFollowerUsers.data.forEach((item) => arrayImgAvatar.push(item));
  } else if (getFollowerUsers.data.length !== 0) {
    getFollowerUsers.forEach((item) => arrayImgAvatar.push(item));
  }

  useEffect(() => {
    if (getFollowerUsers && getFollowerUsers.data && getFollowerUsers.data.length > 0) {
      setData(getFollowerUsers.data);
    } else if (getFollowerUsers.data.length !== 0) {
      setData(getFollowerUsers);
    }
  }, []);

  const renderItemFollowers = (item) => {
    const showRight = selectedFollowers.length > 0 && selectedFollowers.find((e) => e === item.id) !== undefined;

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 24,
        }}
        key={item.id}
        activeOpacity={1}
        onPress={() => selectFollowers(item.id)}>
        <Avatar source={item.avatar ? {uri: item.avatar} : avatarSrc} />
        <Username>
          <ListText>{item.fullName || `@${item.username}`}</ListText>
          <ListSubText>{`@${item.username} ${item.location ? ` • ${item.location}` : ''}`}</ListSubText>
        </Username>
        {showRight ? <CheckIco width="20" height="20" fill={colors.pink} stroke={colors.white} /> : <ButtonConfirm />}
      </TouchableOpacity>
    );
  };

  const InviteAll = useMemo(
    () => (
      <InviteAllRow activeOpacity={1} onPress={selectAllFollowers}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            marginTop: -8,
            marginLeft: 8,
          }}>
          {arrayImgAvatar.length > 1 && arrayImgAvatar[1].avatar ? (
            <AvatarAllFollow source={{uri: arrayImgAvatar[1].avatar}} borderColor={avatarBorderColor} />
          ) : (
            <AvatarAllFollow source={avatarSrc} borderColor={avatarBorderColor} />
          )}
        </View>
        {arrayImgAvatar.length > 0 && arrayImgAvatar[0].avatar ? (
          <AvatarAllFollow source={{uri: arrayImgAvatar[0].avatar}} borderColor={avatarBorderColor} />
        ) : (
          <AvatarAllFollow source={avatarSrc} borderColor={avatarBorderColor} />
        )}
        <TextAllFollow>{ALL_FOLLOWERS}</TextAllFollow>
        {checkedBox ? <CheckIco width="20" height="20" fill={colors.pink} stroke={colors.white} /> : <ButtonConfirm />}
      </InviteAllRow>
    ),
    [arrayImgAvatar, avatarBorderColor, checkedBox, selectAllFollowers],
  );

  const HeaderComponent = () => (
    <>
      <Title>{NEW_SESSION_INVITE_FOLLOWERS_TITLE}</Title>
      {InviteAll}
      <SuggestedText>{NEW_SESSION_INVITE_FOLLOWERS_SELECT}</SuggestedText>
    </>
  );

  const handleSearch = (text) => {
    setQuery(text);
    const formattedText = text.toLowerCase();
    setData(
      arrayImgAvatar.filter(
        ({username, fullName}) => username.includes(formattedText) || fullName.includes(formattedText),
      ),
    );
  };

  return (
    <Wrapper>
      <SearchInput
        value={query}
        onChangeText={handleSearch}
        autoCorrect={false}
        style={{width: '100%', alignSelf: 'center'}}
      />
      {data.length > 0 ? (
        <FollowersContainer
          ListHeaderComponent={HeaderComponent}
          renderItem={({item}) => renderItemFollowers(item)}
          data={data}
        />
      ) : (
        <EmptyFollowersContainer>
          <EmptyTitle>{SUBTITLE_SHARE_SESSION}</EmptyTitle>
          <EmptyFollowersText>
            {NO_FOLLOWERS}
            {NO_FOLLOWERS_1}
            <SearchPanelLink>{NO_FOLLOWERS_2}</SearchPanelLink>
            {NO_FOLLOWERS_3}
            {NO_FOLLOWERS_4}
          </EmptyFollowersText>
        </EmptyFollowersContainer>
      )}
    </Wrapper>
  );
};

export default InviteFollowers;
