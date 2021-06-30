import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardActions,
  Avatar,
  Typography,
  CardContent,
  IconButton,
  FormControl,
  Button,
  TextField,
  Grow,
} from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import CommentIcon from "@material-ui/icons/Comment";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";

import GraphQLDeleteButton from "./GraphQL_DeleteButton";
import { gql, useMutation } from "@apollo/client";
import FETCH_POSTS_QUERY from "../util/graphql";
import { Context } from "../Store/GraphQL_Request_Store";

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

function GraphQLPost({ post: { id, body, createdAt } }) {
  const [editMode, setEditMode] = useState(false);
  const [postBody, setPostBody] = useState(body);

  const [, dispatch] = useContext(Context);
  const [updatePostResult, setUpdatePostResult] = useState();

  const [updatePost,] = useMutation(UPDATE_POST_MUTATION, {
    variables: { postId: id, body: postBody },
    update(proxy, result) {
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: {
            id: id,
            body: postBody,
          },
        },
        variables: {
          id: id,
        },
      });
      setUpdatePostResult(() => JSON.stringify(result, null, 2));
    },
  });

  useEffect(() => {
    if (updatePostResult) {
      dispatch({
        type: "ADD_GRAPHQL_REQUEST",
        payload: {
          Request: "Update Post",
          RequestMethod: "POST",
          RequestURL: "http://localhost:5000/",
          RequestBody: UPDATE_POST_MUTATION.loc.source.body,
          //TODO Fix calculation of Size to be exact or read it from the header
          RequestSize:
            (JSON.stringify(updatePostResult).length * 16) / 8 / 1024 / 2,
          Response: updatePostResult,
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatePostResult]);

  const handleSave = (e) => {
    e.preventDefault();
    updatePost();
    setEditMode(false);
  };
  const classes = useStyles();
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
            <GraphQLDeleteButton postId={id} />
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

//TODO Only return success message for update, no need to return complete Post, because it is done seperately anyway
const UPDATE_POST_MUTATION = gql`
  mutation updatePost($postId: ID!, $body: String!) {
    updatePost(postId: $postId, body: $body) {
      id
      body
      createdAt
    }
  }
`;
export default GraphQLPost;
