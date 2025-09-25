import { useState, useEffect, useRef } from "react";
import QuizModal from "../../components/QuizModal/QuizModal";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Mic,
  Music2,
  Sparkles,
} from "lucide-react";
import Hls from "hls.js";
import "./style.css";
import "antd/dist/reset.css";
import VideoModal from "./videoModal";
import axios from "axios";
import { decryptData } from "../../utils/decrypt";
import { base_url } from "../../constants";

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
  videoUrl,
  activityVideos = {},
  currentVideo,
}) => {
  console.log("videoUrl", videoUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("0:00");
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState("auto");
  const [levels, setLevels] = useState([]); // HLS quality levels
  const [qualityEnabled, setQualityEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const lastCheckedTime = useRef(0);
  useEffect(() => {
    const v = iframeRef.current;
    if (!v) return;

    const flush = () => {
      // close segment if still counting
      if (lastTickRef.current != null) {
        watchSecondsRef.current += (Date.now() - lastTickRef.current) / 1000;
        lastTickRef.current = null;
      }
      sendRequest({
        type: "heartbeat",
        current_position: Math.floor(v.currentTime || 0),
        cumulative_watch_seconds: Math.floor(watchSecondsRef.current),
      });
    };

    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, []);

  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const durationRef = useRef(0);
  const propsRef = useRef({
    questions,
    answeredQuestions,
    isModalOpen,
    setCurrentQuestion,
    setIsModalOpen,
    setCurrentQuestions,
    showSuccess,
    showWrong,
  });
  // Use axios to POST to https://camp-coding.online/iframe.php with payload { video_url: "<your_video_url_here>" }
  // minute-ended tracking (timeline minutes 1,2,3,...)

  // Per-minute watch time (content seconds) and timeline-minute events sent
  const perMinuteWatchRef = useRef(new Map()); // minuteIndex(0-based) -> seconds watched in that minute
  const lastVideoTimeRef = useRef(null); // last video currentTime we saw
  const sentMinutesRef = useRef(new Set()); // which minute indices (1-based) were already sent
  const watchSecondsRef = useRef(null);
  const lastTickRef = useRef(null);

  // wall-clock ms when playback last advanced
  useEffect(() => {
    perMinuteWatchRef.current = new Map();
    lastVideoTimeRef.current = null;
    sentMinutesRef.current = new Set();
  }, [videoUrl, isPlaying]);

  useEffect(() => {
    sentMinutesRef.current = new Set();
    watchSecondsRef.current = 0;
    lastTickRef.current = null;
  }, [videoUrl, isPlaying]);
  useEffect(() => {
    const v = iframeRef.current;
    if (!v) return;

    const onPlay = () => {
      // start a new timing segment
      lastTickRef.current = Date.now();
    };

    const onPause = () => {
      // close current timing segment
      if (lastTickRef.current != null) {
        watchSecondsRef.current += (Date.now() - lastTickRef.current) / 1000;
        lastTickRef.current = null;
      }
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [isPlaying]);

  // Update your sendRequest to send richer data (or keep console.log if testing)
  const sendRequest = async (payload) => {
    // example:
    // fetch('/api/minute-ended', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });
    const localData = localStorage.getItem("elmataryapp");
    const decryptedUserData = decryptData(localData);

    const z = axios.post(
      "https://camp-coding.tech/emore/admin/reports/insert_into_videos.php",
      JSON.stringify({
        student_id: decryptedUserData?.student_id,
        ...payload,
        video_id: currentVideo?.video_id,
      })
    );
  };

  // Helper function to get iframe src from backend
  const fetchIframeSrc = async () => {
    try {
      const response = await axios.post(
        "https://camp-coding.online/iframe.php",
        {
          video_url: videoUrl,
        }
      );
      console.log(response);
      return response.data || null;
    } catch (error) {
      console.error("Failed to fetch iframe src:", error);
      return null;
    }
  };
  useEffect(() => {
    propsRef.current = {
      questions,
      answeredQuestions,
      isModalOpen,
      setCurrentQuestion,
      setIsModalOpen,
      setCurrentQuestions,
      showSuccess,
      showWrong,
    };
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const checkForQuestions = async (currentTimeInSeconds) => {
    const {
      questions,
      answeredQuestions,
      isModalOpen,
      setCurrentQuestion,
      setIsModalOpen,
      setCurrentQuestions,
    } = propsRef.current;

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
      if (iframeRef.current) {
        await iframeRef.current.pause();
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
      if (iframeRef.current) {
        await iframeRef.current.pause();
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
  const [videoDuration, setVideoDuration] = useState(0);
  const [activeUrl, setActiveUrl] = useState(null);
  // useEffect(() => {
  //   let script = document.querySelector('script[src="https://unpkg.com/@peertube/embed-api/build/player.min.js"]');

  //   if (!script) {
  //     script = document.createElement('script');
  //     script.src = 'https://unpkg.com/@peertube/embed-api/build/player.min.js';
  //     script.async = true;

  //     script.onload = () => {
  //       console.log('PeerTube script loaded');
  //     };

  //     script.onerror = () => {
  //       console.error('Failed to load PeerTube script');
  //     };

  //     document.head.appendChild(script);
  //   }

  //   return () => {
  //     // Don't remove the script on component unmount
  //     // Just clean up the player
  //     if (playerRef.current) {
  //       playerRef.current.destroy();
  //       playerRef.current = null;
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if (videoUrl) {
      // Reset player state
      setProgress(0);
      setCurrentTime("0:00");
      setTotalTime("0:00");
      setIsPlaying(false);
      setIsLoading(true);
      setVideoError(null);
      let retryTimeout = null;
      const video = iframeRef.current;
      const duration = video.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60)
        .toString()
        .padStart(2, "0");
      setTotalTime(`${minutes}:${seconds}`);
      const handleLoadedMetadata = () => {
        setIsLoading(false);
        video.muted = true;
        video.play();
        video.muted = false;
        video.pause();
        setRetryCount(0);
        if (retryCount > 0) {
          setTimeout(() => {
            video.play().catch(() => {});
            video.currentTime = progress;
            setVideoDuration(duration);
          }, 100);
        }
      };
      const handleError = (e) => {
        setIsLoading(true);
        retryTimeout = setTimeout(() => {
          setRetryCount((c) => c + 1);
          if (iframeRef.current) {
            iframeRef.current.load();
          }
        }, 2000);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("error", handleError);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("error", handleError);
        if (retryTimeout) clearTimeout(retryTimeout);
      };
    }
  }, [videoUrl, retryCount]);

  const handlePlayPause = () => {
    const video = iframeRef.current;
    if (video) {
      if (video.paused) {
        video.muted = true;
        video.play();
        video.muted = false;
      } else {
        video.pause();
      }
    }
  };

  const handleProgressChange = (currentTime) => {
    const video = iframeRef.current;
    if (video) {
      checkForQuestions(currentTime);
      const video = iframeRef.current;
      const duration = video.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60)
        .toString()
        .padStart(2, "0");
      setTotalTime(`${minutes}:${seconds}`);
    }
  };

  const handleProgressClick = (e) => {
    const input = e.currentTarget.querySelector('input[type="range"]');
    if (!input) return;
    const rect = input.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const video = iframeRef.current;
    if (video && video.duration) {
      const time = pct * video.duration;
      video.currentTime = time;
      setProgress(pct * 100);
      setCurrentTime(formatTime(time));
      checkForQuestions(time);
    }
  };

  const handleMuteToggle = () => {
    const video = iframeRef.current;
    if (video) {
      video.muted = !video.muted;
    }
  };

  const handleChangeVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = iframeRef.current;

    if (video) {
      video.volume = newVolume;
      video.muted = newVolume === 0;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleChangeSpeed = (e) => {
    const newSpeed = parseFloat(e.target.value);
    const video = iframeRef.current;

    if (video) {
      video.playbackRate = newSpeed;
      setPlaybackSpeed(newSpeed);
    }
  };

  // Helper function to format bitrate
  const bitrateToMbps = (bps) =>
    bps || bps === 0 ? `${(bps / 1_000_000).toFixed(1)} Mbps` : "";

  // Get current quality label
  const getCurrentQualityLabel = () => {
    if (quality === "auto") {
      const video = iframeRef.current;
      if (video && video.hls && video.hls.currentLevel >= 0) {
        const currentLevel = video.hls.levels[video.hls.currentLevel];
        if (currentLevel) {
          const height = currentLevel.height;
          const bitrate = currentLevel.bitrate ?? currentLevel.attrs?.BANDWIDTH;
          return `Auto (${height ? `${height}p` : "Unknown"}${
            bitrate ? ` • ${bitrateToMbps(bitrate)}` : ""
          })`;
        }
      }
      return "Auto";
    }

    const selectedLevel = levels.find(
      (lvl) => lvl.level.toString() === quality
    );
    return selectedLevel ? selectedLevel.label : "Auto";
  };

  // Handle quality change for HLS
  const handleChangeQuality = (e) => {
    const newQuality = e.target.value;
    setQuality(newQuality);

    // Get the HLS instance from the video element
    const video = iframeRef.current;
    if (!video || !video.hls) return;

    const hls = video.hls;

    if (newQuality === "auto") {
      hls.currentLevel = -1; // Enable ABR (Adaptive Bitrate)
    } else {
      // Find the level index for the selected quality
      const levelIndex = parseInt(newQuality);
      if (
        !isNaN(levelIndex) &&
        levelIndex >= 0 &&
        levelIndex < hls.levels.length
      ) {
        hls.currentLevel = levelIndex;
      }
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

  useEffect(() => {
    const video = iframeRef.current;
    if (!video || !videoUrl) return;

    let hls;
    let retryTimeout = null;

    const resetState = () => {
      setProgress(0);
      setCurrentTime("0:00");
      setTotalTime("0:00");
      setIsPlaying(false);
      setIsLoading(true);
      setVideoError(null);
    };

    const setVideoDurationFormatted = () => {
      const duration = video.duration;
      setVideoDuration(duration);
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60)
        .toString()
        .padStart(2, "0");
      setTotalTime(`${minutes}:${seconds}`);
    };

    const handleLoadedMetadata = () => {
      setIsLoading(false);
      setRetryCount(0);
      setVideoDurationFormatted();

      video.muted = true;
      video.play().then(() => {
        video.muted = false;
        video.pause();
      });

      if (retryCount > 0) {
        setTimeout(() => {
          video.play().catch(() => {});
          video.currentTime = progress;
        }, 100);
      }
    };

    const handleError = () => {
      setIsLoading(true);
      retryTimeout = setTimeout(() => {
        setRetryCount((c) => c + 1);
        if (Hls.isSupported() && hls) {
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = videoUrl;
        }
      }, 2000);
    };

    resetState();

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, debug: false });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      // Store HLS instance on video element for quality control
      video.hls = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.currentTime = 0.1;

        // Setup quality levels
        const lvls = (hls.levels || []).map((lvl, idx) => {
          const height =
            lvl.height ||
            (lvl.attrs &&
              lvl.attrs.RESOLUTION &&
              Number(lvl.attrs.RESOLUTION.split("x")[1])) ||
            undefined;
          const bitrate = lvl.bitrate ?? lvl.attrs?.BANDWIDTH ?? undefined;
          const label = `${height ? `${height}p` : `L${idx}`}${
            bitrate ? ` • ${bitrateToMbps(bitrate)}` : ""
          }`;
          return { level: idx, height, bitrate, label };
        });

        // Sort from highest to lowest quality
        lvls.sort((a, b) => (b.height || 0) - (a.height || 0));

        setLevels(lvls);
        setQualityEnabled(lvls.length > 1);
        setQuality("auto");
      });

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("error", handleError);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("error", handleError);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [videoUrl]);

  return (
    <div
      key={videoUrl}
      className="!w-[100%] videoPalyerContainer  mx-auto overflow-hidden bg-gray-900 shadow-2xl rounded-2xl !z-[9999] relative "
    >
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-black rounded-t-2xl group !max-h-[130%]"
      >
        <div className="relative w-full md:pt-[56.25%]">
          {/* <iframe
            key={videoUrl}
            ref={iframeRef}
            className="md:absolute top-0 left-0 w-full h-full"
            src={`${videoUrl}`}
            allow="autoplay; fullscreen; allowfullscreen;"
            allowFullScreen
          /> */}
          <video
            ref={iframeRef}
            muted={true}
            controls={false}
            className="md:absolute top-0 left-0 w-full h-full"
            onTimeUpdate={(e) => {
              const v = e.target;
              const nowT = v.currentTime || 0;
              const duration = v.duration || 1;
              const percent = (nowT / duration) * 100;

              // ... your existing UI code ...
              setProgress(percent);
              setCurrentTime(formatTime(nowT));
              setVideoDuration(duration);
              handleProgressChange(nowT);
              setIsPlaying(!v.paused);

              // ----- ACCUMULATE WATCHED SECONDS INTO MINUTE BUCKETS -----
              // Use playback-time deltas (content seconds). Ignore big jumps (seeks).
              const lastT = lastVideoTimeRef.current;
              if (!v.paused && !v.seeking && lastT != null) {
                let dt = nowT - lastT; // content seconds advanced since last tick
                if (dt > 0 && dt < 5) {
                  // ignore seeks/jumps; adjust threshold as you like
                  let tCursor = lastT; // walk through minutes crossed in this dt window
                  while (dt > 0) {
                    const minuteIdx = Math.floor(tCursor / 60); // 0,1,2,...
                    const nextBoundary = (minuteIdx + 1) * 60; // 60,120,...
                    const chunk = Math.min(dt, nextBoundary - tCursor);

                    perMinuteWatchRef.current.set(
                      minuteIdx,
                      (perMinuteWatchRef.current.get(minuteIdx) || 0) + chunk
                    );

                    dt -= chunk;
                    tCursor += chunk;
                  }
                }
              }
              lastVideoTimeRef.current = nowT;

              // ----- SEND MINUTE-ENDED EVENTS (EVEN IF SKIPPED) -----
              const currentMinute1b = Math.floor(nowT / 60); // 0,1,2,...  (0 means first minute 0:00–0:59)
              for (let m1b = 1; m1b <= currentMinute1b; m1b++) {
                if (!sentMinutesRef.current.has(m1b)) {
                  sentMinutesRef.current.add(m1b);

                  const minuteZeroBased = m1b - 1;
                  const watchedThisMinute = Math.floor(
                    perMinuteWatchRef.current.get(minuteZeroBased) || 0
                  );

                  // Optional: cumulative across all minutes so far (content seconds)
                  const cumulativeWatched = Math.floor(
                    Array.from(perMinuteWatchRef.current.values()).reduce(
                      (a, b) => a + b,
                      0
                    )
                  );

                  sendRequest({
                    type: "timeline_minute_ended",
                    minute: m1b, // 1-based: 1 => 0:00–0:59, 2 => 1:00–1:59, ...
                    at_timeline_second: m1b * 60, // 60,120,...
                    watched_seconds_in_minute: watchedThisMinute, // ✅ WHAT YOU ASKED FOR
                    cumulative_watched_seconds: cumulativeWatched, // (optional)
                    current_position: Math.floor(nowT),
                  });
                }
              }
            }}
          />

          {/* <iframe src="https://player.vdocipher.com/v2/?otp=20160313versASE323l2HcuuTENhewIswTbnMsoxUo8gr0Trpmg1eJZ0vZRM0L7v&playbackInfo=eyJ2aWRlb0lkIjoiYjFlMDlkNjMxODE0MDc1NTU4Y2Y1ZDAxYjk1ZmFhZDYifQ==" style="border:0;height:360px;width:640px;max-width:100%" allowFullScreen="true" allow="encrypted-media"></iframe> */}
          {/* {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white text-sm">جاري تحميل الفيديو...</p>
              </div>
            </div>
          )} */}

          {/* {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
              <div className="flex flex-col items-center">
                <i className="fa fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
                <p className="text-white text-base text-center">{videoError}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    setVideoError(null);
                    // setIsLoading(true);
                    // Try to reload the video
                    if (iframeRef.current) {
                      iframeRef.current.load();
                    }
                  }}
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          )} */}
        </div>

        <div className="absolute videoPlayerControls bottom-0 left-0 right-0 p-2 sm:p-4 transition-opacity duration-300 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
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
                onChange={(e) => {
                  const pct = parseFloat(e.target.value);
                  const time = (videoDuration * pct) / 100;
                  const video = iframeRef.current;
                  if (video) {
                    video.currentTime = time;
                  }
                  setProgress(pct);
                  setCurrentTime(formatTime(time));
                  checkForQuestions(time);
                }}
                className="absolute w-full h-full rounded-full appearance-none cursor-pointer bg-white/20 slider"
                dir="ltr"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`,
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
                    }%, rgba(255,255,255,0.2) 100%)`,
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
              <div className="relative group">
                <select
                  value={quality}
                  onChange={handleChangeQuality}
                  disabled={!qualityEnabled}
                  className="p-1.5 sm:p-2 text-xs sm:text-sm text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={
                    qualityEnabled
                      ? "Select video quality"
                      : "Quality selection unavailable"
                  }
                >
                  <option value="auto">{getCurrentQualityLabel()}</option>
                  {levels.map((lvl) => (
                    <option key={lvl.level} value={lvl.level}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
                {!qualityEnabled && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    No quality options available
                  </div>
                )}
              </div>

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
                key={question.id || index}
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
      <div className="">
        <div className="relative m-3 rounded-3xl border border-white/20 backdrop-blur-xl bg-gradient-to-br from-black/95 via-gray-900/90 to-black/95 p-4 sm:p-6 shadow-2xl overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500/10 via-purple-500/5 to-transparent rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 via-cyan-500/5 to-transparent rounded-full translate-y-12 -translate-x-12 pointer-events-none"></div>

          {/* Enhanced Header */}
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
              <span className="text-white font-bold text-lg sm:text-xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-sm">
                أنشطة إضافية
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
            </div>
          </div>

          {/* Enhanced Buttons Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
            {/* تسميع الكلمات */}
            <div className="relative group">
              <button
                style={{
                  pointerEvents: !currentVideo?.words && "none",
                  opacity: !currentVideo?.words && ".6",
                  cursor: !currentVideo?.words && "not-allowed",
                }}
                onClick={() => {
                  setActiveUrl(currentVideo?.words);
                  console.log("currentVideo", currentVideo);
                }}
                className={`relative w-full cursor-pointer rounded-2xl sm:rounded-3xl px-4 py-4 sm:px-5 sm:py-5 text-white shadow-lg transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden
        bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 hover:from-rose-400 hover:via-red-400 hover:to-orange-400
        flex flex-col items-center justify-center gap-3 text-center min-h-[100px] sm:min-h-[120px] ${
          videoUrl === activityVideos.words
            ? "ring-4 ring-white/60 ring-offset-2 ring-offset-black shadow-2xl scale-105"
            : "hover:shadow-xl"
        }`}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {/* Icon with Enhanced Animation */}
                <div className="relative">
                  <Mic className="w-6 h-6 sm:w-8 sm:h-8 opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-sm" />
                  <div className="absolute -inset-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                </div>

                <span className="relative font-bold text-sm sm:text-base whitespace-nowrap drop-shadow-sm">
                  نطق الكلمات
                </span>

                {/* Active Indicator */}
                {videoUrl === activityVideos.words && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
                )}
              </button>
            </div>

            {/* لحن الأغنية */}
            <div className="relative group">
              <button
                style={{
                  pointerEvents: !currentVideo?.tune && "none",
                  opacity: !currentVideo?.tune && ".6",
                  cursor: !currentVideo?.tune && "not-allowed",
                }}
                onClick={() => setActiveUrl(currentVideo?.tune)}
                className={`relative w-full cursor-pointer rounded-2xl sm:rounded-3xl px-4 py-4 sm:px-5 sm:py-5 text-white shadow-lg transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden
        bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500 hover:from-sky-400 hover:via-indigo-400 hover:to-purple-400
        flex flex-col items-center justify-center gap-3 min-h-[100px] sm:min-h-[120px] ${
          videoUrl === activityVideos.tune
            ? "ring-4 ring-white/60 ring-offset-2 ring-offset-black shadow-2xl scale-105"
            : "hover:shadow-xl"
        }`}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {/* Icon with Enhanced Animation */}
                <div className="relative">
                  <Music2 className="w-6 h-6 sm:w-8 sm:h-8 opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 drop-shadow-sm" />
                  <div className="absolute -inset-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                </div>

                <span className="relative font-bold text-sm sm:text-base whitespace-nowrap drop-shadow-sm">
                  أغنية الدرس
                </span>

                {/* Active Indicator */}
                {videoUrl === activityVideos.tune && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
                )}
              </button>
            </div>

            {/* حل مع الفلاح */}
            <div className="relative group">
              <button
                style={{
                  pointerEvents: !currentVideo?.solve && "none",
                  opacity: !currentVideo?.solve && ".6",
                  cursor: !currentVideo?.solve && "not-allowed",
                }}
                onClick={() => setActiveUrl(currentVideo?.solve)}
                className={`relative w-full cursor-pointer rounded-2xl sm:rounded-3xl px-4 py-4 sm:px-5 sm:py-5 text-white shadow-lg transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden
        bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 hover:from-emerald-400 hover:via-teal-400 hover:to-green-400
        flex flex-col items-center justify-center gap-3 min-h-[100px] sm:min-h-[120px] ${
          videoUrl === activityVideos.solve
            ? "ring-4 ring-white/60 ring-offset-2 ring-offset-black shadow-2xl scale-105"
            : "hover:shadow-xl"
        }`}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {/* Icon with Enhanced Animation */}
                <div className="relative">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 drop-shadow-sm" />
                  <div className="absolute -inset-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                </div>

                <span className="relative font-bold text-sm sm:text-base whitespace-nowrap drop-shadow-sm">
                  حل مع الفلاح
                </span>

                {/* Active Indicator */}
                {videoUrl === activityVideos.solve && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
                )}
              </button>
            </div>

            {/* اختبر نفسك */}
            <div
              className="relative group"
              style={{
                pointerEvents: !currentVideo?.exam?.exam_id && "none",
                opacity: !currentVideo?.exam?.exam_id && ".6",
                cursor: "not-allowed",
              }}
            >
              <a
                href={`/examQuestion/${currentVideo?.exam?.exam_id}`}
                target="_blank"
                className={`relative w-full cursor-pointer rounded-2xl sm:rounded-3xl px-4 py-4 sm:px-5 sm:py-5 text-white shadow-lg transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden
          bg-gradient-to-br from-fuchsia-600 via-pink-500 to-rose-500 hover:from-fuchsia-500 hover:via-pink-400 hover:to-rose-400
          flex flex-col items-center justify-center gap-3 min-h-[100px] sm:min-h-[120px] ${
            videoUrl === activityVideos.test
              ? "ring-4 ring-white/60 ring-offset-2 ring-offset-black shadow-2xl scale-105"
              : "hover:shadow-xl"
          }`}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {/* Icon with Enhanced Animation */}
                <div className="relative">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 drop-shadow-sm" />
                  <div className="absolute -inset-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                </div>

                <span className="relative font-bold text-sm sm:text-base whitespace-nowrap drop-shadow-sm">
                  تسميع الكلمات
                </span>

                {/* External Link Indicator */}
                <div className="absolute top-2 left-2 w-4 h-4 border-2 border-white/60 rounded-sm flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>

                {/* Active Indicator */}
                {videoUrl === activityVideos.test && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
                )}
              </a>
            </div>
          </div>
          <div
            className="relative group !mt-2"
            style={{
              pointerEvents: !currentVideo?.exam?.exam_id && "none",
              opacity: !currentVideo?.exam?.exam_id && ".6",
              cursor: "not-allowed",
            }}
          >
            <a
              href={`/examQuestion/${currentVideo?.unit_exam?.exam_id}`}
              target="_blank"
              className={`relative w-full cursor-pointer rounded-2xl sm:rounded-3xl px-4 py-4 sm:px-5 sm:py-5 text-white shadow-lg transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden
          bg-gradient-to-br from-fuchsia-600 via-pink-500 to-rose-500 hover:from-fuchsia-500 hover:via-pink-400 hover:to-rose-400
          flex flex-col items-center justify-center gap-3 min-h-[100px] sm:min-h-[120px] ${
            videoUrl === activityVideos.test
              ? "ring-4 ring-white/60 ring-offset-2 ring-offset-black shadow-2xl scale-105"
              : "hover:shadow-xl"
          }`}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* Icon with Enhanced Animation */}
              <div className="relative">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 drop-shadow-sm" />
                <div className="absolute -inset-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
              </div>

              <span className="relative font-bold text-sm sm:text-base whitespace-nowrap drop-shadow-sm">
                اختبار الدرس
              </span>

              {/* External Link Indicator */}
              <div className="absolute top-2 left-2 w-4 h-4 border-2 border-white/60 rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>

              {/* Active Indicator */}
              {videoUrl === activityVideos.test && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
              )}
            </a>
          </div>
          {/* Bottom Gradient Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
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

      {activeUrl && (
        <VideoModal activeUrl={activeUrl} setActiveUrl={setActiveUrl} />
      )}
    </div>
  );
};

export default VideoPlayerWithQuiz;
