import React, { useContext, useEffect, useState } from "react";
import {
  makeStyles,
  Typography,
  CardContent,
  IconButton,
  FormControl,
  Button,
  TextField,
  Grow,
  Card,
  CardHeader,
  CardActions,
  Avatar,
} from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import CommentIcon from "@material-ui/icons/Comment";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";

import RESTDeleteButton from "./REST_DeleteButton";
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

function RESTPost({ parentCallback, restpost: { _id, body, createdAt } }) {
  const [editMode, setEditMode] = useState(false);
  const [postBody, setPostBody] = useState(body);

  const [, dispatch] = useContext(Context);
  const [updatePostResult, setUpdatePostResult] = useState();

  const classes = useStyles();

  const handleSave = (e) => {
    e.preventDefault();
    // updatePost();
    setEditMode(false);
  };

  const callbackFunction = (postId) => {
    parentCallback(postId);
  };

  const updatePost = () => {
    httpRestService
      .update(_id, postBody)
      .then((res) => {
        setUpdatePostResult(JSON.stringify(res, null, 2));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (updatePostResult) {
      dispatch({
        type: "Add_REST_REQUEST",
        payload: {
          Request: "Update Post",
          RequestMethod: "PUT",
          RequestBody: postBody,
          RequestURL: `http://localhost:8080/api/posts/updatepost/${_id}`,
          //TODO Fix calculation of Size to be exact or read it from the header
          RequestSize:
            (JSON.stringify(updatePostResult).length * 16) / 8 / 1024 / 2,
          Response: updatePostResult,
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatePostResult]);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label='recipe' className={classes.avatar}>
            S
          </Avatar>
        }
        title='User Name'
        subheader={moment(createdAt).fromNow()}
      />
      <CardContent>
        {editMode ? (
          <Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={800}>
            <form
              onSubmit={(e) => {
                handleSave(e);
              }}
            >
              <FormControl fullWidth>
                <TextField
                  id='standard-basic'
                  label='Edit Post'
                  rows={4}
                  fullWidth
                  variant='outlined'
                  name='postBody'
                  required
                  value={postBody}
                  // autoFocus={inputFocused}
                  onChange={(e) => setPostBody(e.target.value)}
                />
                <CardActions>
                  <Button
                    type='submit'
                    value='SubmitPost'
                    variant='contained'
                    color='secondary'
                    onClick={updatePost}
                  >
                    Save
                  </Button>
                </CardActions>
              </FormControl>
            </form>
          </Grow>
        ) : (
          <Typography variant='body2' component='p'>
            {postBody}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        {editMode ? (
          <></>
        ) : (
          <>
            <IconButton color='secondary' aria-label='like post' disabled>
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton color='secondary' aria-label='like post' disabled>
              <CommentIcon />
            </IconButton>
            <RESTDeleteButton parentCallback={callbackFunction} postId={_id} />
          </>
        )}
        <IconButton
          color='secondary'
          aria-label='edit post'
          onClick={() => setEditMode(!editMode)}
        >
          <EditIcon color={editMode ? "disabled" : "action"} />
        </IconButton>
      </CardActions>
    </Card>
  );
}
export default RESTPost;
