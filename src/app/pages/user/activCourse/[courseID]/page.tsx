'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const StudyPage = ({ params }: { params: { courseId: string } }) => {
    const { courseId } = params;
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900">Study Session</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Welcome to your study session for Course ID: <strong>{courseId}</strong>
                    </p>
                </header>

                {/* Main Content */}
                <div className="bg-white shadow-md rounded-lg p-8">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Resources</h2>

                        {/* Chat Link */}
                        <div>
                            <h3 className="text-xl font-medium text-gray-700">Chat with Mentor</h3>
                            <Link href={`/chat/${courseId}`} className="text-blue-500 hover:text-blue-700">
                                Start Chat
                            </Link>
                        </div>

                        {/* Video Call Link */}
                        <div>
                            <h3 className="text-xl font-medium text-gray-700">Video Call</h3>
                            <Link href={`/video-call/${courseId}`} className="text-blue-500 hover:text-blue-700">
                                Join Video Call
                            </Link>
                        </div>

                        {/* File Upload Link */}
                        <div>
                            <h3 className="text-xl font-medium text-gray-700">Upload Files</h3>
                            <Link href={`/upload-files/${courseId}`} className="text-blue-500 hover:text-blue-700">
                                Upload Files
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.back()}
                        className="inline-block px-6 py-2 text-white bg-gray-700 hover:bg-gray-800 rounded-md"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyPage;
