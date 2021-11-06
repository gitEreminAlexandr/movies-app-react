/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Col, List, Pagination } from 'antd';
import MovieCards from '../MovieCards';
import './ListMovieCards.scss';

const ListMovieCards = ({ movieList, rateMovie, numberPages, onChangePage, pageList }) => (
  <List
    grid={{
      gutter: 1,
    }}
    dataSource={movieList}
    renderItem={(item) => (
      <Col className="list-movie-cards__item">
        <MovieCards {...item} rateMovie={rateMovie} />
      </Col>
    )}
  >
    {numberPages === 0 ? null : <Pagination size="small" onChange={page => onChangePage(page)}  pageSize={20} defaultCurrent={pageList} responsive total={numberPages} showSizeChanger={false}/>}
  </List>
);

ListMovieCards.defaultProps = {
  movieList: [],
  rateMovie: () => {},
  numberPages: 0,
  onChangePage: () => {},
  pageList: 0,
};

ListMovieCards.propTypes = {
  movieList: PropTypes.arrayOf(PropTypes.object),
  rateMovie: PropTypes.func,
  numberPages: PropTypes.number,
  onChangePage: PropTypes.func,
  pageList: PropTypes.number,
};

export default ListMovieCards;
