import { useState } from "react";
import "./AddNewItem.css";

type AddNewItemProp = {
  onSend: (value: string) => void;
};

const AddNewItem = ({ onSend }: AddNewItemProp) => {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return; 

    onSend(value);
    setValue(""); 
  };

  return (
    <div className="add-item">
      <input
        type="text"
        placeholder="Add new item..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />

      <button className="next-btn" onClick={handleSend}>
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default AddNewItem;