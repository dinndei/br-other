// 'use client'
// import React, { useState, useEffect } from 'react';
// import  IUser  from '../../../types/IUser';
// import { useHistory } from 'react-router-dom';

// const Page: React.FC = () => {
//     const [user, setUser] = useState<IUser | null>(null);
//     const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
//     const history = useHistory();

//     useEffect(() => {
//         fetchUserData();
//     }, []);

//     const fetchUserData = async () => {
//         const response = await fetch('/api/user');
//         const data = await response.json();
//         setUser(data);
//     };

//     const handleFieldClick = (field: string) => {
//         setEditing({ ...editing, [field]: true });
//     };

//     const handleBlur = async (field: string, value: any) => {
//         await updateUserField(field, value);
//         setEditing({ ...editing, [field]: false });
//     };

//     const updateUserField = async (field: string, value: any) => {
//         const response = await fetch('/api/user/update', {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ [field]: value }),
//         });
//         const updatedUser = await response.json();
//         setUser(updatedUser);
//     };

//     if (!user) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
//             <form>
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700">First Name</label>
//                     {editing.firstName ? (
//                         <input
//                             className="mt-1 p-2 border border-gray-300 rounded-md w-full"
//                             defaultValue={user.firstName}
//                             onBlur={(e) => handleBlur('firstName', e.target.value)}
//                             autoFocus
//                         />
//                     ) : (
//                         <span
//                             className="block p-2 bg-gray-100 rounded-md cursor-pointer"
//                             onClick={() => handleFieldClick('firstName')}
//                         >
//                             {user.firstName}
//                         </span>
//                     )}
//                 </div>

//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700">Last Name</label>
//                     {editing.lastName ? (
//                         <input
//                             className="mt-1 p-2 border border-gray-300 rounded-md w-full"
//                             defaultValue={user.lastName}
//                             onBlur={(e) => handleBlur('lastName', e.target.value)}
//                         />
//                     ) : (
//                         <span
//                             className="block p-2 bg-gray-100 rounded-md cursor-pointer"
//                             onClick={() => handleFieldClick('lastName')}
//                         >
//                             {user.lastName}
//                         </span>
//                     )}
//                 </div>

//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700">Email</label>
//                     {editing.email ? (
//                         <input
//                             className="mt-1 p-2 border border-gray-300 rounded-md w-full"
//                             defaultValue={user.email}
//                             onBlur={(e) => handleBlur('email', e.target.value)}
//                         />
//                     ) : (
//                         <span
//                             className="block p-2 bg-gray-100 rounded-md cursor-pointer"
//                             onClick={() => handleFieldClick('email')}
//                         >
//                             {user.email}
//                         </span>
//                     )}
//                 </div>

//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700">Age</label>
//                     {editing.age ? (
//                         <input
//                             className="mt-1 p-2 border border-gray-300 rounded-md w-full"
//                             type="number"
//                             defaultValue={user.age}
//                             onBlur={(e) => handleBlur('age', e.target.value)}
//                         />
//                     ) : (
//                         <span
//                             className="block p-2 bg-gray-100 rounded-md cursor-pointer"
//                             onClick={() => handleFieldClick('age')}
//                         >
//                             {user.age}
//                         </span>
//                     )}
//                 </div>

//                 <button
//                     className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
//                     onClick={(e) => {
//                         e.preventDefault();
//                         alert('Changes confirmed!');
//                         // Optional: You can also redirect to profile page after update
//                         // history.push('/profile');
//                     }}
//                 >
//                     Confirm Changes
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Page;
