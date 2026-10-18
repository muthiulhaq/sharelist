import { useState } from "react";
import { createPortal } from "react-dom";
import "./NewListButton.css";
import { useNavigate } from "react-router-dom";

export const NewListButton = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const close = () => {
    setOpen(false);
    setName("");
  };

  const confirm = () => {
    const title = name.trim();
    if (!title) return;

    close();
    navigate("/list", { state: { draftTitle: title } });
  };

  return (
    <>
      <button type="button" className="fab" onClick={() => setOpen(true)}>
        <i className="fas fa-plus"></i>
      </button>

      {open &&
        createPortal(
        <div className="name-backdrop" onClick={close}>
          <form
            className="name-sheet"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              confirm();
            }}
          >
            <label htmlFor="list-name">List name</label>
            <div className="name-row">
              <input
                id="list-name"
                type="text"
                placeholder="Name this list"
                value={name}
                autoFocus
                onChange={(event) => setName(event.target.value)}
              />
              <button type="submit" className="name-tick" title="Continue">
                <i className="fa-solid fa-check"></i>
              </button>
            </div>
          </form>
        </div>,
        document.querySelector(".mobile") ?? document.body,
        )}
    </>
  );
};

export default NewListButton;
