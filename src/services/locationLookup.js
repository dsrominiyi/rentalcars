const locationLookup = async (searchText, maxResults = 6) => {
  const response = await (
    await fetch(
      `https://cors.io/?https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=${maxResults}&solrTerm=${searchText}`,
      { method: 'get' }
    )
  ).json();

  return response.results && response.results.numFound > 0 ? response.results.docs : [];
};

export default locationLookup;