import Axios from "@/utils/axios"; // Import your Axios interceptor
import imageCompression from "browser-image-compression";
import { getCookie } from "cookies-next";
interface CarDetails {
    carmodel: string;
    price: number;
    images: File[];
}

interface UploadResponse {
    message: string;
    car: {
        id: string;
        name: string;
        price: number;
    };
    images: Array<{
        id: string;
        url: string;
    }>;
}

const compressImage = async (file: File) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return new File([compressedFile], file.name, {
            type: compressedFile.type,
            lastModified: new Date().getTime(),
        });
    } catch (error) {
        console.error("Error compressing image:", error);
        return file;
    }
};

export const uploadCarDetails = async (carDetails: CarDetails) => {
    try {
        // Input validation
        if (
            !carDetails.carmodel ||
            !carDetails.price ||
            !carDetails.images.length
        ) {
            throw new Error("Missing required fields");
        }

        // Compress all images
        const compressPromises = carDetails.images.map((image) =>
            compressImage(image)
        );
        const compressedImages = await Promise.all(compressPromises);

        // Create FormData
        const formData = new FormData();
        formData.append("carmodel", carDetails.carmodel);
        formData.append("price", carDetails.price.toString());

        // Append compressed images
        compressedImages.forEach((image) => {
            formData.append("images", image);
        });

        const token = getCookie("auth");
        // Make API call with progress tracking using the interceptor
        const response = await Axios.post<UploadResponse>(
            "/car-details",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {

        console.log(error);
    }
};
