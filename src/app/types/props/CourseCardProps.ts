import ICourse from "../ICourse";

export interface CourseCardProps {
  course: ICourse;
  handleCourseClick: () => void;
}