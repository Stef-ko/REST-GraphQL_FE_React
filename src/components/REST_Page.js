import React, { useContext, useEffect, useState } from "react";

import {
  Container,
  Paper,
  Grid,
  Grow,
  CircularProgress,
} from "@material-ui/core";

import httpRestService from "../services/httpRest.service";
import RESTPost from "./REST_Post";
import RESTPostForm from "./REST_PostForm";
import RESTRequestAccordion from "./REST_RequestAccordion";
import { Context } from "../Store/REST_Request_Store";

function REST() {
  const [restposts, setPosts] = useState([]);

  const [, dispatch] = useContext(Context);

  useEffect(() => {
    retrievePosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrievePosts = () => {
    var start = performance.now();

    httpRestService
      .getAll()
      .then((res) => {
        var time = performance.now();
        setPosts(res.data);
        dispatch({
          type: "Add_REST_REQUEST",
          payload: {
            Request: "Get Posts",
            RequestMethod: "GET",
            RequestURL: "http://localhost:8080/api/posts",
            RequestBody: "",
            //TODO Fix calculation of Size to be exact or read it from the header
            RequestSize: (JSON.stringify(res).length * 16) / 8 / 1024 / 2,
            RequestExecutionTime: time - start,
            Response: JSON.stringify(res, null, 2),
          },
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const createcallbackFunction = (RESTPostNew) => {
    setPosts([RESTPostNew.data, ...restposts]);
  };

  const deleteCallbackFunction = (postId) => {
    setPosts([...restposts.filter((p) => p._id !== postId)]);
  };

  return (
    <Container maxWidth='md'>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h1>REST</h1>
          {restposts ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper>
                  <RESTPostForm parentCallback={createcallbackFunction} />
                </Paper>
              </Grid>
              {restposts.map((restpost) => (
                //TODO set unique key for rest and graphql post
                <Grid key={restpost.createdAt} item xs={12}>
                  <Grow
                    in={true}
                    style={{ transformOrigin: "0 0 0" }}
                    timeout={800}
                  >
                    <Paper elevation={2}>
                      <RESTPost
                        parentCallback={deleteCallbackFunction}
                        restpost={restpost}
                      />
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
          <RESTRequestAccordion />
        </Grid>
      </Grid>
    </Container>
  );
}

export default REST;
