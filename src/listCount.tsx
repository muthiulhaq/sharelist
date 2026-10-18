import { createContext, useContext, useState, type ReactNode } from "react";

export type DetailHeader = {
  title: string;
  itemCount: number;
};

type ListCountValue = {
  count: number;
  setCount: (count: number) => void;
  detail: DetailHeader | null;
  setDetail: (detail: DetailHeader | null) => void;
};

const ListCountContext = createContext<ListCountValue>({
  count: 0,
  setCount: () => {},
  detail: null,
  setDetail: () => {},
});

export function ListCountProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [detail, setDetail] = useState<DetailHeader | null>(null);

  return (
    <ListCountContext.Provider value={{ count, setCount, detail, setDetail }}>
      {children}
    </ListCountContext.Provider>
  );
}

export function useListCount() {
  return useContext(ListCountContext);
}
