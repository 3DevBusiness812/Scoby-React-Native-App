/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
import React, {useEffect, useRef, useState} from 'react';
import withSafeArea from 'src/components/withSafeArea';
import {ActivityIndicator, Image, StyleSheet, KeyboardAvoidingView} from 'react-native';
import Fonts from 'src/constants/Fonts';
import Colors from 'src/constants/Colors';
import {useMutation, useQuery, useSubscription} from '@apollo/client';
import {GET_USER_PROFILE} from 'src/graphql/queries/profile';
import {GiftedChat} from 'react-native-gifted-chat';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import {SUBSCRIBE_NEW_MESSAGE} from 'src/graphql/subscription/chat';
import {formatChatMessage, formatChatMessages} from 'src/utils/helpers';
import {CREATE_CHAT_ROOM, DELETE_CHAT_ROOM, SEND_MESSAGE, SET_READ_MESSAGE_STATUS} from 'src/graphql/mutations/chat';
import {GET_SPECIFIC_CAHT_ROOM} from 'src/graphql/queries/chat';
import colors from 'src/config/theme/colors';
import BackButton from '../BackButton';
import Contact from './Contact';
import {InputToolbarCustom} from './InputToolbar';
import Bubble from './Bubble';
import EmptyChat from './EmptyChat';
import RenderDay from './RenderDay';
import RisingModal from '../RisingModal/RisingModal';

const Chat = ({route, navigation}) => {
  const {id, fullName: fullNameParam, username: usernameParam, role: roleParam, avatar: avatarParam} = route?.params;
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isVisible, setisVisible] = useState(false);

  const inputRef = useRef(null);

  const {data: getUserProfile = {}} = useQuery(GET_USER_PROFILE);
  const currUser = getUserProfile?.getUserProfile;
  const {
    data: getSpecificChatRoom,
    loading: isRoomLoading,
    refetch: refetchRoom,
  } = useQuery(GET_SPECIFIC_CAHT_ROOM, {
    variables: {userId: id},
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    refetchRoom();
  }, [refetchRoom]);

  const {id: room, messages, participantUsers} = getSpecificChatRoom?.getSpecificChatRoom || {};

  const {data: newMessage} = useSubscription(SUBSCRIBE_NEW_MESSAGE, {variables: {room}});

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    variables: {
      room,
      text: messageText,
    },
  });
  const handleDeleteRoom = () => {
    toggleModal();
    navigation.goBack();
  };

  const [deleteRoom, {loading: isRoomDeleting}] = useMutation(DELETE_CHAT_ROOM, {
    onCompleted: () => handleDeleteRoom(),
  });

  const onModalSubmit = () => {
    deleteRoom({variables: {room}});
  };

  const toggleModal = () => {
    setisVisible(!isVisible);
  };

  const [updateReadStatus] = useMutation(SET_READ_MESSAGE_STATUS);

  const [createRoom] = useMutation(CREATE_CHAT_ROOM, {
    variables: {
      messageText,
      participants: [id],
    },
    onCompleted: () => refetchRoom(),
  });

  useEffect(() => {
    if (!isRoomLoading && messages) {
      const messagesNeedToUpdate = messages.reduce(
        (acc, msg) => (msg.sender.id !== currUser.id && !msg.isRead ? [...acc, msg.id] : acc),
        [],
      );
      updateReadStatus({variables: {ids: messagesNeedToUpdate}});
    }
  }, [currUser.id, isRoomLoading, messages, updateReadStatus]);

  useEffect(() => {
    if (newMessage) {
      const {newMessage: message} = newMessage;
      if (chatMessages?.find((item) => item._id === message.id)) {
        return;
      }
      setChatMessages([formatChatMessage(message, currUser, avatarSrc), ...chatMessages]);
    }
  }, [chatMessages, currUser, newMessage]);

  useEffect(() => {
    setChatMessages(formatChatMessages(messages, currUser, avatarSrc));
  }, [currUser, messages]);

  const chatWithUser = participantUsers?.find(({username}) => username !== currUser?.username);
  const {avatar, fullName, role, username} = chatWithUser || {};

  const onSend = async () => {
    if (!room) {
      createRoom();
    }
    sendMessage();
  };

  const renderAvatar = () => <Image style={styles.avatar} source={avatar ? {uri: avatar} : avatarSrc} />;

  if (isRoomLoading) return <ActivityIndicator style={styles.indicator} />;
  return (
    <>
      <BackButton navigation={navigation} />
      <Contact
        image={avatar || avatarParam}
        sender={fullName || fullNameParam}
        isVerified={role || roleParam}
        profile={username || usernameParam}
        toggleModal={toggleModal}
      />
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-500} style={styles.avoidKeyboard}>
        <GiftedChat
          messages={chatMessages}
          renderLoading={() => <ActivityIndicator size="small" />}
          renderChatEmpty={() => (
            <EmptyChat
              name={fullName || fullNameParam}
              isVerified={role || roleParam}
              image={avatar || avatarParam}
              profile={username || usernameParam}
              id={id}
              navigation={navigation}
            />
          )}
          renderAvatarOnTop
          text={messageText}
          onInputTextChanged={(text) => setMessageText(text)}
          alignTop
          renderDay={RenderDay}
          listViewProps={{style: styles.container, showsVerticalScrollIndicator: false}}
          textInputStyle={styles.textInputStyle}
          renderBubble={Bubble}
          renderInputToolbar={(props) => <InputToolbarCustom {...props} ref={inputRef} />}
          onSend={onSend}
          bottomOffset={20}
          renderAvatar={renderAvatar}
          placeholder="Message..."
          textStyle={styles.textStyle}
          user={{
            _id: 1,
          }}
        />
      </KeyboardAvoidingView>

      <RisingModal
        onSubmit={onModalSubmit}
        toggleModal={toggleModal}
        btnText="Delete Chat"
        isVisible={isVisible}
        isLoading={isRoomDeleting}
      />
    </>
  );
};

const styles = StyleSheet.create({
  indicator: {marginTop: 15},
  avatar: {width: 20, height: 20, borderRadius: 50, marginRight: 15},
  input: {
    backgroundColor: Colors.backgroundSearchBar,
    color: Colors.white,
    paddingRight: 55,
  },
  date: {...Fonts.avenir, color: Colors.white, opacity: 0.5, marginBottom: 25, marginTop: 25, textAlign: 'center'},
  container: {paddingHorizontal: 23, marginBottom: 10},
  textInputStyle: {color: Colors.white},
  textStyle: {color: colors.white},
  avoidKeyboard: {flex: 1, marginBottom: 5},
});

export default withSafeArea(Chat);
