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
        let loc;
        let btn = document.createElement('input');
        btn.className = "button";
        btn.id = id;
        btn.type = "button";
        btn.value = val;
        btn.addEventListener('click', func);
        where!=undefined ? loc = document.getElementById(where) : loc = document.body;
        loc.append(btn);
    }
}
/**отмена форм param==form.id */
function cancelForm(id){
    document.getElementById(id).remove();
}