import "./Search.css";

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

const Search = ({ value, onChange }: SearchProps) => {
  return (
    <div className="search-area">
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search lists..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
