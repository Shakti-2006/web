let allProducts = [];
let filteredCategory = null;

//Fetch Products from server
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3001/products");
    if (!response.ok)
      throw new Error(`HTTP error! status : ${response.status}`);
    const products = await response.json();

    allProducts = products;
    populateCategories(products);
    displayProducts(products);
  } catch (error) {
    const errorE1 = document.getElementById("errorE1");
    if (errorE1) {
      errorE1.textContent = "Failed to load products" + error.message;
    } else {
      alert("Failed to load products" + error.message);
    }
  }
}

//Generate category list
function populateCategories(products) {
  const categoryList = document.getElementById("categoryList");
  const categories = [...new Set(products.map((p) => p.category))];

  categoryList.innerHTML =
    `<li onclick="filterByCategory(null)">All</li>` +
    categories
      .map((cat) => `<li onclick="filterByCategory('${cat}')"> ${cat}</li>`)
      .join("");
}

//filter by selected category
function filterByCategory(category) {
  filteredCategory = category;
  applyFilters();
}

//Apply current filters: category, search, sort
function applyFilters() {
  let filtered = [...allProducts];

  //category filter
  if (filteredCategory) {
    filtered = filtered.filter((p) => p.category === filteredCategory);
  }

  //search filter
  const searchTerm = document.getElementById("searchBox").value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );
  }

  //sort
  const sortType = document.getElementById("sortSelect").value;
  if (sortType === "lowToHigh") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortType === "highToLow") {
    filtered.sort((a, b) => b.price - a.price);
  }

  displayProducts(filtered);
}

//Render products to page
function displayProducts(products) {
  const productsE1 = document.getElementById("products");
  if (products.length === 0) {
    productsE1.innerHTML = "<p> No Products Available</p>";
    return;
  }

  productsE1.innerHTML = products
    .map(
      (product) => `
        <div class="product">
        <img src="${product.image}" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <h5>${product.category}</h5>
        <div class="price">Rs ${product.price}</div>
        <button onclick='addToCart(${JSON.stringify(
          product
        )})'> Add to Cart</button>
        </div>`
    )
    .join("");
}

//add item to localStorage cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exists = cart.find((item) => item.id === product.id);

  if (!exists) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  } else {
    alert(`${product.name} is already in the cart.`);
  }
}

//Event Listeners
document.getElementById("searchBox").addEventListener("input", applyFilters);
document.getElementById("sortSelect").addEventListener("change", applyFilters);

fetchProducts();
