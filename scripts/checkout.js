import { calculateCartQuantity, cart, removeFromCart, updateQuantity } from "../data/cart.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

let cartSummaryHTML = '';

cart.forEach(cartItem => {
  const productId = cartItem.productId;
  
  let matchingProduct;

  products.forEach(product => {
    if (product.id === productId) {
      matchingProduct = product
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;

  let deliveryOption;

  deliveryOptions.forEach(option => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(
    deliveryOption.deliveryDays,
    'days'
  );
  const dateString = deliveryDate.format(
    'dddd, MMMM D'
  );

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
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
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';
  deliveryOptions.forEach(deliveryOption => {
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );
    const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    html += `
      <div class="delivery-option">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `
  });
  return html;
}

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