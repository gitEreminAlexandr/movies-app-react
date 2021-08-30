import React, { Component } from 'react';
import { Tabs } from 'antd';
import MovieService from '../../services/MovieService';
import SearchInput from '../SearchInput';
import ListMovieCards from '../ListMovieCards';
import Spinner from '../Spinner';
import ErrorIndicator from '../ErrorIndicator';
import { GenresProvider } from '../GenresContext';
import './CardTabs.scss';

class CardTabs extends Component {
  state = {
    moviesListRate: [],
    movieList: [],
    genresList: [],
    loading: true,
    error: false,
  };

  movieService = new MovieService();

  componentDidMount() {
    this.movieService.getToken();
    this.movieService.getGenres().then((result) => this.setState({ genresList: result }));
    this.movieService.getTrendingMovies().then((movieArr) => {
      this.setState({
        movieList: movieArr,
        loading: false,
      });
    });
  }

  getRateMovies = () => {
    this.movieService.getRatedMovies().then((result) =>
      this.setState({
        moviesListRate: result,
      })
    );
  };

  onSearchInput = (text) => {
    const nameFilm = text;

    this.movieService
      .getSearchMovie(nameFilm)
      .then((movieArr) => {
        this.setState({
          movieList: movieArr,
          loading: false,
        });
      })
      .catch(this.onError);
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  rateMovie = (id, value) => {
    const { movieList } = this.state;
    const newMovieList = movieList.map((item) => {
      if (item.id === id) {
        return { ...item, userRating: value.value };
      }
      return item;
    });
    this.setState({
      movieList: newMovieList,
    });

    this.movieService.rateMovieById(id, value);
  };

  render() {
    const { TabPane } = Tabs;
    const { moviesListRate, movieList, genresList, loading, error } = this.state;

    const hasData = !(loading || error);
    const errorMassage = error ? <ErrorIndicator /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? <ListMovieCards movieList={movieList} rateMovie={this.rateMovie} /> : null;
    const contentRate = <ListMovieCards movieList={moviesListRate} rateMovie={this.rateMovie} />;

    return (
      <GenresProvider value={genresList}>
        <Tabs defaultActiveKey="1" centered onTabClick={('2', this.getRateMovies)}>
          <TabPane tab="Search" key="1">
            <SearchInput onSearchInput={this.onSearchInput} />
            {content}
            {spinner}
            {errorMassage}
          </TabPane>
          <TabPane tab="Rated" key="2">
            {contentRate}
          </TabPane>
        </Tabs>
      </GenresProvider>
    );
  }
}

export default CardTabs;
