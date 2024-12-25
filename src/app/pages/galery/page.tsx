"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
import { CldImage } from "next-cloudinary";
import { addImages, downloadImage, getImages } from "@/app/actions/galeryAction";

const UploadAndDisplay = () => {
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

            // הוספת התמונה לשרת וטעינת כל התמונות מחדש
            await addImages(uploadedImageUrl);
            fetchImages();

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
            console.log("in gallery page", response);

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
            {/* {imageUrl && <img src={imageUrl} alt="Uploaded" />} */}
            {loading ? (
                <p>Loading images...</p>
            ) : (
                <div>
                    {Array.isArray(uploadedImages) && uploadedImages.length > 0 ? (
                        <Masonry
                            key={uploadedImages.length}
                            breakpointCols={{
                                default: 6,
                                1100: 5,
                                700: 4,
                                500: 3
                            }}
                            className="flex flex-wrap -mx-2 gap-1"
                            columnClassName="px-2"
                        >
                            {uploadedImages.slice().reverse().map((image, index) => (
                                <div key={index} className="p-2 z-0">
                                    <div className="relative w-full h-auto">
                                        <CldImage
                                            src={image}
                                            alt={`Uploaded Image ${index + 1}`}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover rounded-lg shadow-lg"

                                            onLoad={() => {
                                                // עדכון סידור ברגע שהתמונה נטענת
                                                const masonryGrid = document.querySelector(".flex");
                                                if (masonryGrid) {
                                                    masonryGrid.dispatchEvent(new Event("resize"));
                                                }
                                            }}

                                        />
                                        <button
                                            className="absolute bottom-2 right-2 p-2 rounded-md opacity-70 hover:opacity-100"
                                            onClick={() => downloadImage(image, `image_${index + 1}.jpg`)}
                                        >
                                            ⬇️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </Masonry>
                    ) : (
                        <p>No images found.</p>
                    )}
                </div>
                


            )}
        </div>
    );
};

export default UploadAndDisplay;

