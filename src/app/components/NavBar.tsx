'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '../store/userStore';
import { usePathname, useRouter } from 'next/navigation';
import { checkActivCourse } from '../actions/userActions';
import UserProfile from './UserProfile';
import ProfileImage from './ProfileImage';
import CoursesList from './CoursesList';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showCourses, setShowCourses] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // מצב של התפריט

    const pathname = usePathname(); // מקבל את הנתיב הנוכחי

    const { user, logout, isAuthenticated } = useUserStore();
    const router = useRouter();

    const navItemStyle = "text-white px-4 py-2 rounded-md hover:bg-gray-700 hover:scale-110 transition-transform duration-300";

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
            toast.error("אירעה שגיאה, נסה שוב מאוחר יותר.");
        }
    };

    const toggleShowCoursesList = () => {
        setShowCourses(prev => !prev);
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev); // משנה את מצב התפריט
    };

    useEffect(() => {
        setShowCourses(false);
        setShowProfile(false);
    }, [pathname]); // מפעיל את ה-useEffect בכל פעם שהנתיב משתנה

    useEffect(() => {
        setShowProfile(false);
    }, [showCourses]); // מפעיל את ה-useEffect בכל פעם שהנתיב משתנה

    return (
        <>
            {/* נבר עליון */}
            <nav className="bg-black p-4 fixed top-0 left-0 right-0 z-10">
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

                    <div className="flex space-x-4">
                        {/* כפתור המבורגר - יוצג רק אם המסך קטן מ-1000 */}
                        <button
                            className="lg:hidden text-white"
                            onClick={toggleMenu}
                        >
                            <span className="block w-6 h-1 bg-white mb-1"></span>
                            <span className="block w-6 h-1 bg-white mb-1"></span>
                            <span className="block w-6 h-1 bg-white"></span>
                        </button>

                        {/* תפריט רספונסיבי */}
                        <div className={`flex flex-col lg:flex-row lg:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
                            {/* תפריט זה מוצג תמיד */}
                            <Link href="/pages/general/about" className={navItemStyle}>
                                אודות
                            </Link>

                            <Link href="/pages/galery" className={navItemStyle}>
                                גלריה
                            </Link>
                            <Link href="/" className={navItemStyle}>
                                בית
                            </Link>

                            <Link href="/pages/user/login" className={navItemStyle}>
                                התחברות
                            </Link>

                            {/* זה מוצג אם יש משתמש רשום */}
                            {user && isAuthenticated &&
                                <>
                                    <button
                                        onClick={handleLogout}
                                        className={navItemStyle}
                                    >
                                        יציאה
                                    </button>
                                    <button
                                        onClick={handleNewLearningClick}
                                        className={navItemStyle}
                                    >
                                        למידה חדשה
                                    </button>

                                    <button
                                        className={navItemStyle}
                                        onClick={toggleShowCoursesList}
                                    >  רשימת קורסים
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </nav>

            {/* תפריט צדדי מתחת לנבר */}
            {showCourses && <CoursesList />}
        </>
    );
}

export default Navbar;
