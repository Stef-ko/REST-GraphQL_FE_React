import React, { useContext, useEffect, useState } from 'react'
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
  Tooltip,
} from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment'
import EditIcon from '@material-ui/icons/Edit'
import moment from 'moment'

import RESTDeleteButton from './REST_DeleteButton'
import httpRestService from '../services/httpRest.service'
import { Context } from '../Store/REST_Request_Store'
import { RESTURI } from '../http-common'

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

function RESTPost({
  parentCallback,
  restpost: { _id, username, body, createdAt },
}) {
  const [editMode, setEditMode] = useState(false)
  const [postBody, setPostBody] = useState(body)

  const [, dispatch] = useContext(Context)
  const [updatePostResult, setUpdatePostResult] = useState()

  const classes = useStyles()

  const handleSave = (e) => {
    e.preventDefault()
    // updatePost();
    setEditMode(false)
  }

  const callbackFunction = (postId) => {
    parentCallback(postId)
  }

  const updatePost = () => {
    httpRestService
      .update(_id, postBody)
      .then((res) => {
        setUpdatePostResult(JSON.stringify(res, null, 2))
      })
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    if (updatePostResult) {
      dispatch({
        type: 'Add_REST_REQUEST',
        payload: {
          Request: 'Update Post',
          RequestMethod: 'PUT',
          RequestBody: postBody,
          RequestURL: `${RESTURI}${_id}`,
          //TODO Fix calculation of Size to be exact or read it from the header
          RequestSize:
            (JSON.stringify(updatePostResult).length * 16) / 8 / 1024 / 2,
          Response: updatePostResult,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatePostResult])

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
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                  />
                </FormControl>
              </Grow>
            </CardContent>
            <CardActions>
              <Button
                type="submit"
                value="SubmitPost"
                variant="contained"
                color="primary"
                onClick={updatePost}
              >
                Save
              </Button>
              <Button
                onClick={() => setEditMode(!editMode)}
                variant="contained"
                color="secondary"
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
            <RESTDeleteButton parentCallback={callbackFunction} postId={_id} />
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

export default RESTPost
