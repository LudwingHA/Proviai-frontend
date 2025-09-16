import axios from "axios";
const API_URL = "http://localhost:5000/api/auth"
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`)
    return response.data
}

export const loginUser = async(credentials) => {
    const respose = await axios.post(`${API_URL}/login`)
    return respose.data
}