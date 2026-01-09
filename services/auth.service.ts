
import { LoginType, RegisterType } from "@/types/auth";
import api from "@/util/api";

export const authApi = {
    login: async (payload: LoginType) => {
        const response = await api.post('/api/user/auth/login', payload)
        return response.data;
    },

    register: async (payload: RegisterType) => {
        const response = await api.post("/api/user/auth/register", payload)
        return response.data
    }
}