import axios from 'axios'

export const RESTURI = 'https://calm-escarpment-72991.herokuapp.com/'

// export const RESTURI = 'http://localhost:8080/'

export default axios.create({
  baseURL: RESTURI,
  headers: {
    'Content-type': 'application/json',
  },
})
