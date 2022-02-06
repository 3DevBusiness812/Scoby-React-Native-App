import {gql} from '@apollo/client';

export const KARTRA_SUBSCRIBE_LEAD_CALENDAR = gql`
  mutation kartraSuscribeLeadCalendar($className: String!, $nameCalendar: String!) {
    kartraSuscribeLeadCalendar(className: $className, nameCalendar: $nameCalendar) {
      className
    }
  }
`;

export const KARTRA_VERIFY_LEAD_CALENDAR = gql`
  mutation kartraCreateLeadCalendar($className: String!, $nameCalendar: String!) {
    kartraCreateLeadCalendar(className: $className, nameCalendar: $nameCalendar) {
      className
    }
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation uploadFileSeries($idSerie: Float!) {
    uploadFileSeries(avatar: $avatar, idSerie: $idSerie) {
      avatar
    }
  }
`;

export const CREATE_SERIE = gql`
  mutation ($serie: SerieCreation!, $avatar: Upload!, $backgroundImage: Upload!, $schedule: [ScheduleCreation!]!) {
    createSerie(serie: $serie, backgroundImage: $backgroundImage, schedule: $schedule, avatar: $avatar) {
      avatar
      backgroundImage
      calendarName
      className
      createdAt
      description
      finishedAt
      id
      ownerUser {
        avatar
        username
        fullName
        id
        location
      }
      schedule {
        day
        end
        id
        start
      }
      seriesName
      suscribeUsers {
        avatar
        id
        username
        fullName
        location
      }
      topics {
        icon
        id
        name
      }
      updatedAt
    }
  }
`;

export const INVITE_SERIE = gql`
  mutation invitedUsersSeries($idSerie: Float!, $invitedUsers: [Int!]!) {
    invitedUsersSeries(idSerie: $idSerie, invitedUsers: $invitedUsers) {
      id
    }
  }
`;
