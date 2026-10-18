import { createContext, useContext, useState, type ReactNode } from "react";

type ListCountValue = {
  count: number;
  setCount: (count: number) => void;
};

const ListCountContext = createContext<ListCountValue>({
  count: 0,
  setCount: () => {},
});

export function ListCountProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  return (
    <ListCountContext.Provider value={{ count, setCount }}>
      {children}
    </ListCountContext.Provider>
  );
}

export function useListCount() {
  return useContext(ListCountContext);
}
