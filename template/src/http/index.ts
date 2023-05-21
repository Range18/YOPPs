import axios from 'axios'
import {IAuthResponse} from "../models/IAuthResponse";
import {apiServer} from "../configTemplate";

const api = axios.create({
    withCredentials: true,
    baseURL: apiServer.url
})

api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config
})

api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true
        try {
            const response = await axios.get<IAuthResponse>(`${apiServer.url}`, {withCredentials: true})
            localStorage.setItem('accessToken', response.data.userData.accessToken)
            return api.request(originalRequest)
        } catch (err) {
            console.log('User is Unauthorized')
        }
        throw  error
    }
})

export default api;