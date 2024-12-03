"use client";

import React, { createContext, useContext, PropsWithChildren } from "react";

export type THandler = (name: string, params?: any) => Promise<any>;

interface DataContextProps {
  fetch: THandler;
  mutate: THandler;
}

const DataContext = createContext<DataContextProps>({
  fetch: async (_: string, __?: any) => {},
  mutate: async (_: string, __?: any) => {},
});

type TPassProps = {
  fetch: <T = any>(name: string, params?: any) => Promise<T>;
  mutate: <T = any>(name: string, params?: any) => Promise<T>;
};

type DataContextProviderProps = PropsWithChildren<Partial<TPassProps>>;

export const DataContextProvider = (props: DataContextProviderProps) => {
  const passProps = {
    fetch: props.fetch ?? (async () => {}),
    mutate: props.mutate ?? (async () => {}),
  };
  return (
    <DataContext.Provider value={passProps}>
      {props.children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext) as TPassProps;
