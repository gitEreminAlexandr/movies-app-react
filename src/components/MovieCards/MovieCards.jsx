import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { format } from 'date-fns';
import { Row, Col, Typography, Rate } from 'antd';
import Genres from '../Genres';
import './MovieCards.scss';

const MovieCards = ({ id, name, appraisal, date, description, poster, genre, userRating, rateMovie }) => {
  const { Title, Text } = Typography;

  const colorBorderRating = classNames({
    'movie-cards__info--rating': true,
    'color-border-rating-short': appraisal <= 3,
    'color-border-rating-normal': appraisal > 3 && appraisal <= 5,
    'color-border-rating-good': appraisal > 5 && appraisal <= 7,
    'color-border-rating-high': appraisal > 7,
  });

  return (
    <Row className="movie-cards">
      <Col className="movie-cards__poster">
        <img className="movie-cards__poster--img" src={poster} alt="poster" />
      </Col>
      <Col className="movie-cards__info">
        <Row className="movie-cards__info__blok-name-rating">
          <Col className="movie-cards__info--name">
            <Title level={5}>{name}</Title>
          </Col>
          <Col className={colorBorderRating}>{appraisal}</Col>
        </Row>
        <Col className="movie-cards__info--data">
          <Text type="secondary">{date && format(new Date(date), 'MMMM dd, yyyy')}</Text>
        </Col>
        <Col className="movie-cards__info--genre">
          <Genres genre={genre} />
        </Col>
        <Col className="movie-cards__info--description">
          <p>{description}</p>
        </Col>
      </Col>
      <Col className="movie-cards__appraisal">
        <Rate
          allowHalf
          value={userRating}
          onChange={(value) => rateMovie(id, { value })}
          count={10}
          allowClear={false}
        />
      </Col>
    </Row>
  );
};

MovieCards.defaultProps = {
  id: 0,
  name: '',
  appraisal: '',
  date: '',
  description: '',
  poster: '',
  genre: [],
  userRating: 0,
  rateMovie: () => {},
};

MovieCards.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  appraisal: PropTypes.string,
  date: PropTypes.string,
  description: PropTypes.string,
  poster: PropTypes.string,
  genre: PropTypes.arrayOf(PropTypes.number),
  userRating: PropTypes.number,
  rateMovie: PropTypes.func,
};

export default MovieCards;
