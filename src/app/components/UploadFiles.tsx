import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UploadFilesProps } from '../types/props/UploadFilesProps';
import { fetchFilesForCourse, saveFile } from '../actions/courseAction';

const UploadFiles: React.FC<UploadFilesProps> = ({ courseId, userName }) => {
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<{
        studentFiles: { fileUrl: string; userName: string }[];
        otherFiles: { fileUrl: string; userName: string }[];
    }>({
        studentFiles: [],
        otherFiles: []
    });

    const uploadFile = async (file: File) => {
        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            const fileUrl = response.data.secure_url;
            setFileUrl(fileUrl);

            const res = await saveFile(fileUrl, courseId, userName);
            console.log("res savefiles0", res);

        } catch (error) {
            console.error("Error uploading file:", error);
            setError("Failed to upload file, please try again.");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetchFilesForCourse(courseId);
                if (response && Array.isArray(response)) {
                    const studentFiles = response.filter((file) => file.userName === userName);
                    const otherFiles = response.filter((file) => file.userName !== userName);

                    setUploadedFiles({ studentFiles, otherFiles });
                } else {
                    console.error('No files found for this course.');
                }
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, [courseId, userName]);

   
    return (
        <div className="container mx-auto p-4 grid grid-cols-3 gap-6">
            {/* צד העלאת קבצים */}
            <div className="col-span-1 p-4 border rounded-md shadow-lg max-w-xs overflow-hidden">
                <h1 className="text-2xl font-bold mb-4">העלאת קבצים</h1>
                <div className="relative">
                    {/* צד העלאת הקובץ */}
                    <input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                uploadFile(e.target.files[0]);
                            }
                        }}
                        disabled={uploading}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="border-2 border-dashed p-4 text-center">
                        <p className="text-gray-500">{fileUrl ? 'File Selected' : 'No file selected'}</p>
                        <button
                            disabled={uploading}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                        >
                            {uploading ? 'Uploading...' : 'Upload File'}
                        </button>
                    </div>
                </div>
                {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {fileUrl && (
                    <div className="mt-4">
                        <p className="text-green-500">File uploaded successfully!</p>
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            View Uploaded File
                        </a>
                    </div>
                )}
            </div>



            {/* צד הצגת הקבצים */}
            <div className="col-span-2 p-1 border rounded-md shadow-lg">
                <h2 className="text-xl font-semibold mb-1">קבצים שהועלו</h2>

                {/* קבצים שהועלו על ידי המשתמש הנוכחי */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-600">הקבצים שלך:</h3>
                    {uploadedFiles.studentFiles.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {uploadedFiles.studentFiles.map((file, index) => (
                                <div key={index} className="p-2 border rounded-md shadow-md">
                                    <p className="text-sm font-semibold">{file.userName}</p>
                                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={file.fileUrl}
                                            alt={`Uploaded File ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-md shadow-md"
                                        />
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No files found for you.</p>
                    )}
                </div>

                {/* קבצים שהועלו על ידי משתמשים אחרים */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-green-600">קבצים של אחר:</h3>
                    {uploadedFiles.otherFiles.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {uploadedFiles.otherFiles.map((file, index) => (
                                <div key={index} className="p-2 border rounded-md shadow-md">
                                    <p className="text-sm font-semibold">{file.userName}</p>
                                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={file.fileUrl}
                                            alt={`Uploaded File ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-md shadow-md"
                                        />
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>לא נמצאו קבצים להצגה.</p>
                    )}
                </div>
            </div>
        </div>
    );

};

export default UploadFiles;
