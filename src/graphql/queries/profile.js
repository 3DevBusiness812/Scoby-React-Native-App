import {gql} from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query getUserProfile($id: Float) {
    getUserProfile(id: $id) {
      id
      avatar
      role
      backgroundImage
      bio
      birthday
      createdAt
      fullName
      id
      location
      phone
      updatedAt
      username
      website
      email
      followStats {
        followingCurrentUser
        followedByCurrentUser
      }
      followCounts {
        followers
        following
      }
      topics {
        id
      }
    }
  }
`;
export const GET_TOPICS = gql`
  query getTopics {
    getTopics {
      id
      name
      icon
    }
  }
`;

export const GET_USER_SERIES = gql`
  query getUserSeries($id: Float) {
    getUserSeries(id: $id) {
      id
      calendarName
      subscribed
      className
      seriesName
      schedule {
        day
        end
        start
      }
      description
      backgroundImage
      avatar
      createdAt
      updatedAt
      finishedAt
      ownerUser {
        id
        avatar
        fullName
        username
      }
      topics {
        id
        icon
        name
      }
      suscribeUsers {
        id
        avatar
        fullName
        username
        followStats {
          followingCurrentUser
          followedByCurrentUser
        }
      }
    }
  }
`;

export const GET_ACTIVITY = gql`
  query getActivity($paging: PagingInput) {
    getActivity(paging: $paging) @connection(key: "data") {
      data {
        id
        createdAt
        procedure_action
        additionalPayload
        sourceUser {
          id
          avatar
          fullName
          role
          username
          followStats {
            followedByCurrentUser
            followingCurrentUser
          }
        }
        type_action
      }
      paging {
        page
        limit
        total
      }
    }
  }
`;

export const GET_USERS = gql`
  query getUsers($paging: PagingInput, $query: String) {
    getUsers(paging: $paging, query: $query) @connection(key: "data", filter: ["query"]) {
      data {
        id
        avatar
        backgroundImage
        bio
        birthday
        createdAt
        fullName
        id
        location
        phone
        updatedAt
        username
        website
        role
        topics {
          id
        }
        followStats {
          followingCurrentUser
          followedByCurrentUser
        }
        followCounts {
          followers
          following
        }
      }
      paging {
        page
        limit
        total
      }
      query
    }
  }
`;
