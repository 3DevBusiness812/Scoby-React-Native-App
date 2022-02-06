import {gql} from '@apollo/client';

export const GET_TEAM = gql`
  query getTeam($teamId: Int!) {
    getTeam(teamId: $teamId) {
      avatar
      backgroundImage
      createdAt
      description
      id
      linkWebsite
      teamType
      membersAllowedToHost
      membersAllowedToInvite
      members {
        id
        isAccepted
        user {
          avatar
          backgroundImage
          bio
          email
          fullName
          id
          role
          username
          website
          location
          followCounts {
            followers
            following
          }
          followStats {
            followingCurrentUser
            followedByCurrentUser
          }
        }
      }
      name
      ownerUser {
        id
        avatar
        username
        fullName
        email
      }
      participantUsers {
        avatar
        username
        fullName
        email
      }
      pendingUsers {
        id
      }
      topics {
        icon
        id
        name
      }
    }
  }
`;
