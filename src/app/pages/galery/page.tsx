"use client";
import { MdDelete } from "react-icons/md";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
import { CldImage } from "next-cloudinary";
import { IoMdDownload } from "react-icons/io";
import { addImages, deleteImage, downloadImage, getImages } from "@/app/actions/galeryAction";
import { useUserStore } from "@/app/store/userStore";

const UploadAndDisplay = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<{ _id: string, imageUrl: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


    const { user } = useUserStore();

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

    const openModal = (imageUrl: string) => {
        setSelectedImage(imageUrl); // הצגת התמונה שנבחרה במודל
        setModalOpen(true); // פתיחת המודל
    };

    const closeModal = () => {
        setModalOpen(false); // סגירת המודל
        setSelectedImage(null); // אפס את התמונה שנבחרה
    };

    const handleDeleteImage = async (imageId: string) => {
        const success = await deleteImage(imageId); // מחיקה מהשרת
        if (success) {
            setUploadedImages((prev) =>
                prev.filter((img) => img._id !== imageId)
            ); // עדכון הסטייט

}}
    return (
        <div className="relative bg-[#f5f5f5] min-h-screen py-12"> {/* רקע בהיר לכל הדף */}
            {/* כותרת מעוצבת */}
            <h1 className="mt-6 text-center text-4xl font-lora font-bold text-[#1A237E] animate__animated animate__fadeInDown animate__delay-1s">
                ---בואו תוסיפו לנו השראה
            </h1>
            {/* כפתור העלאת תמונה */}
            <div className="fixed bottom-10 left-10 group z-10"> {/* כפתור תמיד עליון על התמונות */}
                <label htmlFor="file-upload" className="bg-blue-400 text-white rounded-full w-20 h-20 flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-all duration-300 group-hover:w-32 group-hover:h-32 group-hover:text-lg group-hover:bg-blue-600">
                    <span className="text-4xl transition-all duration-300 group-hover:opacity-0 group-hover:w-full group-hover:h-full group-hover:flex group-hover:justify-center group-hover:items-center group-hover:rotate-45">
                        +
                    </span>
                    <span className="absolute transition-all duration-300 group-hover:opacity-100 group-hover:text-2xl group-hover:left-1/2 group-hover:transform group-hover:-translate-x-1/2 group-hover:top-1/2 group-hover:-translate-y-1/2">
                        +
                    </span>
                </label>
                <input
                    id="file-upload"
                    type="file"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            uploadImage(e.target.files[0]);
                        }
                    }}
                    className="hidden"
                />
            </div>

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
                            className="flex flex-wrap justify-center -mx-2 gap-1"
                            columnClassName="px-2"
                        >
                            {uploadedImages.slice().reverse().map((image, index) => (
                                <div key={index} className="p-2 z-0">
                                    <div className="relative w-full h-auto z-0">
                                        <CldImage
                                            src={image.imageUrl}
                                            alt={`Uploaded Image ${index + 1}`}
                                            width={800}
                                            height={800}
                                            onClick={() => openModal(image.imageUrl)}
                                            className="w-full h-full object-cover rounded-lg shadow-lg"

                                            onLoad={() => {
                                                // עדכון סידור ברגע שהתמונה נטענת
                                                const masonryGrid = document.querySelector(".flex");
                                                if (masonryGrid) {
                                                    masonryGrid.dispatchEvent(new Event("resize"));
                                                }
                                            }}

                                        />
                                        <div className="bg-white">
                                            <button
                                                className="absolute bottom-2 right-2 p-2 rounded-md text-blue-500 hover:scale-150"
                                                onClick={() => downloadImage(image.imageUrl, `image_${index + 1}.jpg`)}
                                            >
                                                <IoMdDownload />
                                            </button>
                                            {user?.role == "Admin" && (
                                                <button
                                                    className="absolute bottom-2 right-7 p-2 rounded-md text-red-500 hover:scale-150"
                                                    onClick={() => handleDeleteImage(image._id)}
                                                >
                                                    <MdDelete />
                                                </button>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Masonry>
                    ) : (
                        <p>No images found.</p>
                    )}

                    {modalOpen && selectedImage && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="relative max-w-4xl">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-2 right-2 text-white text-3xl"
                                >
                                    X
                                </button>
                                <img
                                    src={selectedImage}
                                    alt="Large view"
                                    className="w-auto max-h-[90vh] rounded-lg"
                                />
                            </div>
                        </div>
                    )}
                </div>



            )}
        </div>
    );
};



export default UploadAndDisplay;

