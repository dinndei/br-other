
'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '../store/userStore';
import { useRouter } from 'next/navigation';
import { checkActivCourse } from '../actions/userActions';


const Navbar: React.FC = () => {
    const [showProfile, setShowProfile] = useState(false);
    const { user, logout, isAuthenticated } = useUserStore();
    const router = useRouter();

console.log(showProfile);

    const toggleProfile = () => {
        setShowProfile(prev => !prev);
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleNewLearningClick = async () => {
        console.log("vdbewr", user);

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

    return (

        <nav className="bg-gray-800 p-4">
            <div className="flex justify-between items-center">
                {/* פריט ניווט לפרופיל אישי */}
                <button
                    onClick={toggleProfile}
                    className="text-white"
                >
                    פרופיל אישי
                </button>

                {/* אפשרויות נוספות */}
                <div className="flex space-x-4 text-white">
                    {!isAuthenticated ? (
                        <Link href="/pages/user/login">
                            התחברות
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="text-white"
                        >
                            התנתקות
                        </button>
                    )}
                    <button
                        onClick={handleNewLearningClick}
                        className="text-white"
                    >
                        למידה חדשה
                    </button>

                    <button
                        
                        className="text-white"
                    >
                        אודות
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

