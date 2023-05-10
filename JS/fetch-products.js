//GET PRODUCTS API, CREATE PRODUCT AND EXIBITION:
async function getProductsAPI(productsList) {
    const response = await fetch(
        `https://api.mercadolibre.com/sites/MLB/search?q=${productsList}`
    );
    const products = await response.json();
    return products;
}
const products = await getProductsAPI("computador");
const productsList = products.results;
const insertionProducts = document.querySelector(".itens");

function createProductItemElement(arrayProducts) {
    return arrayProducts.map((product) => {
        insertionProducts.innerHTML += `
    <div class=product>
    <img class="img-product" src="${product.thumbnail}"/>
    <p id="id-product">${product.id}</p>
    <p id="title-product">${product.title}</p>
    <p id="price-product">${product.price}</p>
    <button class="button-add-product">Adicionar ao carrinho</button>
    </div>
    `;
    });
}
createProductItemElement(productsList);

//GET ITEM API, CREATE ITEM AND ADD IN CART:
async function getItemAPI(id) {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const item = response.json();
    return item;
}
const insertionCartItens = document.querySelector(".cart-itens")

function createCartItemElement(item) {
    return insertionCartItens.innerHTML += `
  <div class="item">
  <img class="img-item" src="${item.thumbnail}"/>
  <p>${item.id}</p>
  <p>${item.title}</p>
  <p>${item.price}</p>
  <button class="button-removeItem">x</button>
  </div>
  `;
}

const buttonsAddItemCartNode = document.querySelectorAll(".button-add-product");
const buttonsAddItemCartList = Array.from(buttonsAddItemCartNode);
buttonsAddItemCartList.map((button) => {
    button.addEventListener("click", async function() {
        const buttonProduct = button.parentNode;
        const entireProduct = buttonProduct.children;
        const productId = entireProduct[1].innerHTML;
        const entireItem = await getItemAPI(productId);
        const item = createCartItemElement(entireItem);
        saveCartItems(item);
    })
})

//REMOVE ITEM CART WITH DBLCLICK:
function cartItemClickListener() {
    const ul = document.querySelector(".cart-itens");
    return ul.addEventListener("dblclick", (event) => {
        const eventClick = event.target;
        if (eventClick.innerHTML === "x") {
            return eventClick.parentNode.remove()
        }
    })
}
cartItemClickListener()

//LOCAL STORAGE:
function getSavedCartItems() {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCartItems(product) {
    if (localStorage.hasOwnProperty("cartItems")) {
        return localStorage.setItem("cartItems", JSON.stringify([...getSavedCartItems(), product]));
    } else {
        localStorage.setItem('cartItems', JSON.stringify([product]))
    }
}

function exibitionCartItensLocalStorage() {
    const ul = document.querySelector(".cart-itens")
    const cartItens = getSavedCartItems();
    return cartItens.map((item) => {
        ul.innerHTML += (item)
    })
}
window.onload = exibitionCartItensLocalStorage()