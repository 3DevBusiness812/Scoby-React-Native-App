import {gql} from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($phone: String!) {
    createUser(phone: $phone) {
      phone
      verificationExpire
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($password: String!, $phone: String!) {
    loginUser(password: $password, phone: $phone) {
      authorizationToken
    }
  }
`;

export const REGISTRATION_USER = gql`
  mutation kartraUserSuscription($email: String!, $name: String!) {
    kartraUserSuscription(email: $email, name: $name) {
      email
      name
    }
  }
`;

export const VERIFY_USER_PHONE = gql`
  mutation verifyUserPhone($phone: String!, $code: String!) {
    verifyUserPhone(phone: $phone, code: $code) {
      registrationToken
    }
  }
`;

export const CREATE_USER_PROFILE = gql`
  mutation createUserProfile($profile: UserProfileCreation!) {
    createUserProfile(profile: $profile) {
      id
      phone
      birthday
      username
      topics {
        id
      }
      auth {
        authorizationToken
      }
    }
  }
`;
export const RESET_PASSWORD = gql`
  mutation resetPassword($phone: String!) {
    resetPassword(phone: $phone) {
      phone
      verificationExpire
    }
  }
`;

export const RESET_PASSWORD_CONFIRM = gql`
  mutation confirmResetPassword($code: String!, $phone: String!) {
    confirmResetPassword(code: $code, phone: $phone) {
      passwordResetToken
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation updatePassword($password: String!, $passwordResetToken: String!) {
    updatePassword(password: $password, passwordResetToken: $passwordResetToken) {
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
      topics {
        id
        name
      }
    }
  }
`;
