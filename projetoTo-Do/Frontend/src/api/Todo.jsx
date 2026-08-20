import axios from "axios";
// Config para o back conversar com o front
const api = axios.create({
    baseURL:"http://localhost:5000/ToDo",
    headers: {
        "Content-Type": "application/json"
    }
})

export const getTodo=()=>api.get("/GetAll");
export const createTodo=(data)=>api.post("/Create", data);
export default api;