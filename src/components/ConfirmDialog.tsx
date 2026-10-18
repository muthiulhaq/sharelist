import { createPortal } from "react-dom";
import "./ConfirmDialog.css";

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({ title, message, onConfirm, onCancel }: ConfirmDialogProps) => {
  return createPortal(
    <div className="confirm-backdrop" onClick={onCancel}>
      <div className="confirm-sheet" onClick={(event) => event.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm-actions">
          <button type="button" className="confirm-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="confirm-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.querySelector(".mobile") ?? document.body,
  );
};

export default ConfirmDialog;
