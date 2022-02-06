import {gql} from '@apollo/client';

export const FOLLOW_USER = gql`
  mutation followUser($userId: Float!) {
    followUser(userId: $userId) {
      id
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation unfollowUser($userId: Float!) {
    unfollowUser(userId: $userId) {
      id
    }
  }
`;
