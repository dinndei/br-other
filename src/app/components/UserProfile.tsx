'use client'
import React from 'react';
import Link from 'next/link'; // For navigation to the edit page
import { FaPen } from 'react-icons/fa'; // Pencil icon
import { useUserStore } from '../store/userStore';
import Image from 'next/image';
import IProfileComponentProps from '../types/IProfileComponentProps';

const UserProfile: React.FC<IProfileComponentProps>= ({openBar, setOpenBar }) => {

   

    const { user, isAuthenticated } = useUserStore();

    // Show loading or fallback UI if the user is not authenticated
    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }

    return (

        <div>
            {openBar && user&& 
                <div className="fixed top-5 right-5 p-4 bg-white rounded-lg shadow-lg w-64">
            <button onClick={()=>{setOpenBar(false)}}>X</button>

                    <div className="flex flex-col">
                        {/* Profile Image */}
                        <div className="w-24 h-24 mb-4 relative">
                            <Image
                                src="/images/בני-משה-אמנות-לבית-למשרד-גלריה-804x1024.jpeg.webp"
                                alt={`${user.firstName} ${user.lastName}`}
                                className="object-cover rounded-full border-2 border-gray-300"
                                fill // Ensures the image fills the parent div
                            />
                        </div>
                        {/* User Info */}
                        <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm">Email: {user.email}</p>
                        <p className="text-sm">Age: {user.age}</p>
                        <p className="text-sm">Gender: {user.gender}</p>
                        <p className="text-sm">Role: {user.role}</p>
                        <Link href="/pages/user/editProfile">
                            <button 
                            onClick={()=>setOpenBar(false)}
                            className="mt-3 flex items-center text-white bg-green-500 px-4 py-2 rounded-md hover:bg-green-600">
                                <FaPen className="mr-2" /> Edit
                            </button>
                        </Link>
                        <Link href="/pages/user/resetPassword">
                            <button 
                            onClick={()=>setOpenBar(false)}
                            className="mt-3 flex items-center text-white bg-green-500 px-4 py-2 rounded-md hover:bg-green-600">
                                <FaPen className="mr-2" />reset password
                            </button>
                        </Link>
                    </div>
                </div>}
        </div>
    );
};

export default UserProfile;
