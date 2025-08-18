import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Spin, Select, Tooltip } from "antd";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Settings
} from "lucide-react";
import Hls from "hls.js";

function VideoModal({ activeUrl, setActiveUrl }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);
  const hideControlsTimer = useRef(null);
  console.log("VideoModal activeUrl:", activeUrl);

  // UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Media state
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');
  const [videoError, setVideoError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Quality (HLS only)
  const [levels, setLevels] = useState([]); // [{level, height, bitrate, label}]
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

  // Initialize video when activeUrl changes (copied from videoHosting.js)
  useEffect(() => {
    console.log("VideoModal useEffect triggered with activeUrl:", activeUrl);
    
    const video = videoRef.current;
    console.log("VideoModal videoRef.current:", videoRef.current);
    if (!video || !activeUrl) return;

    let hls;
    let retryTimeout = null;

    const resetState = () => {
      setProgress(0);
      setCurrentTime('0:00');
      setTotalTime('0:00');
      setIsPlaying(false);
      setIsLoading(true);
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
      const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
      setTotalTime(`${minutes}:${seconds}`);
    };

    const handleLoadedMetadata = () => {
      console.log("Video loaded metadata, duration:", video.duration);
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
          video.play().catch(() => { });
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
      console.log("Video error occurred");
      setIsLoading(true);
      retryTimeout = setTimeout(() => {
        setRetryCount((c) => c + 1);
        if (Hls.isSupported() && hls) {
          hls.loadSource(activeUrl);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = activeUrl;
        }
      }, 2000);
    };

    const handlePlaying = () => {
      console.log("Video started playing");
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log("Video paused");
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      console.log("Video waiting");
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      console.log("Video can play");
      setIsLoading(false);
    };

    const handleEnded = () => {
      console.log("Video ended");
      setIsPlaying(false);
    };

    // Clean previous hls
    if (hlsRef.current) {
      console.log("Cleaning up previous HLS instance");
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    resetState();

    // Ensure video element is properly configured
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
         console.log("HLS is supported, initializing...");
         hls = new Hls({ 
           enableWorker: true,
           debug: false
         });
         hlsRef.current = hls;
         
         // Store HLS instance on video element for quality control
         video.hls = hls;
         
         hls.loadSource(activeUrl);
         hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest parsed successfully");
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

        // highest to lowest
        lvls.sort((a, b) => (b.height || 0) - (a.height || 0));

        setLevels(lvls);
        setQualityEnabled(true);
        setSelectedLevel("auto");
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("HLS error:", data);
        if (data?.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error, restarting...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, recovering...");
              hls.recoverMediaError();
              break;
            default:
              console.log("Fatal error, destroying HLS");
              hls.destroy();
              break;
          }
        }
        setIsLoading(false);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari (native HLS): no manual quality
      console.log("Using native HLS support");
      video.src = activeUrl;
      setQualityEnabled(false);
      setSelectedLevel("auto");
    } else {
      // MP4 or others
      console.log("Using direct video source");
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
  }, [activeUrl, retryCount,  videoRef, videoRef.current]);

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
    hideControlsTimer.current = setTimeout(() => setShowControls(false), 2500);
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

  // Shortcuts
  useEffect(() => {
    if (!activeUrl) return;
    const onKey = (e) => {
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
        case "arrowright": {
          const v = videoRef.current;
          if (!v) break;
          v.currentTime = Math.min(
            v.currentTime + 5,
            duration || v.duration || v.currentTime
          );
          setCurrent(v.currentTime);
          revealControls();
          break;
        }
        case "arrowleft": {
          const v = videoRef.current;
          if (!v) break;
          v.currentTime = Math.max(v.currentTime - 5, 0);
          setCurrent(v.currentTime);
          revealControls();
          break;
        }
        case "arrowup": {
          const next = Math.min(1, volume + 0.05);
          handleVolumeChange(next);
          revealControls();
          break;
        }
        case "arrowdown": {
          const next = Math.max(0, volume - 0.05);
          handleVolumeChange(next);
          revealControls();
          break;
        }
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeUrl, duration, volume]);

  // Apply quality WITHOUT restarting video (no re-init, no source reload)
  const applyQuality = (value) => {
    setSelectedLevel(value);
    const hls = hlsRef.current;
    if (!hls) return; // Not HLS (or Safari native) – nothing to do

    if (value === "auto") {
      hls.currentLevel = -1; // ABR
      return;
    }

    // We stored the real Hls level index in l.level
    const lvlObj = levels.find((l) => String(l.level) === String(value));
    if (!lvlObj) return;

    // Seamless switch: keep currentTime; hls handles buffer/segment switching internally
    hls.currentLevel = Number(lvlObj.level);
  };

  const handleClose = () => {
    console.log("Closing video modal, cleaning up...");
    setActiveUrl(null);
    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
        v.removeAttribute('src');
        v.load();
      } catch (error) {
        console.log("Error cleaning up video:", error);
      }
    }
    if (hlsRef.current) {
      console.log("Destroying HLS instance");
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
      // Tailwind overrides (Modal root)
      rootClassName="!p-0"
      className="!max-w-[min(1200px,96vw)] !w-full"
      styles={{
        body: { padding: 0 }
      }}
    >
      {/* Force LTR for everything inside */}
      <div
        dir="ltr"
        ref={containerRef}
        className="relative !bg-black"
        onMouseMove={handleMouseMove}
        onClick={togglePlay}
        style={{
          aspectRatio: "16 / 9",
          width: "100%",
          maxHeight: "86vh",
          userSelect: "none",
          overflow: "hidden"
        }}
      >
        <video
          ref={videoRef}
          playsInline
          preload="metadata"
          muted={true}
          controls={false}
          className="block !w-full !h-full"
          style={{ background: "black" }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Center Play */}
        {!isPlaying && !isLoading && (
          <button
            aria-label="Play"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-2 bg-blue"
            style={{
              top: "50%",
              left: "50%",
              // transform: "translate(-50%,-50%)"
            }}
          >
            <Play size={28} color="#fff" />
          </button>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Spin size="large" />
          </div>
        )}

        {/* Controls */}
        <div
          className={`absolute inset-x-0 bottom-0 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glass gradient */}
          <div
            className="pointer-events-none"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.38) 46%, rgba(0,0,0,.66) 100%)"
            }}
          />

          <div className="relative !px-4 !pt-10 !pb-3">
            {/* Seek bar */}
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={(e) => handleSeek(e.target.value)}
              onMouseDown={() => setShowControls(true)}
              className="w-full"
              style={{
                appearance: "none",
                width: "100%",
                height: "6px",
                background:
                  "linear-gradient(to right, #1677ff 0%, #1677ff " +
                  progress +
                  "%, rgba(255,255,255,.25) " +
                  progress +
                  "%, rgba(255,255,255,.25) 100%)",
                borderRadius: 999,
                outline: "none"
              }}
            />

             {/* Bottom row */}
             <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 rounded-xl border border-white/10 bg-white/5 px-2 sm:px-3 py-2 text-white shadow-xl backdrop-blur-md">
               {/* Left */}
               <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
                 {/* Play / Pause */}
                 <button
                   aria-label={isPlaying ? "Pause" : "Play"}
                   onClick={togglePlay}
                   className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-white/15 bg-white/10 transition
                  hover:scale-105 hover:bg-white/15 active:scale-95
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                 >
                   {isPlaying ? <Pause size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Play size={16} className="sm:w-[18px] sm:h-[18px]" />}
                 </button>

                 {/* Divider */}
                 <span className="hidden h-4 sm:h-5 w-px shrink-0 bg-white/10 md:block" />

                 {/* Volume */}
                 <div className="flex items-center gap-1 sm:gap-2">
                   <button
                     aria-label={isMuted ? "Unmute" : "Mute"}
                     onClick={toggleMute}
                     className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-white/15 bg-white/10 transition
                    hover:scale-105 hover:bg-white/15 active:scale-95
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                   >
                     {isMuted || volume === 0 ? (
                       <VolumeX size={16} className="sm:w-[18px] sm:h-[18px]" />
                     ) : (
                       <Volume2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                     )}
                   </button>

                   <input
                     type="range"
                     min={0}
                     max={1}
                     step={0.01}
                     value={isMuted ? 0 : volume}
                     onChange={(e) =>
                       handleVolumeChange(parseFloat(e.target.value))
                     }
                     className="slider w-16 sm:w-24 md:w-36"
                     style={{
                       appearance: "none",
                       height: 4,
                       background: `linear-gradient(to right, #fff 0%, #fff ${
                         isMuted ? 0 : volume * 100
                       }%, rgba(255,255,255,.25) ${
                         isMuted ? 0 : volume * 100
                       }%, rgba(255,255,255,.25) 100%)`,
                       borderRadius: 999,
                       outline: "none"
                     }}
                   />
                 </div>

                 {/* Time */}
                 <div className="select-none tabular-nums text-xs font-semibold text-white/90 sm:text-sm">
                   {currentTime} <span className="text-white/50">/</span>{" "}
                   {totalTime}
                 </div>
               </div>

               {/* Right */}
               <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
                 <Tooltip
                   title={
                     qualityEnabled
                       ? "Select quality (A to toggle Auto)"
                       : "Quality selection unavailable on this source"
                   }
                 >
                   <div className="flex items-center gap-1 sm:gap-2">
                     <Settings size={16} className="text-white/90 sm:w-[18px] sm:h-[18px]" />
                     <Select
                       size="small"
                       disabled={!qualityEnabled}
                       value={selectedLevel}
                       className="!min-w-[120px] sm:!min-w-[150px] md:!min-w-[180px] !text-left [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!border-white/20
                      [&_.ant-select-selector]:!text-white [&_.ant-select-arrow]:!text-white/80
                      hover:[&_.ant-select-selector]:!border-white/40 !text-white"
                       onChange={applyQuality}
                       options={[
                         { value: "auto", label: activeAutoLevelLabel },
                         ...levels.map((l) => ({
                           value: String(l.level),
                           label: l.label
                         }))
                       ]}
                     />
                   </div>
                 </Tooltip>

                 {/* Divider */}
                 <span className="hidden h-4 sm:h-5 w-px shrink-0 bg-white/10 md:block" />

                 <Tooltip title="Fullscreen (F)">
                   <button
                     aria-label="Fullscreen"
                     onClick={toggleFullscreen}
                     className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-white/15 bg-white/10 transition
                    hover:scale-105 hover:bg-white/15 active:scale-95
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                   >
                     {isFullscreen ? (
                       <Minimize size={16} className="sm:w-[18px] sm:h-[18px]" />
                     ) : (
                       <Maximize size={16} className="sm:w-[18px] sm:h-[18px]" />
                     )}
                   </button>
                 </Tooltip>
               </div>
             </div>
          </div>
        </div>

        {/* Keep controls visible on pause */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0" onMouseMove={handleMouseMove} />
        )}
      </div>
    </Modal>
  );
}

export default VideoModal;
