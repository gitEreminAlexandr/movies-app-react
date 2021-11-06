import { setCookie, getCookie } from "../utils/utils";

export default class MovieService {
  constructor() {
    this.apiBase = 'https://api.themoviedb.org/3/';
    this.apiKey = 'd616b7e180ca490592633d1a5982969d';
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

    setCookie('token', sessionId.guest_session_id, { secure: true, 'max-age': 97200 });
  }

  async rateMovieById(movieId, data) {
    const token = getCookie('token');

    const res = await fetch(
      `${this.apiBase}movie/${movieId}/rating?&api_key=${this.apiKey}&guest_session_id=${token}`,
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
      poster: objectMovie.poster_path === null ? 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/no-internet-poster-template-design-996432a5f193ca3fd6bd8b57d0b0210f_screen.jpg?ts=1591381528' : `https://image.tmdb.org/t/p/original${objectMovie.poster_path}`,
      date: objectMovie.release_date,
      appraisal: this.editAppraisal(objectMovie.vote_average),
      userRating: objectMovie.rating,
      genre: objectMovie.genre_ids,
    };
  }

  async getTrendingMovies() {

    const token = getCookie('token');
    if (!token) {
      this.getToken();
    }
    
    return this.getResource(`${this.apiBase}trending/movie/day?api_key=${this.apiKey}`)
      .then((result) => result.results)
      .then((arrMovei) => arrMovei.map((element) => this.newObjectMovie(element)));
  }

  async getRatedMovies() {
    const token = getCookie('token')

    return this.getResource(`${this.apiBase}guest_session/${token}/rated/movies?api_key=${this.apiKey}`)
      .then((result) => result.results)
      .then((arrMovei) => arrMovei.map((element) => this.newObjectMovie(element)));
  }

  getSearchMovie(search, page) {
    return this.getResource(`${this.apiBase}search/movie?api_key=${this.apiKey}&query=${search}&language=en-US&page=${page}`)
      .then(({results, total_results: numberPages}) => {
        const arrMovies =  results.map((element) => this.newObjectMovie(element));
        return { results: arrMovies, numberPages };
      });
  }
}

