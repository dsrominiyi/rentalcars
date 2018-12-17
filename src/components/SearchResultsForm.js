import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LoadingSpinner from './img/LoadingSpinner';
import DeleteCross from './svg/DeleteCross';

class SearchResultsForm extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    resultsLookup: PropTypes.func.isRequired,
    ResultsList: PropTypes.func.isRequired
  };

  state = {
    searchText: '',
    results: [],
    loading: false,
    focused: false
  };

  async componentDidUpdate(prevProps, prevState) {
    const { searchText, loading } = this.state;

    if (searchText.length > 1 && searchText !== prevState.searchText) {
      try {
        const results = await this.props.resultsLookup(searchText);
        return this.setState({ results, loading: false });
      } catch (err) {
        console.error(err);
        return this.setState({ results: [], loading: false });
      }
    }
    if (loading) {
      this.setState({ loading: false });
    }
  }

  render() {
    const { title, label, placeholder, ResultsList } = this.props;
    const { searchText, results, loading, focused } = this.state;

    return (
      <form id="SearchResultsForm">
        <h2>{title}</h2>

        <div>
          <label htmlFor="searchField" id="searchBoxLabel">{label}</label>
          <input
            type="text"
            id="searchField"
            name="searchField"
            placeholder={placeholder}
            value={searchText}
            onChange={e => this.setState({
              searchText: e.target.value,
              loading: e.target.value.length > 1
            })}
            onFocus={e => this.setState({ focused: true })}
            onBlur={e => this.setState({ focused: false })}
          />
          {loading ? <LoadingSpinner /> : ''}
          <span
            id="clearSearch"
            className={searchText.length === 0 || loading ? 'hidden' : ''}
            onClick={e => this.setState({ searchText: '', loading: false })}
          >
            <DeleteCross />
          </span>
        </div>

        <div id="resultsListContainer" className={searchText.length < 2 || !focused ? 'removed' : ''}>
          <ResultsList
            id="ResultsList"
            results={results}
            searchText={searchText}
            loading={loading}
          />
        </div>
      </form>
    );
  }

}

export default SearchResultsForm;