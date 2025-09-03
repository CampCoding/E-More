import React, { useState, useEffect, useMemo, useRef, useCallback} from 'react';

export const useArabicFormattedDate = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  const arabicDate = date && new Intl.DateTimeFormat('ar', options)?.format(new Date(date))
  return arabicDate
}

export const GetTime = ({ date }) => {
  const dateTime = new Date(date)

  let hours = dateTime.getHours()
  const minutes = dateTime.getMinutes()
  const seconds = dateTime.getSeconds()

  let period = 'AM'

  // Convert to 12-hour format
  if (hours > 12) {
    hours -= 12
    period = 'PM'
  } else if (hours === 12) {
    period = 'PM'
  } else if (hours === 0) {
    hours = 12
  }

  return (
    <div>
      {seconds} : {minutes} :{' '}
      <span className="fw-bolder " style={{ fontWeight: 'bolder' }}>
        {hours}
      </span>{' '}
      {period}
    </div>
  )
}

export const isToday = (date) => {
  const dateTime = new Date(date)

  const today = new Date()

  const isToday =
    dateTime.getFullYear() === today.getFullYear() &&
    dateTime.getMonth() === today.getMonth() &&
    dateTime.getDate() === today.getDate()

  return isToday
}

export const GetDifferenceInHours = ({ firstTime, secondTime }) => {
  const dateTime1 = new Date(firstTime)
  const dateTime2 = new Date(secondTime)

  const timeDifferenceMs = Math.abs(dateTime2 - dateTime1)

  // Convert milliseconds to hours, minutes, and seconds
  const hours = Math.floor(timeDifferenceMs / (1000 * 60 * 60))
  const minutes = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60))
  // const seconds = Math.floor((timeDifferenceMs % (1000 * 60)) / 1000);

  return (
    <div>
      {hours == 0
        ? ''
        : hours == 1
          ? 'ساعة'
          : hours == 2
            ? 'ساعتان'
            : hours < 10
              ? hours + ' ساعات  '
              : hours + 'ساعة'}{' '}
      {minutes > 0 && hours > 0 && 'و'}{' '}
      {minutes == 0
        ? ''
        : minutes == 1
          ? 'دقيقة واحدة'
          : minutes == 2
            ? 'دقيقتان'
            : minutes < 10
              ? minutes + ' دقائق '
              : minutes + ' دقيقة '}{' '}
      {hours <= 0 && minutes <= 0 && 'اقل من دقيقة'}
    </div>
  )
}



export function useCountdownTimer(targetDate) {

  function formatNumber(num) {
    return num < 10 ? `0${num}` : num;
  }

  const targetToDate = new Date(targetDate).getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const timeDifference =  now - targetToDate;

    if (timeDifference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = formatNumber(Math.floor(timeDifference / (1000 * 60 * 60)));
    const minutes = formatNumber(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = formatNumber(Math.floor((timeDifference % (1000 * 60)) / 1000));

    return { hours, minutes, seconds };
  }

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [targetDate]);

  return timeLeft;
}



export const  formatDate = (date , locale = "en" , includeTime = false) => {
  const options = {
    weekday: 'short',  // Thu
    year: 'numeric',   // 2024
    month: 'short',    // Aug
    day: '2-digit',    // 15
    hour12: true  ,     // AM/PM format    
  };


  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}


export function useCountdownTimerMinutes(initialMinutes, onFinish) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isStopped, setIsStopped] = useState(false);
  const startTime = useRef(initialMinutes !== null ? Date.now() + initialMinutes * 60000 : null);
  const timerRef = useRef(null);

  // Start and manage the timer
  useEffect(() => {
    if (startTime.current === null || isStopped) {
      // Start time not yet available or the timer is stopped, skip setting up the timer
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timerRef.current); // Cleanup interval on component unmount
  }, [isStopped]);

  // Check if time is up and trigger onFinish
  useEffect(() => {
    if (startTime.current === null || isStopped) return;

    const remainingTime = Math.max(0, Math.floor((startTime.current - currentTime) / 1000));
    if (remainingTime === 0) {
      clearInterval(timerRef.current); // Stop the interval when time is up
      setIsStopped(true); // Set stopped state to prevent further interval updates
      if (onFinish) onFinish(); // Trigger the onFinish callback if time is up
    }
  }, [currentTime, onFinish, isStopped]);

  // Function to manually stop the timer
  const stop = useCallback(() => {
    clearInterval(timerRef.current);
    setIsStopped(true);
  }, []);

  const timeLeft = Math.max(0, Math.floor((startTime.current - currentTime) / 1000));
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isFinished = timeLeft === 0;

  return { minutes, seconds, isFinished, stop };
}


export function getTimeDifferenceInMinutes(startDate, endDate) {
  // Convert input dates to Date objects (if they aren't already)
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = end - start;

  // Calculate difference in minutes
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));

  return differenceInMinutes;
}


export const changeDateFormat = (input) => {
  const date = new Date(input); 
  const Y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const H = String(date.getHours()).padStart(2, '0');
  const i = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0'); 
  
  return `${Y}-${m}-${d} ${H}:${i}:${s}`;
};


function getDateDifference(date1, date2) {
  // Convert both dates to milliseconds
  const ms1 = new Date(date1).getTime();
  const ms2 = new Date(date2).getTime();

  // Get the absolute difference in milliseconds
  const differenceMs = Math.abs(ms2 - ms1);

  // Convert milliseconds to time components
  const days = Math.floor(differenceMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((differenceMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((differenceMs % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((differenceMs % (60 * 1000)) / 1000);

  return { days, hours, minutes, seconds };
}

