import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import ICourse from '@/app/types/ICourse';
import { useUserStore } from '@/app/store/userStore';
import { getCoursesByIds } from '../actions/courseAction';
import mongoose from 'mongoose';
import toast from 'react-hot-toast';


const CoursesList: React.FC = () => {
    const user = useUserStore(state => state.user);

    const [courses, setCourses] = useState<ICourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCourseListVisible, setIsCourseListVisible] = useState(true);


    const handleCourseClick = () => {
        setIsCourseListVisible(false);
    };

    function convertObjectIdsToStrings(ids: mongoose.Types.ObjectId[]): string[] {
        return ids.map((id) => id.toString());
    }

    useEffect(() => {
        if (!user) {
            setIsCourseListVisible(false);
        }
    }, [user]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (user && user.courses) {
                try {
                    const courses = convertObjectIdsToStrings(user.courses as mongoose.Types.ObjectId[]);
                    console.log("courses", courses);

                    const response = await getCoursesByIds(courses)
                    setCourses(response); // עדכון הסטייט עם נתוני הקורסים
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            }
            setLoading(false);
        };

        fetchCourses();
    }, [user]);

    if (loading) {
        toast('טוען קורסים', {
            icon: '⏳',
          });
    }

    if (!courses.length) {
       toast.error("אין קורסים להצגה")
    }



    return (
        <div>
            {
                isCourseListVisible && (
                    <div className="fixed top-0 right-0 mt-20 w-full md:w-1/3 h-full bg-gray-800 bg-opacity-90 p-4 transform transition-all duration-300 ease-in-out z-50">
                        <h2 className="text-2xl font-bold text-white mb-4">רשימת קורסים</h2>
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                            {courses.map((course: ICourse) => (
                                <CourseCard key={course.id} course={course} handleCourseClick={handleCourseClick} />
                            ))}
                        </div>
                    </div>
                )
            }
        </div >

    );
};

export default CoursesList;
