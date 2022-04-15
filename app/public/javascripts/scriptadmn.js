function loadScript(src) {
    let script = document.createElement('script');
    script.src = src;
    document.head.append(script);
  }

  loadScript("/javascripts/modules/general.js");
  loadScript("/javascripts/modules/navigation.js");
  loadScript("/javascripts/modules/orders.js");
  loadScript("/javascripts/modules/price.js");
  loadScript("/javascripts/modules/report.js");
  loadScript("/javascripts/modules/tasks.js");
  loadScript("/javascripts/modules/users.js");
  loadScript("/javascripts/modules/wereh.js");

  /**страем все с документа и рисуем вверхние кнопки */
function addTopButtons(){
    let html = `<div class="topButtons"><button id="usersButton" class="button" onclick="usersPage()">Пользователи</button><button id="tasksButton" class="button" onclick="tasksPage()">Система заявок</button><button id="storeButton" class="button" onclick="storePage()">Система заказов</button><button id="werehButton" class="button" onclick="werehousePage()">Склад</button><button id="reportButton" class="button" onclick="reportPage()">Отчет</button><button id="priceButton" class="button" onclick="priceForm()">Цена</button><button id="logOutButton" class="button" onclick="logOut()">Выход из системы</button><hr></div>`;
    document.body.innerHTML = "";
    document.body.innerHTML = html;
}
