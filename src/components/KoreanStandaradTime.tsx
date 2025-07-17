'use client';

import { useEffect, useState } from 'react';

export default function KoreanStandardTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    let offset = 0;

    const fetchTime = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/time/current'); // 배포 시 서버 주소로 변경
        const data = await res.json();

        if (data.success && data.data.timestamp) {
          const serverTimestamp = data.data.timestamp;
          offset = serverTimestamp - Date.now();
          setTime(new Date(Date.now() + offset));
        }
      } catch (error) {
        console.error('시간 정보를 불러오는 데 실패했습니다', error);
      }
    };

    fetchTime();

    const interval = setInterval(() => {
      setTime(new Date(Date.now() + offset));
    }, 33); // 30FPS 정도로 실시간 업데이트

    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <p className="mt-4 text-gray-400 text-lg">시간을 불러오는 중...</p>;
  }

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const millis = String(time.getMilliseconds()).padStart(3, '0');

  return (
    <>
      <p className="mt-10 text-gray-600 font-medium text-base">
        한국 표준시간 (<span className="font-semibold">자체 서버 기준</span>)
      </p>
      <div className="mt-6 flex items-center space-x-6 text-5xl font-mono">
        <span>{hours}</span>
        <span>:</span>
        <span>{minutes}</span>
        <span>:</span>
        <span>{seconds}</span>
        <span>:</span>
        <span>{millis}</span>
      </div>
    </>
  );
}
