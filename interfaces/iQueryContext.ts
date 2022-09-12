import { ApolloError } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";

import { contactType } from "./Contact";

export type refetchType = () => void;

export interface AppContextInterface {
  data: contactType[];
  loading: boolean;
  error: ApolloError | undefined;
  loadMore: any;
  setSearch?: Dispatch<SetStateAction<string>>;
  refetch: refetchType;
}

export interface IQueryContextProvider {
  children: React.ReactNode;
}
