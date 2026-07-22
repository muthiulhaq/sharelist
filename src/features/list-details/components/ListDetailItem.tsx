import "./ListDetailItem.css";

const ListDetailItem = () => {
  return (
    <>
      <div className="list-item">
        <div className="item-left">
          <div className="item-title">Milk</div>

          <div className="item-note">
            <i className="fa-solid fa-triangle-exclamation"></i>
            Buy low fat milk
          </div>
        </div>

        <div className="item-right">
          <div className="qty">
            2<span>Pkt</span>
          </div>

          <div className="item-actions">
            <button title="Edit">
              <i className="fa-solid fa-pen"></i>
            </button>

            <button className="delete" title="Delete">
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="divider"></div>
    </>
  );
};

export default ListDetailItem;
