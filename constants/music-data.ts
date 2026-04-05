export interface MusicTrack {
  title: string;
  artist: string;
  cover: string;
  file: string;
}

export interface SpotifyTrack extends MusicTrack {
  duration: string;
}

export const MUSIC_PLAYLIST: MusicTrack[] = [
  {
    title: "Chill Lofi Beat",
    artist: "LoFi Artist",
    cover: "/placeholder.svg?height=300&width=300&query=album cover lofi",
    file: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
  },
  {
    title: "Jazz Vibes",
    artist: "Jazz Artist",
    cover: "/placeholder.svg?height=300&width=300&query=album cover jazz",
    file: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946f4a8c41.mp3?filename=jazz-music-7174.mp3",
  },
  {
    title: "Ambient Sounds",
    artist: "Ambient Artist",
    cover: "/placeholder.svg?height=300&width=300&query=album cover ambient",
    file: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8c567b7.mp3?filename=ambient-piano-ampamp-strings-10711.mp3",
  },
];

export const SPOTIFY_PLAYLIST: SpotifyTrack[] = [
  {
    title: "Lofi Study Beat",
    artist: "Chill Artist",
    cover: "/cozy-corner-beats.png",
    file: "/lofi-study-112191.mp3",
    duration: "3:42",
  },
  {
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    cover: "/cool-blue-jazz.png",
    file: "/lofi-study-112191.mp3",
    duration: "2:56",
  },
  {
    title: "Sunny Morning",
    artist: "Alex Productions",
    cover: "/grand-piano-keys.png",
    file: "/lofi-study-112191.mp3",
    duration: "4:10",
  },
];
