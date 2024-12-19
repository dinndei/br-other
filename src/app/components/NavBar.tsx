
'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '../store/userStore';
import { useRouter } from 'next/navigation';
import { checkActivCourse } from '../actions/userActions';
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
            const response = await checkActivCourse(user!)
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

    const toggleCoursesList = () => {
        setShowCourses(prev => !prev);
    };



    return (
        <>
            {/* נבר עליון */}
            <nav className="bg-gray-800 p-4">
                <div className="flex justify-between items-center">
                    <button
                        onClick={toggleProfile}
                        className="text-white"
                    >
                        {user && <ProfileImage url={user.profileImage!} firstName={user.firstName!} size={"small"} />}
                    </button>
                    {showProfile &&
                        <UserProfile openBar={showProfile} setOpenBar={setShowProfile} />
                    }

                    <div className="flex space-x-4 text-white">
                        {!isAuthenticated ? (
                            <>
                                <Link href="/pages/user/login">
                                    התחברות
                                </Link>
                                <button className="text-white">
                                    אודות
                                </button>
                                <Link href="/pages/galery">
                                    גלריה
                                </Link>

                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleLogout}
                                    className="text-white"
                                >
                                    התנתקות
                                </button>
                                <button
                                    onClick={handleNewLearningClick}
                                    className="text-white"
                                >
                                    למידה חדשה
                                </button>
                                <button className="text-white">
                                    אודות
                                </button>
                                <button
                                    className="text-white flex items-center"
                                    onClick={toggleCoursesList}
                                >
                                    {showCourses ? (
                                       <p>  ▲</p>
                                    ) : (
                                       <p>  ▼</p> 
                                    )}
                                    רשימת קורסים
                                </button>
                                <Link href="/pages/galery">
                                    גלריה
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* תפריט צדדי מתחת לנבר */}
            {showCourses && <CoursesList />}
        </>
    );

}

export default Navbar;

