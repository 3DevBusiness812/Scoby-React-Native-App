import {gql} from '@apollo/client';

export const GET_SERIES_SESSION=gql`
  query getSeriesAndSession($paging: PagingInput!){
    getSeriesAndSession(paging:$paging){
      series{
        id
        subscribed
        calendarName
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
        }
      },
      seriesLive{
        id
        subscribed
        viewers
        calendarName
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
        }
        session{
          id
          vonageSessionToken
          title
          description
        }
      },
      session{
        id
        title
        description
        createdAt
        finishedAt
        updatedAt
        vonageSessionToken
        viewers
        ownerUser {
          id
          avatar
          backgroundImage
          bio
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
          createdAt
          fullName
          location
          phone
          updatedAt
          username
          website
        }
        topics {
          icon
          id
          name
        }
      }
    }
  } 
`

export const GET_LIVE_SESSIONS = gql`
  query getLiveSessions {
    getLiveSessions {
      id
      title
      description
      createdAt
      finishedAt
      updatedAt
      vonageSessionToken
      viewers
      ownerUser {
        id
        avatar
        backgroundImage
        bio
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
        createdAt
        fullName
        location
        phone
        updatedAt
        username
        website
      }
      topics {
        icon
        id
        name
      }
    }
  }
`;

export const GET_LIVE_SESSION = gql`
  query getSession($sessionId: Float!) {
    getSession(id: $sessionId) {
      id
      title
      description
      createdAt
      finishedAt
      updatedAt
      vonageSessionToken
      viewers
      ownerUser {
        id
        avatar
        backgroundImage
        bio
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
        createdAt
        fullName
        location
        phone
        updatedAt
        username
        website
      }
      topics {
        icon
        id
        name
      }
    }
  }
`;
