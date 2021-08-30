export default class MovieService {
  constructor() {
    this.apiBase = 'https://api.themoviedb.org/3/';
    this.apiKey = 'd616b7e180ca490592633d1a5982969d';
    this.tokenId = null;
  }

  async getResource(url) {
    const res = await fetch(`${url}`);

    if (!res.ok) {
      throw new Error(`Got an error ${res.status}`);
    }

    return res.json();
  }

  async getToken() {
    const urlGetToken = `${this.apiBase}authentication/guest_session/new?&api_key=${this.apiKey}`;
    const sessionId = await this.getResource(urlGetToken);

    this.tokenId = sessionId.guest_session_id;

    return sessionId.guest_session_id;
  }

  async rateMovieById(movieId, data) {
    if (this.tokenId === null) {
      this.tokenId = await this.getToken();
    }

    const res = await fetch(
      `${this.apiBase}movie/${movieId}/rating?&api_key=${this.apiKey}&guest_session_id=${this.tokenId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
      }
    );

    return res.status_message;
  }

  async getGenres() {
    const genresList = await this.getResource(`${this.apiBase}genre/movie/list?api_key=${this.apiKey}`);
    return genresList.genres;
  }

  editDescription(text) {
    const newText = text;

    if (newText.length < 205) {
      return newText;
    }
    return `${newText.slice(0, 205)}...`;
  }

  editAppraisal(number) {
    if (String(number).length > 1) {
      return `${number}`;
    }
    return `${number}.${0}`;
  }

  newObjectMovie(objectMovie) {
    return {
      id: objectMovie.id,
      name: objectMovie.title,
      description: this.editDescription(objectMovie.overview),
      poster: `https://image.tmdb.org/t/p/original${objectMovie.poster_path}`,
      date: objectMovie.release_date,
      appraisal: this.editAppraisal(objectMovie.vote_average),
      userRating: objectMovie.rating,
      genre: objectMovie.genre_ids,
    };
  }

  async getTrendingMovies() {
    return this.getResource(`${this.apiBase}trending/movie/day?api_key=${this.apiKey}`)
      .then((result) => result.results)
      .then((arrMovei) => arrMovei.map((element) => this.newObjectMovie(element)));
  }

  async getRatedMovies() {
    return this.getResource(`${this.apiBase}guest_session/${this.tokenId}/rated/movies?api_key=${this.apiKey}`)
      .then((result) => result.results)
      .then((arrMovei) => arrMovei.map((element) => this.newObjectMovie(element)));
  }

  getSearchMovie(search) {
    return this.getResource(`${this.apiBase}search/movie?api_key=${this.apiKey}&query=${search}&language=en-US`)
      .then((res) => res.results)
      .then((arrMovei) => arrMovei.map((element) => this.newObjectMovie(element)));
  }
}
