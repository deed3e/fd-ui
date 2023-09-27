import axios from 'axios'

axios.defaults.baseURL = 'https://localhost:7106'
axios.defaults.headers.common['Content-Type'] = 'application/json'

export const apiGetCall = async (url: string) => {
  const response = axios.get(url)
  return response
}

export const apiPostCall = async (url: string, data?: unknown) => {
  const response = await axios.post(url, data)
  return response
}

export const apiPutCall = async (url: string, data?: unknown) => {
  const response = await axios.put(url, data)
  return response
}

export const apiDeleteCall = async (url: string) => {
  const response = await axios.delete(url)
  return response
}