import { invoke } from "@tauri-apps/api/tauri";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

import { FoodItem, FoodType, MenuAPI, getMenu  } from "./menu-interface.js"

async function greet() {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    greetMsgEl.textContent = await invoke("greet", {
      name: greetInputEl.value,
    });
  }
}

interface ShoppingCartItem {
  id: Number, // use MenuAPI object
  options: Number[],
  quantity: Number,
  unique: Number, // use time for unique ident

  computeTotal(): void;
  showModal(): void;
}

interface ShoppingCartModel {
  shoppingCart: ShoppingCartItem[],
  element: HTMLElement,
  render(): void,
  destroy(): void,
}

function generateShoppingCartHTML(itemName, price, ondelete, onedit) {
  // Create the elements
  var divShoppingCart = document.createElement("div");
  var divItem = document.createElement("div");
  var spanItemName = document.createElement("span");
  var divDetails = document.createElement("div");
  var divPrice = document.createElement("div");
  var divActions = document.createElement("div");
  var buttonEdit = document.createElement("button");
  var buttonDelete = document.createElement("button");

  buttonEdit.onclick = onedit;
  buttonDelete.onclick = ondelete;

  // Set the class names
  divShoppingCart.className = "ShoppingCart";
  divItem.className = "item";
  spanItemName.className = "item-name";
  divDetails.className = "details";
  divPrice.className = "price";
  divActions.className = "actions";

  // Set the text content
  spanItemName.innerHTML = itemName;
  divPrice.textContent = "Price: $" + (price/100).toFixed(2);
  buttonEdit.textContent = "Edit";
  buttonDelete.textContent = "Delete";

  // Append the elements to their parents
  divItem.appendChild(spanItemName);
  divActions.appendChild(buttonEdit);
  divActions.appendChild(buttonDelete);
  divDetails.appendChild(divPrice);
  divDetails.appendChild(divActions);
  divShoppingCart.appendChild(divItem);
  divShoppingCart.appendChild(divDetails);

  // Return the outer HTML of the shopping cart div
  return divShoppingCart;
}

function createRemoveCallback(shoppingCartModel:ShoppingCartModel, cartItem:ShoppingCartItem) {
  return () => {
    shoppingCartModel.shoppingCart = shoppingCartModel.shoppingCart.filter((item:ShoppingCartItem) => item.unique !== cartItem.unique);
    shoppingCartModel.destroy();
    shoppingCartModel.render();
  }
}

function createShoppingCartModel(element:HTMLElement, menu:MenuAPI): ShoppingCartModel {


  return {
    shoppingCart: new Array,
    element,
    render() {

      for (let cartItem of this.shoppingCart) {
        let item: FoodItem = menu.items[cartItem.id];

        let name = item.name;

        console.log(cartItem);

        cartItem.options.forEach((id) => {
          let option_item = menu.items[id];
          name += "<br>+ " + option_item.name;
        })

        let shoppingCartItem = generateShoppingCartHTML(name, cartItem.computeTotal(), createRemoveCallback(this, cartItem), cartItem.showModal);
        element.appendChild(shoppingCartItem);
      }
    },
    destroy() {
      while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild)
      }
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document
    .querySelector("#greet-button")
    ?.addEventListener("click", () => greet());
});

function createButton(text:string, div:HTMLElement, others: Array<HTMLElement>) {
  let button = document.createElement("button")
  button.innerHTML = text;
  button.onclick = () => {
      others.forEach((elt) => {
        elt.style.display = "none"
      })
      div.style.display = 'grid';
  };
  return button;
}

function createHiddenDiv() {
  let div = document.createElement("div")
  div.className = "pane"
  div.style.display = "none";
  return div;
}

function createFoodButtonWithTemplate(text, callback) {
  let button = document.createElement("button");
  button.innerHTML = text;
  button.onclick = callback;
  return button;
}

function createShoppingCartItem(id:Number, menu:MenuAPI): ShoppingCartItem {
  return {
    id,
    options:[],
    quantity: 1,
    unique: Date.now(),
    showModal: () => {},
    computeTotal() {
      if (this.options.length) {
        return menu.items[this.id].price + this.options.map((id) => menu.items[id].price).reduce((x, y) => x + y);
      }
      return menu.items[this.id].price
    }
  }
}

function createAddItemCallBack(item_id: Number, shoppingCart:ShoppingCartModel, modal: any, menu: MenuAPI) {
  return () => {
    let shoppingCartItem = createShoppingCartItem(item_id, menu)
    if (menu.items[item_id].options && menu.items[item_id].options.length) {

      let fn = () => modal.show_modal(item_id, menu, shoppingCartItem, shoppingCart);
      shoppingCartItem.showModal = fn;
      fn();
    }
    else {
      shoppingCart.destroy()
      shoppingCart.shoppingCart.push(shoppingCartItem)
      shoppingCart.render()
    }
  };
}

function generateOptionModalSnippet(id, name, value, label) {
  // Create the elements
  var div = document.createElement("div");
  var input = document.createElement("input");
  var labelElem = document.createElement("label");

  // Set the input attributes
  input.type = "checkbox";
  input.id = id;
  input.name = name;
  input.value = value;

  // Set the label attributes and text
  labelElem.htmlFor = id;
  labelElem.innerText = label;

  // Append the elements to the div
  div.appendChild(input);
  div.appendChild(labelElem);

  // Return the div
  return [ div, input ]
}

function initModal(cartModel:ShoppingCartModel) {
  let modal = document.getElementById("option-modal")
  console.assert(modal);

  let hide_modal = () => modal.style.display = "none"

  let option_element = document.getElementById("option-modal-viewport")

  let destroy_options = () => {
    while (option_element.lastChild) {
      option_element.lastChild.remove();
    }
  }
  let done_modal = document.getElementById("option-modal-done");

  let show_modal = (item_id, menu, shopping_cart_item, shoppingCartModel) => {
    destroy_options();

    let options = menu.items[item_id].options.map(opt => menu.items[opt]);
    
    let option_value_divs = []

    console.log(options)

    
    options.forEach((item:FoodItem) => {
      let [ div, input ] = generateOptionModalSnippet(item.id, item.name, item.id, item.name);
      option_element?.appendChild(div);
      option_value_divs.push(input);
    })


    console.log("showing modal")
    modal.style.display = "block";
    done_modal.onclick = () => {

      let ids = option_value_divs
        .map((input) => {
            if (input.checked)
              return input.id;
            else
              return -1;
        })
        .filter((x) => x > 0);
      
      shopping_cart_item.options = ids;

      console.log(ids);
      shoppingCartModel.destroy()
      let cart = shoppingCartModel.shoppingCart.filter((x) => x.unique === shopping_cart_item.unique);
      if (! cart.length) 
        shoppingCartModel.shoppingCart.push(shopping_cart_item);
      shoppingCartModel.render()
      hide_modal()
    }
  }

  let cancel_modal = document.getElementById("option-modal-cancel");
  cancel_modal.onclick = hide_modal;

  return {
    element:modal,
    show_modal,
    hide_modal,
  }

}

function initMenu(menu: MenuAPI, model:ShoppingCartModel) {

  console.log(menu)
  let items = menu.items;
  let types = menu.types;

  let tabs = document.getElementById("button-bar")
  let panes = document.getElementById("menu-viewport")
  let others: Array<HTMLElement> = []
  let modal = initModal(model);
  console.log(modal)
  for (let type of menu.types) {
    // Create inner html
    let div = createHiddenDiv();
    others.push(div)
    panes?.appendChild(div)
    let bt = createButton(type.name, div, others);
    console.log(tabs)
    tabs?.appendChild(bt)

    items.filter((item) => item.type_id == type.id).forEach((item) => {
      let foodbutton = createFoodButtonWithTemplate(item.name, createAddItemCallBack(item.id, model, modal, menu))
      div.appendChild(foodbutton)
    })
  }
}


function errorMenu(error:any) {
  console.log(error);
}


async function sleep(ms) {
  await new Promise(r => setTimeout(r, ms));
}

async function updatePriceLabel(shoppingCartModel: ShoppingCartModel) {

  let subtotalElt = document.getElementById("subtotal");
  let taxElt = document.getElementById("tax");
  let totalElt = document.getElementById("total");

  while (1) {
    let value = 0;
    let cart = shoppingCartModel.shoppingCart


    if (cart.length) {
      value = cart
        .map((item:ShoppingCartItem) => item.computeTotal())
        .reduce((x, y) => x + y);
    }
    subtotalElt.value = (value/100).toFixed(2);

    let tax = (value * 0.0855)
    let total = value + tax;
    
    taxElt.value = (tax/100).toFixed(2);
    totalElt.value = (total/100).toFixed(2);
    


    await sleep(33.33);
  }
}

(new Promise(async (resolve, reject) => {
  try {
    resolve(await getMenu())
  }
  catch (error) {
    reject(error)
  }
})).then((data:MenuAPI) => {
    let cartElement = document.getElementById("shopping-cart-container");

    console.assert(cartElement);
    
    let shoppingCartModel = createShoppingCartModel(cartElement, data);
    
    initMenu(data, shoppingCartModel);

    new Promise(async (res, rej) => {
      await updatePriceLabel(shoppingCartModel)
    })
  })
  .catch(error => errorMenu(error))