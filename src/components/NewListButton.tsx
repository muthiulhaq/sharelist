import "./NewListButton.css";
import { useNavigate } from "react-router-dom";

export const NewListButton = () => {
  const navigate = useNavigate();

  return (
    <button className="fab" onClick={() => navigate(`/list`)}>
      <i className="fas fa-plus"></i>
    </button>
  );
};
export default NewListButton;
