/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React from 'react';
import { Typography } from 'antd';
import PropTypes from 'prop-types';
import './Genres.scss';

import { GenresConsumer } from '../GenresContext';

const Genres = ({ genre }) => {
  const { Text } = Typography;

  return (
    <GenresConsumer>
      {(genresList) => {
        const genreMovies = genre.map((genreId, index) => {
          if (index < 3) {
            const [one] = genresList.filter((item) => item.id === genreId);
            const { id, name } = one;
            return (
              <Text keyboard key={`${id}`}>
                {name}
              </Text>
            );
          }
        });

        return genreMovies;
      }}
    </GenresConsumer>
  );
};

Genres.defaultProps = {
  genre: [],
};

Genres.propTypes = {
  genre: PropTypes.arrayOf(PropTypes.number),
};

export default Genres;
