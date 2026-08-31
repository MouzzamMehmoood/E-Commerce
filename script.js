const API_URL = "https://dummyjson.com/products";

let allProducts = [];

// ================================
// GET PRODUCTS FROM API
// ================================

async function getProducts() {
  const loading = document.getElementById("loading");
  const errorMessage = document.getElementById("errorMessage");

  try {
    if (loading) loading.style.display = "flex";
    if (errorMessage) errorMessage.style.display = "none";

    const response = await fetch(`${API_URL}?limit=0`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    allProducts = data.products || [];

    const laptop = allProducts.find(
      (product) => product.category === "laptops",
    );

    const bag = allProducts.find(
      (product) => product.category === "womens-bags",
    );

    const shoes = allProducts.find(
      (product) =>
        product.category === "womens-shoes" ||
        product.category === "mens-shoes",
    );

    const perfume = allProducts.find(
      (product) => product.category === "fragrances",
    );

    const jewellery = allProducts.find(
      (product) => product.category === "womens-jewellery",
    );

    const watch = allProducts.find(
      (product) =>
        product.category === "mens-watches" ||
        product.category === "womens-watches",
    );

    const gucciFloraBloom = perfume
      ? {
          ...perfume,
          title: "Calvin Klien Perfume",
        }
      : null;

    const flashSales = [gucciFloraBloom, laptop, bag, shoes].filter(Boolean);

    const bestSelling = [jewellery, watch, bag, laptop].filter(Boolean);

    displayFlashSales(flashSales);
    displayBestSelling(bestSelling.slice(0, 4));

    if (loading) loading.remove();
  } catch (error) {
    console.error("API Error:", error);

    if (loading) loading.remove();

    if (errorMessage) {
      errorMessage.style.display = "block";
    }
  }
}

// ================================
// GET WISHLIST
// ================================

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

// ================================
// CHECK IF PRODUCT IS IN WISHLIST
// ================================

function isInWishlist(productId) {
  const wishlist = getWishlist();

  return wishlist.includes(Number(productId));
}

// ================================
// PRODUCT CARD
// ================================

function createProductCard(product) {
  const wishlistActive = isInWishlist(product.id);

  return `
    <div
      class="product-card bg-white rounded-lg p-4 font-sans select-none w-[280px]"
    >

      <!-- PRODUCT IMAGE -->

      <div
        class="relative bg-[#f7f7f7] rounded-lg aspect-square flex items-center justify-center p-6 overflow-hidden"
      >

        <img
          src="${escapeHTML(product.thumbnail)}"
          alt="${escapeHTML(product.title)}"
          class="max-h-[80%] max-w-[80%] object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
        />


        <!-- ACTION BUTTONS -->

        <div
          class="absolute top-3 right-3 flex flex-col gap-2"
        >

          <!-- WISHLIST -->

          <button
            type="button"
            onclick="toggleWishlist(${product.id}, this)"
            aria-label="${
              wishlistActive ? "Remove from wishlist" : "Add to wishlist"
            }"
            class="wishlist-btn w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
          >

            <span
              class="material-icons text-[20px] wishlist-icon ${
                wishlistActive ? "text-red-500" : "text-gray-800"
              }"
            >
              favorite
            </span>

          </button>


          <!-- EYE -->

          <button
            type="button"
            onclick="openProduct(${product.id})"
            aria-label="View product"
            class="w-9 h-9 cursor-pointer bg-white rounded-full flex items-center justify-center shadow-md text-gray-800 hover:text-blue-500 hover:scale-110 transition-all duration-200"
          >

            <span class="material-icons text-[20px]">
              visibility
            </span>

          </button>

        </div>


        <!-- DISCOUNT -->

        ${
          product.discountPercentage
            ? `
              <span
                class="absolute top-3 left-3 bg-[#f44336] text-white text-xs font-medium px-3 py-1 rounded"
              >
                -${Math.round(product.discountPercentage)}%
              </span>
            `
            : ""
        }

      </div>


      <!-- PRODUCT INFORMATION -->

      <div class="mt-4 space-y-2">

        <h3
          class="font-bold text-gray-900 text-lg leading-tight truncate"
          title="${escapeHTML(product.title)}"
        >
          ${escapeHTML(product.title)}
        </h3>


        <!-- PRICE -->

        <div class="flex items-baseline gap-2 flex-wrap">

          <span class="text-[#f44336] font-bold text-base">
            $${Number(product.price).toFixed(2)}
          </span>

          <span class="text-gray-500 font-medium text-sm">
            ${Number(product.discountPercentage || 0).toFixed(2)}% Off
          </span>

        </div>


        <!-- RATING -->

        <div class="flex items-center gap-1">

          <div class="text-[#ffb400]">
            ${createStars(product.rating)}
          </div>

          <span class="text-gray-500 font-medium text-sm ml-1">
            (${product.reviews?.length || 0})
          </span>

        </div>

      </div>

    </div>
  `;
}

// ================================
// WISHLIST TOGGLE
// ================================

function toggleWishlist(productId, button) {
  productId = Number(productId);

  let wishlist = getWishlist();

  const icon = button.querySelector(".wishlist-icon");

  if (wishlist.includes(productId)) {
    // REMOVE FROM WISHLIST

    wishlist = wishlist.filter((id) => id !== productId);

    icon.classList.remove("text-red-500");

    icon.classList.add("text-gray-800");

    button.setAttribute("aria-label", "Add to wishlist");

    console.log("Removed from wishlist:", productId);
  } else {
    // ADD TO WISHLIST

    wishlist.push(productId);

    icon.classList.remove("text-gray-800");

    icon.classList.add("text-red-500");

    button.setAttribute("aria-label", "Remove from wishlist");

    console.log("Added to wishlist:", productId);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// ================================
// CREATE STARS
// ================================

function createStars(rating) {
  let stars = "";

  const roundedRating = Math.round(rating || 0);

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars += `
        <span class="material-icons text-[18px]">
          star
        </span>
      `;
    } else {
      stars += `
        <span class="material-icons text-[18px] text-gray-300">
          star
        </span>
      `;
    }
  }

  return `
    <span class="inline-flex">
      ${stars}
    </span>
  `;
}

// ================================
// FLASH SALES
// ================================

function displayFlashSales(products) {
  const container = document.getElementById("flashSalesContainer");

  if (!container) return;

  container.innerHTML = products
    .map((product) => createProductCard(product))
    .join("");
}

// ================================
// BEST SELLING PRODUCTS
// ================================

function displayBestSelling(products) {
  const container = document.getElementById("bestSellingContainer");

  if (!container) return;

  container.innerHTML = products
    .map((product) => createProductCard(product))
    .join("");
}

// ================================
// OPEN PRODUCT PAGE
// ================================

function openProduct(productId) {
  window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
}

// ================================
// CATEGORY FILTER
// ================================

function setupCategories() {
  const categories = document.querySelectorAll(".category-card");

  categories.forEach((category) => {
    category.addEventListener("click", () => {
      const categoryName = category.dataset.category;

      if (!categoryName) return;

      console.log("Selected Category:", categoryName);

      localStorage.setItem("selectedCategory", categoryName);

      window.location.href = `AllProducts.html?category=${encodeURIComponent(
        categoryName,
      )}`;
    });
  });
}

// ================================
// SEARCH
// ================================

function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  searchInput.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") {
      return;
    }

    const searchText = searchInput.value.trim();

    if (!searchText) return;

    window.location.href = `AllProducts.html?search=${encodeURIComponent(
      searchText,
    )}`;
  });
}

// ================================
// VIEW ALL BUTTONS
// ================================

function setupButtons() {
  const buttons = document.querySelectorAll(".view_prod");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = "AllProducts.html";
    });
  });
}

// ================================
// SHOP NOW BUTTONS
// ================================

function setupShopButtons() {
  const shopButtons = document.querySelectorAll(".shop-btn");

  shopButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = "AllProducts.html";
    });
  });
}

// ================================
// ESCAPE HTML
// ================================

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ================================
// INITIALIZE
// ================================

document.addEventListener("DOMContentLoaded", async () => {
  await getProducts();

  setupCategories();

  setupSearch();

  setupButtons();

  setupShopButtons();
});
function updateWishlistCount() {
  const wishlistCount = document.getElementById("wishlistCount");

  if (!wishlistCount) return;

  let wishlist = [];

  try {
    wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (!Array.isArray(wishlist)) {
      wishlist = [];
    }
  } catch (error) {
    console.error("Error reading wishlist:", error);
    wishlist = [];
  }

  // Supports both:
  // [1, 2, 3]
  //
  // and:
  // [{id: 1}, {id: 2}, {id: 3}]

  const wishlistIds = wishlist
    .map((item) => {
      if (typeof item === "object" && item !== null) {
        return Number(item.id);
      }

      return Number(item);
    })
    .filter((id) => Number.isInteger(id) && id > 0);

  // Remove duplicate products
  const uniqueWishlistIds = [...new Set(wishlistIds)];

  wishlistCount.textContent = uniqueWishlistIds.length;
}

// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");

  if (!cartCount) return;

  let cart = [];

  try {
    cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!Array.isArray(cart)) {
      cart = [];
    }
  } catch (error) {
    console.error("Error reading cart:", error);
    cart = [];
  }

  let totalQuantity = 0;

  cart.forEach((item) => {
    totalQuantity += Number(item.quantity) || 1;
  });

  cartCount.textContent = totalQuantity;
}

// ==========================================
// RUN WHEN PAGE LOADS
// ==========================================

updateWishlistCount();
updateCartCount();

// ==========================================
// UPDATE WHEN LOCAL STORAGE CHANGES
// ==========================================

window.addEventListener("storage", function (event) {
  if (event.key === "wishlist") {
    updateWishlistCount();
  }

  if (event.key === "cart") {
    updateCartCount();
  }
});

// ==========================================
// UPDATE WHEN USER RETURNS TO THIS PAGE
// ==========================================

window.addEventListener("focus", function () {
  updateWishlistCount();
  updateCartCount();
});

// ==========================================
// UPDATE WHEN PAGE BECOMES VISIBLE AGAIN
// ==========================================

document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    updateWishlistCount();
    updateCartCount();
  }
});
