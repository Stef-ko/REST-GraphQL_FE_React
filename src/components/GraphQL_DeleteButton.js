import React, { useContext, useEffect, useState } from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { gql, useMutation } from "@apollo/client";
import FETCH_POSTS_QUERY from "../util/graphql";
import { Context } from "../Store/GraphQL_Request_Store";

function GraphQLDeleteButton({ postId }) {
  const useStyles = makeStyles({
    DeleteButton: {
      padding: "0 0 auto 0",
      textAlign: "right",
    },
  });

  const [, dispatch] = useContext(Context);
  const [deletePostResult, setDeletePostResult] = useState();

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    variables: { postId: postId },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      let newData = data;
      newData = [...newData.getPosts.filter((p) => p.id !== postId)];
      setDeletePostResult(() => JSON.stringify(result, null, 2));
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: newData },
      });
    },
  });

  useEffect(() => {
    if (deletePostResult) {
      dispatch({
        type: "ADD_GRAPHQL_REQUEST",
        payload: {
          Request: "Delete Post",
          RequestMethod: "POST",
          RequestURL: "http://localhost:5000/",
          RequestBody: DELETE_POST_MUTATION.loc.source.body,
          //TODO Fix calculation of Size to be exact or read it from the header
          RequestSize:
            (JSON.stringify(deletePostResult).length * 16) / 8 / 1024 / 2,
          Response: deletePostResult,
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletePostResult]);

  const classes = useStyles();
  return (
    <IconButton
      variant='outlined'
      color='secondary'
      aria-label='delete post'
      className={classes.DeleteButton}
      onClick={deletePost}
    >
      <DeleteIcon />
    </IconButton>
  );
}
const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default GraphQLDeleteButton;
