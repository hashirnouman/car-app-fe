import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

class AxiosInterceptor {
    private static instance: AxiosInterceptor;
    private axiosInstance: AxiosInstance;

    // Private constructor to prevent direct instantiation
    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:8000', // Replace with your API base URL
            // baseURL: 'http://10.105.1.152:8000/api', // Replace with your API base URL
            timeout: 70000,
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' +  localStorage.getItem('token'),
            },
        });

        // Setting up the request and response interceptors
        this.setupInterceptors();
    }

    // Public static method to access the single instance
    public static getInstance(): AxiosInterceptor {
        if (!AxiosInterceptor.instance) {
            AxiosInterceptor.instance = new AxiosInterceptor();
        }
        return AxiosInterceptor.instance;
    }

    // Getter for the axios instance
    public getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }

    // Set up request and response interceptors
    private setupInterceptors(): void {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                // You can modify the request config here
                const token = localStorage.getItem('token'); // Example: Add auth token
                if (token && config.headers) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error: AxiosError) => {
                // Handle request error
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // You can modify the response here
                return response;
            },
            (error: AxiosError) => {
                // Handle response error
                if (error.response?.status === 401) {
                    // Handle unauthorized error, redirect to login, etc.
                    console.error('Unauthorized access - redirecting to login');
                }
                return Promise.reject(error);
            }
        );
    }
}

const Axios = AxiosInterceptor.getInstance().getAxiosInstance();
export default Axios;