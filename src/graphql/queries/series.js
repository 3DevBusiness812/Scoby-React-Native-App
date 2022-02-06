import {gql} from '@apollo/client';

export const GET_SERIE_BY_ID = gql`
  query getSerieById($id: Float!) {
    getSerieById(id: $id) {
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
        followStats {
          followingCurrentUser
          followedByCurrentUser
        }
      }
    }
  }
`;
