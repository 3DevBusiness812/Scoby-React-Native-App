import {gql} from '@apollo/client';

export const SUBSCRIBE_NEW_MESSAGE = gql`
  subscription newMessage($room: Int!) {
    newMessage(room: $room) {
      createdAt
      id
      room {
        id
      }
      text
      sender {
        avatar
        fullName
      }
    }
  }
`;
