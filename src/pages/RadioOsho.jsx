import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import OSHO_PLAYLIST, { OSHO_CHANNEL } from '../data/oshoPlaylist';
import OSHO_MUSIC_PLAYLIST, { MUSIC_SOURCE } from '../data/oshoMusicPlaylist';
import {
  ALL_CATEGORY,
  filterTracks,
  formatTime,
  getCategories,
  getNextIndex,
  getPreviousIndex,
} from '../utils/radioOsho';
import useYouTubePlayer from '../hooks/useYouTubePlayer';

const PREFS_KEY = 'radioOsho_prefs';

const COLLECTIONS = {
  talks: {
    label: 'Osho Talks',
    tab: 'Osho Talks',
    subtitle: "A curated stream of Osho's talks on meditation, awareness and love.",
    tracks: OSHO_PLAYLIST,
    sourceLabel: 'OSHO International',
    sourceUrl: OSHO_CHANNEL,
    watchBase: 'https://www.youtube.com/watch?v=',
  },
  music: {
    label: 'Meditation Music',
    tab: 'Music',
    subtitle: 'Ambient, mantra and singing-bowl music — played audio-only, no video.',
    tracks: OSHO_MUSIC_PLAYLIST,
    sourceLabel: 'YouTube Music',
    sourceUrl: MUSIC_SOURCE,
    watchBase: 'https://music.youtube.com/watch?v=',
  },
};

const COLLECTION_KEYS = ['talks', 'music'];

function normalizeCollection(value) {
  return value === 'music' ? 'music' : 'talks';
}

function loadPrefs() {
  if (typeof localStorage === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
  } catch {
    return {};
  }
}

function savePrefs(patch) {
  if (typeof localStorage === 'undefined') return;
  try {
    const current = loadPrefs();
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...patch }));
  } catch {
    /* storage unavailable */
  }
}

function lastIndexFor(prefs, collection) {
  const value = prefs[`lastIndex_${collection}`];
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

function thumbUrl(id, quality = 'mqdefault') {
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

const REPEAT_ORDER = { off: 'all', all: 'one', one: 'off' };
const REPEAT_ICON = { off: 'pi pi-refresh', all: 'pi pi-refresh', one: 'pi pi-replay' };

export default function RadioOsho() {
  const prefs = useMemo(() => loadPrefs(), []);

  const [collection, setCollection] = useState(() => normalizeCollection(prefs.collection));
  const [activeIndex, setActiveIndex] = useState(() => {
    const active = normalizeCollection(prefs.collection);
    const tracks = COLLECTIONS[active].tracks;
    const saved = lastIndexFor(prefs, active);
    return saved < tracks.length ? saved : 0;
  });
  const [audioOnly, setAudioOnly] = useState(prefs.audioOnly !== false);
  const [category, setCategory] = useState(ALL_CATEGORY);
  const [query, setQuery] = useState('');
  const [shuffle, setShuffle] = useState(Boolean(prefs.shuffle));
  const [repeat, setRepeat] = useState(prefs.repeat || 'all');
  const [endedCount, setEndedCount] = useState(0);
  const [error, setError] = useState('');

  const config = COLLECTIONS[collection];
  const tracks = config.tracks;
  const total = tracks.length;
  const activeTrack = tracks[activeIndex];

  const categories = useMemo(() => getCategories(tracks), [tracks]);
  const filtered = useMemo(
    () => filterTracks(tracks, { category, query }),
    [tracks, category, query],
  );

  const player = useYouTubePlayer({
    videoId: tracks[activeIndex].id,
    initialVolume: Number.isFinite(prefs.volume) ? prefs.volume : 80,
    onEnded: () => setEndedCount((c) => c + 1),
    onError: (code) => {
      const messages = {
        2: 'This video id is invalid.',
        5: 'This track cannot be played in the embedded player.',
        100: 'This track is private or has been removed.',
        101: 'The owner does not allow this track to be embedded.',
        150: 'The owner does not allow this track to be embedded.',
      };
      setError(messages[code] || 'This track could not be played.');
    },
  });

  const {
    ready,
    playing,
    buffering,
    currentTime,
    duration,
    volume,
    muted,
    toggle,
    seek,
    seekBy,
    setVolume,
    toggleMute,
    loadVideo,
  } = player;

  const loadedKeyRef = useRef(`${collection}:${activeIndex}`);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  useEffect(() => {
    savePrefs({ [`lastIndex_${collection}`]: activeIndex });
  }, [collection, activeIndex]);

  useEffect(() => {
    savePrefs({ collection, audioOnly, shuffle, repeat, volume });
  }, [collection, audioOnly, shuffle, repeat, volume]);

  useEffect(() => {
    const key = `${collection}:${activeIndex}`;
    if (!ready || loadedKeyRef.current === key) return;
    loadedKeyRef.current = key;
    setError('');
    loadVideo(tracks[activeIndex].id, true);
  }, [collection, activeIndex, ready, loadVideo, tracks]);

  useEffect(() => {
    if (endedCount === 0) return;
    if (repeat === 'one') {
      seek(0);
      setTimeout(() => player.play(), 50);
      return;
    }
    const next = activeIndex + 1;
    if (shuffle) {
      setActiveIndex(getNextIndex(activeIndex, total, { shuffle: true }));
    } else if (next < total) {
      setActiveIndex(next);
    } else if (repeat === 'all') {
      setActiveIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endedCount]);

  const goToIndex = useCallback(
    (index) => {
      setActiveIndex(((index % total) + total) % total);
    },
    [total],
  );

  const goToTrack = useCallback(
    (track) => {
      const index = tracks.findIndex((t) => t.id === track.id);
      if (index !== -1) setActiveIndex(index);
    },
    [tracks],
  );

  const changeCollection = useCallback(
    (next) => {
      if (next === collection) return;
      const nextTracks = COLLECTIONS[next].tracks;
      const saved = lastIndexFor(loadPrefs(), next);
      setCollection(next);
      setActiveIndex(saved < nextTracks.length ? saved : 0);
      setCategory(ALL_CATEGORY);
      setQuery('');
      setError('');
    },
    [collection],
  );

  const handlePlayToggle = useCallback(() => {
    setError('');
    toggle();
  }, [toggle]);

  const handleNext = useCallback(() => {
    if (shuffle) goToIndex(getNextIndex(activeIndex, total, { shuffle: true }));
    else goToIndex(activeIndex + 1);
  }, [shuffle, activeIndex, total, goToIndex]);

  const handlePrev = useCallback(() => {
    if (currentTime > 5) {
      seek(0);
      return;
    }
    goToIndex(getPreviousIndex(activeIndex, total));
  }, [currentTime, seek, activeIndex, total, goToIndex]);

  const cycleRepeat = useCallback(() => setRepeat((r) => REPEAT_ORDER[r] || 'all'), []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return;
      switch (event.key) {
        case ' ':
          event.preventDefault();
          handlePlayToggle();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (event.shiftKey) handleNext();
          else seekBy(10);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (event.shiftKey) handlePrev();
          else seekBy(-10);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setVolume(volume + 5);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setVolume(volume - 5);
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case 'n':
        case 'N':
          handleNext();
          break;
        case 'p':
        case 'P':
          handlePrev();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePlayToggle, handleNext, handlePrev, seekBy, setVolume, volume, toggleMute]);

  const progressMax = duration || 0;
  const progressValue = scrubbing ? scrubValue : Math.min(currentTime, progressMax || currentTime);
  const progressPercent = progressMax ? (progressValue / progressMax) * 100 : 0;
  const watchUrl = `${config.watchBase}${activeTrack.id}`;

  const playOverlay = (
    <button
      type="button"
      onClick={handlePlayToggle}
      aria-label={playing ? 'Pause' : 'Play'}
      className="absolute inset-0 z-10 flex items-center justify-center group cursor-pointer"
    >
      {!playing && (
        <span className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-transform group-hover:scale-105">
          <i className="pi pi-play text-3xl text-white translate-x-0.5" />
        </span>
      )}
      {playing && (
        <span className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <i className="pi pi-pause text-3xl text-white" />
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 shrink-0">
                <i className={`pi ${audioOnly ? 'pi-headphones' : 'pi-volume-up'} text-3xl text-white`} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Radio Osho</h1>
                <p className="text-slate-400 text-base md:text-lg">{config.subtitle}</p>
              </div>
            </div>
            <a
              href={config.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-lg text-sm font-medium text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <i className="pi pi-youtube" /> {config.sourceLabel}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex p-1 bg-slate-800 rounded-xl gap-1">
              {COLLECTION_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => changeCollection(key)}
                  className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                    collection === key ? 'bg-amber-500 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {COLLECTIONS[key].tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAudioOnly((a) => !a)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
                audioOnly
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              aria-pressed={audioOnly}
            >
              <i className={`pi ${audioOnly ? 'pi-headphones' : 'pi-desktop'} `} />
              {audioOnly ? 'Audio only' : 'Video'}
            </button>

            <span className="text-xs text-slate-500 ml-auto flex items-center gap-1.5">
              <i className="pi pi-info-circle" />
              {audioOnly ? 'Playing audio without video' : 'Playing with video'}
            </span>
          </div>

          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
            <section className="flex flex-col">
              {/* Player mount — always mounted so audio survives mode switches. */}
              <div
                className={
                  audioOnly
                    ? 'fixed w-px h-px overflow-hidden opacity-0 pointer-events-none'
                    : 'relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-700'
                }
                style={audioOnly ? { left: '-9999px', top: 0 } : undefined}
              >
                <div ref={player.containerRef} className="absolute inset-0 w-full h-full" />
                {!audioOnly && playOverlay}
                {!audioOnly && buffering && (
                  <span className="absolute top-3 right-3 z-20 text-xs px-2 py-1 rounded-full bg-black/60 text-amber-300 flex items-center gap-1.5 pointer-events-none">
                    <i className="pi pi-spin pi-spinner text-xs" /> buffering
                  </span>
                )}
                {!audioOnly && !ready && (
                  <span className="absolute top-3 left-3 z-20 text-xs px-2 py-1 rounded-full bg-black/60 text-slate-300 flex items-center gap-1.5 pointer-events-none">
                    <i className="pi pi-spin pi-spinner text-xs" /> loading player
                  </span>
                )}
              </div>

              {audioOnly && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img
                    src={thumbUrl(activeTrack.id, 'hqdefault')}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-25 blur-2xl scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-950/40" />
                  {playOverlay}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 pointer-events-none">
                    <div className="relative">
                      <img
                        src={thumbUrl(activeTrack.id, 'hqdefault')}
                        alt=""
                        className="w-36 h-36 md:w-48 md:h-48 rounded-2xl object-cover shadow-2xl border border-white/10"
                      />
                      {playing && (
                        <span className="absolute -inset-2 rounded-3xl border border-amber-400/40 animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-end gap-1 h-6">
                      {[40, 80, 55, 95, 65].map((h, i) => (
                        <span
                          key={i}
                          className={`w-1 rounded-full bg-amber-400/80 ${playing ? 'animate-pulse' : ''}`}
                          style={{ height: playing ? `${h}%` : '20%', animationDelay: `${i * 120}ms` }}
                        />
                      ))}
                    </div>
                    <div className="text-center max-w-lg">
                      <h3 className="text-lg md:text-2xl font-semibold text-white truncate">{activeTrack.title}</h3>
                      {activeTrack.artist && (
                        <p className="text-sm text-amber-200/80 mt-1 truncate">{activeTrack.artist}</p>
                      )}
                    </div>
                  </div>
                  {buffering && (
                    <span className="absolute top-3 right-3 z-20 text-xs px-2 py-1 rounded-full bg-black/60 text-amber-300 flex items-center gap-1.5 pointer-events-none">
                      <i className="pi pi-spin pi-spinner text-xs" /> buffering
                    </span>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-2">
                  <i className="pi pi-exclamation-circle mt-0.5" />
                  <span>
                    {error}{' '}
                    <a className="underline" href={watchUrl} target="_blank" rel="noreferrer">
                      Open on {collection === 'music' ? 'YouTube Music' : 'YouTube'}
                    </a>
                  </span>
                </div>
              )}

              {!audioOnly && (
                <div className="mt-5 flex items-start gap-4">
                  <img
                    src={thumbUrl(activeTrack.id)}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300">
                        {activeTrack.category}
                      </span>
                      <span>
                        Track {activeIndex + 1} of {total}
                      </span>
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-white mt-1 truncate">
                      {activeTrack.title}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">{activeTrack.description}</p>
                  </div>
                </div>
              )}

              {audioOnly && activeTrack.description && (
                <p className="text-sm text-slate-400 mt-4 line-clamp-2 text-center">{activeTrack.description}</p>
              )}

              <div className="mt-5">
                <input
                  type="range"
                  min={0}
                  max={progressMax || 100}
                  step={1}
                  value={progressValue}
                  onMouseDown={() => setScrubbing(true)}
                  onChange={(e) => {
                    setScrubbing(true);
                    setScrubValue(Number(e.target.value));
                  }}
                  onMouseUp={(e) => {
                    seek(Number(e.target.value));
                    setScrubbing(false);
                  }}
                  disabled={!progressMax}
                  className="w-full h-1.5 cursor-pointer appearance-none rounded-full bg-slate-700 accent-amber-500 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(to right, #f59e0b ${progressPercent}%, #334155 ${progressPercent}%)`,
                  }}
                  aria-label="Seek"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                  <span>{formatTime(progressValue)}</span>
                  <span>{progressMax ? formatTime(progressMax) : activeTrack.duration}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShuffle((s) => !s)}
                    className={`p-2.5 rounded-full transition-all ${
                      shuffle ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    aria-label="Shuffle"
                    title="Shuffle"
                  >
                    <i className="pi pi-sort-alt text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    aria-label="Previous"
                    title="Previous"
                  >
                    <i className="pi pi-step-backward-alt text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePlayToggle}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-amber-900/40"
                    aria-label={playing ? 'Pause' : 'Play'}
                  >
                    <i className={`pi ${playing ? 'pi-pause' : 'pi-play'} text-xl`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    aria-label="Next"
                    title="Next"
                  >
                    <i className="pi pi-step-forward-alt text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={cycleRepeat}
                    className={`p-2.5 rounded-full transition-all ${
                      repeat !== 'off'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    aria-label={`Repeat: ${repeat}`}
                    title={`Repeat: ${repeat === 'one' ? 'this track' : repeat}`}
                  >
                    <i className={`${REPEAT_ICON[repeat]} text-lg`} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    aria-label={muted ? 'Unmute' : 'Mute'}
                  >
                    <i className={`pi ${muted || volume === 0 ? 'pi-volume-off' : 'pi-volume-up'} text-lg`} />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={muted ? 0 : volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-20 md:w-28 h-1.5 cursor-pointer appearance-none rounded-full bg-slate-700 accent-amber-500"
                    style={{
                      background: `linear-gradient(to right, #f59e0b ${muted ? 0 : volume}%, #334155 ${muted ? 0 : volume}%)`,
                    }}
                    aria-label="Volume"
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col min-h-0">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <i className="pi pi-list" /> Playlist
                </h2>
                <span className="text-xs text-slate-500">{filtered.length} tracks</span>
              </div>

              <div className="relative mb-3">
                <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      category === cat
                        ? 'bg-amber-500 text-slate-900'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="overflow-y-auto pr-1 space-y-1.5 lg:max-h-[32rem]">
                {filtered.map((track) => {
                  const index = tracks.findIndex((t) => t.id === track.id);
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => goToTrack(track)}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all border ${
                        isActive
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className="relative w-16 h-10 rounded-md overflow-hidden shrink-0 bg-slate-800">
                        <img src={thumbUrl(track.id)} alt="" className="w-full h-full object-cover" />
                        {isActive && (
                          <span className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <i
                              className={`pi ${playing ? 'pi-volume-up' : 'pi-play'} text-amber-300 text-xs`}
                            />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${isActive ? 'text-amber-200' : 'text-white'}`}>
                          {track.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {track.artist ? `${track.artist} · ` : ''}
                          {track.category} · {track.duration}
                        </p>
                      </div>
                      {isActive && playing && (
                        <span className="flex items-end gap-0.5 h-4 shrink-0" aria-hidden="true">
                          <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-pulse" />
                          <span
                            className="w-0.5 h-4 bg-amber-400 rounded-full animate-pulse"
                            style={{ animationDelay: '150ms' }}
                          />
                          <span
                            className="w-0.5 h-3 bg-amber-400 rounded-full animate-pulse"
                            style={{ animationDelay: '300ms' }}
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">Nothing matches your search.</p>
                )}
              </div>

              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                Shortcuts: Space play/pause · ← → seek ±10s · Shift + ← → prev/next · ↑ ↓ volume · M mute
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
