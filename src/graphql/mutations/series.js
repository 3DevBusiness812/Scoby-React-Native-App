import {gql} from '@apollo/client';

export const JOIN_SERIES = gql`
  mutation joinSerie($id: Float!) {
    joinSerie(id: $id) {
      id
    }
  }
`;

export const LEAVE_SERIES = gql`
  mutation leaveSerie($id: Float!) {
    leaveSerie(id: $id) {
      id
    }
  }
`;

export const DELETE_SERIES = gql`
  mutation endSerie($serieId: Float!) {
    endSerie(serieId: $serieId) {
      id
    }
  }
`;

export const CREATE_SESSION_SERIES = gql`
  mutation liveSerie($SerieId: Float!) {
    liveSerie(SerieId: $SerieId) {
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

export const EDIT_SERIES = gql`
  mutation editSerie(
    $serieId: Float!
    $serie: serieEdit!
    $avatar: Upload!
    $backgroundImage: Upload!
    $schedule: [ScheduleCreation!]!
  ) {
    editSerie(
      serieId: $serieId
      serie: $serie
      avatar: $avatar
      backgroundImage: $backgroundImage
      schedule: $schedule
    ) {
      id
      avatar
      backgroundImage
      createdAt
      description
      finishedAt
      seriesName
      topics {
        icon
        id
        name
      }
      ownerUser {
        fullName
        username
      }
      suscribeUsers {
        id
        avatar
        fullName
        username
      }
    }
  }
`;
