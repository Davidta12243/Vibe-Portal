'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, CheckCircle2, ShieldAlert } from 'lucide-react';

interface VideoPlayerProps {
  demo5mUrl?: string;
  demo5mTitle?: string;
  demo20mUrl?: string;
  demo20mTitle?: string;
  lessonVideoUrl?: string;
  lessonTitle?: string;
  hasFullAccess: boolean;
  initialTime?: number;
  onProgressUpdate?: (seconds: number, totalSeconds: number) => void;
  onComplete?: () => void;
}

export default function VideoPlayer({
  demo5mUrl,
  demo5mTitle = 'Video Demo 5 Phút (Tổng quan cốt lõi)',
  demo20mUrl,
  demo20mTitle = 'Video Demo 20 Phút (Bài giảng mẫu chuyên sâu)',
  lessonVideoUrl,
  lessonTitle = 'Video Toàn Khóa Học',
  hasFullAccess,
  initialTime = 0,
  onProgressUpdate,
  onComplete,
}: VideoPlayerProps) {
  // Mode: 'full' | 'demo5m' | 'demo20m'
  const defaultMode = hasFullAccess && lessonVideoUrl ? 'full' : demo5mUrl ? 'demo5m' : 'demo20m';
  const [activeMode, setActiveMode] = useState<'full' | 'demo5m' | 'demo20m'>(defaultMode);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasReportedCompletion, setHasReportedCompletion] = useState(false);

  // Chọn URL video dựa trên mode đang chọn
  const currentVideoUrl =
    activeMode === 'full' && hasFullAccess
      ? lessonVideoUrl
      : activeMode === 'demo5m'
      ? demo5mUrl
      : demo20mUrl || demo5mUrl;

  useEffect(() => {
    if (videoRef.current && initialTime > 0 && activeMode === 'full') {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime, activeMode]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(cur);
    setDuration(dur);

    // Báo cáo tiến độ cho server
    if (onProgressUpdate && activeMode === 'full') {
      onProgressUpdate(Math.floor(cur), Math.floor(dur));
    }

    // Tự động đánh dấu hoàn thành khi xem trên 85% video bài học chính
    if (activeMode === 'full' && dur > 0 && cur / dur >= 0.85 && !hasReportedCompletion) {
      setHasReportedCompletion(true);
      if (onComplete) onComplete();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
      {/* Video Source Switcher Tabs (Hai video demo độc lập + Full Lesson) */}
      <div className="flex items-center gap-1.5 p-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto text-xs">
        {hasFullAccess && lessonVideoUrl && (
          <button
            onClick={() => {
              setActiveMode('full');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeMode === 'full'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
            {lessonTitle} (Bài Học Chính)
          </button>
        )}

        {demo5mUrl && (
          <button
            onClick={() => {
              setActiveMode('demo5m');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeMode === 'demo5m'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            {demo5mTitle}
          </button>
        )}

        {demo20mUrl && (
          <button
            onClick={() => {
              setActiveMode('demo20m');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeMode === 'demo20m'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            {demo20mTitle}
          </button>
        )}

        {!hasFullAccess && (
          <span className="ml-auto text-[11px] text-amber-400 font-medium px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-800/50 flex items-center gap-1 shrink-0">
            <ShieldAlert className="w-3.5 h-3.5" />
            Chế độ Xem Thử Demo Miễn Phí
          </span>
        )}
      </div>

      {/* Video Screen Container */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center group">
        {currentVideoUrl ? (
          <video
            ref={videoRef}
            src={currentVideoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            playsInline
          />
        ) : (
          <div className="text-center p-8 text-slate-400">
            <p className="text-sm">Video chưa khả dụng hoặc đang được cập nhật bởi giảng viên.</p>
          </div>
        )}

        {/* Big Center Play Overlay Button when paused */}
        {!isPlaying && currentVideoUrl && (
          <button
            onClick={togglePlay}
            className="absolute w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 hover:bg-blue-600 transition-all shadow-xl border border-white/30"
          >
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          </button>
        )}

        {/* Bottom Control Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Progress Seek Bar */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-1.5 transition-all"
          />

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="p-1 hover:text-blue-400 transition-colors">
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => {
                  if (videoRef.current) videoRef.current.currentTime = Math.max(0, currentTime - 10);
                }}
                className="p-1 hover:text-blue-400 transition-colors"
                title="Tua lại 10 giây"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button onClick={toggleMute} className="p-1 hover:text-blue-400 transition-colors">
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="font-mono text-[11px] text-slate-300">
                {formatSeconds(currentTime)} / {formatSeconds(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-400">
                {activeMode === 'full' ? 'Nội dung trả phí' : 'Demo độc lập'}
              </span>
              <button onClick={toggleFullScreen} className="p-1 hover:text-blue-400 transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
