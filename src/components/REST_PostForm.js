import React, { useContext, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";

import { TextField } from "@material-ui/core";
import { useState } from "react";

import httpRestService from "../services/httpRest.service";
import { Context } from "../Store/REST_Request_Store";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function RESTPostForm({ parentCallback }) {
  const [, dispatch] = useContext(Context);

  const classes = useStyles();
  const [postBody, setPostBody] = useState();
  const [inputFocused, setInputFocus] = useState();

  const [createPostResult, setCreatePostResult] = useState("");

  const createPost = () => {
    httpRestService
      .create(postBody)
      .then((res) => {
        parentCallback(res);
        setCreatePostResult(() => JSON.stringify(res, null, 2));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (createPostResult) {
      dispatch({
        type: "Add_REST_REQUEST",
        payload: {
          Request: "Add Post",
          RequestMethod: "POST",
          RequestURL: "http://localhost:8080/api/posts/newpost",
          RequestBody: postBody,
          //TODO Fix calculation of Size to be exact or read it from the header
          RequestSize:
            (JSON.stringify(createPostResult).length * 16) / 8 / 1024 / 2,
          Response: createPostResult,
        },
      });
      setCreatePostResult("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPostResult]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost();
    setPostBody("");
    //TODO reset Textfield after post was submitted
    // console.log(postBody);
    setInputFocus(false);
    // setInputFocus({ postBody } === "" ? true : false);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<Avatar aria-label='recipe'>S</Avatar>}
        title='User Name'
        subheader=''
      />
      <CardContent>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <FormControl fullWidth>
            <TextField
              id='outlined-multiline-static'
              label='New Post'
              multiline
              rows={4}
              fullWidth
              variant='outlined'
              name='postBody'
              required
              value={postBody}
              autoFocus={inputFocused}
              onChange={(e) => setPostBody(e.target.value)}
            />
            <CardActions>
              <Button
                type='submit'
                value='SubmitPost'
                variant='contained'
                color='secondary'
              >
                Submit
              </Button>
            </CardActions>
          </FormControl>
        </form>
      </CardContent>
    </Card>
  );
}

export default RESTPostForm;
