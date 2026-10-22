import { useState, type FormEvent } from "react";
import "./ItemEditModal.css";
import type { IListDetailsItem } from "../../../types";

const UNITS = ["Nos", "Kg", "Pkt", "Ltr", "Box", "Loaf", "Pack"];

interface IItemEditModalProps {
  item: IListDetailsItem;
  onClose: () => void;
  onSave: (item: IListDetailsItem) => void;
}

export const ItemEditModal = ({ item, onClose, onSave }: IItemEditModalProps) => {
  const [title, setTitle] = useState(item.title);
  const [quantity, setQuantity] = useState(
    item.quantity != null && item.quantity > 0 ? String(item.quantity) : ""
  );
  const [unit, setUnit] = useState(item.unit);
  const [notes, setNotes] = useState(item.notes);
  const units = unit && !UNITS.includes(unit) ? [unit, ...UNITS] : UNITS;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;

    const parsedQuantity = quantity.trim() === "" ? null : Number(quantity);
    onSave({
      id: item.id,
      title: nextTitle,
      quantity:
        parsedQuantity != null && Number.isFinite(parsedQuantity) && parsedQuantity > 0
          ? parsedQuantity
          : null,
      unit: unit.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="item-modal"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="modal-body">
          <div className="form-group">
            <input
              type="text"
              placeholder="Item title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                min={1}
                placeholder="Optional"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Unit</label>

              <select value={unit} onChange={(event) => setUnit(event.target.value)}>
                <option value="">Optional</option>
                {units.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>

            <textarea
              placeholder="Optional notes..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="delete-btn" onClick={onClose}>
            <i className="fa-solid fa-close"></i>
            Close
          </button>

          <button type="submit" className="save-btn">
            <i className="fa-solid fa-save"></i>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemEditModal;
