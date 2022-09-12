import React, { createContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import getLocalStorage from "../utils/localStorage";
import { queryContactList } from "../services/query";

import {
  AppContextInterface,
  IQueryContextProvider,
} from "interfaces/iQueryContext";

export const QueryContext = createContext<AppContextInterface | null>(null);

const QueryContextProvider: React.FC<IQueryContextProvider> = ({
  children,
}) => {
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [dataAgrregate, setDataAgrregate] = useState<{
    aggregate: { count: number };
  }>();

  const [skipQuery, setSkipQuery] = useState(true);
  const dataTemp = getLocalStorage.getItem("dataContacts");

  useEffect(() => {
    if (dataTemp) {
      setData(dataTemp?.contact);
      setDataAgrregate(dataTemp?.contact_aggregate);
    } else {
      setSkipQuery(false);
    }
  }, []);

  const { loading, error, refetch } = useQuery(queryContactList, {
    variables: {
      limit,
      where: {
        first_name: {
          _ilike: `%${search}%`,
        },
      },
      order_by: {
        created_at: "desc",
      },
    },
    skip: skipQuery,
    onCompleted(data) {
      setData(data.contact);
      setDataAgrregate(data.contact_aggregate);
      getLocalStorage.setItem("dataContacts", JSON.stringify(data));
    },
  });

  const loadMore = () => {
    const total = dataAgrregate?.aggregate?.count;
    if (limit <= (total as number)) {
      setLimit(limit + 5);
    }
  };

  useEffect(() => {
    if (!skipQuery) {
      refetch();
    }
    if (search.length > 0) {
      setSkipQuery(false);
    }
  }, [search]);

  useEffect(() => {
    limit !== 15 && refetch();
  }, [limit]);

  return (
    <QueryContext.Provider
      value={{
        loading,
        error,
        data,
        loadMore,
        setSearch,
        refetch,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export default QueryContextProvider;
