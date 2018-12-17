import React from 'react';
import 'enzyme/mount';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import SearchResultsForm from '../../../src/components/SearchResultsForm';

describe('<SearchResultsForm />', () => {

  let component;
  const results = [{}, {}, {}];
  const resultsLookup = sinon.stub().resolves(results);

  const props = {
    title: 'Where are you going?',
    label: 'Pick-up Location',
    placeholder: 'city, airport, station, region and district...',
    resultsLookup,
    ResultsList: sinon.stub()
  };

  const initialise = (props) => {
    component = shallow(<SearchResultsForm {...props} />);
  };

  beforeEach(() => {
    resultsLookup.resetHistory();
    initialise(props);
  });

  describe('initial render', () => {

    it('should render the title', () => {
      const title = component.find('h2');

      expect(title).to.have.length(1);
      expect(title.text()).to.equal(props.title);
    });

    it('should render the label', () => {
      const label = component.find('#searchBoxLabel');

      expect(label).to.have.length(1);
      expect(label.text()).to.equal(props.label);
    });

    it('should render the search field with a placeholder', () => {
      const searchField = component.find('#searchField');

      expect(searchField).to.have.length(1);
      expect(searchField.prop('placeholder')).to.equal(props.placeholder);
    });

    it('should render ResultsList with no results and an empty search text', () => {
      const ResultsList = component.find('#ResultsList');

      expect(ResultsList).to.have.length(1);
      expect(ResultsList.prop('results')).to.deep.equal([]);
      expect(ResultsList.prop('searchText')).to.equal('');
    });

    it('should render resultsListContainer with the removed class', () => {
      const ResultsList = component.find('#resultsListContainer');

      expect(ResultsList).to.have.length(1);
      expect(ResultsList.hasClass('removed')).to.equal(true);
    });

    it('should render the clear search button with the hidden class', () => {
      const clearSearch = component.find('#clearSearch');

      expect(clearSearch).to.have.length(1);
      expect(clearSearch.hasClass('hidden')).to.equal(true);
    });
  });

  describe('searching', () => {

    it('should not call resultsLookup if less than 2 characters are entered', () => {
      let searchText = '';
      const searchField = component.find('#searchField');

      searchField.prop('onChange')({ target: { value: searchText } });

      expect(props.resultsLookup).to.have.not.been.called;

      searchText = 'M';
      searchField.prop('onChange')({ target: { value: searchText } });

      expect(props.resultsLookup).to.have.not.been.called;
    });

    it('should call resultsLookup when 2 or more characters are entered', () => {
      let searchText = 'Ma';
      const searchField = component.find('#searchField');

      searchField.prop('onChange')({ target: { value: searchText } });

      expect(props.resultsLookup).to.have.been.calledWith(searchText);

      searchText = 'Manchester';
      searchField.prop('onChange')({ target: { value: searchText } });

      expect(props.resultsLookup).to.have.been.calledWith(searchText);
    });

    it('should render ResultsList with the results returned from resultsLookup and search text', async () => {
      const searchText = 'Man';
      const searchField = component.find('#searchField');

      await searchField.prop('onChange')({ target: { value: searchText } });
      const ResultsList = component.find('#ResultsList');

      expect(ResultsList.prop('results')).to.equal(results);
      expect(ResultsList.prop('searchText')).to.equal(searchText);
    });

    it('should apply the removed class to resultsListContainer if the search text has less than 2 characters', () => {
      let searchText = 'M';
      const searchField = component.find('#searchField');

      searchField.prop('onFocus')();
      searchField.prop('onChange')({ target: { value: searchText } });
      let resultsListContainer = component.find('#resultsListContainer');

      expect(resultsListContainer.hasClass('removed')).to.equal(true);

      searchText = '';
      searchField.prop('onChange')({ target: { value: searchText } });
      resultsListContainer = component.find('#resultsListContainer');

      expect(resultsListContainer.hasClass('removed')).to.equal(true);
    });

    it('should remove the removed class from resultsListContainer if the search field is focused and has 2 or more characters', () => {
      let searchText = 'Ma';
      const searchField = component.find('#searchField');

      searchField.prop('onFocus')();
      searchField.prop('onChange')({ target: { value: searchText } });
      let resultsListContainer = component.find('#resultsListContainer');

      expect(resultsListContainer.hasClass('removed')).to.equal(false);

      searchText = 'Manchester';
      searchField.prop('onChange')({ target: { value: searchText } });
      resultsListContainer = component.find('#resultsListContainer');

      expect(resultsListContainer.hasClass('removed')).to.equal(false);
    });

    it('should apply the removed class to the resultsListContainer if the search field loses focus', () => {
      const searchText = 'Ma';
      const searchField = component.find('#searchField');

      searchField.prop('onFocus')();
      searchField.prop('onChange')({ target: { value: searchText } });
      let resultsListContainer = component.find('#resultsListContainer');

      expect(resultsListContainer.hasClass('removed')).to.equal(false);

      searchField.prop('onBlur')();
      resultsListContainer = component.find('#resultsListContainer');

      expect(resultsListContainer.hasClass('removed')).to.equal(true);
    });

    it('should remove the hidden class from the clear search button if the search text has 1 or more characters', async () => {
      let searchText = 'M';
      const searchField = component.find('#searchField');

      await searchField.prop('onChange')({ target: { value: searchText } });
      let clearSearch = component.find('#clearSearch');

      expect(clearSearch.hasClass('hidden')).to.equal(false);

      searchText = 'Manchester';
      await searchField.prop('onChange')({ target: { value: searchText } });
      clearSearch = component.find('#clearSearch');

      expect(clearSearch.hasClass('hidden')).to.equal(false);
    });

    it('should re-apply the hidden class to the the clear search button if the search text is empty', () => {
      let searchText = 'M';
      const searchField = component.find('#searchField');

      searchField.prop('onChange')({ target: { value: searchText } });
      let clearSearch = component.find('#clearSearch');

      expect(clearSearch.hasClass('hidden')).to.equal(false);

      searchText = '';
      searchField.prop('onChange')({ target: { value: searchText } });
      clearSearch = component.find('#clearSearch');

      expect(clearSearch.hasClass('hidden')).to.equal(true);
    });

    it('should clear the search text when the clear search button is clicked/tapped', () => {
      const searchText = 'Man';
      let searchField = component.find('#searchField');

      searchField.prop('onChange')({ target: { value: searchText } });

      expect(component.state('searchText')).to.equal(searchText);

      const clearSearch = component.find('#clearSearch');
      clearSearch.prop('onClick')();
      searchField = component.find('#searchField');

      expect(component.state('searchText')).to.equal('');
    });
  });
});