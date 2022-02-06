import {gql} from '@apollo/client';

export const SESSION_CREATED_SUBSCRIPTIONS = gql`
  subscription sessionCreated {
    sessionCreated {
      id
      description
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
    }
  }
`;
export const SESSION_CLOSED_SUBSCRIPTIONS = gql`
  subscription sessionClosed {
    sessionClosed {
      id
      description
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
    }
  }
`;
export const SESSION_USER_JOINED_SUBSCRIPTION = gql`
  subscription sessionUserJoined {
    sessionUserJoined {
      id
      description
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
    }
  }
`;

export const SESSION_VIEWER_JOINED = gql`
  subscription sessionViewerJoined {
    sessionViewerJoined {
      id
      description
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
    }
  }
`;
export const SESSION_USER_LEFT = gql`
  subscription sessionUserLeft {
    sessionUserLeft {
      id
      description
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
    }
  }
`;
export const SESSION_VIEWER_LEFT = gql`
  subscription sessionViewerLeft {
    sessionViewerLeft {
      id
      description
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
    }
  }
`;
