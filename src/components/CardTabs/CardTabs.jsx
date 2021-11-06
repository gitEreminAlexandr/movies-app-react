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
    movieSearch: '',
    numberPages: 0,
    pageList: 1,
    loading: true,
    error: false,
  };

  movieService = new MovieService();

  componentDidMount() {
    this.getRateMovies();
    this.movieService.getGenres().then((result) => this.setState({ genresList: result }));
    this.movieService.getTrendingMovies().then((movieArr) => {
      this.setState({
        movieList: movieArr,
        loading: false,
      });
    });
    
  }

  componentDidUpdate(prevPropps, prevState) {
    const {movieSearch, pageList, moviesListRate} = this.state;

    if (moviesListRate !== prevState.moviesListRate) {
      this.assessmontMovies()
    }

    if(prevState.movieSearch !== movieSearch || prevState.pageList !== pageList) {
      this.movieService
      .getSearchMovie(movieSearch, pageList)
      .then(({ results, numberPages }) => {
        this.setState({
          movieList: results,
          numberPages,
          loading: false,
        })}
      )
      .catch(this.onError);
      if(prevState.pageList !== pageList) {
        window.scrollTo(0, 0);
      }
    }
  }

  assessmontMovies = () => {
    const {movieList} = this.state;
    const newMovieArr = movieList.map(this.checkForAssessmentMoviesList);

    this.setState({
      movieList: newMovieArr
    })
  }

  checkForAssessmentMoviesList = (movie) => {
    const { moviesListRate } = this.state;
    let newMovie = movie;

    moviesListRate.forEach(item => {
      if (newMovie.id === item.id) {
        newMovie = {...item}
      }
    })
    return newMovie;
  }

  getRateMovies = () => {
    this.movieService.getRatedMovies().then((result) =>
      this.setState({
        moviesListRate: result,
      })
    );
  };

  onSearchInput = (text) => {
    if (text.length === 0) {
      return this.movieService.getTrendingMovies().then((movieArr) => {
        this.setState({
          movieList: movieArr,
          numberPages: 0,
          loading: false,
        });
      });
    }
    return this.setState({
      movieSearch: text,
    })
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  rateMovie = (id, value) => {
    const { movieList, moviesListRate } = this.state;
    const newMovieList = movieList.map((item) => {
      if (item.id === id) {
        return { ...item, userRating: value.value };
      }
      return item;
    });

    const newMoviesListRate = moviesListRate.map((item) => {
      if (item.id === id) {
        return { ...item, userRating: value.value };
      }
      return item;
    });
    

    this.setState({
      movieList: newMovieList,
      moviesListRate: newMoviesListRate,
    });
    this.movieService.rateMovieById(id, value);
  };

  changePage = (page) => {
    this.setState({
      loading: true,
      pageList: page,
    })
  }

  searchLoadingOn = () => {
    this.setState({
      loading: true,
    });
  }

  render() {
    const { TabPane } = Tabs;
    const { moviesListRate, movieList, genresList, loading, error, numberPages, pageList } = this.state;

    const hasData = !(loading || error);
    const errorMassage = error ? <ErrorIndicator /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? <ListMovieCards movieList={movieList} rateMovie={this.rateMovie} numberPages={numberPages} pageList={pageList} onChangePage={this.changePage}/> : null;
    const contentRate = <ListMovieCards movieList={moviesListRate} rateMovie={this.rateMovie} numberPages={0} pageList={pageList} onChangePage={this.changePage}/>;

    return (
      <GenresProvider value={genresList}>
        <Tabs defaultActiveKey="1" centered onTabClick={( this.getRateMovies)}>
          <TabPane tab="Search" key="1">
            <SearchInput onSearchInput={this.onSearchInput} onSearchLoadingOn={this.searchLoadingOn}/>
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
