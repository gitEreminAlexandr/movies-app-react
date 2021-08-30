import React from 'react';
import PropTypes from 'prop-types';
import { Col, List } from 'antd';
import MovieCards from '../MovieCards';
import './ListMovieCards.scss';

const ListMovieCards = ({ movieList, rateMovie }) => (
  <List
    grid={{
      gutter: 1,
    }}
    pagination={{
      size: 'small',
      position: 'bottom',
      pageSize: 6,
    }}
    dataSource={movieList}
    renderItem={(item) => (
      <Col className="list-movie-cards__item">
        <MovieCards {...item} rateMovie={rateMovie} />
      </Col>
    )}
  />
);

ListMovieCards.defaultProps = {
  movieList: [],
  rateMovie: () => {},
};

ListMovieCards.propTypes = {
  movieList: PropTypes.arrayOf(PropTypes.object),
  rateMovie: PropTypes.func,
};

export default ListMovieCards;
