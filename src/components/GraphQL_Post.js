import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
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
  Tooltip,
} from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment'
import EditIcon from '@material-ui/icons/Edit'
import moment from 'moment'

import GraphQLDeleteButton from './GraphQL_DeleteButton'
import { gql, useMutation } from '@apollo/client'
import FETCH_POSTS_QUERY from '../util/graphql'
import { Context } from '../Store/GraphQL_Request_Store'
import { apolloURI } from '../ApolloProvider'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

function GraphQLPost({ post: { id, username, body, createdAt } }) {
  const [editMode, setEditMode] = useState(false)
  const [postBody, setPostBody] = useState(body)
  const [tmpPostBody, setTmpPostBody] = useState(body)

  const [, dispatch] = useContext(Context)
  const [updatePostResult, setUpdatePostResult] = useState()

  const [executiontimeUpdate, setExecutiontimeUpdate] = useState()

  const [updateGraphQLPost] = useMutation(UPDATE_POST_MUTATION, {
    variables: { postId: id, body: tmpPostBody },
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
      })
      setUpdatePostResult(() => JSON.stringify(result, null, 2))
    },
  })

  //Workaround to measure execution time
  const updatePost = () => {
    var start = performance.now()
    updateGraphQLPost()
    var time = performance.now()
    setExecutiontimeUpdate(time - start)
  }

  useEffect(() => {
    if (updatePostResult) {
      dispatch({
        type: 'ADD_GRAPHQL_REQUEST',
        payload: {
          Request: 'Update Post',
          RequestMethod: 'POST',
          RequestURL: apolloURI,
          RequestBody: UPDATE_POST_MUTATION.loc.source.body,
          //TODO Fix calculation of Size to be exact or read it from the header
          RequestSize:
            (JSON.stringify(updatePostResult).length * 16) / 8 / 1024 / 2,
          RequestExecutionTime: executiontimeUpdate,
          Response: updatePostResult,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatePostResult])

  const handleSave = (e) => {
    e.preventDefault()
    setPostBody(tmpPostBody)
    setEditMode(false)
  }

  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {username.charAt(0)}
          </Avatar>
        }
        title={username}
        subheader={moment(createdAt).fromNow()}
      />
      {editMode ? (
        <>
          <form
            onSubmit={(e) => {
              handleSave(e)
            }}
          >
            <CardContent>
              <Grow
                in={true}
                style={{ transformOrigin: '0 0 0' }}
                timeout={800}
              >
                <FormControl fullWidth>
                  <TextField
                    id="standard-basic"
                    label="Edit Post"
                    rows={4}
                    fullWidth
                    variant="outlined"
                    name="postBody"
                    required
                    value={tmpPostBody}
                    onChange={(e) => setTmpPostBody(e.target.value)}
                  />
                </FormControl>
              </Grow>
            </CardContent>
            <CardActions>
              <Button
                type="submit"
                value="SubmitPost"
                variant="contained"
                color="secondary"
                onClick={updatePost}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setEditMode(!editMode)
                  setPostBody(body)
                  setTmpPostBody(body)
                }}
                variant="contained"
                color="primary"
              >
                Cancel
              </Button>
            </CardActions>
          </form>
        </>
      ) : (
        <>
          <CardContent>
            <Typography variant="body2" component="p">
              {postBody}
            </Typography>
          </CardContent>
          <CardActions>
            <Tooltip title="Not implemented" arrow>
              <span>
                <IconButton color="secondary" aria-label="like post" disabled>
                  <FavoriteBorderIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Not implemented" arrow>
              <span>
                <IconButton color="secondary" aria-label="like post" disabled>
                  <CommentIcon />
                </IconButton>
              </span>
            </Tooltip>
            <GraphQLDeleteButton postId={id} />
            <Tooltip title="Edit" arrow>
              <IconButton
                color="secondary"
                aria-label="edit post"
                onClick={() => setEditMode(!editMode)}
              >
                <EditIcon color="action" />
              </IconButton>
            </Tooltip>
          </CardActions>
        </>
      )}
    </Card>
  )
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
`
export default GraphQLPost
