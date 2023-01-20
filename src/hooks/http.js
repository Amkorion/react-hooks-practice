import { useCallback, useReducer } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

export const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...httpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return { loading: false, error: action.errorData };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Щось пішло не так!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clearErrorHandler = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: "SEND", identifier: reqIdentifier });
      fetch(url, {
        method: method,
        body: body,
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          return response.json();
          // setIsloading(false);
          // dispatchHttp({ type: "RESPONSE" });
          // setUserIngredients((prevIngredients) =>
          //   prevIngredients.filter((ingredient) => ingredient.id !== id)
          // );
          // dispatch({ type: "DELETE", id: id });
        })
        .then((responseData) => {
          dispatchHttp({
            type: "RESPONSE",
            responseData: responseData,
            extra: reqExtra,
          });
        })
        .catch((err) => {
          // setError("Упс... Щось пішло не так!");
          dispatchHttp({ type: "ERROR", errorData: err.message });
        });
    },
    []
  );
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clearErrorHandler: clearErrorHandler,
  };
};

export default useHttp;
