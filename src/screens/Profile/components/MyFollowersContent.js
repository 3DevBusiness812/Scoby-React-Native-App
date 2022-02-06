import React, {useState, useContext} from 'react';
import {useQuery} from '@apollo/client';
import {Modal, StyleSheet, Alert, View, Platform} from 'react-native';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import colors from 'src/constants/Colors';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import {GET_USER_PROFILE} from 'src/graphql/queries/profile';
import {GET_FOLLOWERS, GET_FOLLOWINGS} from 'src/graphql/queries/followers';
import Follow from 'src/components/Follow';
import {UNKNOWN_ERROR_TEXT} from 'src/constants/Texts';
import UserDetailInfoModal from 'src/screens/UserDetailInfoModal';
import {FollowersContext} from 'src/containers/followers';
import Fonts from 'src/constants/Fonts';
import BackButton from 'src/components/BackButton';
import {statusBarHeight} from 'src/components/withSafeArea';

const Wrapper = styled.View`
  flex-direction: row;
  margin-top: -32px;
  padding-horizontal: 24px;
  justify-content: flex-end;
`;

const Followers = styled.TouchableOpacity`
  align-items: flex-end;
  padding-left: 24px;
`;

const NumberText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 14,
  textAlign: 'center',
  color: colors.white,
});

const DescriptionText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  textAlign: 'center',
  color: colors.regularText,
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

const ContainerView = styled.View({
  flex: 1,
});

const ContainerItem = styled.ScrollView({
  paddingTop: Platform.OS === 'ios' ? 16 + statusBarHeight : 24,
  backgroundColor: colors.blueBackgroundSession,
  flex: 1,
});

const TitleText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  textAlign: 'center',
  color: colors.white,
  paddingBottom: 16,
});

const UserTitleText = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 16,
  textAlign: 'center',
  color: colors.white,
  paddingBottom: 12,
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

const BoldText = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 14,
});

const Header = styled.View({
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderColor: colors.borderGrey,
});

const FollowersContent = ({navigation, userId}) => {
  const {currentUserProfile} = useContext(FollowersContext);
  const [isModalFollowerVisible, setFollowerModalVisible] = useState(false);
  const [isModalFollowingVisible, setFollowingModalVisible] = useState(false);
  const [visibleModalPage, setVisibleModalPage] = useState(null);
  const currentUserID = userId || currentUserProfile.id;
  const isMyContent = currentUserID === currentUserProfile.id;

  const {data: {getUserProfile} = {getUserProfile: {}}, refetch} = useQuery(GET_USER_PROFILE, {
    variables: {
      id: currentUserID,
    },
  });

  const {data: {getFollowerUsers} = {getFollowerUsers: {data: []}}, refetch: refetchFollowers} = useQuery(
    GET_FOLLOWERS,
    {
      variables: {
        paging: {
          limit: 100,
          page: 1,
        },
        userId: currentUserID,
      },
      onError(e) {
        Alert.alert(UNKNOWN_ERROR_TEXT, e.message);
      },
    },
  );

  const {data: {getFollowingUsers} = {getFollowingUsers: {data: []}}, refetch: refetchFollowings} = useQuery(
    GET_FOLLOWINGS,
    {
      variables: {
        paging: {
          limit: 100,
          page: 1,
        },
        userId: currentUserID,
      },
      onError(e) {
        Alert.alert(UNKNOWN_ERROR_TEXT, e.message);
      },
    },
  );

  const refetchAll = () => {
    refetch();
    refetchFollowers();
    refetchFollowings();
  };

  return (
    <>
      <Modal
        visible={isModalFollowerVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          refetchAll();
          setFollowerModalVisible(false);
        }}>
        <ContainerView>
          <ContainerItem
            contentContainerStyle={{
              paddingBottom: Platform.OS === 'ios' ? 100 : 40,
            }}>
            <Header>
              <UserTitleText>
                {isMyContent
                  ? currentUserProfile.fullName || `@${currentUserProfile.username}`
                  : getUserProfile.fullName || `@${getUserProfile.username}`}
              </UserTitleText>
              <TitleText>
                <BoldText>
                  {(isMyContent
                    ? currentUserProfile.followCounts?.followers
                    : getUserProfile.followCounts?.followers) || 0}
                  &nbsp;
                </BoldText>
                Followers
              </TitleText>
            </Header>
            {getFollowerUsers.data.map((item) => (
              <UserRow
                key={item.id}
                activeOpacity={1}
                onPress={() => {
                  refetchAll();
                  setFollowerModalVisible(false);
                  setVisibleModalPage(item);
                }}>
                <UserDetails>
                  <Avatar source={item.avatar ? {uri: item.avatar} : avatarSrc} />
                  <ListText>{item.fullName || `@${item.username}`}</ListText>
                </UserDetails>
                <UserActions>
                  {currentUserID !== item.id ? <FollowButton user={item} navigation={navigation} /> : null}
                </UserActions>
              </UserRow>
            ))}
          </ContainerItem>
        </ContainerView>
        <BackButton
          avoidStatusBar={Platform.OS === 'ios'}
          onPress={() => {
            refetchAll();
            setFollowerModalVisible(false);
          }}
        />
      </Modal>

      <Modal
        visible={isModalFollowingVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          refetchAll();
          setFollowingModalVisible(false);
        }}>
        <ContainerView>
          <ContainerItem
            contentContainerStyle={{
              paddingBottom: Platform.OS === 'ios' ? 100 : 40,
            }}>
            <Header>
              <UserTitleText>
                {isMyContent
                  ? currentUserProfile.fullName || `@${currentUserProfile.username}`
                  : getUserProfile.fullName || `@${getUserProfile.username}`}
              </UserTitleText>
              <TitleText>
                <BoldText>
                  {(isMyContent
                    ? currentUserProfile.followCounts?.following
                    : getUserProfile.followCounts?.following) || 0}
                  &nbsp;
                </BoldText>
                Following
              </TitleText>
            </Header>
            {getFollowingUsers.data.map((item) => (
              <UserRow
                key={item.id}
                activeOpacity={1}
                onPress={() => {
                  refetchAll();
                  setFollowingModalVisible(false);
                  setVisibleModalPage(item);
                }}>
                <UserDetails>
                  <Avatar source={item.avatar ? {uri: item.avatar} : avatarSrc} />
                  <ListText numberOfLines={1}>{item.fullName || `@${item.username}`}</ListText>
                </UserDetails>
                <UserActions>
                  {currentUserID !== item.id ? (
                    <FollowButton user={item} navigation={navigation} onAction={refetchAll} />
                  ) : null}
                </UserActions>
              </UserRow>
            ))}
          </ContainerItem>
        </ContainerView>
        <BackButton
          avoidStatusBar={Platform.OS === 'ios'}
          onPress={() => {
            refetchAll();
            setFollowingModalVisible(false);
          }}
        />
      </Modal>
      <UserDetailInfoModal
        info={visibleModalPage && visibleModalPage.id}
        onClose={() => {
          refetchAll();
          setVisibleModalPage(null);
        }}
        nonBlink
        navigation={navigation}
      />
      <Wrapper>
        <Followers
          onPress={() => {
            refetchAll();
            getUserProfile.followCounts?.following > 0 && setFollowingModalVisible(true);
          }}>
          <View>
            <NumberText>
              {(isMyContent ? currentUserProfile.followCounts?.following : getUserProfile.followCounts?.following) || 0}
            </NumberText>
            <DescriptionText>Following</DescriptionText>
          </View>
        </Followers>
        <Followers
          onPress={() => {
            refetchAll();
            getUserProfile.followCounts?.followers > 0 && setFollowerModalVisible(true);
          }}>
          <View>
            <NumberText>
              {(isMyContent ? currentUserProfile.followCounts?.followers : getUserProfile.followCounts?.followers) || 0}
            </NumberText>
            <DescriptionText>Followers</DescriptionText>
          </View>
        </Followers>
      </Wrapper>
    </>
  );
};
export default FollowersContent;
