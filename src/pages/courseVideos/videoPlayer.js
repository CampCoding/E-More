import React, { useState, useEffect, useRef } from 'react';
import QuizModal from '../../components/QuizModal/QuizModal';
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react';

const VideoPlayerWithQuiz = ({
  currentQuestion,
  isModalOpen,
  setIsModalOpen,
  setCurrentQuestion,
  setCurrentQuestions,
  currentQuestions,
  questions,
  closeModal,
  onSubmitAnswer,
  selectedAnswer,
  setSelectedAnswer,
  showSuccess,
  showWrong,
  answeredQuestions,
  videoUrl
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [isLoading, setIsLoading] = useState(true);
  const lastCheckedTime = useRef(0);

  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const durationRef = useRef(0);
  const propsRef = useRef({ questions, answeredQuestions, isModalOpen, setCurrentQuestion, setIsModalOpen, setCurrentQuestions, showSuccess,
    showWrong, });

  useEffect(() => {
    propsRef.current = { questions, answeredQuestions, isModalOpen, setCurrentQuestion, setIsModalOpen, setCurrentQuestions, showSuccess,
      showWrong, };
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const checkForQuestions = async (currentTimeInSeconds) => {
    const { questions, answeredQuestions, isModalOpen, setCurrentQuestion, setIsModalOpen, setCurrentQuestions } = propsRef.current;

    if (Math.abs(currentTimeInSeconds - lastCheckedTime.current) < 1) {
      return;
    }
    lastCheckedTime.current = currentTimeInSeconds;

    const question = questions.find(
      (q) =>
        Math.abs(currentTimeInSeconds - q.time) <= 2 &&
        !q.answered &&
        !answeredQuestions?.some((a) => a.id === q.id) &&
        !isModalOpen
    );

    if (question) {
      if (playerRef.current) {
        await playerRef.current.pause();
      }
      setCurrentQuestion(question);
      setIsModalOpen(true);
      return;
    }

    const notAnsweredQuestions = questions.filter((q) => {
      return (
        !q.answered &&
        !answeredQuestions?.some((a) => a.id === q.id) &&
        q.time < currentTimeInSeconds
      );
    });

    if (notAnsweredQuestions.length > 0) {
      if (playerRef.current) {
        await playerRef.current.pause();
      }
      setIsModalOpen(true);
      const allNotAnsweredQuestions = notAnsweredQuestions.map(
        (item, index) => {
          if (index === 0) item.open = true;
          return item;
        }
      );
      setCurrentQuestions(allNotAnsweredQuestions);
    }
  };

  const initializePlayer = async () => {
    setIsLoading(true);
    if (iframeRef.current && typeof window.PeerTubePlayer !== 'undefined') {
      try {
        const player = new window.PeerTubePlayer(iframeRef.current);
        await player.ready;
        playerRef.current = player;

        player.addEventListener('playbackStatusUpdate', async (status) => {
          durationRef.current = status.duration;
          const pct = status.duration
            ? (status.position / status.duration) * 100
            : 0;

          setProgress(pct);
          setCurrentTime(formatTime(status.position));
          setTotalTime(formatTime(status.duration));
          setIsPlaying(status.playbackState === 'playing');
          setIsMuted(status.volume === 0);
          setVolume(status.volume);
          setIsLoading(false);

          if (status.playbackState === 'playing') {
            await checkForQuestions(status.position);
          }
        });
        
        console.log('Player initialized for URL:', videoUrl);
      } catch (error) {
        console.error('Error initializing player:', error);
        setIsLoading(false);
      }
    } else {
      console.log('PeerTube player not available yet');
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // Load PeerTube script only once
    let script = document.querySelector('script[src="https://unpkg.com/@peertube/embed-api/build/player.min.js"]');
    
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://unpkg.com/@peertube/embed-api/build/player.min.js';
      script.async = true;
      
      script.onload = () => {
        console.log('PeerTube script loaded');
      };
      
      script.onerror = () => {
        console.error('Failed to load PeerTube script');
      };
      
      document.head.appendChild(script);
    }

    return () => {
      // Don't remove the script on component unmount
      // Just clean up the player
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (videoUrl) {
      // Reset player state
      setProgress(0);
      setCurrentTime('0:00');
      setTotalTime('0:00');
      setIsPlaying(false);
      setIsLoading(true);
      
      // Destroy previous player if it exists
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      
      // Small delay to ensure iframe is ready
      const timer = setTimeout(() => {
        initializePlayer();
      }, 300);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [videoUrl]);

  const handlePlayPause = async () => {
    if (playerRef.current) {
      if (await playerRef.current.isPlaying()) {
        await playerRef.current.pause();
      } else {
        await playerRef.current.play();
      }
    }
  };

  const handleProgressChange = async (e) => {
    const newProgress = parseFloat(e.target.value);
    const time = (newProgress / 100) * durationRef.current;

    if (playerRef.current) {
      await playerRef.current.seek(time);
      await checkForQuestions(time);
    }
  };

  const handleProgressClick = async (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = (x / rect.width) * 100;
    const time = (pct / 100) * durationRef.current;

    if (playerRef.current) {
      await playerRef.current.seek(time);
      await checkForQuestions(time);
    }
  };

  const handleMuteToggle = async () => {
    if (playerRef.current) {
      const vol = await playerRef.current.getVolume();
      await playerRef.current.setVolume(vol > 0 ? 0 : 1);
    }
  };

  const handleChangeVolume = async (e) => {
    if (playerRef.current) {
      const newVolume = parseFloat(e.target.value);
      await playerRef.current.setVolume(newVolume);
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleChangeSpeed = async (e) => {
    if (playerRef.current) {
      const newSpeed = parseFloat(e.target.value);
      await playerRef.current.setPlaybackRate(newSpeed);
      setPlaybackSpeed(newSpeed);
    }
  };

  const handleChangeQuality = async (e) => {
    if (playerRef.current) {
      const newQuality = e.target.value;
      await playerRef.current.setResolution({ id: newQuality });
      setQuality(newQuality);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div key={videoUrl} className="!w-[100%] mx-auto overflow-hidden bg-gray-900 shadow-2xl rounded-2xl !z-[9999] relative">
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-black rounded-t-2xl group !max-h-[100%]"
      >
        <div className="relative w-full md:pt-[56.25%]">
          <iframe
            key={videoUrl}
            ref={iframeRef}
            className="md:absolute top-0 left-0 w-full h-full"
            src={`${videoUrl}`}
            allow="autoplay; fullscreen; allowfullscreen;"
            allowFullScreen
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white text-sm">جاري تحميل الفيديو...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 transition-opacity duration-300 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          {/* Progress Bar */}
          <div className="mb-2 sm:mb-3">
            <div
              className="relative w-full h-1.5 sm:h-2 cursor-pointer"
              onClick={handleProgressClick}
            >
              <input
                type="range"
                value={progress}
                min="0"
                max="100"
                step="0.1"
                onChange={handleProgressChange}
                className="absolute w-full h-full rounded-full appearance-none cursor-pointer bg-white/20 slider"
                dir="ltr"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-start gap-2">
              <button
                onClick={handlePlayPause}
                className="p-2 sm:p-3 text-white transition-all duration-200 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] flex items-center justify-center"
                aria-label="Play/Pause"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2 gap-2">
                <button
                  onClick={handleMuteToggle}
                  className="p-2 transition-all duration-200 rounded-full bg-blue-600 text-white/80 hover:text-white hover:bg-white/10 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] flex items-center justify-center"
                  aria-label="Mute/Unmute"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  dir="ltr"
                  value={volume}
                  onChange={handleChangeVolume}
                  className="w-16 sm:w-20 h-1 rounded-full appearance-none bg-white/20 slider hidden sm:block"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                      volume * 100
                    }%, rgba(255,255,255,0.2) ${
                      volume * 100
                    }%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
              </div>

              <div className="mb-1 sm:mb-2 text-[10px] sm:text-xs font-medium text-center text-white/80">
                {currentTime} / {totalTime}
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end  gap-2">
              <select
                value={playbackSpeed}
                onChange={handleChangeSpeed}
                className="p-1.5 sm:p-2 text-xs sm:text-sm text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <option key={speed} value={speed}>
                    {speed}x
                  </option>
                ))}
              </select>

              {/* Quality Control */}
              <select
                value={quality}
                onChange={handleChangeQuality}
                className="p-1.5 sm:p-2 text-xs sm:text-sm text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {['auto', '1080', '720', '480', '360'].map((q) => (
                  <option key={q} value={q}>
                    {q === 'auto' ? 'Auto' : `${q}p`}
                  </option>
                ))}
              </select>

              <button
                onClick={handleFullscreen}
                className="p-2 transition-all duration-200 rounded-full bg-blue-600 text-white/80 hover:text-white hover:bg-white/10 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] flex items-center justify-center"
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize className="text-base sm:text-lg" />
                ) : (
                  <Maximize className="text-base sm:text-lg" />
                )}
              </button>
            </div>
          </div>
        </div>
console.log(showSuccess, showWrong )
        {isFullscreen && (
          <QuizModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setCurrentQuestion(null);
            }}
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            onSubmit={onSubmitAnswer}
            isFullscreen={isFullscreen}
            showSuccess={showSuccess}
            showWrong={showWrong}
          />
        )}

        {isFullscreen && currentQuestions && currentQuestions?.length
          ? currentQuestions.map((question, index) => (
              <QuizModal
                isOpen={isModalOpen && question?.open}
                onClose={closeModal}
                question={question}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={setSelectedAnswer}
                onSubmit={onSubmitAnswer}
                isFullscreen={false}
                showSuccess={showSuccess}
                showWrong={showWrong}
              />
            ))
          : null}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        @media (min-width: 640px) {
          .slider::-webkit-slider-thumb {
            width: 16px;
            height: 16px;
          }
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>

      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        rel="stylesheet"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default VideoPlayerWithQuiz;