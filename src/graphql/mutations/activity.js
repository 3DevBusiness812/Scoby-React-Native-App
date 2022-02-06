import {gql} from '@apollo/client';

export const DELETE_COUNTER_ACTIVITY = gql`
  mutation deleteCounterActivity {
    deleteCounterActivity {
      counter
    }
  }
`;
