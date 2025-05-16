import { calculateCartQuantity } from "../../data/cart.js";

export function renderCheckoutHeader() {
  const quantity = calculateCartQuantity();
  const html = `
    Checkout (<a class="return-to-home-link"
          href="amazon.html">${quantity} items</a>)
  `
  document.querySelector('.js-checkout-header')
    .innerHTML = html;
}