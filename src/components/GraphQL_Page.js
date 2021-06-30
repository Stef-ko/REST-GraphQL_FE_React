import React, { useEffect, useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Container,
  Paper,
  Grid,
  CircularProgress,
  Grow,
} from "@material-ui/core";

import GraphQLPost from "./GraphQL_Post";
import GraphQLPostForm from "./GraphQL_PostForm";
import FETCH_POSTS_QUERY from "../util/graphql";
import GraphQLRequestAccordion from "./GraphQL_RequestAccordion";
//TODO Load Request URL from ApolloProvider
// import apolloURI from "../ApolloProvider";

import { Context } from "../Store/GraphQL_Request_Store";

function GraphQL() {
  const [, dispatch] = useContext(Context);

  var start = performance.now();
  const {
    data: { getPosts: posts } = {},
  } = useQuery(FETCH_POSTS_QUERY);
  var time = performance.now();
  console.log(time - start);

  // Workaround, to avoid getting displayed a new Request Accordion for every change on posts
  const [initiallyLoaded, setInitiallyLoaded] = useState(false);

  useEffect(() => {
    // gets called twice, only the second time the posts are fetched,
    // check if posts are there to store request and response in global state
    // console.log(apolloURI);
    if (!initiallyLoaded) {
      if (posts) {
        setInitiallyLoaded(true);
        dispatch({
          type: "ADD_GRAPHQL_REQUEST",
          payload: {
            Request: "Get Posts",
            RequestMethod: "POST",
            RequestURL: "http://localhost:5000/",
            RequestBody: FETCH_POSTS_QUERY.loc.source.body,
            //TODO Fix calculation of Size to be exact or read it from the header
            RequestSize: (JSON.stringify(posts).length * 16) / 8 / 1024 / 2,
            RequestExecutionTime: time - start,
            Response: JSON.stringify(posts, null, 2),
          },
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  return (
    <Container maxWidth='md'>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h1>GraphQL</h1>
          {posts ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper>
                  <GraphQLPostForm />
                </Paper>
              </Grid>
              {posts.map((post) => (
                <Grid key={post.id} item xs={12}>
                  <Grow
                    in={true}
                    style={{ transformOrigin: "0 0 0" }}
                    timeout={800}
                  >
                    <Paper elevation={2}>
                      <GraphQLPost post={post} />
                    </Paper>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          ) : (
            <CircularProgress />
          )}
        </Grid>
        <Grid item xs={6}>
          <h1>Requests</h1>
          <GraphQLRequestAccordion posts={posts} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default GraphQL;
