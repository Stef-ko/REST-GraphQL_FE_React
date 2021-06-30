import axios from 'axios'

export const RESTURI = 'https://calm-escarpment-72991.herokuapp.com/'

export default axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: RESTURI,
  headers: {
    'Content-type': 'application/json',
  },
})
