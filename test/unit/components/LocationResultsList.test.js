import React from 'react';
import 'enzyme/mount';
import { shallow } from 'enzyme';

import LocationResultsList from '../../../src/components/LocationResultsList';

describe('<LocationResultsList />', () => {

  let component;

  const tagMap = {
    A: 'Airport',
    C: 'City',
    T: 'Station'
  };

  const results = [
    {
      country: 'United Kingdom',
      city: 'Manchester',
      iata: 'MAN',
      name: 'Manchester Airport',
      region: 'Greater Manchester',
      placeType: 'A'
    },
    {
      country: 'United Kingdom',
      name: 'Manchester',
      region: 'Greater Manchester',
      placeType: 'C'
    },
    {
      country: 'United Kingdom',
      city: 'Manchester',
      name: 'Manchester - Piccadilly Train Station',
      region: 'England',
      placeType: 'T'
    },
    {
      country: 'United Kingdom',
      name: 'Oldham',
      region: 'Greater Manchester',
      placeType: 'C'
    }
  ];

  const initialise = (props) => {
    component = shallow(<LocationResultsList {...props} />);
  };

  it('should display a message if no results are received', () => {
    initialise();
    const noResults = component.find('#noResults');

    expect(noResults).to.have.length(1);
    expect(noResults.text()).to.equal('No results found');
  });

  it('should render the received results as expected', () => {
    const expectedItemTextHtml = [
      '<div class="itemText">Manchester Airport (MAN)<span>Manchester, United Kingdom</span></div>',
      '<div class="itemText">Manchester<span>Greater Manchester, United Kingdom</span></div>',
      '<div class="itemText">Manchester - Piccadilly Train Station<span>Manchester, England, United Kingdom</span></div>',
      '<div class="itemText">Oldham<span>Greater Manchester, United Kingdom</span></div>'
    ];

    initialise({ results });
    const noResults = component.find('#noResults');
    const renderedItems = component.find('.item');

    expect(noResults).to.have.length(0);
    expect(renderedItems).to.have.length(results.length);

    renderedItems.forEach((renderedItem, index) => {
      const itemTag = renderedItem.find('.itemTag');
      const itemText = renderedItem.find('.itemText');
      const expectedTag = tagMap[results[index].placeType];

      expect(itemTag).to.have.length(1);
      expect(itemText).to.have.length(1);
      expect(itemTag.text()).to.equal(expectedTag);
      expect(itemText.html()).to.equal(expectedItemTextHtml[index]);
    });
  });

  it('should highlight the search text in the result items if applicable', () => {
    const expectedItemTextHtml = [
      '<div class="itemText"><em>Manchester</em> Airport (MAN)<span>Manchester, United Kingdom</span></div>',
      '<div class="itemText"><em>Manchester</em><span>Greater Manchester, United Kingdom</span></div>',
      '<div class="itemText"><em>Manchester</em> - Piccadilly Train Station<span>Manchester, England, United Kingdom</span></div>',
      '<div class="itemText">Oldham<span>Greater Manchester, United Kingdom</span></div>'
    ];

    initialise({ results, searchText: 'manchester' });
    const renderedItems = component.find('.item');

    expect(renderedItems).to.have.length(results.length);

    renderedItems.forEach((renderedItem, index) => {
      const itemTag = renderedItem.find('.itemTag');
      const itemText = renderedItem.find('.itemText');
      const expectedTag = tagMap[results[index].placeType];

      expect(itemTag).to.have.length(1);
      expect(itemText).to.have.length(1);
      expect(itemTag.text()).to.equal(expectedTag);
      expect(itemText.html()).to.equal(expectedItemTextHtml[index]);
    });
  });
});