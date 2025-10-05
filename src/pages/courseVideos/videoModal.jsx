import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Spin, Select, Tooltip, Popover } from "antd";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Settings,
  MoreHorizontal,
  SkipBack,
  SkipForward,
  Loader2,
} from "lucide-react";
import Hls from "hls.js";

function VideoModal({ activeUrl, setActiveUrl }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);
  const playerIdRef = useRef(`modal-${Math.random().toString(36).slice(2)}`);
  const hideControlsTimer = useRef(null);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [mobileVolumeOpen, setMobileVolumeOpen] = useState(false);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const [desktopVolumeOpen, setDesktopVolumeOpen] = useState(false);

  // UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  // Media state
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("0:00");
  const [videoError, setVideoError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Quality (HLS only)
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("auto");
  const [qualityEnabled, setQualityEnabled] = useState(false);

  const formatTime = (secs) => {
    if (!isFinite(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const bitrateToMbps = (bps) =>
    bps || bps === 0 ? `${(bps / 1_000_000).toFixed(1)} Mbps` : "";

  // Initialize video when activeUrl changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeUrl) return;

    let hls;
    let retryTimeout = null;

    const resetState = () => {
      setProgress(0);
      setCurrentTime("0:00");
      setTotalTime("0:00");
      setIsPlaying(false);
      setIsLoading(true);
      setIsBuffering(false);
      setVideoError(null);
      setDuration(0);
      setCurrent(0);
      setLevels([]);
      setSelectedLevel("auto");
      setQualityEnabled(false);
    };

    const setVideoDurationFormatted = () => {
      const duration = video.duration;
      setDuration(duration);
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60)
        .toString()
        .padStart(2, "0");
      setTotalTime(`${minutes}:${seconds}`);
    };

    const handleLoadedMetadata = () => {
      setIsLoading(false);
      setIsBuffering(false);
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

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const duration = video.duration || 1;
      const percent = (current / duration) * 100;

      setProgress(percent);
      setCurrentTime(formatTime(current));
      setCurrent(current);
      setDuration(duration);
      setIsPlaying(!video.paused);
    };

    const handleError = () => {
      setIsLoading(true);
      setIsBuffering(false);
      retryTimeout = setTimeout(() => {
        setRetryCount((c) => c + 1);
        if (Hls.isSupported() && hls) {
          hls.loadSource(activeUrl);
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = activeUrl;
        }
      }, 2000);
    };

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      // Broadcast that this player started so others can pause
      try {
        window.dispatchEvent(
          new CustomEvent("app-video-play", {
            detail: { id: playerIdRef.current },
          })
        );
      } catch {}
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsBuffering(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setIsBuffering(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsBuffering(false);
    };

    // Clean previous hls
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    resetState();

    video.volume = 1;
    video.muted = false;
    video.controls = false;
    video.preload = "metadata";

    // Add event listeners
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        debug: false,
      });
      hlsRef.current = hls;
      video.hls = hls;

      hls.loadSource(activeUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.currentTime = 0.1;

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

        lvls.sort((a, b) => (b.height || 0) - (a.height || 0));
        setLevels(lvls);
        setQualityEnabled(true);
        setSelectedLevel("auto");
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data?.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
        setIsLoading(false);
        setIsBuffering(false);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = activeUrl;
      setQualityEnabled(false);
      setSelectedLevel("auto");
    } else {
      video.src = activeUrl;
      setQualityEnabled(false);
      setSelectedLevel("auto");
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);

      if (hls) {
        hls.destroy();
      }
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [activeUrl, retryCount]);

  // Listen for other players starting and pause this one if needed
  useEffect(() => {
    const handler = (e) => {
      const otherId = e?.detail?.id;
      if (!otherId || otherId === playerIdRef.current) return;
      const v = videoRef.current;
      if (v && !v.paused) {
        try {
          v.pause();
        } catch {}
      }
    };
    window.addEventListener("app-video-play", handler);
    return () => window.removeEventListener("app-video-play", handler);
  }, []);

  // Fullscreen change tracking
  useEffect(() => {
    const onFsChange = () => {
      const fsEl =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      setIsFullscreen(Boolean(fsEl));
    };

    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    document.addEventListener("mozfullscreenchange", onFsChange);
    document.addEventListener("MSFullscreenChange", onFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
      document.removeEventListener("mozfullscreenchange", onFsChange);
      document.removeEventListener("MSFullscreenChange", onFsChange);
    };
  }, []);

  // Auto-hide controls
  const startHideControlsTimer = () => {
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const revealControls = () => {
    setShowControls(true);
    if (!videoRef.current?.paused) startHideControlsTimer();
  };

  const handleMouseMove = () => revealControls();

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      try {
        await v.play();
        setIsPlaying(true);
        startHideControlsTimer();
      } catch {
        setShowControls(true);
      }
    } else {
      v.pause();
      setIsPlaying(false);
      setShowControls(true);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleVolumeChange = (val) => {
    const v = videoRef.current;
    if (!v) return;
    const newVol = Math.min(1, Math.max(0, Number(val)));
    v.volume = newVol;
    v.muted = newVol === 0;
    setIsMuted(v.muted);
    setVolume(newVol);
  };

  const handleSeek = (pct) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const clamped = Math.min(100, Math.max(0, Number(pct)));
    v.currentTime = (clamped / 100) * duration;
    setCurrent(v.currentTime);
  };

  const skip = (seconds) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(
      0,
      Math.min(v.currentTime + seconds, duration || v.duration || v.currentTime)
    );
    setCurrent(v.currentTime);
    revealControls();
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;

    const isFs =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    try {
      if (!isFs) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen) await el.mozRequestFullScreen();
        else if (el.msRequestFullscreen) await el.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen)
          await document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen)
          await document.mozCancelFullScreen();
        else if (document.msExitFullscreen) await document.msExitFullscreen();
      }
    } catch {}
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!activeUrl) return;

    const onKey = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "arrowright":
          e.preventDefault();
          skip(5);
          break;
        case "arrowleft":
          e.preventDefault();
          skip(-5);
          break;
        case "arrowup":
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          revealControls();
          break;
        case "arrowdown":
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          revealControls();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeUrl, duration, volume]);

  // Apply quality
  const applyQuality = (value) => {
    setSelectedLevel(value);
    const hls = hlsRef.current;
    if (!hls) return;

    if (value === "auto") {
      hls.currentLevel = -1;
      return;
    }

    const lvlObj = levels.find((l) => String(l.level) === String(value));
    if (!lvlObj) return;
    hls.currentLevel = Number(lvlObj.level);
  };

  const handleClose = () => {
    setActiveUrl(null);
    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
        v.removeAttribute("src");
        v.load();
      } catch (error) {
        console.log("Error cleaning up video:", error);
      }
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
  };

  const activeAutoLevelLabel = useMemo(() => {
    const hls = hlsRef.current;
    if (!hls || selectedLevel !== "auto" || !hls.levels) return "Auto";
    const idx = hls.currentLevel;
    if (idx < 0) return "Auto";
    const cur = hls.levels[idx];
    const height = cur?.height;
    const br = cur?.bitrate ?? cur?.attrs?.BANDWIDTH;
    return `Auto${height ? ` (${height}p` : ""}${
      br ? ` • ${bitrateToMbps(br)}` : ""
    }${height || br ? ")" : ""}`;
  }, [selectedLevel, isPlaying, current]);

  return (
    <Modal
      open={activeUrl}
      onCancel={handleClose}
      footer={null}
      width="100%"
      destroyOnClose
      rootClassName="!p-0"
      className="max-w-6xl !w-full  p-0"
      styles={{
        padding: 0,
        content: { padding: 0 },
        body: { padding: 0 },
        mask: {
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0,0,0,0.85)",
        },
      }}
    >
      <div
        dir="ltr"
        ref={containerRef}
        className={`relative bg-black  py-[130px] md:py-[50px] ${
          isFullscreen ? "overflow-visible" : "overflow-hidden"
        } shadow-2xl`}
        onMouseMove={handleMouseMove}
        onClick={togglePlay}
        style={{
          width: "100%",
          // maxHeight: "90vh",
          userSelect: "none",
        }}
      >
        <video
          ref={videoRef}
          playsInline
          preload="metadata"
          muted={true}
          controls={false}
          className={`block w-full m-auto ${
            isFullscreen ? "absolute top-1/2  -translate-y-1/2" : ""
          }`}
          style={{
            background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Top-right Quality (Desktop/Tablet) */}
        <div className="hidden sm:block absolute top-3 right-3 z-10">
          <Popover
            open={desktopMoreOpen}
            onOpenChange={(open) => setDesktopMoreOpen(open)}
            trigger="click"
            placement="bottomRight"
            getPopupContainer={() => containerRef.current || document.body}
            overlayStyle={{ zIndex: 2147483646 }}
            overlayInnerStyle={{
              background: "rgba(17,24,39,0.95)",
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            content={
              <div
                className="min-w-[220px] text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-1 text-xs text-white/70">Quality</div>
                <Select
                  size="small"
                  disabled={!qualityEnabled}
                  value={selectedLevel}
                  className="!w-full [&_.ant-select-selector]:!bg-white/10 [&_.ant-select-selector]:!border-white/30 [&_.ant-select-selector]:!text-white"
                  dropdownStyle={{
                    backgroundColor: "rgba(31, 41, 55, 0.95)",
                    color: "white",
                  }}
                  getPopupContainer={() =>
                    containerRef.current || document.body
                  }
                  onChange={(v) => {
                    applyQuality(v);
                    setDesktopMoreOpen(false);
                  }}
                  options={[
                    { value: "auto", label: activeAutoLevelLabel },
                    ...levels.map((l) => ({
                      value: String(l.level),
                      label: l.label,
                    })),
                  ]}
                />
              </div>
            }
          >
            <button
              aria-label="Quality options"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 border border-white/20 text-white/90 transition-all duration-200 hover:bg-white/20 hover:text-white hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500/50"
            >
              <Settings size={14} />
            </button>
          </Popover>
        </div>

        {/* Center Play Button with Enhanced Design */}
        {!isPlaying && !isLoading && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              aria-label="Play"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 
                         rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600
                         shadow-2xl transition-all duration-500 ease-out
                         hover:scale-110 hover:shadow-blue-500/30 hover:shadow-2xl
                         active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              {/* Animated ring */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 
                            opacity-0 group-hover:opacity-20 transition-opacity duration-500 
                            animate-pulse"
              />

              {/* Play icon */}
              <Play
                size={22}
                className="text-white ml-1 drop-shadow-lg sm:w-8 sm:h-8"
                fill="currentColor"
              />
            </button>
          </div>
        )}

        {/* Enhanced Loading State */}
        {(isLoading || isBuffering) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Loader2
                  className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 animate-spin"
                  strokeWidth={1.5}
                />
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
              </div>
              <div className="text-white/80 text-sm sm:text-base font-medium">
                {isLoading ? "Loading..." : "Buffering..."}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Controls with Better Mobile Design */}
        <div
          className={`absolute inset-x-0 bottom-0 transition-all duration-500 ease-out transform ${
            showControls
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced gradient background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, 
                rgba(0,0,0,0) 0%, 
                rgba(0,0,0,0.3) 30%, 
                rgba(0,0,0,0.7) 70%, 
                rgba(0,0,0,0.9) 100%)`,
            }}
          />

          <div className="relative md:px-6 pt-8 sm:pt-12 pb-4 sm:pb-6">
            {/* Enhanced Seek Bar */}
            <div className="relative mb-2 sm:mb-3 flex items-center gap-2">
              {/* Time Display */}
              <div
                className="block select-none font-mono text-sm  
                              text-white/90 font-semibold ml-2"
              >
                <span className="text-white">{currentTime}</span>
                <span className="text-white/50 mx-1">/</span>
                <span className="text-white/80">{totalTime}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progress}
                onChange={(e) => handleSeek(e.target.value)}
                onMouseDown={() => setShowControls(true)}
                className="w-full h-1 bg-transparent flex-1 appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    #3b82f6 0%, 
                    #3b82f6 ${progress}%, 
                    rgba(255,255,255,0.2) ${progress}%, 
                    rgba(255,255,255,0.2) 100%)`,
                  borderRadius: "999px",
                }}
              />

              {/* Custom slider thumb */}
              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                  border-radius: 50%;
                  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                  transition: all 0.2s ease;
                }
                input[type="range"]::-webkit-slider-thumb:hover {
                  width: 20px;
                  height: 20px;
                  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
                }
              `}</style>
            </div>

            {/* Enhanced Control Bar */}
            <div
              className="flex flex-row items-center justify-between gap-4 
                          rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl
                          px-4 sm:px-6 py-3 sm:py-4 shadow-2xl"
            >
              {/* Left Controls */}
              <div
                dir=""
                className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto justify-center lg:justify-start"
              >
                {/* Skip Back (Mobile) */}
                <button
                  aria-label="Skip back 10 seconds"
                  onClick={() => skip(-10)}
                  className="lg:hidden grid h-10 w-10 place-items-center rounded-full 
                           bg-white/10 border border-white/20 text-white
                           transition-all duration-200 hover:bg-white/20 hover:scale-105 
                           active:scale-95 focus:ring-2 focus:ring-blue-500/50"
                >
                  <SkipBack size={16} />
                </button>

                {/* Play/Pause */}
                <button
                  aria-label={isPlaying ? "Pause" : "Play"}
                  onClick={togglePlay}
                  className="group relative  h-12 md:grid hidden w-12 sm:h-14 sm:w-14 place-items-center 
                           rounded-full bg-gradient-to-br from-blue-500 to-blue-600
                           border-2 border-blue-400/50 text-white shadow-lg
                           transition-all duration-300 hover:scale-110 hover:shadow-blue-500/30
                           active:scale-95 focus:ring-2 focus:ring-blue-500/50"
                >
                  <div
                    className="absolute inset-0 rounded-full bg-white/10 opacity-0 
                                group-hover:opacity-100 transition-opacity duration-200"
                  />
                  {isPlaying ? (
                    <Pause size={16} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Play
                      size={16}
                      className="sm:w-5 sm:h-5 ml-0.5"
                      fill="currentColor"
                    />
                  )}
                </button>

                {/* Skip Forward (Mobile) */}
                <button
                  aria-label="Skip forward 10 seconds"
                  onClick={() => skip(10)}
                  className="lg:hidden grid h-10 w-10 place-items-center rounded-full 
                           bg-white/10 border border-white/20 text-white
                           transition-all duration-200 hover:bg-white/20 hover:scale-105 
                           active:scale-95 focus:ring-2 focus:ring-blue-500/50"
                >
                  <SkipForward size={16} />
                </button>

                {/* Desktop Skip Controls */}
                <div className="hidden lg:flex items-center gap-2">
                  <div className="w-px h-6 bg-white/20 mx-2" />
                  <button
                    aria-label="Skip back 10 seconds"
                    onClick={() => skip(-10)}
                    className="grid h-10 w-10 place-items-center rounded-full 
                             bg-white/10 border border-white/20 text-white/90
                             transition-all duration-200 hover:bg-white/20 hover:text-white 
                             hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500/50"
                  >
                    <SkipBack size={16} />
                  </button>
                  <button
                    aria-label="Skip forward 10 seconds"
                    onClick={() => skip(10)}
                    className="grid h-10 w-10 place-items-center rounded-full 
                             bg-white/10 border border-white/20 text-white/90
                             transition-all duration-200 hover:bg-white/20 hover:text-white 
                             hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500/50"
                  >
                    <SkipForward size={16} />
                  </button>
                </div>

                {/* Volume Controls */}
                <div className="hidden sm:flex items-center gap-3 ml-2">
                  <div className="w-px h-6 bg-white/20" />
                  <Popover
                    open={desktopVolumeOpen}
                    onOpenChange={(open) => setDesktopVolumeOpen(open)}
                    trigger="click"
                    placement="top"
                    getPopupContainer={() =>
                      containerRef.current || document.body
                    }
                    overlayStyle={{ zIndex: 2147483646 }}
                    overlayInnerStyle={{
                      background: "rgba(17,24,39,0.95)",
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    content={
                      <div
                        className="flex items-center gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          aria-label={isMuted ? "Unmute" : "Mute"}
                          onClick={() => {
                            toggleMute();
                          }}
                          className="grid h-9 w-9 place-items-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX size={14} />
                          ) : (
                            <Volume2 size={14} />
                          )}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          dir="ltr"
                          value={isMuted ? 0 : volume}
                          onChange={(e) =>
                            handleVolumeChange(parseFloat(e.target.value))
                          }
                          className="w-40 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to left, #ffffff ${
                              isMuted ? 0 : volume * 100
                            }%, rgba(255,255,255,0.2) ${
                              isMuted ? 0 : volume * 100
                            }%)`,
                          }}
                        />
                      </div>
                    }
                  >
                    <button
                      aria-label={isMuted ? "Unmute" : "Mute"}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="grid h-10 w-10 place-items-center rounded-full 
                               bg-white/10 border border-white/20 text-white/90
                               transition-all duration-200 hover:bg-white/20 hover:text-white 
                               hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500/50"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={16} />
                      ) : (
                        <Volume2 size={16} />
                      )}
                    </button>
                  </Popover>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto justify-center lg:justify-end">
                {/* Mobile: three-dots menu with Quality inside */}
                <div className="sm:hidden">
                  <Popover
                    open={mobileMoreOpen}
                    onOpenChange={(open) => setMobileMoreOpen(open)}
                    trigger="click"
                    placement="topRight"
                    getPopupContainer={() =>
                      containerRef.current || document.body
                    }
                    overlayStyle={{ zIndex: 2147483646 }}
                    overlayInnerStyle={{
                      background: "rgba(17,24,39,0.95)",
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    content={
                      <div
                        className="min-w-[220px] text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="mb-1 text-xs text-white/70">
                          Quality
                        </div>
                        <Select
                          size="small"
                          disabled={!qualityEnabled}
                          value={selectedLevel}
                          className="!w-full [&_.ant-select-selector]:!bg-white/10 [&_.ant-select-selector]:!border-white/30 [&_.ant-select-selector]:!text-white"
                          dropdownStyle={{
                            backgroundColor: "rgba(31, 41, 55, 0.95)",
                            color: "white",
                          }}
                          getPopupContainer={() =>
                            containerRef.current || document.body
                          }
                          onChange={(v) => {
                            applyQuality(v);
                            setMobileMoreOpen(false);
                          }}
                          options={[
                            { value: "auto", label: activeAutoLevelLabel },
                            ...levels.map((l) => ({
                              value: String(l.level),
                              label: l.label,
                            })),
                          ]}
                        />
                      </div>
                    }
                  >
                    <button
                      aria-label="More options"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="grid h-10 w-10 place-items-center rounded-full bg-white/10 border border-white/20 text-white/90 transition-all duration-200 hover:bg-white/20 hover:text-white hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500/50"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </Popover>
                </div>
                {/* Mobile Volume (popover slider) */}
                <div className="sm:hidden">
                  <Popover
                    open={mobileVolumeOpen}
                    onOpenChange={(open) => setMobileVolumeOpen(open)}
                    trigger="click"
                    placement="top"
                    getPopupContainer={() =>
                      containerRef.current || document.body
                    }
                    overlayStyle={{ zIndex: 2147483646 }}
                    overlayInnerStyle={{
                      background: "rgba(17,24,39,0.95)",
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    content={
                      <div
                        className="flex items-center gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          aria-label={isMuted ? "Unmute" : "Mute"}
                          onClick={() => {
                            toggleMute();
                          }}
                          className="grid h-9 w-9 place-items-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX size={16} />
                          ) : (
                            <Volume2 size={16} />
                          )}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          dir="ltr"
                          step={0.01}
                          value={isMuted ? 0 : volume}
                          onChange={(e) =>
                            handleVolumeChange(parseFloat(e.target.value))
                          }
                          className="w-40 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #ffffff ${
                              isMuted ? 0 : volume * 100
                            }%, rgba(255,255,255,0.2) ${
                              isMuted ? 0 : volume * 100
                            }%)`,
                          }}
                        />
                      </div>
                    }
                  >
                    <button
                      aria-label={isMuted ? "Unmute" : "Mute"}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="grid h-10 w-10 place-items-center rounded-full 
                               bg-white/10 border border-white/20 text-white/90
                               transition-all duration-200 hover:bg-white/20 hover:text-white 
                               hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500/50"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={18} />
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </button>
                  </Popover>
                </div>

                {/* Quality Settings (desktop/tablet) */}
                <Tooltip
                  title={
                    qualityEnabled ? "Video Quality" : "Quality unavailable"
                  }
                  getPopupContainer={() =>
                    containerRef.current || document.body
                  }
                >
                  <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                    <Settings
                      size={14}
                      className="text-white/80 sm:w-5 sm:h-5"
                    />
                    <Select
                      size="small"
                      disabled={!qualityEnabled}
                      value={selectedLevel}
                      className="!min-w-[100px] sm:!min-w-[140px] lg:!min-w-[180px]
                               [&_.ant-select-selector]:!bg-white/10 
                               [&_.ant-select-selector]:!border-white/30
                               [&_.ant-select-selector]:!text-white 
                               [&_.ant-select-arrow]:!text-white/80
                               hover:[&_.ant-select-selector]:!border-white/50
                               [&_.ant-select-selector]:!backdrop-blur-sm"
                      popupClassName="[&_.ant-select-item]:!text-white [&_.ant-select-item]:!bg-gray-800 
                                     [&_.ant-select-item-option-selected]:!bg-blue-600"
                      dropdownStyle={{
                        backgroundColor: "rgba(31, 41, 55, 0.95)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                      }}
                      getPopupContainer={() =>
                        containerRef.current || document.body
                      }
                      onChange={applyQuality}
                      options={[
                        { value: "auto", label: activeAutoLevelLabel },
                        ...levels.map((l) => ({
                          value: String(l.level),
                          label: l.label,
                        })),
                      ]}
                    />
                  </div>
                </Tooltip>

                {/* Divider (hide when no desktop quality) */}
                <div className="hidden sm:block w-px h-6 bg-white/20" />

                {/* Fullscreen */}
                <Tooltip
                  title={`${isFullscreen ? "Exit" : "Enter"} Fullscreen (F)`}
                  getPopupContainer={() =>
                    containerRef.current || document.body
                  }
                >
                  <button
                    aria-label="Toggle Fullscreen"
                    onClick={toggleFullscreen}
                    className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full 
                             bg-white/10 border border-white/20 text-white/90
                             transition-all duration-200 hover:bg-white/20 hover:text-white 
                             hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500/50"
                  >
                    {isFullscreen ? (
                      <Minimize size={16} className="sm:w-5 sm:h-5" />
                    ) : (
                      <Maximize size={16} className="sm:w-5 sm:h-5" />
                    )}
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Mobile Time Display hidden (moved beside controls) */}
            <div className="hidden">
              <div
                className="select-none font-mono text-sm text-white/90 font-semibold 
                            px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm"
              >
                <span className="text-white">{currentTime}</span>
                <span className="text-white/50 mx-2">•</span>
                <span className="text-white/80">{totalTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Keep controls visible on pause */}
        {!isPlaying && !isLoading && !isBuffering && (
          <div className="absolute inset-0" onMouseMove={handleMouseMove} />
        )}

        {/* Custom CSS for enhanced styling */}
        <style jsx>{`
          /* Enhanced range slider styling */
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
          }

          input[type="range"]::-webkit-slider-track {
            background: transparent;
            height: 100%;
          }

          input[type="range"]::-moz-range-track {
            background: transparent;
            height: 100%;
            border: none;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }

          input[type="range"]::-webkit-slider-thumb:hover {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
            border-color: rgba(255, 255, 255, 0.5);
          }

          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }

          input[type="range"]::-moz-range-thumb:hover {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
            border-color: rgba(255, 255, 255, 0.5);
          }

          /* Enhanced scrollbar for quality dropdown */
          .ant-select-dropdown::-webkit-scrollbar {
            width: 6px;
          }

          .ant-select-dropdown::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }

          .ant-select-dropdown::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
          }

          .ant-select-dropdown::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }

          /* Smooth transitions for all interactive elements */
          button,
          input,
          .ant-select {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Enhanced modal backdrop */
          .ant-modal-mask {
            backdrop-filter: blur(8px);
            background: rgba(0, 0, 0, 0.85);
          }

          /* Remove focus outline on video element */
          video:focus {
            outline: none;
          }

          /* Ensure proper touch targets on mobile */
          @media (max-width: 640px) {
            button {
              min-width: 44px;
              min-height: 44px;
            }
          }
        `}</style>
      </div>
    </Modal>
  );
}

export default VideoModal;
