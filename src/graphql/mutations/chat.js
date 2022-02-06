import {gql} from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation sendMessage($room: Int!, $text: String!) {
    sendMessage(room: $room, text: $text) {
      createdAt
      id
      room {
        id
      }
      sender {
        id
        username
      }
      text
    }
  }
`;

export const CREATE_CHAT_ROOM = gql`
  mutation createChatRoom($messageText: String!, $participants: [Int!]!) {
    createChatRoom(messageText: $messageText, participants: $participants) {
      id
    }
  }
`;

export const SET_READ_MESSAGE_STATUS = gql`
  mutation setReadMessageStatus($ids: [Int!]!) {
    setReadMessageStatus(ids: $ids) {
      id
      isRead
      text
      sender {
        id
        username
        fullName
        role
      }
    }
  }
`;

export const DELETE_CHAT_ROOM = gql`
  mutation deleteChatRoom($room: Int!) {
    deleteChatRoom(room: $room) {
      id
    }
  }
`;
