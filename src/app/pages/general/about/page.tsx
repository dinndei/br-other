const page = () => {
    return ( 
        <div className="relative w-full h-screen bg-gradient-to-br from-blue-500 via-white to-blue-300">
        <div className="absolute inset-0 bg-opacity-30 z-0">
          <div className="absolute inset-0 blur-3xl opacity-60 bg-gradient-to-t from-blue-200 via-white to-blue-100 rounded-full mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 text-gray-800 text-center">התוכן כאן</div>
      </div>
     );
}
 
export default page;