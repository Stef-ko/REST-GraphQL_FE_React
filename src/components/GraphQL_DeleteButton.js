import React, { useContext, useEffect, useState } from 'react'
import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  makeStyles,
  Tooltip,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { gql, useMutation } from '@apollo/client'
import FETCH_POSTS_QUERY from '../util/graphql'
import { Context } from '../Store/GraphQL_Request_Store'
import { apolloURI } from '../ApolloProvider'

function GraphQLDeleteButton({ postId }) {
  const useStyles = makeStyles((theme) => ({
    DeleteButton: {
      padding: '0 0 auto 0',
      textAlign: 'right',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
      width: '100vw',
    },
  }))

  const [, dispatch] = useContext(Context)
  const [deletePostResult, setDeletePostResult] = useState()

  const [open, setOpen] = useState(false)

  const [executiontimeDelete, setExecutiontimeDelete] = useState()

  const [deleteGraphQLPost] = useMutation(DELETE_POST_MUTATION, {
    variables: { postId: postId },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      })
      let newData = data
      newData = [...newData.getPosts.filter((p) => p.id !== postId)]
      setDeletePostResult(() => JSON.stringify(result, null, 2))
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: newData },
      })
    },
  })

  //Workaround to measure execution time
  const deletePost = () => {
    var start = performance.now()
    deleteGraphQLPost()
    var time = performance.now()
    setExecutiontimeDelete(time - start)
  }

  useEffect(() => {
    if (deletePostResult) {
      dispatch({
        type: 'ADD_GRAPHQL_REQUEST',
        payload: {
          Request: 'Delete Post',
          RequestMethod: 'POST',
          RequestURL: apolloURI,
          RequestBody: DELETE_POST_MUTATION.loc.source.body,
          //TODO Fix calculation of Size to be exact or read it from the header
          RequestSize:
            (JSON.stringify(deletePostResult).length * 16) / 8 / 1024 / 2,
          RequestExecutionTime: executiontimeDelete,
          Response: deletePostResult,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletePostResult])

  const handleClose = () => {
    setOpen(false)
  }
  const handleToggle = () => {
    setOpen(!open)
  }

  const classes = useStyles()

  return (
    <>
      <Tooltip title="Delete" arrow>
        <IconButton
          variant="outlined"
          color="secondary"
          aria-label="delete post"
          className={classes.DeleteButton}
          onClick={handleToggle}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Do you really want to delete this post?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description"></DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              type="submit"
              value="SubmitPost"
              variant="contained"
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={deletePost} variant="contained" color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Backdrop>
    </>
  )
}
const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`

export default GraphQLDeleteButton
