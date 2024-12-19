'use client'
import React from 'react';
import Link from 'next/link'; // For navigation to the edit page
import { FaPen } from 'react-icons/fa'; // Pencil icon
import { useUserStore } from '../store/userStore';
import IProfileComponentProps from '../types/IProfileComponentProps';
import ProfileImage from './ProfileImage';

const UserProfile: React.FC<IProfileComponentProps> = ({ openBar, setOpenBar }) => {



    const { user} = useUserStore();

    return (

        <div>
            {openBar && user &&
                <div className="fixed top-5 right-5 p-4 bg-white rounded-lg shadow-lg w-64">
                    <button onClick={() => { setOpenBar(false) }}>X</button>

                    <div className="flex flex-col">
                        {/* Profile Image */}
                        <ProfileImage url={user?.profileImage} firstName={user?.firstName}/>
                        {/* User Info */}
                        <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm">Email: {user.email}</p>
                        <p className="text-sm">Age: {user.age}</p>
                        <p className="text-sm">Gender: {user.gender}</p>
                        <p className="text-sm">Role: {user.role}</p>
                        <Link href="/pages/user/editProfile">
                            <button
                                onClick={() => setOpenBar(false)}
                                className="mt-3 flex items-center text-white bg-green-500 px-4 py-2 rounded-md hover:bg-green-600">
                                <FaPen className="mr-2" /> Edit
                            </button>
                        </Link>
                        <Link href="/pages/user/resetPassword">
                            <button
                                onClick={() => setOpenBar(false)}
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
