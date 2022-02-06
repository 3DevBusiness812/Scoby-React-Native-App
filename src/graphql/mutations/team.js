import {gql} from '@apollo/client';

export const CREATE_TEAM = gql`
  mutation createTeam($avatar: Upload, $backgroundImage: Upload, $team: TeamCreation!) {
    createTeam(avatar: $avatar, backgroundImage: $backgroundImage, team: $team) {
      createdAt
      description
      id
      linkWebsite
      members {
        id
        createdAt
        user {
          fullName
          id
        }
      }
      name
    }
  }
`;

export const INVITE_TEAM_MEMBERS = gql`
  mutation inviteMembers($teamId: Int!, $usersIds: [Int!]!) {
    inviteMembers(teamId: $teamId, usersIds: $usersIds) {
      id
    }
  }
`;

export const UPDATE_TEAM = gql`
  mutation updateTeamGeneralInfo($updateTeamPayload: TeamUpdate!) {
    updateTeamGeneralInfo(updateTeamPayload: $updateTeamPayload) {
      id
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation deleteTeam($teamId: Int!) {
    deleteTeam(teamId: $teamId) {
      id
    }
  }
`;

export const EDIT_TEAM = gql`
  mutation editTeam($avatar: Upload, $backgroundImage: Upload, $editTeamPayload: EditTeam!) {
    editTeam(avatar: $avatar, backgroundImage: $backgroundImage, editTeamPayload: $editTeamPayload) {
      id
    }
  }
`;

export const ACCEPT_INVITE = gql`
  mutation acceptInvite($teamId: Int!) {
    acceptInvite(teamId: $teamId) {
      id
    }
  }
`;

export const REQUEST_MEMBERSHIP = gql`
  mutation joinRequest($teamId: Int!) {
    joinRequest(teamId: $teamId) {
      id
    }
  }
`;
