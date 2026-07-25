import "./ItemEditModal.css";
import type { IListDetailsItem } from "../../../types";

interface IItemEditModalProps {
  item: IListDetailsItem;
  onClose: () => void;
}

export const ItemEditModal = ({ item, onClose }: IItemEditModalProps) => {
  return (
    <div className="modal-backdrop">
      <div className="item-modal">
        <div className="modal-body">
          <div className="form-group">
            <input type="text" placeholder="Item title" defaultValue={item.title} />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Quantity</label>

              <input type="number" defaultValue={item.quantity} />
            </div>

            <div className="form-group">
              <label>Unit</label>

              <select defaultValue={item.unit}>
                <option>Nos</option>
                <option>Kg</option>
                <option>Pkt</option>
                <option>Ltr</option>
                <option>Box</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>

            <textarea placeholder="Optional notes..." defaultValue={item.notes}></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button className="delete-btn" onClick={onClose}>
            <i className="fa-solid fa-close"></i>
            Close
          </button>

          <button className="save-btn">
            <i className="fa-solid fa-save"></i>
            Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default ItemEditModal;
