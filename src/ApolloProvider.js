import React from 'react'
import App from './App'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'

// export const apolloURI = "http://localhost:5000/";
export const apolloURI = 'https://thawing-earth-03793.herokuapp.com/'

const httpLink = createHttpLink({
  uri: apolloURI,
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
