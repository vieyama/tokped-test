export type phoneType = {
  id: string;
  contact_id: string;
  number: string;
  contact: {
    first_name: string;
    last_name: string;
  };
  addNumber?: boolean;
};
export type contactType = {
  id: string;
  first_name: string;
  last_name: string;
  phones: phoneType[];
};
