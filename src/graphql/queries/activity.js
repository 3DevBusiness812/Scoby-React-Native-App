import {gql} from '@apollo/client';

export const GET_COUNTER_ACTIVITY = gql`
  query getCounterActivity {
    getCounterActivity {
      counter
    }
  }
`;
