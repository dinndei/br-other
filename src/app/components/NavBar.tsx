
'use client'
import { useState } from 'react';
import Link from 'next/link';
import ProfileComponent from '../components/UserProfile'
import { useUserStore } from '../store/userStore';


const Navbar: React.FC = () => {
    const [showProfile, setShowProfile] = useState(false);
    const { logout, user, isAuthenticated } = useUserStore();


    const toggleProfile = () => {
        setShowProfile(prev => !prev);
    }

    const handleLogout = () => {
        logout(); // מבצע את פעולת ה-logout
        //router.push('/login'); // הפנייה לדף התחברות
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

                {/* כאן תוכל להוסיף אפשרויות נוספות כמו התחברות/התנתקות */}
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
                    <Link href="/pages/user/new-learning">
                        למידה חדשה
                    </Link>
                </div>
            </div>


            <ProfileComponent openBar={showProfile} setOpenBar={setShowProfile} />

        </nav>
    );
}

export default Navbar;

