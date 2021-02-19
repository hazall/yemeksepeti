import $ from 'jquery';

const sepetAdres = document.getElementById("sepet-adres");
const cartSepet = document.getElementById("cart-sepet");
const cartEmpty = document.getElementById("cart-empty");
const restaurantName = document.getElementById("restaurant__name");

var orderCart = (function() {

    var cart =[];
  
  function Order (name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }
  function saveCart() {
    sessionStorage.setItem('orders', JSON.stringify(cart));
  }

  function formatMyMoney(price) {
    var currency_symbol = "₺"
    var formattedOutput = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
      });
  
    return formattedOutput.format(price).replace(currency_symbol, '') + ' TL';
  }
  
  var orderObject = {};
  // Add to cart
  orderObject.addItemToCart = function(name, price, count) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart[item].count += Number(count);
        saveCart();
        return;
      }
    }
    var item = new Order(name, price, count);
    cart.push(item);
    saveCart();
  };
  orderObject.totalCount = function() {
    var totalCount = 0;
    for(var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  }
  orderObject.totalCart = function() {
    var totalCart = 0;
    for(var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return formatMyMoney(totalCart);
  }
  orderObject.listCart = function() {
    var cartCopy = [];
    for(var i in cart) {
      var item = cart[i];
      var itemCopy = {};
      for(var p in item) {
        itemCopy[p] = item[p];
  
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy)
    }
    return cartCopy;
  }
  orderObject.removeItemFromCart = function(name) {
    for(var item in cart) {
      if(cart[item].name === name) {
          cart.splice(item, 1);
      }
  }
  saveCart();
  }
  orderObject.setCount = function(name, count) {
    for(var item in cart) {
     if(cart[item].name === name) {
       cart[item].count = Number(count);
       if(count == 0){
         cart.splice(item,1);
       }
       break;
     }
    }
  }
  orderObject.displayCart = function() {
    var cartArray = orderObject.listCart();
    var output = "";
    if(cartArray.length>0){
      for(var i in cartArray) {
        output += "<tr class='cart'>"
          + "<td class='cart__name'>" + cartArray[i].name + "</td>" 
          + "<td class='cart__input'><input class='form-control restaurant__menu__card__input' type='number' data-name='" + cartArray[i].name +"' value='" +cartArray[i].count+ "' />"
          + "<td class='cart__price'>" + formatMyMoney(cartArray[i].price) + "</td>"
          + "<td class='cart__button'><button class='delete-item btn' data-name='" + cartArray[i].name + "'>x</button></td>"
          +  "</tr>";
      }
      $('.show-cart').html(output);
      $('.cart__totalPrice').html(orderCart.totalCart());
    }
    else{
      cartSepet.style.display = "none";
      sepetAdres.innerHTML = restaurantName.innerHTML;
      cartEmpty.style.display = "grid";
    }
  
  }
  orderObject.addCart = function (item) {
    var name = item.dataset.name;
    var price = item.dataset.price;
    var count = item.previousElementSibling.value;
    orderObject.addItemToCart(name, price, count);
    cartSepet.style.display = "grid";
    sepetAdres.innerHTML = restaurantName.innerHTML;
    cartEmpty.style.display = "none";
    item.previousElementSibling.value = 1;
    orderObject.displayCart();
  }
  return orderObject;
  })();
export default orderCart;