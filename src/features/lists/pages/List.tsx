import { NewListButton } from "../../../components/NewListButton";
import Search from "../../../components/Search";
import type { IListItem } from "../../../types";

import ListItem from "../components/ListItem";
import "./List.css";

const List = () => {
  const LISTS: IListItem[] = [
    {
      id: 1,
      title: "Grocery Shopping",
      createdAt: "2026-07-22T10:45:00",
      itemCount: 18,
    },
    {
      id: 2,
      title: "Office Tasks",
      createdAt: "2026-07-20T09:30:00",
      itemCount: 12,
    },
    {
      id: 3,
      title: "Vacation Checklist",
      createdAt: "2026-07-19T17:20:00",
      itemCount: 24,
    },
    {
      id: 4,
      title: "Birthday Party Supplies",
      createdAt: "2026-07-18T02:15:00",
      itemCount: 16,
    },
    {
      id: 5,
      title: "Weekly Meal Plan",
      createdAt: "2026-07-17T08:00:00",
      itemCount: 21,
    },
    {
      id: 6,
      title: "Home Cleaning Checklist",
      createdAt: "2026-07-16T11:40:00",
      itemCount: 14,
    },
    {
      id: 7,
      title: "Books to Read",
      createdAt: "2026-07-15T06:10:00",
      itemCount: 30,
    },
    {
      id: 8,
      title: "Fitness Goals",
      createdAt: "2026-07-14T07:45:00",
      itemCount: 10,
    },
    {
      id: 9,
      title: "Monthly Budget",
      createdAt: "2026-07-13T01:25:00",
      itemCount: 8,
    },
    {
      id: 10,
      title: "Packing List",
      createdAt: "2026-07-12T04:50:00",
      itemCount: 19,
    },
  ];

  return (
    <>
      <Search></Search>
      <main className="content">
        {LISTS.map((item) => (
          <ListItem
            key={item.id}
            id={item.id}
            title={item.title}
            createdAt={item.createdAt}
            itemCount={item.itemCount}
          />
        ))}
      </main>
      <NewListButton></NewListButton>
    </>
  );
};

export default List;
