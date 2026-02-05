const API_URL = "https://api.escuelajs.co/api/v1/products";

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 5;
let sortField = null;
let sortDirection = "asc";

/* ================= LOAD DATA ================= */
async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    allProducts = await res.json();
    filterProducts("");
  } catch (err) {
    console.error(err);
  }
}

/* ================= RENDER ================= */
function renderTable(products) {
  const table = document.getElementById("productTable");
  table.innerHTML = "";

  if (!products.length) {
    table.innerHTML = `<tr><td colspan="5" class="text-center">Không có sản phẩm</td></tr>`;
    return;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const data = sortProducts(products).slice(start, start + itemsPerPage);

  data.forEach(p => {
    const tr = document.createElement("tr");
    tr.classList.add("product-row");
    tr.innerHTML = `
      <td class="text-center">${p.id}</td>
      <td>${p.title}</td>
      <td class="text-end">${p.price}</td>
      <td>${p.category?.name || "N/A"}</td>
      <td><img src="${p.images?.[0] || ""}"></td>
    `;
    table.appendChild(tr);
  });

  updatePagination(products);
}

/* ================= SORT ================= */
function sortProducts(products) {
  if (!sortField) return products;

  return [...products].sort((a, b) => {
    if (sortField === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    }
    return sortDirection === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });
}

/* ================= FILTER ================= */
function filterProducts(keyword) {
  filteredProducts = allProducts.filter(p =>
    p.title.toLowerCase().includes(keyword.toLowerCase())
  );
  currentPage = 1;
  renderTable(filteredProducts);
}

/* ================= PAGINATION ================= */
function updatePagination(products) {
  const totalPages = Math.ceil(products.length / itemsPerPage);
  document.getElementById("pageInfo").textContent =
    `Trang ${currentPage} / ${totalPages || 1}`;

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

/* ================= EVENTS ================= */
document.getElementById("searchInput").addEventListener("input", e => {
  filterProducts(e.target.value);
});

document.getElementById("prevBtn").addEventListener("click", () => {
  currentPage--;
  renderTable(filteredProducts);
});

document.getElementById("nextBtn").addEventListener("click", () => {
  currentPage++;
  renderTable(filteredProducts);
});

document.querySelectorAll(".per-page-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".per-page-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    itemsPerPage = +btn.dataset.items;
    currentPage = 1;
    renderTable(filteredProducts);
  });
});

document.querySelectorAll(".sortable-header").forEach(h => {
  h.addEventListener("click", () => {
    const field = h.dataset.sort;
    sortDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    sortField = field;
    renderTable(filteredProducts);
  });
});

/* ================= INIT ================= */
loadProducts();
