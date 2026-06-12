/* ==========================================
   API CONFIG
========================================== */

const API_URL = "https://dummyjson.com/products";

/* ==========================================
   GLOBAL STATE
========================================== */

let allProducts = [];
let filteredProducts = [];

let currentPage = 1;
const itemsPerPage = 12;

/* ==========================================
   DOM ELEMENTS
========================================== */

const productGrid =
document.getElementById("productGrid");

const skeletonContainer =
document.getElementById("skeletonContainer");

const errorState =
document.getElementById("errorState");

const emptyState =
document.getElementById("emptyState");

const searchInput =
document.getElementById("searchInput");

const sortSelect =
document.getElementById("sortSelect");

const pagination =
document.getElementById("pagination");

const themeToggle =
document.getElementById("themeToggle");

/* ==========================================
   THEME MANAGEMENT
========================================== */

function initializeTheme() {

    const savedTheme =
    localStorage.getItem("theme");

    if (savedTheme === "light") {

        document.body.classList.add("light");

        themeToggle.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

    } else {

        document.body.classList.remove("light");

        themeToggle.innerHTML =
        '<i class="fa-solid fa-moon"></i>';
    }
}

function toggleTheme() {

    document.body.classList.toggle("light");

    const isLight =
    document.body.classList.contains("light");

    localStorage.setItem(
        "theme",
        isLight ? "light" : "dark"
    );

    themeToggle.innerHTML =
    isLight
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
}

themeToggle.addEventListener(
    "click",
    toggleTheme
);

/* ==========================================
   SKELETON LOADER
========================================== */

function showSkeletonLoader() {

    skeletonContainer.innerHTML = "";

    for (let i = 0; i < 8; i++) {

        skeletonContainer.innerHTML += `

        <div class="skeleton-card">

            <div class="skeleton-image"></div>

            <div class="skeleton-content">

                <div class="skeleton-line long"></div>

                <div class="skeleton-line medium"></div>

                <div class="skeleton-line short"></div>

            </div>

        </div>

        `;
    }

    skeletonContainer.classList.remove(
        "hidden"
    );
}

function hideSkeletonLoader() {

    skeletonContainer.classList.add(
        "hidden"
    );
}

/* ==========================================
   ERROR STATE
========================================== */

function showError(message) {

    errorState.classList.remove(
        "hidden"
    );

    errorState.querySelector("p")
        .textContent = message;
}

function hideError() {

    errorState.classList.add(
        "hidden"
    );
}

/* ==========================================
   EMPTY STATE
========================================== */

function showEmptyState() {

    emptyState.classList.remove(
        "hidden"
    );
}

function hideEmptyState() {

    emptyState.classList.add(
        "hidden"
    );
}

/* ==========================================
   FETCH PRODUCTS
========================================== */

async function fetchProducts() {

    try {

        hideError();

        showSkeletonLoader();

        const response =
        await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Failed to fetch products."
            );
        }

        const data =
        await response.json();

        allProducts =
        data.products || [];

        filteredProducts =
        [...allProducts];

        renderProducts();

        updateStatistics();

    } catch (error) {

        console.error(error);

        showError(
            error.message ||
            "Something went wrong."
        );

    } finally {

        hideSkeletonLoader();
    }
}

/* ==========================================
   PRODUCT CARD TEMPLATE
========================================== */

function createProductCard(product) {

    const discount =
    product.discountPercentage || 0;

    const stockClass =
    product.stock > 20
        ? "stock-in"
        : product.stock > 0
        ? "stock-low"
        : "stock-out";

    const stockText =
    product.stock > 20
        ? "In Stock"
        : product.stock > 0
        ? "Low Stock"
        : "Out Of Stock";

    return `

    <article class="product-card">

        <div class="product-image">

            <img
                src="${product.thumbnail}"
                alt="${product.title}"
                loading="lazy"
            >

            <div class="product-overlay"></div>

            <span class="discount-badge">
                ${discount.toFixed(0)}% OFF
            </span>

            <button
                class="favorite-btn"
                data-id="${product.id}"
            >
                <i class="fa-regular fa-heart"></i>
            </button>

        </div>

        <div class="product-body">

            <span class="product-category">
                ${product.category}
            </span>

            <h3 class="product-title">
                ${product.title}
            </h3>

            <p class="product-brand">
                ${product.brand || "Premium Brand"}
            </p>

            <div class="price-row">

                <div>

                    <span class="product-price">
                        $${product.price}
                    </span>

                </div>

                <div class="rating">

                    ${generateStars(
                        product.rating
                    )}

                    <span>
                        ${product.rating}
                    </span>

                </div>

            </div>

            <div class="product-footer">

                <span
                class="stock-badge ${stockClass}">
                    ${stockText}
                </span>

                <button
                class="quick-view-btn"
                data-id="${product.id}">
                    Quick View
                </button>

            </div>

        </div>

    </article>

    `;
}

/* ==========================================
   STAR RATING
========================================== */

function generateStars(rating) {

    let stars = "";

    const rounded =
    Math.round(rating);

    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        stars += i <= rounded
            ? '<i class="fa-solid fa-star"></i>'
            : '<i class="fa-regular fa-star"></i>';
    }

    return stars;
}

/* ==========================================
   RENDER PRODUCTS
========================================== */

function renderProducts() {

    if (!filteredProducts.length) {

        productGrid.innerHTML = "";

        showEmptyState();

        return;
    }

    hideEmptyState();

    const start =
    (currentPage - 1)
    * itemsPerPage;

    const end =
    start + itemsPerPage;

    const productsToDisplay =
    filteredProducts.slice(
        start,
        end
    );

    productGrid.innerHTML =
    productsToDisplay
    .map(createProductCard)
    .join("");

    renderPagination();
}

/* ==========================================
   ANIMATED COUNTERS
========================================== */

function animateCounter(
    elementId,
    endValue,
    duration = 1200
) {

    const element =
    document.getElementById(
        elementId
    );

    let start = 0;

    const increment =
    endValue /
    (duration / 16);

    const timer =
    setInterval(() => {

        start += increment;

        if (start >= endValue) {

            start = endValue;

            clearInterval(timer);
        }

        element.textContent =
        Math.floor(start);

    }, 16);
}

/* ==========================================
   DASHBOARD STATS
========================================== */

function updateStatistics() {

    const totalProducts =
    allProducts.length;

    const categories =
    new Set(
        allProducts.map(
            item => item.category
        )
    );

    const avgRating =
    allProducts.reduce(
        (sum, item) =>
        sum + item.rating,
        0
    ) / totalProducts;

    const inventory =
    allProducts.reduce(
        (sum, item) =>
        sum + item.stock,
        0
    );

    animateCounter(
        "totalProducts",
        totalProducts
    );

    animateCounter(
        "totalCategories",
        categories.size
    );

    animateCounter(
        "inventoryCount",
        inventory
    );

    document
    .getElementById(
        "avgRating"
    )
    .textContent =
    avgRating.toFixed(1);
}

/* ==========================================
   INITIAL LOAD
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTheme();

        fetchProducts();
    }
);
/* ==========================================
   DEBOUNCE UTILITY
========================================== */

function debounce(callback, delay = 400) {

    let timeout;

    return (...args) => {

        clearTimeout(timeout);

        timeout = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

/* ==========================================
   SEARCH PRODUCTS
========================================== */

function searchProducts() {

    const keyword =
    searchInput.value
    .trim()
    .toLowerCase();

    filteredProducts =
    allProducts.filter(product => {

        return (
            product.title
            .toLowerCase()
            .includes(keyword)

            ||

            product.category
            .toLowerCase()
            .includes(keyword)

            ||

            (product.brand || "")
            .toLowerCase()
            .includes(keyword)
        );

    });

    currentPage = 1;

    renderProducts();
}

const debouncedSearch =
debounce(searchProducts, 350);

searchInput.addEventListener(
    "input",
    debouncedSearch
);

/* ==========================================
   SORTING
========================================== */

function sortProducts() {

    const sortValue =
    sortSelect.value;

    switch(sortValue) {

        case "nameAsc":

            filteredProducts.sort(
                (a,b) =>
                a.title.localeCompare(
                    b.title
                )
            );
            break;

        case "nameDesc":

            filteredProducts.sort(
                (a,b) =>
                b.title.localeCompare(
                    a.title
                )
            );
            break;

        case "priceAsc":

            filteredProducts.sort(
                (a,b) =>
                a.price - b.price
            );
            break;

        case "priceDesc":

            filteredProducts.sort(
                (a,b) =>
                b.price - a.price
            );
            break;

        case "ratingDesc":

            filteredProducts.sort(
                (a,b) =>
                b.rating - a.rating
            );
            break;

        case "discountDesc":

            filteredProducts.sort(
                (a,b) =>
                b.discountPercentage -
                a.discountPercentage
            );
            break;
    }

    renderProducts();
}

sortSelect.addEventListener(
    "change",
    sortProducts
);

/* ==========================================
   FILTER DRAWER
========================================== */

const filterDrawer =
document.getElementById(
    "filterDrawer"
);

const filterBtn =
document.getElementById(
    "filterBtn"
);

const closeDrawer =
document.getElementById(
    "closeDrawer"
);

filterBtn.addEventListener(
    "click",
    () => {
        filterDrawer.classList.add(
            "active"
        );
    }
);

closeDrawer.addEventListener(
    "click",
    () => {
        filterDrawer.classList.remove(
            "active"
        );
    }
);

/* ==========================================
   CATEGORY FILTER
========================================== */

const categoryCheckboxes =
document.querySelectorAll(
    '.filter-group input[type="checkbox"]'
);

categoryCheckboxes.forEach(cb => {

    cb.addEventListener(
        "change",
        applyFilters
    );

});

function applyFilters() {

    const selectedCategories =
    [...categoryCheckboxes]

    .filter(cb => cb.checked)

    .map(cb => cb.value);

    filteredProducts =
    allProducts.filter(product => {

        if (
            selectedCategories.length &&
            !selectedCategories.includes(
                product.category
            )
        ) {
            return false;
        }

        return true;
    });

    currentPage = 1;

    renderProducts();
}

/* ==========================================
   RESET FILTERS
========================================== */

const resetBtn =
document.getElementById(
    "resetBtn"
);

const emptyResetBtn =
document.getElementById(
    "emptyResetBtn"
);

function resetFilters() {

    searchInput.value = "";

    sortSelect.value = "";

    categoryCheckboxes.forEach(
        cb => cb.checked = false
    );

    filteredProducts =
    [...allProducts];

    currentPage = 1;

    renderProducts();

    showToast(
        "Filters reset successfully",
        "info"
    );
}

resetBtn.addEventListener(
    "click",
    resetFilters
);

emptyResetBtn.addEventListener(
    "click",
    resetFilters
);

/* ==========================================
   PAGINATION
========================================== */

function renderPagination() {

    pagination.innerHTML = "";

    const totalPages =
    Math.ceil(
        filteredProducts.length /
        itemsPerPage
    );

    if(totalPages <= 1)
        return;

    const prevBtn =
    document.createElement("button");

    prevBtn.className =
    "page-nav";

    prevBtn.textContent =
    "Previous";

    prevBtn.disabled =
    currentPage === 1;

    prevBtn.onclick = () => {

        currentPage--;

        renderProducts();
    };

    pagination.appendChild(
        prevBtn
    );

    for(
        let i = 1;
        i <= totalPages;
        i++
    ){

        const btn =
        document.createElement(
            "button"
        );

        btn.className =
        `page-btn ${
            currentPage === i
            ? "active"
            : ""
        }`;

        btn.textContent = i;

        btn.onclick = () => {

            currentPage = i;

            renderProducts();
        };

        pagination.appendChild(
            btn
        );
    }

    const nextBtn =
    document.createElement("button");

    nextBtn.className =
    "page-nav";

    nextBtn.textContent =
    "Next";

    nextBtn.disabled =
    currentPage === totalPages;

    nextBtn.onclick = () => {

        currentPage++;

        renderProducts();
    };

    pagination.appendChild(
        nextBtn
    );
}

/* ==========================================
   FAVORITES
========================================== */

function getFavorites() {

    return JSON.parse(
        localStorage.getItem(
            "favorites"
        )
    ) || [];
}

function saveFavorites(ids) {

    localStorage.setItem(
        "favorites",
        JSON.stringify(ids)
    );
}

/* ==========================================
   TOASTS
========================================== */

function showToast(
    message,
    type = "info"
){

    let container =
    document.querySelector(
        ".toast-container"
    );

    if(!container){

        container =
        document.createElement(
            "div"
        );

        container.className =
        "toast-container";

        document.body.appendChild(
            container
        );
    }

    const toast =
    document.createElement("div");

    toast.className =
    `toast ${type}`;

    toast.innerHTML = `
        <span>${message}</span>
    `;

    container.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    }, 3000);
}

/* ==========================================
   QUICK VIEW MODAL
========================================== */

const modal =
document.getElementById(
    "productModal"
);

const modalBody =
document.getElementById(
    "modalBody"
);

const closeModal =
document.getElementById(
    "closeModal"
);

function openModal(productId){

    const product =
    allProducts.find(
        p => p.id == productId
    );

    if(!product) return;

    modalBody.innerHTML = `

    <div class="modal-product">

        <img
        src="${product.thumbnail}"
        alt="${product.title}">

        <div>

            <span class="category-tag">
                ${product.category}
            </span>

            <h2>
                ${product.title}
            </h2>

            <p>
                ${product.description}
            </p>

            <div class="price">
                $${product.price}
            </div>

            <p>
                Rating:
                ⭐ ${product.rating}
            </p>

            <p>
                Stock:
                ${product.stock}
            </p>

        </div>

    </div>
    `;

    modal.classList.remove(
        "hidden"
    );
}

closeModal.addEventListener(
    "click",
    () => {

        modal.classList.add(
            "hidden"
        );
    }
);

modal.addEventListener(
    "click",
    e => {

        if(e.target === modal){

            modal.classList.add(
                "hidden"
            );
        }
    }
);

/* ==========================================
   EVENT DELEGATION
========================================== */

document.addEventListener(
    "click",
    e => {

        const favoriteBtn =
        e.target.closest(
            ".favorite-btn"
        );

        const quickBtn =
        e.target.closest(
            ".quick-view-btn"
        );

        if(favoriteBtn){

            const id =
            Number(
                favoriteBtn.dataset.id
            );

            let favorites =
            getFavorites();

            if(
                favorites.includes(id)
            ){

                favorites =
                favorites.filter(
                    item => item !== id
                );

                favoriteBtn.classList
                .remove("active");

                showToast(
                    "Removed from favorites",
                    "error"
                );

            } else {

                favorites.push(id);

                favoriteBtn.classList
                .add("active");

                showToast(
                    "Added to favorites",
                    "success"
                );
            }

            saveFavorites(
                favorites
            );
        }

        if(quickBtn){

            openModal(
                quickBtn.dataset.id
            );
        }
    }
);

/* ==========================================
   RETRY BUTTON
========================================== */

const retryBtn =
document.getElementById(
    "retryBtn"
);

retryBtn.addEventListener(
    "click",
    fetchProducts
);

/* ==========================================
   MOBILE SIDEBAR
========================================== */

const menuToggle =
document.getElementById(
    "menuToggle"
);

const sidebar =
document.getElementById(
    "sidebar"
);

if(menuToggle){

    menuToggle.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "active"
            );
        }
    );
}