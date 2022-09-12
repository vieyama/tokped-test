import { gql } from "@apollo/client";

export const queryContactList = gql`
  query (
    $limit: Int
    $offset: Int
    $order_by: [contact_order_by!]
    $where: contact_bool_exp
  ) {
    contact(
      limit: $limit
      offset: $offset
      where: $where
      order_by: $order_by
    ) {
      id
      first_name
      last_name
      phones {
        id
        contact_id
        contact {
          first_name
          last_name
        }
        number
        created_ad
      }
      phones_aggregate {
        aggregate {
          count
        }
      }
    }
    contact_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;
