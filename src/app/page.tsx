'use client'
// import axios from "axios";
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import { useUserStore } from "./store/userStore";




export default function Home() {
const user=useUserStore(st=>st.user);


  return (
    <div className="relative w-full h-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-white to-blue-300 text-gray-800">
      {/* רקע */}
      <div className="absolute inset-0 bg-opacity-30 pointer-events-none">
        <div className="absolute inset-0 blur-3xl opacity-40 bg-gradient-to-t from-blue-200 via-white to-blue-100 rounded-full mix-blend-multiply" />
      </div>

      {/* תוכן */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
           אני אחר, אני אח 
        </h1>
        <p className="mt-4 text-xl md:text-2xl max-w-xl mx-auto">
          כי השינוי מתחיל מאיתנו
        </p>
{
      !user&&
       <div className="mt-8 flex justify-center space-x-4">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg shadow-lg transition-all flex items-center">
            <span>
              <Link href="/pages/user/login" >
                התחברות
              </Link></span>
            <ArrowRightIcon className="h-6 w-6 ml-2" />
          </button>
          <button className="px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 rounded-full font-semibold text-lg shadow-lg border border-blue-600 transition-all flex items-center">
            <span>
              <Link href="/pages/user/signup" >
              הרשמה
            </Link></span>
          </button>
        </div>
}
      </div>
    </div>
  );
}