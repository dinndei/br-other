import { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';

interface VideoCallProps {
  roomUrl: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomUrl }) => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [callObject, setCallObject] = useState<DailyIframe | null>(null);
  const [error, setError] = useState<string | null>(null);

  // פונקציה שמחברת את המשתמש לחדר
  const joinRoom = async () => {
    if (!callObject) return;
    try {
      // הצטרפות לחדר
      await callObject.join({ url: roomUrl });
    } catch (err) {
      setError('לא ניתן להצטרף לחדר: ' + err.message);
    }
  };

  // אתחול של Daily.co API והקמת החדר
  useEffect(() => {
    const initCall = () => {
      const daily = DailyIframe.createCallObject();
      setCallObject(daily);
      daily.on('joined-meeting', () => {
        console.log('המשתמש הצטרף לחדר');
      });
      daily.on('error', (e: any) => {
        setError('שגיאה: ' + e.error);
      });

      // הצגת הוידאו בתוך ה-container
      if (videoContainerRef.current) {
        daily.attachVideoElement(videoContainerRef.current);
      }
    };

    initCall();

    return () => {
      if (callObject) {
        callObject.destroy();
      }
    };
  }, []);

  // קריאה לפונקציה להיכנס לחדר אחרי שהתשתית מוכנה
  useEffect(() => {
    if (callObject && roomUrl) {
      joinRoom();
    }
  }, [callObject, roomUrl]);

  return (
    <div>
      <h2>שיחת וידאו</h2>
      {error && <div className="error-message">{error}</div>}
      <div ref={videoContainerRef} style={{ width: '100%', height: '500px', border: '1px solid black' }} />
    </div>
  );
};

export default VideoCall;
