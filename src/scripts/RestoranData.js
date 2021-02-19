const pointData = document.getElementById("point-data");
const minTutar = document.getElementById("min-tutar");
const sepetAdresEmpty = document.getElementById("sepet-adresEmpty");
const deliveryTime = document.getElementById("time");
const restaurantName = document.getElementById("restaurant__name");

function formatMyMoney(price) {
    var currency_symbol = "₺"
    var formattedOutput = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
      });
  
    return formattedOutput.format(price).replace(currency_symbol, '') + ' TL';
  }

var days = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cuamrtesi","Pazar"];


export default class RestoranData {

    async getRestoranData() {
   
      try {
        let result =  await import( '../assets/restoranData.json');
        let restoran = result.d;
        return restoran;
      } catch(err){
      }
    }
    getRestoranDataHtml(restoranData){
     restoranData = restoranData;
     restaurantName.innerHTML = '<span>'+restoranData.ResultSet.DisplayName +' (' + restoranData.ResultSet.DeliveryAreas[0].AreaName +' )' + '</span>';
     pointData.innerHTML = this.getRestoranPoints('Hız',restoranData.ResultSet.Speed) + this.getRestoranPoints('Servis',restoranData.ResultSet.Serving) + this.getRestoranPoints('Lezzet',restoranData.ResultSet.Flavour);
     minTutar.innerHTML = formatMyMoney(restoranData.ResultSet.DeliveryAreas[0].MinimumPrice);
     sepetAdresEmpty.innerHTML = restoranData.ResultSet.DeliveryAreas[0].AreaName;
     deliveryTime.innerHTML = restoranData.ResultSet.DeliveryAreas[0].DeliveryTime + ' dk.';
    }
    getRestoranPoints(name,point) {
     return '<div class="restaurant__points">'+
                 '<span>'+ name +
                 '</span>'+
                 '<span class="restaurant__points__point">' + point + '</span>'+
             '</div>';
     }
     getPaymentMethods(paymentMethods) {
       var htmlDiscounts = document.getElementById("restoran-payment");
       var paymentData = "";
       paymentMethods.forEach(item => {
        paymentData += '<span class="restaurant__detail__card"><i class="fa fa-check-circle"></i>'+ item.PaymentMethodName + '</span>';
       });
       htmlDiscounts.innerHTML = paymentData;
     }
     
     getRestoranDetail(discounts) {
       var htmlDiscounts = document.getElementById("restoran-detail");
       var cardData = "";
       discounts.forEach(item => {
         cardData += '<span class="restaurant__detail__card">'+ item.Name + '</span>';
       });
       htmlDiscounts.innerHTML = cardData;
     }
      getWorkingHours(workingHours) {
       var today = workingHours.find(item => {
         return item.IsToday;
       });
       document.getElementById("dayOfWeek").innerHTML = days[today.DayOfWeek];
       document.getElementById("hourOfDay").innerHTML = today.WorkingHours[0];
     
       var htmlWorkingHours = document.getElementById("workingHours");
       var working = "";
       workingHours.forEach(item => {
         working += '<div class="workingHours"><span class="workingHours__days">' + days[item.DayOfWeek] + '</span>'+
         '<span class="workingHours__hours">' + item.WorkingHours[0] + '</span>'+
         '</div>';
       });
     
       htmlWorkingHours.innerHTML = working;
     }
     groupBy(xs, key) {
       return xs.reduce(function(rv, x) {
         (rv[x[key]] = rv[x[key]] || []).push(x);
         return rv;
       }, {});
     };
     getDeliveryArea(deliveryAreas) {
       var grouped = this.groupBy(deliveryAreas, 'MinimumPrice');
       var kampus = document.getElementById("kampus");
       var areas = "";
          var keys = Object.keys(grouped);
           for(var key in keys){
             areas += '<div class="bilgiler__gonderim__popup"><span class="bilgiler__gonderim__span">' +formatMyMoney(keys[key])+ ': </span><div class="bilgiler__gonderim__area">';
             var area = '';
             var groupAreas = grouped[keys[key]];
             for(var i=0;i<groupAreas.length;i++) {
               area += '<a>'+ groupAreas[i].AreaName
               + '</a>';
             }
             areas += area + '</div></div>';
           }
        kampus.innerHTML = areas;
     }
   
   }