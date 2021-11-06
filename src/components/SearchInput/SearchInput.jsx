import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import { Input, Row, Col } from 'antd';
import './Search.scss';

class SearchInput extends Component {
  state = {
    label: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const { label } = this.state;
    if (label !== prevState.label) {
      const { onSearchInput, onSearchLoadingOn } = this.props;
      onSearchLoadingOn();
      onSearchInput(label);
    }
  }

  onLabelChange = (event) => {
    this.setState({
      label: event.target.value,
    });
  };

  debounceEvent(...args) {
    this.debouncedEvent = debounce(...args);
    return (events) => {
      events.persist();
      return this.debouncedEvent(events);
    };
  }

  render() {
    return (
      <Row>
        <Col className="search" span={24}>
          <Input
            className="search--input"
            placeholder="Type to search..."
            onChange={this.debounceEvent(this.onLabelChange, 800)}
          />
        </Col>
      </Row>
    );
  }
}

SearchInput.defaultProps = {
  onSearchInput: () => {},
  onSearchLoadingOn: () => {},
};

SearchInput.propTypes = {
  onSearchInput: PropTypes.func,
  onSearchLoadingOn: PropTypes.func,
};

export default SearchInput;
