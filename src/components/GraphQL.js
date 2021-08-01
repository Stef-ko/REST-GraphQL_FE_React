import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  Container,
  Paper,
  Grid,
  CircularProgress,
} from '@material-ui/core/Container'

import Post from './Post'
import PostForm from './PostForm'
import FETCH_POSTS_QUERY from '../util/graphql'
import { Tooltip } from '@material-ui/core'

function GraphQL() {
  const { loading, data: { getPosts: posts } = {} } =
    useQuery(FETCH_POSTS_QUERY)

  const [showDelayTooltip, setshowDelayTooltip] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setshowDelayTooltip(true)
    }, 4000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container maxWidth="sm">
      <h1>GraphQL</h1>
      {posts ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper>
              <PostForm />
            </Paper>
          </Grid>
          {posts.map((post) => (
            <Grid item xs={12}>
              <Paper elevation={2}>
                <Post post={post} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Tooltip
          title="Sorry for beeing slow. I am not getting paid."
          arrow
          placement="right"
          open={showDelayTooltip}
        >
          <CircularProgress />
        </Tooltip>
      )}
    </Container>
  )
}

export default GraphQL
