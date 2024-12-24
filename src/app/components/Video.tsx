// import { useEffect, useRef } from 'react';

// const Video = ({ stream }: { stream: MediaStream }) => {
//     const videoRef = useRef<HTMLVideoElement>(null);

//     useEffect(() => {
//         if (videoRef.current) {
//             console.log('Setting video source object...');
//             videoRef.current.srcObject = stream;
//         }
//     }, [stream]);

//     return <video ref={videoRef} autoPlay playsInline />;
// };

// export default Video;

import { useEffect, useRef } from 'react';

const Video = ({ stream }: { stream: MediaStream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return <video ref={videoRef} autoPlay playsInline />;
};

export default Video;


