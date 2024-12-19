'use client'
import axios from "axios";
// import useDataStore from "./store/fieldsStore";
// import { useEffect } from "react";


async function post() {
  console.log("comming to post");
  try {
    const response = await axios.post('/api/fields/postFields');
    console.log("response.data", response.data);

    return response.data;
  } catch (error) {

    if (error) {
      return { error };
    } else {
      return { error: 'Something went wrong. Please try again.' };
    }
  }
}



export default function Home() {
  // const { fieldsData, setFieldsData, setLoading } = useDataStore();

  //טעינת שדות התחלתית למונגו 
  // const { fields, setFields, setLoading } = useDataStore();

 
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (fields.length === 0) {
  //       setLoading(true);
  //       try {
  //         const response = await axios.post('/api/fields/getAllFields');
  //         setFields(response.data.fields);
  //       } catch (error) {
  //         console.error("Error fetching data", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [setFields, setLoading, fields]);



  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
        <button onClick={()=>post()}>לטעינת השדות</button>
        
    </div>
  );
}
