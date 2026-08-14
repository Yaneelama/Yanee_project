// =======================================
// ShopEase E-Commerce SPA
// script.js - Part 1
// =======================================

// ------------------------------
// Global Variables
// ------------------------------

let products = [];
let filteredProducts = [];

// ------------------------------
// DOM Elements
// ------------------------------

const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".route-link");

const productContainer = document.getElementById("productContainer");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");

const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");

// ------------------------------
// SPA Router
// ------------------------------

function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    const targetPage = document.getElementById(pageId);

    if (targetPage) {
        targetPage.classList.add("active-page");
    } else {
        document.getElementById("notfound").classList.add("active-page");
    }

    navLinks.forEach(link => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === "#" + pageId) {
            link.classList.add("active");
        }

    });

}

// ------------------------------
// Hash Router
// ------------------------------

function router() {

    const hash = window.location.hash.replace("#", "") || "home";

    showPage(hash);

}

// ------------------------------
// Product Card
// ------------------------------

function createProductCard(product) {

    return `

        <div class="card shadow-sm h-100">

            <img
                src="${product.image}"
                class="card-img-top p-3"
                style="height:250px;object-fit:contain;"
                alt="${product.title}"
            >

            <div class="card-body d-flex flex-column">

                <span class="badge bg-primary mb-2">

                    ${product.category}

                </span>

                <h5 class="card-title">

                    ${product.title}

                </h5>

                <p class="card-text text-muted">

                    ${product.description.substring(0,90)}...

                </p>

                <div class="mt-auto">

                    <h4 class="text-success">

                        $${product.price}

                    </h4>

                    <button class="btn btn-dark w-100 mt-2">

                        Buy Now

                    </button>

                </div>

            </div>

        </div>

    `;

}

// ------------------------------
// Render Products
// Uses .map()
// ------------------------------

function renderProducts(productList) {

    if (productList.length === 0) {

        productContainer.innerHTML = `

            <div class="col-12 text-center">

                <h4>No products found.</h4>

            </div>

        `;

        return;

    }

    productContainer.innerHTML = productList
        .map(product => {

            return `

                <div class="product-item">

                    ${createProductCard(product)}

                </div>

            `;

        })
        .join("");

}

// ------------------------------
// Populate Category Dropdown
// ------------------------------

function loadCategories() {

    const categories = [

        "all",

        ...new Set(

            products.map(product => product.category)

        )

    ];

    categoryFilter.innerHTML = "";

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;

        option.textContent =

            category.charAt(0).toUpperCase() +

            category.slice(1);

        categoryFilter.appendChild(option);

    });

}

// ------------------------------
// Fetch Products
// async / await
// try / catch
// ------------------------------

async function fetchProducts() {

    loadingSpinner.classList.remove("d-none");

    errorMessage.classList.add("d-none");

    productContainer.innerHTML = "";

    try {

        const response = await fetch(

            "https://fakestoreapi.com/products"

        );

        if (!response.ok) {

            throw new Error("Unable to fetch products.");

        }

        const data = await response.json();

        products = data;

        filteredProducts = data;

        renderProducts(filteredProducts);

        loadCategories();

    }

    catch (error) {

        console.error(error);

        loadingSpinner.classList.add("d-none");

        errorMessage.classList.remove("d-none");

        errorMessage.innerHTML = `

            <strong>Error:</strong>

            Could not load products.

            Please refresh the page.

        `;

        return;

    }

    finally {

        loadingSpinner.classList.add("d-none");

    }

}
// ------------------------------
// Filter Products
// Uses .filter()
// ------------------------------

function filterProducts() {

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const selectedCategory = categoryFilter.value;

    filteredProducts = products.filter(product => {

        const matchesSearch =

            product.title
                .toLowerCase()
                .includes(searchText) ||

            product.description
                .toLowerCase()
                .includes(searchText);

        const matchesCategory =

            selectedCategory === "all" ||

            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    renderProducts(filteredProducts);

}

// ------------------------------
// Contact Form Validation
// ------------------------------

const contactForm = document.getElementById("contactForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");

const successMessage = document.getElementById("successMessage");

// ------------------------------
// Email Validation
// ------------------------------

function validateEmail(email) {

    const regex =

        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);

}

// ------------------------------
// Validate Form
// ------------------------------

function validateForm(event) {

    event.preventDefault();

    let valid = true;

    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";

    successMessage.classList.add("d-none");

    // Name

    if (nameInput.value.trim().length < 3) {

        nameError.textContent =
            "Name must contain at least 3 characters.";

        valid = false;

    }

    // Email

    if (!validateEmail(emailInput.value.trim())) {

        emailError.textContent =
            "Enter a valid email address.";

        valid = false;

    }

    // Message

    if (messageInput.value.trim().length < 10) {

        messageError.textContent =
            "Message must contain at least 10 characters.";

        valid = false;

    }

    if (valid) {

        successMessage.classList.remove("d-none");

        contactForm.reset();

    }

}

// ------------------------------
// Search Event
// ------------------------------

if (searchInput) {

    searchInput.addEventListener(

        "input",

        filterProducts

    );

}

// ------------------------------
// Category Event
// ------------------------------

if (categoryFilter) {

    categoryFilter.addEventListener(

        "change",

        filterProducts

    );

}

// ------------------------------
// Form Event
// ------------------------------

if (contactForm) {

    contactForm.addEventListener(

        "submit",

        validateForm

    );

}

// ------------------------------
// Navigation Active State
// ------------------------------

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.forEach(item => {

            item.classList.remove("active");

        });

        link.classList.add("active");

    });

});

// ------------------------------
// Router Events
// ------------------------------

window.addEventListener(

    "hashchange",

    router

);

window.addEventListener(

    "load",

    router

);
// ------------------------------
// Initialize Application
// ------------------------------

async function initializeApp() {

    await fetchProducts();

}

initializeApp();

// ------------------------------
// Optional: Scroll To Top
// ------------------------------

window.addEventListener("hashchange", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

// ------------------------------
// Buy Button Click
// Event Delegation
// ------------------------------

productContainer.addEventListener("click", function (event) {

    const button = event.target.closest(".btn-dark");

    if (!button) return;

    const card = button.closest(".card");

    const title = card.querySelector(".card-title").textContent;

    alert(`${title} added to cart!`);

});

// ------------------------------
// Keyboard Shortcut
// Press "/" to focus search
// ------------------------------

document.addEventListener("keydown", function (event) {

    if (event.key === "/") {

        event.preventDefault();

        if (window.location.hash === "#products") {

            searchInput.focus();

        }

    }

});

// ------------------------------
// Clear Search on Escape
// ------------------------------

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        searchInput.value = "";

        categoryFilter.value = "all";

        filterProducts();

    }

});

// ------------------------------
// Window Resize (Demo)
// ------------------------------

window.addEventListener("resize", () => {

    console.log(

        `Current Width: ${window.innerWidth}px`

    );

});

// ------------------------------
// End of script.js
// ------------------------------