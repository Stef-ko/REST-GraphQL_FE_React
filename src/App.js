import "./App.css";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import GraphQLRequeststore from "./Store/GraphQL_Request_Store";

import Header from "./components/Header";
import GraphQL from "./components/GraphQL_Page";
import REST from "./components/REST_Page";
import RESTRequeststore from "./Store/REST_Request_Store";

function App() {
  return (
    <>
      <Router>
        <Header history />
        <RESTRequeststore>
          <Route exact path='/rest' component={REST} />
        </RESTRequeststore>
        <GraphQLRequeststore>
          <Route exact path='/graphql' component={GraphQL} />
          <Route exact path='/'>
            <Redirect to='/rest' />
          </Route>
        </GraphQLRequeststore>
      </Router>
    </>
  );
}

export default App;
