import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VIDEO_ID = "Q8JIO106JlM";
const TARGET_VOLUME = 42;
const FADE_DURATION = 2400;

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  setPlaybackQuality: (quality: string) => void;
  destroy: () => void;
};

type YouTubePlayerEvent = { target: YouTubePlayer };

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, number | string>;
      events: { onReady: (event: YouTubePlayerEvent) => void };
    },
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi() {
  if (window.YT) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<YouTubeApi>((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      if (window.YT) resolve(window.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return apiPromise;
}

export function AmbientAudio({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(false);
  const [available, setAvailable] = useState(false);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const fadeRef = useRef<number | null>(null);

  function cancelFade() {
    if (fadeRef.current !== null) {
      window.cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  }

  function fadeVolume(from: number, to: number, done?: () => void) {
    cancelFade();
    const player = playerRef.current;
    if (!player) return;
    const started = performance.now();

    const frame = (now: number) => {
      const progress = Math.min((now - started) / FADE_DURATION, 1);
      player.setVolume(Math.round(from + (to - from) * progress));
      if (progress < 1) {
        fadeRef.current = window.requestAnimationFrame(frame);
      } else {
        fadeRef.current = null;
        done?.();
      }
    };

    fadeRef.current = window.requestAnimationFrame(frame);
  }

  useEffect(() => {
    let disposed = false;

    void loadYouTubeApi()
      .then((YT) => {
        const mount = mountRef.current;
        if (disposed || !mount) return;
        new YT.Player(mount, {
          videoId: VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: VIDEO_ID,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: ({ target }) => {
              playerRef.current = target;
              target.setPlaybackQuality("small");
              target.setVolume(0);
              setAvailable(true);
            },
          },
        });
      })
      .catch(() => setAvailable(false));

    return () => {
      disposed = true;
      cancelFade();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  function toggle() {
    const player = playerRef.current;
    if (!player) return;

    if (on) {
      fadeVolume(TARGET_VOLUME, 0, () => player.pauseVideo());
      setOn(false);
      return;
    }

    player.setVolume(0);
    player.playVideo();
    fadeVolume(0, TARGET_VOLUME);
    setOn(true);
  }

  return (
    <>
      <div
        ref={mountRef}
        className="pointer-events-none fixed -left-[9999px] top-0 h-px w-px overflow-hidden"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={toggle}
        disabled={!available}
        aria-pressed={on}
        aria-label={on ? "Silenciar la música ambiental" : "Activar la música ambiental"}
        title={on ? "Silenciar música" : "Música ambiental de neowake en YouTube"}
        className={`rounded-full border border-border/70 bg-card/70 p-2.5 backdrop-blur transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          on ? "border-neon/50 text-neon" : "text-muted-foreground hover:text-primary"
        } ${className}`}
      >
        {on ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>
    </>
  );
}