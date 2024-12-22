import React, { useEffect, useState } from 'react';
import { CourseCardProps } from '../types/props/CourseCardProps';
import { getMentorById } from '../actions/courseAction';
import Link from 'next/link';

const CourseCard: React.FC<CourseCardProps> = ({ course ,handleCourseClick}) => {

    const [mentorName, setMentorName] = useState<string>("");

    useEffect(() => {
        const fetchMentorName = async () => {
            try {
                const response = await getMentorById(course.teacherID.toString())

                console.log("response in component", response);
                const name = response.mentor.firstName + " " + response.mentor.lastName
                setMentorName(name)

            } catch (error) {
                console.error("Error fetching mentor name:", error);
            }
        };

        fetchMentorName();
    }, [course.teacherID]);

    const statusStyle = course.isActiv ? "bg-green-600" : "bg-gray-400";


    return (

        <Link
            href={course.isActiv ? `/pages/user/activCourse/${course._id}` : "#"}
            onClick={handleCourseClick}
            className={`course-card block bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col gap-2 w-full 
        ${course.isActiv ? "cursor-pointer hover:bg-gray-700" : "cursor-not-allowed opacity-50"}`}
        >
            <div className="flex justify-between items-center border-b pb-2 mb-2">
                <p className="text-white">
                    <span className="font-semibold text-gray-300">תחום:</span>{" "}
                    {course.feild.mainField} {course.feild.subField}
                </p>
                {/* עיגול קטן שמציין את המצב */}
                <span
                    className={`w-4 h-4 rounded-full ${statusStyle}`}
                    title={course.isActiv ? "קורס פעיל" : "קורס לא פעיל"}
                ></span>
            </div>
            <div className="flex flex-col gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                <p className="text-white">
                    <span className="font-semibold text-gray-300">מנטור:</span>{" "}
                    {mentorName}
                </p>
            </div>
        </Link>
    );
};

export default CourseCard;
