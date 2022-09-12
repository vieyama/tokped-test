import { gql } from "@apollo/client";

export const addContact = gql`
  mutation (
    $first_name: String!
    $last_name: String!
    $phones: [phone_insert_input!]!
  ) {
    insert_contact(
      objects: {
        first_name: $first_name
        last_name: $last_name
        phones: { data: $phones }
      }
    ) {
      returning {
        first_name
        last_name
        id
        phones {
          number
        }
      }
    }
  }
`;

export const addNumberToContact = gql`
  mutation ($contact_id: Int!, $phone_number: String!) {
    insert_phone(objects: { contact_id: $contact_id, number: $phone_number }) {
      returning {
        contact {
          id
          last_name
          first_name
          phones {
            number
          }
        }
      }
    }
  }
`;

export const deleteContact = gql`
  mutation ($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`;

export const deleteNumber = gql`
  mutation ($contact_id: Int!, $number: String!) {
    delete_phone_by_pk(contact_id: $contact_id, number: $number) {
      id
    }
  }
`;

export const updatePhoneNumber = gql`
  mutation (
    $pk_columns_phone: phone_pk_columns_input!
    $set_phone: phone_set_input
    $pk_columns_contact: contact_pk_columns_input!
    $set_contact: contact_set_input
  ) {
    update_phone_by_pk(pk_columns: $pk_columns_phone, _set: $set_phone) {
      contact {
        first_name
      }
    }
    update_contact_by_pk(pk_columns: $pk_columns_contact, _set: $set_contact) {
      created_at
      id
      last_name
    }
  }
`;
