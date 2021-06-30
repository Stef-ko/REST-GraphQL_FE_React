import React, { createContext, useReducer } from "react";

const initialState = {
  requests: [],
};

const GraphQLRequeststore = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "ADD_GRAPHQL_REQUEST":
        const newState = {
          ...state,
          requests: [...state.requests, action.payload],
        };
        return newState;
      default:
        throw new Error();
    }
  }, initialState);

  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext(initialState);

export default GraphQLRequeststore;
