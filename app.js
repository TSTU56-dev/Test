const products = [
  {
    id: "house-blend",
    name: "House Blend",
    price: 18,
    category: "beans",
    note: "Chocolate, toasted almond · 12 oz",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ethiopian",
    name: "Yirgacheffe",
    price: 22,
    category: "beans",
    note: "Jasmine, lemon peel · 12 oz",
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "colombia",
    name: "Huila Washed",
    price: 20,
    category: "beans",
    note: "Red apple, caramel · 12 oz",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pour-over-kit",
    name: "Pour-over kit",
    price: 54,
    category: "kits",
    note: "Dripper, papers, 12 oz house blend",
    image:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "office-starter",
    name: "Office starter crate",
    price: 86,
    category: "kits",
    note: "Two kilos, filters, tasting cards",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "gift-box",
    name: "Three-origin gift",
    price: 62,
    category: "gifts",
    note: "Three 8 oz bags, handwritten card",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "blue-matcha",
    name: "Blue matcha gift",
    price: 24,
    category: "gifts",
    note: "Silky, floral blue matcha with a calm, clear lift",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
  },
];

const plans = {
  home: { id: "plan-home", name: "Home lane (monthly)", price: 28 },
  studio: { id: "plan-studio", name: "Studio lane (monthly)", price: 149 },
  house: { id: "plan-house", name: "House lane (monthly)", price: 390 },
};

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const cart = new Map();
let filter = "all";

const grid = document.querySelector("[data-product-grid]");
const countEl = document.querySelector("[data-cart-count]");
const drawer = document.querySelector("[data-cart-drawer]");
const listEl = document.querySelector("[data-cart-list]");
const emptyEl = document.querySelector("[data-cart-empty]");
const totalEl = document.querySelector("[data-cart-total]");

function renderProducts() {
  const items = products.filter((p) => filter === "all" || p.category === filter);
  grid.innerHTML = items
    .map(
      (p) => `
      <article class="card">
        <img src="${p.image}" alt="${p.name}" />
        <div class="card__body">
          <h3>${p.name}</h3>
          <p class="meta">${p.note}</p>
          <p><strong>${money(p.price)}</strong></p>
          <button class="btn btn--solid" type="button" data-add="${p.id}">Add to cart</button>
        </div>
      </article>`
    )
    .join("");
}

function addItem(item) {
  const existing = cart.get(item.id);
  cart.set(item.id, { ...item, qty: existing ? existing.qty + 1 : 1 });
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.get(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.delete(id);
  renderCart();
}

function cartTotal() {
  return [...cart.values()].reduce((sum, i) => sum + i.price * i.qty, 0);
}

function renderCart() {
  const items = [...cart.values()];
  countEl.textContent = items.reduce((n, i) => n + i.qty, 0);
  emptyEl.hidden = items.length > 0;
  listEl.innerHTML = items
    .map(
      (i) => `
      <li>
        <div>
          <strong>${i.name}</strong>
          <div class="qty">
            <button type="button" data-qty="${i.id}" data-delta="-1" aria-label="Decrease">−</button>
            <span>${i.qty}</span>
            <button type="button" data-qty="${i.id}" data-delta="1" aria-label="Increase">+</button>
          </div>
        </div>
        <span>${money(i.price * i.qty)}</span>
      </li>`
    )
    .join("");
  totalEl.textContent = money(cartTotal());
}

function openCart() {
  drawer.hidden = false;
}

function closeCart() {
  drawer.hidden = true;
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
renderProducts();
renderCart();

document.querySelectorAll("[data-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("is-on", b === btn));
    renderProducts();
  });
});

grid.addEventListener("click", (e) => {
  const id = e.target.dataset.add;
  if (!id) return;
  const product = products.find((p) => p.id === id);
  addItem(product);
  openCart();
});

document.querySelectorAll("[data-add-plan]").forEach((btn) => {
  btn.addEventListener("click", () => {
    addItem(plans[btn.dataset.addPlan]);
    openCart();
  });
});

document.querySelector("[data-open-cart]").addEventListener("click", openCart);
document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
drawer.addEventListener("click", (e) => {
  if (e.target === drawer) closeCart();
});

listEl.addEventListener("click", (e) => {
  const id = e.target.dataset.qty;
  if (!id) return;
  changeQty(id, Number(e.target.dataset.delta));
});

document.querySelector("[data-contact-form]").addEventListener("submit", (e) => {
  e.preventDefault();
  const note = document.querySelector("[data-form-note]");
  note.hidden = false;
  note.textContent = "Thanks — we’ll write back within a business day.";
  e.target.reset();
});

document.querySelector("[data-checkout]").addEventListener("submit", (e) => {
  e.preventDefault();
  const note = document.querySelector("[data-checkout-note]");
  if (!cart.size) {
    note.hidden = false;
    note.textContent = "Add something to the cart first.";
    return;
  }
  note.hidden = false;
  note.textContent = `Order received for ${money(cartTotal())}. We’ll email roast-day details.`;
  cart.clear();
  renderCart();
  e.target.reset();
});
