import { useCallback, useEffect, useRef, useState } from 'react';

const YT_API_SRC = 'https://www.youtube.com/iframe_api';

let apiPromise = null;

export function loadYouTubeAPI() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube IFrame API requires a browser environment'));
  }
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') previous();
      resolve(window.YT);
    };

    if (!document.querySelector(`script[src="${YT_API_SRC}"]`)) {
      const tag = document.createElement('script');
      tag.src = YT_API_SRC;
      tag.async = true;
      document.head.appendChild(tag);
    }
  });

  return apiPromise;
}

/**
 * Hook that mounts a YouTube IFrame player into an imperatively-created child
 * node so React reconciliation is never confused by the iframe swap.
 */
export default function useYouTubePlayer({ videoId, initialVolume = 80, onEnded, onReady, onError }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const endedRef = useRef(onEnded);
  const readyRef = useRef(onReady);
  const errorRef = useRef(onError);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(initialVolume);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    endedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    errorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let cancelled = false;
    const wrapper = containerRef.current;
    if (!wrapper) return undefined;

    const mount = document.createElement('div');
    mount.style.width = '100%';
    mount.style.height = '100%';
    wrapper.appendChild(mount);

    loadYouTubeAPI()
      .then((YT) => {
        if (cancelled) return;
        playerRef.current = new YT.Player(mount, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            iv_load_policy: 3,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (cancelled) return;
              setReady(true);
              const player = event.target;
              try {
                player.setVolume(volume);
                setDuration(player.getDuration() || 0);
              } catch {
                /* player not ready yet */
              }
              if (readyRef.current) readyRef.current(player);
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const state = event.data;
              const player = event.target;
              if (state === YT.PlayerState.PLAYING) {
                setPlaying(true);
                setBuffering(false);
                setDuration(player.getDuration() || 0);
              } else if (state === YT.PlayerState.PAUSED) {
                setPlaying(false);
                setBuffering(false);
              } else if (state === YT.PlayerState.BUFFERING) {
                setBuffering(true);
              } else if (state === YT.PlayerState.ENDED) {
                setPlaying(false);
                setBuffering(false);
                if (endedRef.current) endedRef.current();
              }
            },
            onError: (event) => {
              if (cancelled) return;
              setPlaying(false);
              setBuffering(false);
              if (errorRef.current) errorRef.current(event.data);
            },
          },
        });
      })
      .catch((err) => {
        if (!cancelled && errorRef.current) errorRef.current(err);
      });

    return () => {
      cancelled = true;
      const player = playerRef.current;
      playerRef.current = null;
      setReady(false);
      setPlaying(false);
      setBuffering(false);
      try {
        if (player && typeof player.destroy === 'function') player.destroy();
      } catch {
        /* already torn down */
      }
      wrapper.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (!player || typeof player.getCurrentTime !== 'function') return;
      try {
        setCurrentTime(player.getCurrentTime() || 0);
        const nextDuration = player.getDuration() || 0;
        if (nextDuration) setDuration(nextDuration);
        setMuted(typeof player.isMuted === 'function' ? player.isMuted() : false);
      } catch {
        /* transient */
      }
    }, 500);
    return () => clearInterval(interval);
  }, [ready]);

  const play = useCallback(() => {
    playerRef.current?.playVideo?.();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo?.();
  }, []);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (typeof player.getPlayerState === 'function' && player.getPlayerState() === 1) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, []);

  const seek = useCallback((seconds) => {
    const player = playerRef.current;
    if (!player || typeof player.seekTo !== 'function') return;
    player.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  const seekBy = useCallback((delta) => {
    const player = playerRef.current;
    if (!player || typeof player.getCurrentTime !== 'function') return;
    const next = Math.max(0, (player.getCurrentTime() || 0) + delta);
    player.seekTo(next, true);
    setCurrentTime(next);
  }, []);

  const changeVolume = useCallback((value) => {
    const next = Math.min(100, Math.max(0, Math.round(value)));
    setVolumeState(next);
    const player = playerRef.current;
    if (player && typeof player.setVolume === 'function') {
      player.setVolume(next);
      if (next > 0 && typeof player.isMuted === 'function' && player.isMuted()) {
        player.unMute();
        setMuted(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (typeof player.isMuted === 'function' && player.isMuted()) {
      player.unMute();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  }, []);

  const loadVideo = useCallback((id, autoPlay = true) => {
    const player = playerRef.current;
    if (!player) return;
    setCurrentTime(0);
    setDuration(0);
    if (autoPlay && typeof player.loadVideoById === 'function') {
      player.loadVideoById(id);
    } else if (typeof player.cueVideoById === 'function') {
      player.cueVideoById(id);
    }
  }, []);

  return {
    containerRef,
    ready,
    playing,
    buffering,
    currentTime,
    duration,
    volume,
    muted,
    play,
    pause,
    toggle,
    seek,
    seekBy,
    setVolume: changeVolume,
    toggleMute,
    loadVideo,
  };
}
