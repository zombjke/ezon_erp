function loadScript(src) {
    let script = document.createElement('script');
    script.src = src;
    document.head.append(script);
  }

  loadScript("/javascripts/modules/general.js");
  loadScript("/javascripts/modules/navigation.js");
  loadScript("/javascripts/modules/orders.js");
  loadScript("/javascripts/modules/wereh.js");


/**страем все с документа и рисуем вверхние кнопки */
function addTopButtons(){
    let html = `<div class="topButtons"><button id="storeButton" class="button" onclick="storePage()">Система заказов</button><button id="werehButton" class="button" onclick="werehousePage()">Склад</button><button id="logOutButton" class="button" onclick="logOut()">Выход из системы</button><hr></div>`;
    document.body.innerHTML = "";
    document.body.innerHTML = html;
}