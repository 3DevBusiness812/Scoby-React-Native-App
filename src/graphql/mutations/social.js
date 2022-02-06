import {gql} from '@apollo/client';

export const CREATE_LEAD = gql`
  mutation createLead($lead: LeadCreation!, $registrationToken: String!) {
    createLead(lead: $lead, registrationToken: $registrationToken) {
      email
    }
  }
`;
