import {gql} from '@apollo/client';

export const UPDATE_PROFILE = gql`
  mutation updateUserProfile($profile: UserProfileEdit!) {
    updateUserProfile(profile: $profile) {
      avatar
      bio
      fullName
      username
      location
      website
      email
      topics {
        id
      }
    }
  }
`;

export const FLAG = gql`
  mutation markUserInappropriate($userId: Float!) {
    markUserInappropriate(userId: $userId) {
      id
    }
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation($avatar: Upload!) {
    uploadFile(avatar: $avatar) {
      avatar
    }
  }
`;

export const UPLOAD_COVER = gql`
  mutation($backgroundImage: Upload!) {
    uploadFile(backgroundImage: $backgroundImage) {
      backgroundImage
    }
  }
`;
