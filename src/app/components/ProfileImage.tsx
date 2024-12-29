'use client'
import React from "react";
import Image from 'next/image';
import { ProfileImageProps } from "../types/props/ProfileImageProps";



const ProfileImage: React.FC<ProfileImageProps> = ({ url, firstName, size = "medium" }) => {

    const sizeClasses = {
        small: "w-12 h-12",
        medium: "w-24 h-24",
        large: "w-32 h-32",
    };

    return (

        <div className={`${sizeClasses[size]} mb-4 relative z-10`}>
            <Image
                src={url || "data:image/png;base64,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"}
                alt={`${firstName}`}
                className="object-cover rounded-md border-2 border-gray-300"
                fill // Ensures the image fills the parent div
            />
        </div>
    );
};

export default ProfileImage;
