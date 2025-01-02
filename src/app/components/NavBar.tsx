'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '../store/userStore';
import { usePathname, useRouter } from 'next/navigation';
import { checkActivCourse, checkRefusalCnt } from '../actions/userActions';
import UserProfile from './UserProfile';
import ProfileImage from './ProfileImage';
import CoursesList from './CoursesList';
import toast from 'react-hot-toast';
import { RiHome4Line } from "react-icons/ri";



const Navbar: React.FC = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showCourses, setShowCourses] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const pathname = usePathname();

    const { user, logout, isAuthenticated } = useUserStore();
    const router = useRouter();

    const navItemStyle = "text-white px-4 py-2 rounded-md hover:bg-gray-700 hover:scale-110 transition-transform duration-300 text-right";

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
            console.log("respomse isActiv", response);

            if (response) {
                toast.error("יש לך למידה פעילה, תאלץ להמתין לסיומה")
                router.push("/");
            }
            else {
               const response = await checkRefusalCnt(user!)
                if (response) {
                    toast.error("על פי בדיקתנו, סירבת לבקשות הלמידה שנשלחו אליך, במידה ותאשר הצעת למידה שתופנה אליך תוכל להמשיך וללמוד")
                    router.push("/");
                }
                else {
                    router.push("/pages/user/newLearning");
                }

            }
        } catch (error) {
            console.error("שגיאה במהלך בדיקת הקורס הפעיל:", error);
            toast.error("אירעה שגיאה, נסה שוב מאוחר יותר.");
        }
    };

    const toggleShowCoursesList = () => {
        setShowCourses(prev => !prev);
        closeMenu()
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        setShowCourses(false);
        setShowProfile(false);
        closeMenu()
    }, [pathname]);

    useEffect(() => {
        setShowProfile(false);
    }, [showCourses]);


    const NavigationLinks = () => (
        <>
            <Link href="/" className={`${navItemStyle} ml-auto`} >
                <RiHome4Line className="text-white text-2xl" />
            </Link>

            <Link href="/pages/general/about" className={navItemStyle} >אודות</Link>
            <Link href="/pages/galery" className={navItemStyle} >גלריה</Link>

            {!user && !isAuthenticated && (
                <Link href="/pages/user/login" className={navItemStyle}>התחברות</Link>
            )}

            {user && isAuthenticated && (
                <>
                    <button onClick={handleNewLearningClick} className={navItemStyle}>למידה חדשה</button>
                    <button onClick={toggleShowCoursesList} className={navItemStyle} >רשימת קורסים</button>
                    <button onClick={handleLogout} className={`${navItemStyle} text-red-500`}>
                        יציאה
                    </button>
                </>
            )}
        </>
    );


    return (

        <>
            {/* נבר עליון */}
            <nav className="bg-black py-4 px-4 fixed top-0 left-0 right-0 z-10 w-full max-w-full min-h-[64px] lg:min-h-[64px]">
                <div className="flex justify-between items-center lg:flex-row-reverse">
                    {user && !isMenuOpen && (
                        <button onClick={toggleProfile} className="text-white lg:absolute lg:left-4 lg:top-4 hidden lg:block">
                            <ProfileImage
                                url={user.profileImage!}
                                firstName={user.firstName!}
                                size={"small"}
                            />
                        </button>
                    )}

                    {/* כפתור המבורגר - יופיע רק בנייד */}
                    <button onClick={toggleMenu} className="text-white lg:hidden absolute right-4 ">
                        <span className="block w-6 h-1 bg-white mb-1"></span>
                        <span className="block w-6 h-1 bg-white mb-1"></span>
                        <span className="block w-6 h-1 bg-white"></span>
                    </button>

                    {/* נבר רגיל - יופיע במסכים גדולים */}
                    <div className="hidden lg:flex space-x-4 flex-row-reverse">
                        <NavigationLinks />
                    </div>
                </div>
            </nav>

            {/* תפריט צד רספונסיבי */}

            <div className={`fixed top-8 right-0 h-full bg-black text-white flex flex-col space-y-4 p-4 z-20 transform  ${isMenuOpen ? "translate-x-0" : "translate-x-full text-right"
                } transition-transform duration-300 lg:hidden`}>

                <div className="flex flex-col flex-grow space-y-4 text-right mt-6">
                    <NavigationLinks />
                    {user && (
                        <button onClick={toggleProfile} className="text-white mt-auto">
                            <ProfileImage
                                url={user.profileImage!}
                                firstName={user.firstName!}
                                size={"small"}
                            />
                        </button>
                    )}
                </div>
            </div >

            {showProfile && (
                <UserProfile openBar={showProfile} setOpenBar={setShowProfile} />
            )
            }

            {showCourses && <CoursesList setShowCourses={setShowCourses}/>}
        </>
    );
}

export default Navbar;
