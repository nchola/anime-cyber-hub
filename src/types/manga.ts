
export interface Manga {
  mal_id: number;
  url: string;
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
  approved: boolean;
  titles: {
    type: string;
    title: string;
  }[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  chapters: number | null;
  volumes: number | null;
  status: string;
  publishing: boolean;
  published: {
    from: string | null;
    to: string | null;
    prop: {
      from: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
      to: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
    };
    string: string;
  };
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  authors: {
    mal_id: number;
    type: string;
    name: string;
  }[];
  serializations: {
    mal_id: number;
    type: string;
    name: string;
  }[];
  genres: {
    mal_id: number;
    type: string;
    name: string;
  }[];
  themes: {
    mal_id: number;
    type: string;
    name: string;
  }[];
  demographics: {
    mal_id: number;
    type: string;
    name: string;
  }[];
  relations?: {
    relation: string;
    entry: {
      mal_id: number;
      type: string;
      name: string;
    }[];
  }[];
  external?: {
    name: string;
    url: string;
  }[];
  isBookmarked?: boolean;
}

export interface MangaResponse {
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
  data: Manga[];
}

export interface MangaGenre {
  mal_id: number;
  name: string;
  count: number;
}

export interface MangaGenresResponse {
  data: MangaGenre[];
}

