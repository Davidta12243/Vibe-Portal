const FormSearch = () => {
    return (
      <>
        <form className="flex-1 border border-green-500 flex justify-between font-sans rounded-lg">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search by title"
            className="px-5 py-2 grow focus:outline-none rounded-l-lg"
            required
          />
          <button className="bg-secondary px-5 text-white rounded-r-lg" type="submit">
            search now
          </button>
        </form>
      </>
    );
  };
  
  export default FormSearch;