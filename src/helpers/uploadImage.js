const uploadImage = async (image) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/image/upload`;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "yml_product"); // Make sure this preset is configured correctly in Cloudinary
    formData.append("folder", "yml");


    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Cloudinary response error:', errorText);
            throw new Error(`Upload failed: ${errorText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error uploading image:', error.message || error);
        throw error;
    }
};  

export default uploadImage;
