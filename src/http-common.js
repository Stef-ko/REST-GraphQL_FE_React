import axios from 'axios'

//export const RESTURI = 'http://localhost:8080/'
export const RESTURI = 'https://calm-escarpment-72991.herokuapp.com/'

export default axios.create({
  baseURL: RESTURI,
  headers: {
    'Content-type': 'application/json',
  },
})
