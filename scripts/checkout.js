import { calculateCartQuantity, cart, removeFromCart, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartSummaryHTML = '';

cart.forEach(cartItem => {
  const productId = cartItem.productId;
  
  let matchingProduct;

  products.forEach(product => {
    if (product.id === productId) {
      matchingProduct = product
    }
  });

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-quantity" data-product-id="${matchingProduct.id}">
              Save
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

document
  .querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

document
  .querySelectorAll('.js-delete-link')
  .forEach(link => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      
      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      container.remove();

      updateCartQuantity();
    });
});

function updateCartQuantity() {
  let cartQuantity = calculateCartQuantity();

  document.querySelector('.js-checkout-quantity').innerHTML = `${cartQuantity} items`;
}

updateCartQuantity();

document
  .querySelectorAll('.js-update-quantity')
  .forEach(update => {
    update.addEventListener('click', () => {
        const { productId } = update.dataset;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        const label = document.querySelector(`.js-quantity-label-${productId}`);


        container.classList.add('is-editing-quantity');
        label.classList.add('is-editing-quantity');
      }
    );
  }
);

function updateQuantityLabel(productId, value) {
  document.querySelector(`.js-quantity-label-${productId}`).innerHTML = value;
}

document
  .querySelectorAll('.js-save-quantity')
  .forEach(save => {
    save.addEventListener('click', () => {
      const { productId } = save.dataset;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      

      container.classList.remove('is-editing-quantity')

      const input = document.querySelector(`.js-quantity-input-${productId}`);
      const valueInput = Number(input.value)

      if (valueInput >= 0 && valueInput < 1000) {
        updateQuantity(productId, Number(input.value));
        updateCartQuantity();
        updateQuantityLabel(productId, Number(input.value));
        console.log('valid');
      } else {
        console.log('invalid');
      }
    });
  });

document.querySelectorAll('.quantity-input').forEach(input => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const { productId } = input.dataset;

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      
      container.classList.remove('is-editing-quantity')

      const valueInput = Number(input.value)
      if (valueInput >= 0 && valueInput < 1000) {
        updateQuantity(productId, Number(input.value));
        updateCartQuantity();
        updateQuantityLabel(productId, Number(input.value));
        console.log('valid');
      } else {
        console.log('invalid');
      }
    }
  });
});