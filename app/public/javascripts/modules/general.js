/**ОБЩИЕ ФУНКЦИИ */
/**обнуление куки с закрытия/обновления страницы */
window.onbeforeunload = function() {
    document.cookie = `x-access-token=${getCookie('x-access-token')}; max-age=-1;`;
  };

/**функция логаут */
function logOut(){
    document.cookie = `x-access-token=${getCookie('x-access-token')}; max-age=-1;`;
    window.location.replace('/');
    
}
/**обрабатываем куки по имени */
function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
}
/**обработка кнопки ПОЛЬЗОВАТЕЛИ */
function usersPage(){
    addTopButtons();      // стираем содержимое страницы и добавляем вверхнее меню
    addButton('addNewUserButton', '+', newUser);   // рисуем кнопку НОВЫЙ ПОЛЬЗОВАТЕЛЬ
    createTableOfUsers(); // рисуем таблицу
    getDataFromUsers();   // заполняем таблицу
}
/**обработка кнопки СИСТЕМА ЗАЯВОК */
function tasksPage(){
    addTopButtons();      // стираем содержимое страницы и добавляем вверхнее меню
    addButton('addNewTaskButton', '+', newTask); //кнопка новойзаявки
    createTableOfTasks(); // таблица заявок
    getDataFromTasks(); // заполняем таблицу заявками
}
/**обработка кнопки СИСТЕМА ЗАКАЗОВ*/
function storePage(){
    addTopButtons();      // стираем содержимое страницы и добавляем ввернее меню
}
/**обработка кнопки СКЛАД */
function werehousePage(){
    if (!document.getElementById('werehouseMenuId')){
        addSelfButtons();
    }else{
        cancelForm('werehouseMenuId');
    }
}
/**обработка кнопки ОТЧЕТ */
function reportPage(){
    addTopButtons();
}
/**создание кнопки  
 id = string, ID будущей кнопки
 val = string, value будущей кнопки
 func = имя функции сработающей по клику */
 function addButton(id, val, func, where){
    if (!document.getElementById(id)){
        let html = "";
        switch (val){
            case '+': html = `<span class="iconsStyle"><i class="bi bi-journal-plus"></i></span>`; break;
            case '-': html = `<span class="iconsStyle"><i class="bi bi-journal-minus"></i></span>`; break;
            case '=': html = `<span class="iconsStyle"><i class="bi bi-journal-text"></i></span>`; break;
            case '?': html = `<span class="iconsStyle"><i class="bi bi-search"></i></span>`; break;
        }
        let loc;
        let btn = document.createElement('div');
        btn.className = "smallButton";
        btn.id = id;
       // btn.type = "button";
      //  btn.value = val;
        btn.innerHTML = html;
        btn.addEventListener('click', func);
        where!=undefined ? loc = document.getElementById(where) : loc = document.body;
        loc.append(btn);
    }
}
/**отмена форм param==form.id */
function cancelForm(id){
    document.getElementById(id).remove();
}
function addTopButtons(){
    let html = ``;
    switch(sessionStorage.getItem('role')){
        case 'ROLE_ADMIN': html = `<div class="topButtons"><button id="usersButton" class="button" onclick="usersPage()">Пользователи</button><button id="tasksButton" class="button" onclick="tasksPage()">Система заявок</button><button id="storeButton" class="button" onclick="storePage()">Система заказов</button><button id="werehButton" class="button" onclick="werehousePage()">Склад</button><button id="reportButton" class="button" onclick="reportPage()">Отчет</button><button id="priceButton" class="button" onclick="priceForm()">Цена</button><button id="logOutButton" class="button" onclick="logOut()" title="Выход из системы"><i class="bi bi-x-square"></i></button><hr></div>`; break;
        case 'ROLE_USER' : html = `<div class="topButtons"><button id="tasksButton" class="button" onclick="tasksPage()">Система заявок</button><button id="logOutButton" class="button" onclick="logOut()">Выход из системы</button><hr></div>`; break;
        case 'ROLE_MODERATOR': html = `<div class="topButtons"><button id="tasksButton" class="button" onclick="tasksPage()">Система заявок</button><button id="storeButton" class="button" onclick="storePage()">Система заказов</button><button id="reportButton" class="button" onclick="reportPage()">Отчет</button><button id="logOutButton" class="button" onclick="logOut()">Выход из системы</button><hr></div>`; break;
        case 'ROLE_WEREHOUSE': html = `<div class="topButtons"><button id="storeButton" class="button" onclick="storePage()">Система заказов</button><button id="werehButton" class="button" onclick="werehousePage()">Склад</button><button id="logOutButton" class="button" onclick="logOut()">Выход из системы</button><hr></div>`; break;
    }
    document.body.innerHTML = "";
    document.body.innerHTML = html;
}