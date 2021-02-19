import $ from 'jquery';

function formatNumber(number) {
    return number.replace(',','.');
}
const menuCard = document.getElementById("menu-card");
export default class MenuData {
    async getMenuData() {
   
      try {
        let result =  await import( '../assets/menuData.json');
        let menu = result.d;
        return menu;
      } catch(err){
      }
    }
    getMenuHtml(menuData) {
      var menuDataDom = "";
      menuData.forEach(data => {
        menuDataDom += '<div style="margin-bottom:20px"><div class="restaurant__menu__title" id="'+ data.Oid+'"><section>'+
        '<h2 class="restaurant__menu__title__name">'+ data.CategoryDisplayName + '</h2></section>'+
        '</div>'+ this.getProduct(data.Products) + '</div>';
      });
    
      menuCard.innerHTML = menuDataDom;
    }
    getProduct(productsArr) {
      var products = "";
      if(productsArr) {
        productsArr.forEach(product => {
          products += '<div class="restaurant__menu__card"><input class="form-control restaurant__menu__card__input" onkeypress="return event.charCode >= 49 && event.charCode <= 57" type="number" value="1" />'+
          '<button class="restaurant__menu__card__svg btn px-3" onclick="addCart(this)" data-name="' + product.DisplayName + '" data-price="' + formatNumber(product.ListPrice) +'" >'+
          '</button>'+
          '<div style="width: 100%;">'+
          '<div id="menu-dinner" class="restaurant__menu__card__dinner">'+
            product.DisplayName+
            '<span>'+ product.ListPrice +' TL' + '</span>'+
          '</div>'+
          '<div class="col-md-12 restaurant__menu__card__detail">' + product.Description +'</div></div></div>';
        });
      }
      return products;
    }
     getTitle(menuData) {
      var liste = "";
      menuData.forEach(data => {
        liste += '<a href="#'+ data.Oid +'" onclick="sectionSelect(this)" class="restaurant__detail__list">'+ data.CategoryDisplayName + '</a>';
      });
      $('#listTitle').html(liste);
    }
   }