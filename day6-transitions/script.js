function loadProductswithThen () {
  fetch('https://fakestoreapi.com/products')
    .then((response) => {
      if (!response.ok) throw new Error('Network error: ' + response.status);
      return response.json();
    })
    .then((data) => {
      allproducts = data;
      /*renderCategoryChips(allproducts);
      renderproducts(allproducts);
     console.log(data); */
    })
    .catch((error) => showLoadError(error));
}
loadProductswithThen();
     