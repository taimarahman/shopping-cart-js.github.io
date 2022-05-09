const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
let wishListItems = JSON.parse(localStorage.getItem("wishListItems") || "[]");


const itemContainer = document.getElementById('container');
const totalCartItems = document.getElementById('cart-items');

const selectedItemCount = document.getElementById('total-item');
const totalPriceEl = document.getElementById('total-price');
const paymentMethodEl = document.getElementById('payment-options');
const promoCode = document.getElementById('promo-code');
const applyBtn = document.getElementById('apply-btn');
const promoSuccess = document.getElementById('promo-applied');
const errorMessage = document.getElementById('error-message');
const totalBillEl = document.getElementById('total-bill');
const checkoutBtn = document.getElementById('checkout-btn');

const wishCountEl = document.getElementById('wishlist-count');
const wishBtn = document.getElementById('wishlist');
const wishListContainer = document.getElementById('wishlist-container');
const closeBtn = document.getElementById('close-btn');

const checkoutContainer = document.getElementById('checkout-container');
const checkoutCloseBtn = document.getElementById('checkout-close-btn');

const reloadBtn = document.getElementById('reload');
const returnBtn = document.getElementById('return-btn');

let quantity = 0;
let totalPrice = 0;
let itemCount = 0;
let totalBill = 0;
let promoPrice = 0;

let checkoutItems = [];

let promoCodeList = [
    'reduce70',
    'dinner90',
    'package50',
    'goribx30'
]

function showCartItems(items) {

    totalCartItems.innerHTML = `${items.length} Items`;

    items.forEach(item => {
        const productEl = document.createElement('div');
        productEl.classList.add('cart-item');
        productEl.innerHTML = `
        <div class="product-details">
            <div class="product-img">
                <img src="${item.image}" alt="">
            </div>
            <div>
                <p class="product-title">${item.title}</p>
                <small class="product-description">${item.description}</small>
                <small class="product-type">${item.type}</small>
                <small class="product-rating">${item.rating} <i class="fa-solid fa-star"></i></small>

                <button class="wished-item" onclick="updateWishList(this)">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>
            <div style="display: none">
                <p class="product-description">${item.description}</p>
                <p class="product-total-Quantity">${item.totalQuantity}</p>
            </div> 
        </div>


        <div class="product-quantity">
            <button class="quatity-btn" onclick= "decreamentQuantity(this)">
                <i class="fa-solid fa-minus"></i>
            </button>
            <div class="quantity">${quantity}</div>
            <button class="quatity-btn" onclick= "increamentQuantity(this)">
                <i class="fa-solid fa-plus" ></i>
            </button>
        </div>

        <div class="product-price">
            <p class="price">$${item.price}</p>
        </div>

        <div class="product-total">
            <p class="product-total-price">$${quantity*item.price}</p>
        </div>
        `;

        itemContainer.appendChild(productEl);

    });
    writeToWishList(wishListItems);
    updateWishListCount(wishListItems.length);
    checkWishBtn(wishListItems);
    showPromoCodeList(promoCodeList);
}

showCartItems(cartItems);


function decreamentQuantity(el) {
    quantity = parseInt(el.nextElementSibling.innerHTML);
    // console.log(quantity);
    
    if(quantity) {
        quantity--;
    }

    el.nextElementSibling.innerHTML = quantity;

    updateProductTotalPrice(el, quantity)
}
function increamentQuantity(el) {
    // console.log('hi');
    // console.log(el);

    quantity = el.previousElementSibling.innerHTML;
    quantity++;
    el.previousElementSibling.innerHTML = quantity;

    updateProductTotalPrice(el, quantity)
}

function updateProductTotalPrice(el, quantity) {
    const price = parseFloat(el.parentNode.nextElementSibling.firstElementChild.innerHTML.slice(1));
    // console.log(price);

    const productTotalEl = el.parentNode.nextElementSibling.nextElementSibling.firstElementChild;

    let productTotalPrice = quantity * price; 
    productTotalEl.innerHTML = `$${productTotalPrice.toFixed(2)}`;

    // console.log(productTotalEl);
    // console.log(productTotalPrice);

    updateOrderTotalPrice();

}

function updateOrderTotalPrice() {

    const productPriceList = document.querySelectorAll('.product-total-price');
    totalPrice = 0;
    itemCount = 0;

    productPriceList.forEach(product => {

        let productPrice = parseFloat(product.innerHTML.slice(1));

        if(productPrice != 0) {
            itemCount++;
        }
        totalPrice += productPrice;
        // console.log(totalPrice);
        // console.log(productPrice);
    })
    // console.log(productPriceList);
    selectedItemCount.innerHTML = `Items ${itemCount}`;
    totalPriceEl.innerHTML = `$${totalPrice.toFixed(2)}`;

    updateBill(totalPrice, promoPrice);

    return totalPrice;
}

function updateBill(total, promo) {
    totalBill = total - promo;
    totalBillEl.innerHTML = `$${totalBill.toFixed(2)}`;

    return totalBill;
}

// Update add remove from wishlist
function updateWishList(el) {
    el.classList.toggle('liked');
    const product = fetchProductDetails(el);
    // console.log(product);

    if((wishListItems.findIndex((item) => item.title == product.title)) == -1) {
        wishListItems.push(product);
        localStorage.setItem("wishListItems", JSON.stringify(wishListItems));


        // update count of the wishlist
        updateWishListCount(wishListItems.length);
        writeToWishList(wishListItems);
    }
    else {
        removeFromWishList(product);
    }
    // console.log(wishListItems);
    
}

function removeFromWishList(item) {
    wishListItems = wishListItems.filter((value) => {
        return value.title != item.title;
    });
    updateWishListCount(wishListItems.length);
    writeToWishList(wishListItems);
    if(wishListItems.length == 0) {
        wishListContainer.innerHTML = 'No items on the list!';
    }
    localStorage.setItem("wishListItems", JSON.stringify(wishListItems));

}

function writeToWishList(wishList) {
    wishListContainer.innerHTML = '';
    wishList.map(function(item, index) {
        const listEl = document.createElement('div');
        listEl.classList.add('items');
        listEl.innerHTML = `
        <div class="product-details">
            <div class="product-img">
                    <img src="${item.image}" alt="">
            </div>
            <div>
                <p class="product-title">${item.title}</p>
                <small class="product-description">${item.description}</small>
                <small class="product-type">${item.type}</small>
                <small class="product-rating">${item.rating} <i class="fa-solid fa-star"></i></small>
            </div>
        </div>
        <button class="btn" onclick="updateWishBtn(wishListItems[${index}]); removeFromWishList(wishListItems[${index}]);">Remove</button>
        `;

        wishListContainer.appendChild(listEl);
    }); 
}



function updateWishBtn(product) {
    const allItem = document.querySelectorAll('.product'); //fetching all products

    allItem.forEach(item => {

        const title = item.children[1].firstElementChild.innerHTML;

        // console.log(element);
        if(title == product.title) {
            item.lastElementChild.lastElementChild.classList.toggle('liked');
        }
    });
}

function checkWishBtn(wishListItems) {
    const allItem = document.querySelectorAll('.product-details'); //fetching all products

    allItem.forEach(item => {

        const title = item.querySelector('.product-title').innerHTML;

        // console.log(element);
        // (wishListItems.findIndex((item) => item.title == product.title)
        if(wishListItems.findIndex((item) => item.title == title) > -1) {
            item.children[1].lastElementChild.classList.toggle('liked');
        }

    });

}

function updateWishListCount(count) {
    wishCountEl.innerHTML = count;
}
// function updateWishList(el) {
//     el.classList.toggle('liked');
//     const wishedProductdetails = el.parentNode.parentNode;

//     if(!wishList.includes(wishedProductdetails)) {
//         wishList.push(wishedProductdetails);

//         // update count of the wishlist
//         wishCountEl.innerHTML = wishList.length;
//         addToWishList(wishList)
//     }
//     else {
//         removeFromWishList(wishedProductdetails);
//     }
//     // console.log(wishList);
    
// }

// function removeFromWishList(item) {
//     wishList = wishList.filter((value) => {
//         return value != item;
//     });
//     wishCountEl.innerHTML = wishList.length;
//     addToWishList(wishList);
//     if(wishList.length == 0) {
//         wishListContainer.innerHTML = 'No items on the list!';
//     }

// }



// function addToWishList(wishList) {
//     wishListContainer.innerHTML = '';
//     wishList.map(function(item, index) {
//         const listEl = document.createElement('div');
//         listEl.classList.add('items');
//         listEl.innerHTML = `
//         <div class="product-details">
//             <div class="product-img">
//             ${item.children[0].innerHTML}
//             </div>
//             <div>
//                 ${item.children[1].innerHTML}
//             </div>
//         </div>
//         <button class="btn" onclick="updateWishBtn(wishList[${index}]); removeFromWishList(wishList[${index}]);">Remove</button>
//         `;

//         wishListContainer.appendChild(listEl);
//     });    
// }

// function updateWishBtn(product) {
//     const allItem = document.querySelectorAll('.cart-item');
//     // console.log(allItem);
//     console.log(product);

//     allItem.forEach(item => {
//         const element = item.firstElementChild;

//         // console.log(element);
//         if(element == product) {
//             element.children[1].lastElementChild.classList.toggle('liked');
//         }

//     });

// }

///////////////////////////////////////////////////////////////////////////////////////

function checkoutCart(cartItems) {
    // console.log();
    checkoutItems = [];
    document.querySelector('.dark-back-checkout').style.display = 'block';

    const paymentMethod = getPaymentMethod();
    let orderTotalBill = updateBill(totalPrice, promoPrice);
    let orderTotalPrice = updateOrderTotalPrice();
    let orderPromoPrice = applyPromoCode();
    const allItem = document.querySelectorAll('.cart-item');

    allItem.forEach(item => {
        // const element = item.;

        // wishListItems.findIndex((item) => item.title == product.title
        itemQuantity = item.querySelector('.quantity').innerHTML;

        // console.log(checkoutItems.find((item) => item.title == itemTitle));

        if(itemQuantity > 0) {
            itemTitle = item.querySelector('.product-title').innerHTML;
            itemPrice = item.querySelector('.price').innerHTML;
            itemTotalPrice = item.querySelector('.product-total-price').innerHTML;
            // console.log(itemPrice,itemTotalPrice);



            addToCheckoutItems(itemTitle, itemQuantity, itemPrice, itemTotalPrice);
            // addToCart(cartItem);
            // console.log(cartItems);
        }
    });

    if(cartItems.length > 0){
        addToCart(checkoutItems);
        addTotalPriceToCart(orderTotalPrice);
        addPromoCodeToCart(orderPromoPrice);
        addTotalBillToCart(orderTotalBill);
        addPaymentMethodToCart(paymentMethod);
        addBtnToCart();
    }
    // console.log(orderTotalBill,orderTotalPrice);
    
}

function addBtnToCart() {
    const btnEl = document.createElement('button');
    btnEl.onclick = Confiramtion;
    btnEl.classList.add('btn', 'confirm-btn');
    btnEl.innerHTML = `Confirm`;

    checkoutContainer.appendChild(btnEl);
}

function Confiramtion() {
    document.querySelector('.dark-back-success').style.display = 'block';
}

function addPaymentMethodToCart(paymentMethod) {
    const payEl = document.createElement('div');
    payEl.classList.add('checkout-promo');
    payEl.innerHTML = `
    <h4>Payment<span>${paymentMethod}</span></h4>
    `;

    checkoutContainer.appendChild(payEl);
}

function addTotalBillToCart(totalBill) {
    const billEl = document.createElement('div');
    billEl.classList.add('checkout-total-price');
    billEl.innerHTML = `
    <h4>Total Bill<span>$${totalBill.toFixed(2)}</span></h4>
    `;

    checkoutContainer.appendChild(billEl);
}

function addPromoCodeToCart(promoPrice) {
    const promoEl = document.createElement('div');
    promoEl.classList.add('checkout-promo');
    promoEl.innerHTML = `
    <h4>Promo Code<span>-$${promoPrice}</span></h4>
    `;

    checkoutContainer.appendChild(promoEl);
}

function addTotalPriceToCart(totalPrice){
    const priceEl = document.createElement('div');
    priceEl.classList.add('checkout-total-price');
    priceEl.innerHTML = `
    <h4>Total<span>$${totalPrice.toFixed(2)}</span></h4>
    `;

    checkoutContainer.appendChild(priceEl);
}

function addToCart(items) {
    checkoutContainer.innerHTML = `
    <div class="div-title">
        <h3 class="">Product details</h3>
        <h3 class="">Quantity</h3>
        <h3 class="">Price</h3>
        <h3 class="">Total</h3>
    </div>
    `;
    items.map(function(item, index) {
        const cartEl = document.createElement('div');
        cartEl.classList.add('checkout-items','div-title');
        cartEl.innerHTML = `
        <p>${item.title}</p>
        <p>${item.quantity}</p>
        <p>${item.price}</p>
        <p>${item.totalPrice}</p>
        `;

        checkoutContainer.appendChild(cartEl);
    })
    
}

function addToCheckoutItems(itemTitle, itemQuantity, itemPrice, itemTotalPrice) {
    const item = {
        title : itemTitle,
        quantity : itemQuantity,
        price : itemPrice,
        totalPrice : itemTotalPrice
    }
    checkoutItems.push(item);
    // console.log(cartItems);

    return item;
}

function getPaymentMethod() {
    return paymentMethodEl.value;
}

function applyPromoCode() {

    if(promoCode.value) {
        if(promoCodeList.includes(promoCode.value)) {
            if(totalPrice > 200){
                promoPrice = promoCode.value.slice(-2);
                updateBill(totalPrice, promoPrice);
    
                errorMessage.innerHTML = '';
                promoSuccess.innerHTML = `Promo Code<span>-$${promoPrice}</span>`;
    
            } else {
                errorMessage.innerHTML = `Not applicable`;
            }
        } else {
            errorMessage.innerHTML = `Invalid Code`;   
        }
    }
    
    return promoPrice;
}

// show available promoCodes for shortcut
function showPromoCodeList(codeList) {
    document.querySelector('.codes').innerHTML = '';
    codeList.map(function(code) {
        const codeEl = document.createElement('button');
        codeEl.classList.add('code-btn');
        codeBtnOnclcik(codeEl,code);
        codeEl.innerHTML = code; 
        document.querySelector('.codes').appendChild(codeEl);
    })
}

// code btn onclick function
function codeBtnOnclcik(el,code) {
    el.onclick = function() {
        addPromoCode(code);
    };
}

// add promo code to the textbox and update available promo code
function addPromoCode(code) {
    codeList = promoCodeList.filter((value) => {
        return value != code;
    });
    promoCode.value = code;
    showPromoCodeList(codeList);
}

// fetch product details and store 
function fetchProductDetails(el) {
    const parentEl = el.parentNode.parentNode.parentNode;
    productTitle = parentEl.querySelector('.product-title').innerHTML;
    productImage = parentEl.querySelector('img').src;
    productPrice = parentEl.querySelector('.price').innerHTML.slice(1);
    productRating = parentEl.querySelector('.product-rating').innerText;
    productType = parentEl.querySelector('.product-type').innerHTML;
    productDesription = parentEl.querySelector('.product-description').innerHTML;
    productTotalQuantity = parentEl.querySelector('.product-total-Quantity').innerHTML;

    product = createProduct(productTitle, productImage, productPrice, productRating, productType, productDesription, productTotalQuantity);
    // console.log(parentEl.querySelector('img').src);

    return product;
}

function createProduct(productTitle, productImage, productPrice, productRating, productType, productDesription, productTotalQuantity) {
    const product = {
        title : productTitle,
        image : productImage,
        totalQuantity : productTotalQuantity,
        price : productPrice,
        rating : productRating,
        type : productType,
        description : productDesription
    }

    return product;
}

// Event listeners
applyBtn.addEventListener('click', applyPromoCode);

// open and close wishlist
wishBtn.addEventListener('click', () => {
    document.querySelector('.dark-back').style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    document.querySelector('.dark-back').style.display = 'none';
});

// checkout cart with added items
checkoutBtn.addEventListener('click', () => {
    checkoutCart(cartItems);    
});

// close checkout cart window
checkoutCloseBtn.addEventListener('click', () => {
    document.querySelector('.dark-back-checkout').style.display = 'none';
});

// reload program
reloadBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.reload();
    location.href = './index.html';

});

returnBtn.addEventListener('click', () => {
    localStorage.setItem("wishListItems", JSON.stringify(wishListItems));
    location.href = './index.html';
})
