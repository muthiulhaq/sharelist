import type { IListDetailsItem } from "../../../types";
import ListDetailItem from "../components/ListDetailItem";
import "./ListDetails.css";

const ListDetails = () => {
  const ListDeatilItems: IListDetailsItem[] = [
    {
      id: 1,
      title: "Milk",
      quantity: 2,
      unit: "Pkt",
      notes: "Buy low fat milk",
    },
    {
      id: 2,
      title: "Tomatoes",
      quantity: 5,
      unit: "Kg",
      notes: "Buy ripe tomatoes only",
    },
    {
      id: 3,
      title: "Bread",
      quantity: 1,
      unit: "Loaf",
      notes: "",
    },
    {
      id: 4,
      title: "Eggs",
      quantity: 12,
      unit: "Nos",
      notes: "Organic if available",
    },
    {
      id: 5,
      title: "Coffee",
      quantity: 1,
      unit: "Box",
      notes: "",
    },
    {
      id: 6,
      title: "Rice",
      quantity: 10,
      unit: "Kg",
      notes: "Basmati preferred",
    },
    {
      id: 7,
      title: "Sugar",
      quantity: 2,
      unit: "Kg",
      notes: "",
    },
    {
      id: 8,
      title: "Cooking Oil",
      quantity: 2,
      unit: "Ltr",
      notes: "Sunflower oil",
    },
    {
      id: 9,
      title: "Chicken",
      quantity: 2,
      unit: "Kg",
      notes: "Skinless",
    },
    {
      id: 10,
      title: "Potatoes",
      quantity: 3,
      unit: "Kg",
      notes: "",
    },
    {
      id: 11,
      title: "Onions",
      quantity: 2,
      unit: "Kg",
      notes: "",
    },
    {
      id: 12,
      title: "Carrots",
      quantity: 1,
      unit: "Kg",
      notes: "Fresh only",
    },
    {
      id: 13,
      title: "Bananas",
      quantity: 12,
      unit: "Nos",
      notes: "",
    },
    {
      id: 14,
      title: "Apples",
      quantity: 6,
      unit: "Nos",
      notes: "Red apples",
    },
    {
      id: 15,
      title: "Cheese",
      quantity: 2,
      unit: "Pack",
      notes: "Cheddar",
    },
  ];

  return (
    <main className="list-area">
      {ListDeatilItems.map((item, index) => (
        <ListDetailItem
          key={index}
          id={item.id}
          title={item.title}
          quantity={item.quantity}
          unit={item.unit}
          notes={item.notes}
        ></ListDetailItem>
      ))}
    </main>
  );
};

export default ListDetails;
