import OSHO_PLAYLIST from '../../src/data/oshoPlaylist.js';
import OSHO_MUSIC_PLAYLIST from '../../src/data/oshoMusicPlaylist.js';
import {
  ALL_CATEGORY,
  clamp,
  filterTracks,
  formatTime,
  getCategories,
  getNextIndex,
  getPreviousIndex,
} from '../../src/utils/radioOsho.js';

describe('Radio Osho - Playlist Data', () => {
  test('every track has the required fields', () => {
    expect(OSHO_PLAYLIST.length).toBeGreaterThan(0);
    for (const track of OSHO_PLAYLIST) {
      expect(typeof track.id).toBe('string');
      expect(track.id.length).toBeGreaterThan(0);
      expect(typeof track.title).toBe('string');
      expect(typeof track.category).toBe('string');
      expect(typeof track.description).toBe('string');
    }
  });

  test('track ids are unique', () => {
    const ids = OSHO_PLAYLIST.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every music track has an artist and unique id', () => {
    expect(OSHO_MUSIC_PLAYLIST.length).toBeGreaterThan(0);
    for (const track of OSHO_MUSIC_PLAYLIST) {
      expect(typeof track.id).toBe('string');
      expect(track.id.length).toBeGreaterThan(0);
      expect(typeof track.title).toBe('string');
      expect(typeof track.artist).toBe('string');
      expect(typeof track.category).toBe('string');
    }
    const ids = OSHO_MUSIC_PLAYLIST.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Radio Osho - formatTime', () => {
  test('formats seconds under a minute', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(9)).toBe('0:09');
    expect(formatTime(59)).toBe('0:59');
  });

  test('formats minutes and seconds', () => {
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(75)).toBe('1:15');
    expect(formatTime(995)).toBe('16:35');
  });

  test('formats hours when needed', () => {
    expect(formatTime(3600)).toBe('1:00:00');
    expect(formatTime(3725)).toBe('1:02:05');
  });

  test('handles invalid input', () => {
    expect(formatTime(-5)).toBe('0:00');
    expect(formatTime(NaN)).toBe('0:00');
    expect(formatTime(Infinity)).toBe('0:00');
    expect(formatTime(undefined)).toBe('0:00');
  });
});

describe('Radio Osho - getCategories', () => {
  test('returns All plus each unique category in order', () => {
    const tracks = [
      { category: 'Meditation' },
      { category: 'Awareness' },
      { category: 'Meditation' },
      { category: 'Love' },
    ];
    expect(getCategories(tracks)).toEqual([ALL_CATEGORY, 'Meditation', 'Awareness', 'Love']);
  });

  test('returns only All for empty input', () => {
    expect(getCategories([])).toEqual([ALL_CATEGORY]);
  });
});

describe('Radio Osho - filterTracks', () => {
  const tracks = OSHO_PLAYLIST;

  test('returns every track with the default options', () => {
    expect(filterTracks(tracks)).toHaveLength(tracks.length);
  });

  test('filters by category', () => {
    const result = filterTracks(tracks, { category: 'Meditation' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((t) => t.category === 'Meditation')).toBe(true);
  });

  test('filters by search query across title and description', () => {
    const result = filterTracks(tracks, { query: 'watching' });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((t) => {
      const haystack = `${t.title} ${t.description}`.toLowerCase();
      expect(haystack).toContain('watching');
    });
  });

  test('filters by artist as well', () => {
    const result = filterTracks(OSHO_MUSIC_PLAYLIST, { query: 'deuter' });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((t) => {
      const haystack = `${t.title} ${t.artist} ${t.description} ${t.category}`.toLowerCase();
      expect(haystack).toContain('deuter');
    });
  });

  test('combines category and query filters', () => {
    const result = filterTracks(tracks, { category: 'Meditation', query: 'watching' });
    expect(result.every((t) => t.category === 'Meditation')).toBe(true);
  });

  test('returns empty when nothing matches', () => {
    expect(filterTracks(tracks, { query: 'zzzznotarealtalk' })).toEqual([]);
  });
});

describe('Radio Osho - index helpers', () => {
  test('getNextIndex wraps around sequentially', () => {
    expect(getNextIndex(0, 3)).toBe(1);
    expect(getNextIndex(2, 3)).toBe(0);
  });

  test('getPreviousIndex wraps backwards', () => {
    expect(getPreviousIndex(0, 3)).toBe(2);
    expect(getPreviousIndex(2, 3)).toBe(1);
  });

  test('single-item playlists always return index 0', () => {
    expect(getNextIndex(0, 1)).toBe(0);
    expect(getPreviousIndex(0, 1)).toBe(0);
  });

  test('shuffle never returns the current index for multi-item lists', () => {
    const random = () => 0.0001;
    expect(getNextIndex(0, 5, { shuffle: true, random })).not.toBe(0);
  });

  test('clamp keeps values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });
});
