import {gql} from '@apollo/client';

export const SEND_FCM_TOKEN = gql`
  mutation addPushToken($deviceId: String!, $token: String!) {
    addPushToken(deviceId: $deviceId, token: $token) {
      id
    }
  }
`;
