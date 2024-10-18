import Axios from "@/utils/axios";
export const login = async (email: string, password: string) => {
    try {
        const response = await Axios.post("/login", { email, password });
        return response.data;
    } catch (error: unknown) {
        console.log(error);
    }
};
