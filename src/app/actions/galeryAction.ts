import axios from "axios";

export const getImages = async () => {
    try {
        const response = await axios.get('/api/galery/get/getAll');
        return response.data;
    } catch (error) {

        if (error) {
            return { error };
        } else {
            return { error: 'Something went wrong. Please try again.' };
        }
    }
}

export const addImages = async (imageUrl: string) => {
    try {
        const response = await axios.post('/api/galery/post', { imageUrl });
        return response.data;
    } catch (error) {
        console.error("Error in addImages:", error);

        return { error: error || 'Something went wrong. Please try again.' };
    }
}

export const downloadImage = async (url: string, fileName: string) => {
    try {
        const response = await axios.get(`/api/galery/get/download?url=${encodeURIComponent(url)}`, {
            responseType: 'blob', 
        });
        const blobUrl = URL.createObjectURL(response.data);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click(); 
        document.body.removeChild(link); 

        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Error in downloadImage:", error);
        return { error: error || 'Something went wrong. Please try again.' };
    }
};


export const deleteImage=async(imageId:string)=> {
    try {
        const response = await fetch(`/api/galery/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            console.error('Error deleting image', data.error);
            return false;
        }
    } catch (error) {
        console.error('Error', error);
        return false;
    }
}
