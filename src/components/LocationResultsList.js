import React from 'react';
import PropTypes from 'prop-types';

const LocationResultsList = ({ results, searchText, loading }) => {

  const tagMap = {
    A: 'Airport',
    C: 'City',
    D: 'District',
    T: 'Station'
  };

  const renderItemText = (item) => {
    const { name, iata, city, region, country, placeType } = item;

    let locationInfo = `${city ? `${city}, ` : ''}`;
    locationInfo += `${(region && placeType !== 'A') ? `${region}, ` : ''}`;
    locationInfo += `${country ? country : ''}`;

    const searchTextIndex = name.toLowerCase().indexOf(searchText.toLowerCase());

    let locationName;

    if (searchText && searchTextIndex !== -1) {
      const preSearchText = name.substring(0, searchTextIndex);
      const matchedSearchText = name.substring(searchTextIndex, searchTextIndex + searchText.length);
      const postSearchText = name.substring(searchTextIndex + searchText.length);
      locationName = (
        <React.Fragment>
          {preSearchText}<em>{matchedSearchText}</em>{postSearchText}{iata ? ` (${iata})` : ''}
        </React.Fragment>
      );
    } else {
      locationName = `${name}${iata ? ` (${iata})` : ''}`;
    }

    return (
      <div className="itemText">
        {locationName}
        <span>{locationInfo}</span>
      </div>
    );
  };

  const renderItem = (item, index) => {
    const tag = tagMap[item.placeType];

    return (
      <li className="item" key={index}>
        <a>
          <span className={`itemTag itemTag${item.placeType}`}>{tag}</span>
          {renderItemText(item)}
        </a>
      </li>
    );
  };

  return (
    <ul id="ResultsList">
      {
        results && results.length > 0
          ? results.map(renderItem)
          : loading && results.length === 0 ? '' : <li id="noResults">No results found</li>
      }
    </ul>
  );
};

LocationResultsList.propTypes = {
  results: PropTypes.array,
  searchText: PropTypes.string,
  loading: PropTypes.bool
};

export default LocationResultsList;