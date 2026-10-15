export const ALL_CATEGORY = 'All';

export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (n) => String(n).padStart(2, '0');
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(secs)}`;
  return `${minutes}:${pad(secs)}`;
}

export function getCategories(tracks) {
  const seen = [];
  for (const track of tracks) {
    if (track.category && !seen.includes(track.category)) {
      seen.push(track.category);
    }
  }
  return [ALL_CATEGORY, ...seen];
}

export function filterTracks(tracks, { category = ALL_CATEGORY, query = '' } = {}) {
  const needle = query.trim().toLowerCase();
  return tracks.filter((track) => {
    const matchesCategory = category === ALL_CATEGORY || track.category === category;
    if (!matchesCategory) return false;
    if (!needle) return true;
    const haystack = `${track.title} ${track.artist || ''} ${track.description} ${track.category}`.toLowerCase();
    return haystack.includes(needle);
  });
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getNextIndex(currentIndex, total, { shuffle = false, random = Math.random } = {}) {
  if (total <= 1) return 0;
  if (shuffle) {
    let next = Math.floor(random() * total);
    if (next === currentIndex) next = (next + 1) % total;
    return next;
  }
  return (currentIndex + 1) % total;
}

export function getPreviousIndex(currentIndex, total) {
  if (total <= 1) return 0;
  return (currentIndex - 1 + total) % total;
}
