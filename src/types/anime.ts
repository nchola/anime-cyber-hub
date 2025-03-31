
export interface Anime {
  mal_id: number;
  title: string;
  title_english: string;
  title_japanese: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  synopsis: string;
  background: string;
  season: string;
  year: number;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  favorites: number;
  episodes: number;
  airing: boolean;
  aired: {
    from: string;
    to: string;
    string: string;
  };
  duration: string;
  status: string;
  genres: {
    mal_id: number;
    type: string;
    name: string;
  }[];
  studios: {
    mal_id: number;
    type: string;
    name: string;
  }[];
}

export interface AnimeResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface SingleAnimeResponse {
  data: Anime;
}

export interface Genre {
  mal_id: number;
  name: string;
  count: number;
  url: string;
}

export interface AnimeVideo {
  title: string;
  embed_url: string;
  url: string;
  images: {
    image_url: string;
  };
}

export interface AnimeVideosResponse {
  data: {
    promo: AnimeVideo[];
    episodes: AnimeVideo[];
    music_videos: AnimeVideo[];
  };
}
