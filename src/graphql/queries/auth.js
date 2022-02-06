import {gql} from '@apollo/client';

export const LOGIN_USER = gql`
  query loginUser($password: String!, $phone: String!) {
    loginUser(password: $password, phone: $phone) {
      authorizationToken
    }
  }
`;
