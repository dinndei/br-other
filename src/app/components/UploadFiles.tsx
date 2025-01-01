import React, { useEffect, useState } from 'react';
import { UploadFilesProps } from '../types/props/UploadFilesProps';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const UploadFiles: React.FC<UploadFilesProps> = ({ courseId, userName }) => {
    console.log("storage",supabase.storage);
    
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

        try {
            const fileName = `${userName}_${Date.now()}_${file.name}`;
        
            
            const { data, error: uploadError } = await supabase.storage
                .from('br-other')
                .upload(fileName, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: publicUrlData } = supabase.storage
                .from('br-other')
                .getPublicUrl(data.path);

            if (!publicUrlData.publicUrl) {
                throw new Error('Failed to generate public URL.');
            }

            const fileUrl = publicUrlData.publicUrl;
            setFileUrl(fileUrl);

            const { error: insertError } = await supabase
                .from('files')
                .insert({ fileUrl, courseId, userName });

            if (insertError) {
                throw insertError;
            }

        } catch (error: unknown) {
            console.error('Error uploading file:', error);
            setError('שגיאה בהעלאת הקובץ, נסה שוב');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const { data, error } = await supabase
                    .from('files')
                    .select('*')
                    .eq('courseId', courseId);

                if (error) {
                    throw error;
                }

                if (data) {
                    const studentFiles = data.filter((file) => file.userName === userName);
                    const otherFiles = data.filter((file) => file.userName !== userName);

                    setUploadedFiles({ studentFiles, otherFiles });
                }
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, [courseId, userName]);

    return (
        <div className="container mx-auto p-4 grid grid-cols-3 gap-6">
            <div className="col-span-1 p-4 border rounded-md shadow-lg max-w-xs overflow-hidden">
                <h1 className="text-2xl font-bold mb-4">העלאת קבצים</h1>
                <div className="relative">
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

            <div className="col-span-2 p-1 border rounded-md shadow-lg">
                <h2 className="text-xl font-semibold mb-1">קבצים שהועלו</h2>
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
