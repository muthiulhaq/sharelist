import "./ItemEditModal.css";

export const ItemEditModal = () => {
  return (
    <div className="modal-backdrop">
      <div className="item-modal">
        <div className="modal-body">
          <div className="form-group">
            <input type="text" placeholder="Item title" />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Quantity</label>

              <input type="number" value="1" />
            </div>

            <div className="form-group">
              <label>Unit</label>

              <select>
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

            <textarea placeholder="Optional notes..."></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button className="delete-btn">
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
