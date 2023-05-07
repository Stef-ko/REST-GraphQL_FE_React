import axios from 'axios'

//export const RESTURI = 'http://localhost:8080/'
export const RESTURI = 'http://174.129.120.99:8080/'

export default axios.create({
  baseURL: RESTURI,
  headers: {
    'Content-type': 'application/json',
  },
})
