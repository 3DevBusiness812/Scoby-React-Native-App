import {gql} from '@apollo/client';

export const GET_FOLLOWERS = gql`
  query getFollowerUsers($paging: PagingInput, $userId: Float) {
    getFollowerUsers(paging: $paging, userId: $userId) {
      data {
        id
        username
        bio
        website
        location
        avatar
        backgroundImage
        fullName
        followStats {
          followedByCurrentUser
          followingCurrentUser
        }
        followCounts {
          followers
          following
        }
      }
      paging {
        limit
        page
      }
    }
  }
`;

export const GET_FOLLOWINGS = gql`
  query getFollowingUsers($paging: PagingInput, $userId: Float) {
    getFollowingUsers(paging: $paging, userId: $userId) {
      data {
        id
        username
        bio
        website
        location
        avatar
        backgroundImage
        fullName
        followStats {
          followedByCurrentUser
          followingCurrentUser
        }
        followCounts {
          followers
          following
        }
      }
      paging {
        limit
        page
      }
    }
  }
`;
