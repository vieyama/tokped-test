import QueryContextProvider from "contexts/contactQueryContext";
import ContactList from "views/ContactList";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import fetch from "cross-fetch";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "https://wpe-hiring.tokopedia.net/graphql",
      fetch,
    }),
  });
  return (
    <ApolloProvider client={client}>
      <QueryContextProvider>
        <ContactList />
      </QueryContextProvider>
    </ApolloProvider>
  );
};

export default Home;
