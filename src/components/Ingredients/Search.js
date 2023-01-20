import React, { useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/http";
import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadingIngredients } = props;
  const [searchInputText, setSearchInputText] = useState("");
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clearErrorHandler } = useHttp();

  const searchInputHandler = (event) => {
    setSearchInputText(event.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInputText === inputRef.current.value) {
        const query =
          searchInputText.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${searchInputText}"`;

        sendRequest(
          "https://react-hooks-update-d49ca-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json" +
            query,
          "GET"
        );
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [searchInputText, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadingIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadingIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clearErrorHandler}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Фільтрувати по назві</label>
          {isLoading && <span>Шукаємо...</span>}
          <input
            ref={inputRef}
            type="text"
            value={searchInputText}
            onChange={searchInputHandler}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
