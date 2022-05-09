const productContainer = document.getElementById('product-container');
const totalItems = document.getElementById('items');

// wishlist
const wishBtn = document.getElementById('wishlist');
const closeBtn = document.getElementById('close-btn');
const wishCountEl = document.getElementById('wishlist-count');
const wishListContainer = document.getElementById('wishlist-container');

const cartBtn = document.getElementById('cart-btn');
const cartCountEl = document.getElementById('cart-item-count');


let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
let wishListItems = JSON.parse(localStorage.getItem("wishListItems") || "[]");

async function getAllProducts() {
    const res = await fetch('./products.json');
    
    const data = await res.json();

    return data;
}

async function showAllProducts() {
    const items = await getAllProducts();

    totalItems.innerHTML = `${items.length} Items`;

    items.forEach(item => {
        const productEl = document.createElement('div');
        productEl.classList.add('product');
        productEl.innerHTML = `
        <div class="product-image">
            <img src="images/${item.filename}">
        </div>
        <div>
            <p class="product-title">${item.title}</p>
            <p class="product-type">${item.type}</p>
            <p class="product-rating">${item.rating} <i class="fa-solid fa-star"></i></p>
            <p class="product-price">$${item.price}</p>
        </div>    
        <div style="display: none">
            <p class="product-description">${item.description}</p>
            <p class="product-total-Quantity">${item.totalQuantity}</p>
            
        </div> 
        <div>
            <button class="add-to-cart" onclick="updateCartBtn(this);addToCartItems(this)">Add to cart</button>
            <button class="wish-btn" onclick="updateWishList(this)">
                <i class="fa-solid fa-heart"></i>
            </button>
        </div>
        `;

        productContainer.appendChild(productEl);

    });
    // showPromoCodeList(promoCodeList);
    writeToWishList(wishListItems);
    updateWishListCount(wishListItems.length);
    checkWishBtn(wishListItems);
    checkAddToCartBtn(cartItems);
}

// add to cart
function updateCartBtn(el) {
    el.innerText = 'Added';
    el.style.backgroundColor = '#27ae60';
    el.style.color = '#fff';
}

function addToCartItems(el) {
    const cartProduct = fetchProductDetails(el);

    if((cartItems.findIndex((item) => item.title == cartProduct.title)) == -1) {
        cartItems.push(product);
        // update count of the cart
        cartCountEl.innerHTML = `${cartItems.length} Items`;
    }

}

function checkAddToCartBtn(cartItems) {
    const allItem = document.querySelectorAll('.product'); //fetching all products

    allItem.forEach(item => {

        const title = item.querySelector('.product-title').innerHTML;

        if(cartItems.findIndex((item) => item.title == title) > -1) {
            updateCartBtn(item.querySelector('.add-to-cart'));
        }

        cartCountEl.innerHTML = `${cartItems.length} Items`;
    });

}

// Update add remove from wishlist
function updateWishList(el) {
    el.classList.toggle('liked');
    const product = fetchProductDetails(el);

    if((wishListItems.findIndex((item) => item.title == product.title)) == -1) {
        wishListItems.push(product);

        // update count of the wishlist
        updateWishListCount(wishListItems.length);
        writeToWishList(wishListItems);
    }
    else {
        removeFromWishList(product);
    }
    
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

        if(title == product.title) {
            item.lastElementChild.lastElementChild.classList.toggle('liked');
        }

    });

}

function checkWishBtn(wishListItems) {
    const allItem = document.querySelectorAll('.product'); //fetching all products

    allItem.forEach(item => {

        const title = item.querySelector('.product-title').innerHTML;

        if(wishListItems.findIndex((item) => item.title == title) > -1) {
            item.querySelector('.wish-btn').classList.toggle('liked');
        }
    });
}

function updateWishListCount(count) {
    wishCountEl.innerHTML = count;
}

// fetch product details and store 
function fetchProductDetails(el) {
    const parentEl = el.parentNode.parentNode;
    productTitle = parentEl.querySelector('.product-title').innerHTML;
    productImage = parentEl.querySelector('img').src;
    productPrice = parentEl.querySelector('.product-price').innerHTML.slice(1);
    productRating = parentEl.querySelector('.product-rating').innerText;
    productType = parentEl.querySelector('.product-type').innerHTML;
    productDesription = parentEl.querySelector('.product-description').innerHTML;
    productTotalQuantity = parentEl.querySelector('.product-total-Quantity').innerHTML;

    product = createProduct(productTitle, productImage, productPrice, productRating, productType, productDesription, productTotalQuantity);

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

showAllProducts();


// open and close wishlist
wishBtn.addEventListener('click', () => {
    document.querySelector('.dark-back').style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    document.querySelector('.dark-back').style.display = 'none';
});

// move to cart details
cartBtn.addEventListener('click', () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("wishListItems", JSON.stringify(wishListItems));
    location.href = './cart.html';
});




