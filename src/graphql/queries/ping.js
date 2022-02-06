import {gql} from '@apollo/client';

export const Ping = gql`
  query Ping {
    ping {
      ping
    }
  }
`;
