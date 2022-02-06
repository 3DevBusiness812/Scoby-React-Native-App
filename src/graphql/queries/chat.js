import {gql} from '@apollo/client';

export const GET_USER_CHAT_ROOMS = gql`
  query getUserChatRooms {
    getUserChatRooms {
      id
      participantUsers {
        username
        avatar
        fullName
        id
      }
      messages {
        createdAt
        isRead
        id
        sender {
          id
          fullName
        }
        text
        updatedAt
      }
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query getChatMessages($room: Int!) {
    getChatMessages(room: $room) {
      id
      createdAt
      isRead
      text
      sender {
        avatar
        fullName
      }
    }
  }
`;

export const GET_CAHT_ROOM_BY_ID = gql`
  query getChatRoomById($roomId: Int!) {
    getChatRoomById(roomId: $roomId) {
      id
      participantUsers {
        id
        fullName
        username
        role
        avatar
      }
      messages {
        id
        isRead
        createdAt
        sender {
          role
          avatar
          fullName
          username
          id
        }
        text
      }
    }
  }
`;

export const GET_SPECIFIC_CAHT_ROOM = gql`
  query getSpecificChatRoom($userId: Int!) {
    getSpecificChatRoom(userId: $userId) {
      id
      participantUsers {
        id
        fullName
        username
        role
        avatar
      }
      messages {
        id
        createdAt
        isRead
        sender {
          role
          avatar
          fullName
          username
          id
        }
        text
      }
    }
  }
`;
