'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '../store/userStore';
import { useRouter } from 'next/navigation';
import { checkActivCourse } from '../actions/userActions';
import { FaInfoCircle, FaImages } from 'react-icons/fa'; // אייקונים לדף אודות ודף גלריה
import UserProfile from './UserProfile';
import ProfileImage from './ProfileImage';
import CoursesList from './CoursesList';

const Navbar: React.FC = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showCourses, setShowCourses] = useState(false);

    const { user, logout, isAuthenticated } = useUserStore();
    const router = useRouter();

    const toggleProfile = () => {
        setShowProfile(prev => !prev);
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleNewLearningClick = async () => {
        try {
            const response = await checkActivCourse(user!);
            if (response) {
                router.push("/");
            } else {
                router.push("/pages/user/newLearning");
            }
        } catch (error) {
            console.error("שגיאה במהלך בדיקת הקורס הפעיל:", error);
            alert("אירעה שגיאה, נסה שוב מאוחר יותר.");
        }
    };

    return (
        <>
            {/* ניווט צדדי שקוף */}
            <nav className="fixed left-0 bottom-0 z-10 flex flex-col items-center space-y-6 p-4 h-full">
                {/* כפתור פרופיל למעלה */}
                <button
                    onClick={toggleProfile}
                    className="bg-transparent text-white hover:text-gray-400 rounded-full p-2 m-2 absolute bottom-22 left-4 "
                >
                    {user && <ProfileImage url={user.profileImage!} firstName={user.firstName!} size={"small"} />}
                </button>

                {/* אם פתוח, הצג את פרופיל המשתמש */}
                {showProfile && <UserProfile openBar={showProfile} setOpenBar={setShowProfile} />}

                {/* כפתורים למטה */}
                <div className="flex flex-col items-center space-y-6 mt-auto">
                    {/* כפתור אודות */}
                    <Link href="/pages/user/login" className="bg-blue-500 text-white hover:bg-blue-700 rounded-full p-4 m-2 flex items-center justify-center w-16 h-16 absolute bottom-20 left-4 ">
                        <FaInfoCircle size={24} />
                    </Link>

                    {/* כפתור גלריה */}
                    <Link href="/pages/galery" className="bg-blue-500 text-white hover:bg-blue-700 rounded-full p-4 m-2 flex items-center justify-center w-16 h-16 absolute bottom-4 left-4">
                        <FaImages size={24} />
                    </Link>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
