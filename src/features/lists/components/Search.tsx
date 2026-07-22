import "./Search.css";

const Search = () => {
  return (
    <div className="search-area">
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input type="text" placeholder="Search lists..." />
      </div>
    </div>
  );
};

export default Search;
