import { useEffect, useState } from "react";
import AddNewItem from "../../../components/AddNewItem";
import type { IListDetailsItem } from "../../../types";
import ListDetailItem from "../components/ListDetailItem";
import { useParams } from "react-router-dom";
import "./ListDetails.css";
import ItemEditModal from "../components/ItemEditModal";

const ListDetails = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const [ListDetailItemsData, setListDetailItemsData] = useState<
    IListDetailsItem[]
  >([]);

  const ListDetailItems: IListDetailsItem[] = [
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

  useEffect(() => {
    isEditMode
      ? setListDetailItemsData(ListDetailItems)
      : setListDetailItemsData([]);
  }, [isEditMode]);

  const handleAddedItem = (value: string) => {
    const newItem: IListDetailsItem = {
      id: Date.now(),
      title: value,
      quantity: 1,
      unit: "Nos",
      notes: "",
    };

    setListDetailItemsData((prev) => [newItem, ...prev]);
  };

  return (
    <>
      <ItemEditModal></ItemEditModal>
      <AddNewItem onSend={handleAddedItem}></AddNewItem>
      <main className="list-area">
        {ListDetailItemsData?.map((item) => (
          <ListDetailItem
            key={item.id}
            id={item.id}
            title={item.title}
            quantity={item.quantity}
            unit={item.unit}
            notes={item.notes}
          ></ListDetailItem>
        ))}
      </main>
    </>
  );
};

export default ListDetails;
