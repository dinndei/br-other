import axios from "axios";
import ICourse from "../types/ICourse";

export const getCourseByID = async (courseId: string) => {
  try {
    const response = await axios.get(`/api/course/getCourse/${courseId}`);
    return response;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
}

export async function getCoursesByIds(ids: string[]): Promise<ICourse[]> {
  const courses: ICourse[] = [];
  for (const id of ids) {
    try {
      const course = await getCourseByID(id);
      courses.push(course.data.course);
    } catch (error) {
      console.error(`Error fetching course with ID ${id}:`, error);
    }
  }

  return courses;
}

export async function getMentorById(id: string) {
  try {
    const response = await axios.get(`/api/course/getMentor/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
}

export async function saveFile(fileUrl: string, courseId: string, userName: string) {

  try {
    const response = await axios.post('/api/course/files/post', {
      fileUrl,
      courseId,
      userName
    });

    return response.data;
  } catch (error) {
    console.error("Error saving file to database:", error);
    throw error;
  }
};

export const fetchFilesForCourse = async (courseId: string) => {
  try {
      const response = await axios.get(`/api/course/files/get?courseId=${courseId}`);
      
      return response.data;
  } catch (error) {
      console.error('Error fetching files for course:', error);
      throw new Error('Error fetching files');
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
      const response = await axios.delete(`/api/course/delete/${courseId}`);      
      return response;
  } catch (error) {
      console.error('Error delete  course:', error);
      throw new Error('Error delete course');
  }
};


