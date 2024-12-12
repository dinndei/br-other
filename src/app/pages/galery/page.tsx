"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { CldImage } from "next-cloudinary";
import { addImages, downloadImage, getImages } from "@/app/actions/galeryAction";


const UploadAndDisplay = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const uploadImage = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );

            const uploadedImageUrl = response.data.secure_url;
            setImageUrl(uploadedImageUrl);

        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setUploading(false);
        }
    };

    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await getImages();
            console.log("in galery page", response);

            if (response && Array.isArray(response)) {
                setUploadedImages(response);
            } else {
                console.error('No images found in response');
            }
        } catch (error) {
            console.error("Error fetching images from MongoDB:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        if (imageUrl) {
            addImages(imageUrl)
                .then(() => {
                    fetchImages();
                })
                .catch((error) => {
                    console.error("Error adding image to MongoDB", error);
                });
        }
    }, [imageUrl]);

   
    return (
        <div>
            <input
                type="file"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        uploadImage(e.target.files[0]);
                    }
                }}
            />
            {uploading && <p>Uploading...</p>}
            {imageUrl && <img src={imageUrl} alt="Uploaded" />}
            {loading ? (
                <p>Loading images...</p>
            ) : (
                <div>

                    {Array.isArray(uploadedImages) && uploadedImages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {uploadedImages.map((image, index) => (
                                <div key={index} className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 p-2">
                                    <div className="relative">
                                        <CldImage
                                            src={image}
                                            alt={`Uploaded Image ${index + 1}`}
                                            width={500}
                                            height={300}
                                            className="w-full h-auto rounded-lg shadow-lg"
                                        />
                                        {/* כפתור הורדה */}
                                        <button
                                            className="absolute bottom-2 right-2 p-2 rounded-md shadow-md opacity-75 hover:opacity-100"
                                            onClick={() => downloadImage(image, `image_${index + 1}.jpg`)}
                                        >
                                            ⬇️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No images found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadAndDisplay;
