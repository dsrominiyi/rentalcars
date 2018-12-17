import React from 'react';
import { render } from 'react-dom';

import SearchResultsForm from './components/SearchResultsForm';
import LocationResultsList from './components/LocationResultsList';
import locationLookup from './services/locationLookup';

import './style/sass/index.scss';

render(
  <div id="form">
    <SearchResultsForm
      title="Where are you going?"
      label="Pick-up Location"
      placeholder="city, airport, station, region and district..."
      resultsLookup={locationLookup}
      ResultsList={LocationResultsList}
    />
  </div>,
  document.getElementById('root')
);
