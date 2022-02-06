import {gql} from '@apollo/client';

export const JOIN_SESSION = gql`
  mutation joinSession($id: Float!, $userId: Float) {
    joinSession(id: $id, userId: $userId) {
      session {
        createdAt
        description
        finishedAt
        id
        ownerUser {
          id
          fullName
          username
          location
        }
        participantUsers {
          id
          username
          fullName
          location
          avatar
        }
        viewerUsers {
          id
          avatar
          backgroundImage
          bio
          birthday
          createdAt
          fullName
          location
          phone
          updatedAt
          username
          website
        }
        greenRoomUsers {
          id
          avatar
          backgroundImage
          bio
          birthday
          createdAt
          fullName
          location
          phone
          updatedAt
          username
          website
        }
        updatedAt
      }
      token
      vonageApiToken
    }
  }
`;

// Add isPrivate boolean var

export const CREATE_SESSION = gql`
  mutation createSession(
    $description: String!
    $title: String!
    $notify: Boolean!
    $invitedUsers: [Int!]
    $topics: [Int!]
    $secondScreenLink: String!
  ) {
    createSession(
      description: $description
      title: $title
      notify: $notify
      invitedUsers: $invitedUsers
      topics: $topics
      secondScreenLink: $secondScreenLink
    ) {
      session {
        createdAt
        title
        description
        finishedAt
        id
        vonageSessionToken
        secondScreenLink
        topics {
          id
          name
          icon
        }
        ownerUser {
          id
          username
          fullName
          location
          avatar
          vonageUserToken
        }
        participantUsers {
          id
          username
          fullName
          location
          avatar
        }
        viewerUsers {
          id
          avatar
          backgroundImage
          bio
          birthday
          createdAt
          fullName
          location
          phone
          updatedAt
          username
          website
        }
        updatedAt
      }
      token
      vonageApiToken
    }
  }
`;

export const VIEW_SESSION = gql`
  mutation viewSession($id: Float!, $userId: Float) {
    viewSession(id: $id, userId: $userId) {
      session {
        createdAt
        description
        finishedAt
        id
        secondScreenLink
        ownerUser {
          id
          fullName
          username
          location
        }
        participantUsers {
          id
          username
          fullName
          location
          avatar
        }
        viewerUsers {
          id
          avatar
          backgroundImage
          bio
          birthday
          createdAt
          fullName
          location
          phone
          updatedAt
          username
          website
        }
        greenRoomUsers {
          id
          avatar
          backgroundImage
          bio
          birthday
          createdAt
          fullName
          location
          phone
          updatedAt
          username
          website
        }
        updatedAt
      }
      token
      vonageUserToken
      vonageApiToken
    }
  }
`;

export const JOIN_GREEN_ROOM_SESSION = gql`
  mutation joinGreenRoomSession($id: Float!, $userId: Float) {
    joinGreenRoomSession(id: $id, userId: $userId) {
      session {
        id
        description
        title
        createdAt
        finishedAt
        updatedAt
        ownerUser {
          id
          avatar
          backgroundImage
          bio
          birthday
          createdAt
          fullName
          location
          phone
          updatedAt
          username
          website
          vonageUserToken
        }
        participantUsers {
          id
          avatar
          backgroundImage
          bio
          birthday
          createdAt
          fullName
          location
          phone
          updatedAt
          username
          website
          vonageUserToken
        }
        viewerUsers {
          id
          avatar
          backgroundImage
          bio
          birthday
          createdAt
          fullName
          location
          phone
          updatedAt
          username
          website
          vonageUserToken
        }
        greenRoomUsers {
          id
          avatar
          backgroundImage
          bio
          birthday
          createdAt
          fullName
          location
          phone
          updatedAt
          username
          website
          vonageUserToken
        }
      }
      vonageUserToken
    }
  }
`;

export const SHARE_SESSION_IN_SESSION = gql`
  mutation shareSession($sessionId: Float!, $invitedUsers: [Int!], $notifyMyFollowers: Boolean!) {
    shareSession(sessionId: $sessionId, invitedUsers: $invitedUsers, notifyMyFollowers: $notifyMyFollowers)
  }
`;

export const END_SESSION = gql`
  mutation endSession($sessionId: Float!) {
    endSession(sessionId: $sessionId) {
      description
      finishedAt
      id
      title
      updatedAt
      vonageSessionToken
    }
  }
`;

export const LEAVE_SESSION = gql`
  mutation leaveSession($sessionId: Float!) {
    leaveSession(sessionId: $sessionId) {
      description
      finishedAt
      id
      title
      updatedAt
      vonageSessionToken
    }
  }
`;
