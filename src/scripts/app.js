import '../styles/styles.scss';
import $ from 'jquery';
import orderCart from './OrderCart';
import RestoranData from './RestoranData';
import MenuData from './MenuData';

let restoranData = [];
let menuData = [];

const restoran = new RestoranData();
const menu = new MenuData();

$(function() {
  // start up your app

  restoran.getRestoranData().then(data => {
    if(data.ErrorCode == 200) {
      restoranData = data;
      restoran.getRestoranDataHtml(restoranData);
    }
  });
  menu.getMenuData().then(data => {
    if(data.ErrorCode == 200) {
      menuData = data.ResultSet;
      menu.getMenuHtml(menuData);
      openTab(null,'Menu');
    }
  });
})

function formatMyMoney(price) {
    var currency_symbol = "₺"
    var formattedOutput = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
      });
  
    return formattedOutput.format(price).replace(currency_symbol, '') + ' TL';
  }


function sectionSelect(item) {
  openTab(event, 'Menu');
  if (item.hash !== "") {
    // Prevent default anchor click behavior
    event.preventDefault();
    // Store hash
    var hash = item.hash;
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 800, function(){
      window.location.hash = hash;
    });
  }
}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  if(evt) {
    evt.currentTarget.className += " active";
  }
  else {
    var tabLinksArr = [...tablinks];
    tabLinksArr.find(item => {
      if(item.innerHTML == tabName) {
        item.className = item.className += " active";
      }
    })
  }
  switch (tabName) {
    case 'Title': 
      menu.getTitle(menuData);
      break;
    case 'Bilgiler': 
      document.getElementById("min-tutar-gonderim").innerHTML = formatMyMoney(restoranData.ResultSet.DeliveryAreas[0].MinimumPrice);
      document.getElementById("area-gonderim").innerHTML = restoranData.ResultSet.DeliveryAreas[0].AreaName;
      document.getElementById("deliverTime").innerHTML = restoranData.ResultSet.DeliveryAreas[0].DeliveryTime + ' dk';
      restoran.getDeliveryArea(restoranData.ResultSet.DeliveryAreas);
      restoran.getWorkingHours(restoranData.ResultSet.WorkingHours);
      restoran.getRestoranDetail(restoranData.ResultSet.Discounts);
      restoran.getPaymentMethods(restoranData.ResultSet.PaymentMethods);
      break;
  }
};
window.openTab = openTab;
window.popUp = popUp;
window.addCart = addCart;
window.sectionSelect = sectionSelect;

function addCart(item){
  orderCart.addCart(item);
}

function popUp(name) {
  var popup = document.getElementById(name);
  popup.classList.toggle("show");
}

$('.show-cart').on("click", ".delete-item", function(event) {
  var name = $(this).data('name');
  orderCart.removeItemFromCart(name);
  orderCart.displayCart();
})

$('.show-cart').on("change", ".restaurant__menu__card__input", function(event) {
  var name = $(this).data('name');
  this.value=this.value.replace(/[^\d]/,'');
  orderCart.setCount(name, this.value);
  orderCart.displayCart();
})

