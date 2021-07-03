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
import httpRestService from '../services/httpRest.service'
import { Context } from '../Store/REST_Request_Store'
import { RESTURI } from '../http-common'

function DeleteButton({ postId, parentCallback }) {
  const useStyles = makeStyles({
    DeleteButton: {
      padding: '0 0 auto 0',
      textAlign: 'right',
    },
  })

  const [, dispatch] = useContext(Context)
  const [deletePostResult, setDeletePostResult] = useState()

  const [open, setOpen] = useState(false)

  const deletePost = () => {
    httpRestService
      .delete(`deletepost/${postId}`)
      .then((res) => {
        setDeletePostResult(() => JSON.stringify(res, null, 2))
        parentCallback(postId)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  //TODO Store Delete Request in Context
  useEffect(() => {
    if (deletePostResult) {
      dispatch({
        type: 'Add_REST_REQUEST',
        payload: {
          Request: 'Delete Post',
          RequestMethod: 'DELETE',
          RequestURL: `${RESTURI}${postId}`,
          RequestBody: '',
          //TODO Fix calculation of Size to be exact or read it from the header
          RequestSize:
            (JSON.stringify(deletePostResult).length * 16) / 8 / 1024 / 2,
          Response: deletePostResult,
        },
      })
    }
  })

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
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={deletePost} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Backdrop>
    </>
  )
}

export default DeleteButton
