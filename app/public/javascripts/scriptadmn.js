

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
/**страем все с документа и рисуем вверхние кнопки */
function addTopButtons(){
    let html = `<div class="topButtons"><button id="usersButton" class="button" onclick="usersPage()">Пользователи</button><button id="tasksButton" class="button" onclick="tasksPage()">Система заявок</button><button id="storeButton" class="button" onclick="storePage()">Система заказов</button><button id="werehButton" class="button" onclick="werehousePage()">Склад</button><button id="reportButton" class="button" onclick="reportPage()">Отчет</button><button id="priceButton" class="button" onclick="priceForm()">Цена</button><button id="logOutButton" class="button" onclick="logOut()">Выход из системы</button><hr></div>`;
    document.body.innerHTML = "";
    document.body.innerHTML = html;
}
/**форма формирования цены */
function priceForm(){
    if (!document.getElementById('priceId')){
        let form = document.createElement('form');
        form.id = "priceId";
        form.className = "priceForm";
        form.innerHTML = `<div id="priceIdHeader" class="priceHeader">Формирование цены</div><div class="priceInfo"><table><tbody id="priceTable"><tr><td>Таможня</td><td><input type="number" id="tamoj" min="0" step="0.01">%</td></tr><tr><td>Демозал</td><td><input type="number" id="demo" min="0" step="0.01">%</td></tr><tr><td>Логистика</td><td><input type="number" id="logistic" min="0" step="0.01">%</td></tr><tr><td>Затраты фирмы</td><td><input type="number" id="costs" min="0" step="0.01">%</td></tr><tr><td>Прочие расходы</td><td><input type="number" id="other" min="0" step="0.01">%</td></tr><tr><td>Прибыль фирмы</td><td><input type="number" id="profit" min="0" step="0.01">%</td></tr><tr><td>Совокупный процент</td><td><input type="text" id="summa" value="0" readonly><span>%</span></td></tr></tbody></table></div><div class="priceSubButtons"><input type="button" class="submitButton" onclick="savePrice()" value="Сохранить"><input type="button" class="submitButton" onclick="cancelForm('priceId')" value="Отмена"></div>`;
        document.body.append(form);
        dragElement(document.getElementById(form.id));
        getPrice();
        
        document.getElementById('priceTable').addEventListener('change', function(event){if(event.target.id != 'summa') calculate();})
    }
}
/**калькуляция суммы процентов */
function calculate(){
    let resField = document.getElementById('summa');
    let form = document.getElementById('priceTable');
    let temp = 0;
    let inputs = form.querySelectorAll('input');
    for (let i=0;i<inputs.length;i++){
        if (inputs[i].id != 'summa'){
            temp += inputs[i].valueAsNumber; 
        }
        resField.value = temp.toFixed(2);
    }
    
}

/**получаем составляющие цены */
async function getPrice(){
    let form = document.getElementById('priceId')
    let response = await fetch ('/price/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
      });
    let result = await response.json();
      form.elements.tamoj.value = result[0].tamoj;
      form.elements.demo.value = result[0].demo;
      form.elements.logistic.value = result[0].logistic;
      form.elements.costs.value = result[0].costs;
      form.elements.other.value = result[0].other;
      form.elements.profit.value = result[0].profit;
      form.elements.summa.value = result[0].summa;

}
/**сохраняем составляющие цены */
async function savePrice(){
    let form = document.getElementById('priceId');
    let data = {
        'tamoj': `${form.elements.tamoj.value}`,
        'demo': `${form.elements.demo.value}`,
        'logistic': `${form.elements.logistic.value}`,
        'costs': `${form.elements.costs.value}`,
        'other': `${form.elements.other.value}`,
        'profit': `${form.elements.profit.value}`,
        'summa': `${form.elements.summa.value}`,
    }
    let response = await fetch ('/price/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
    });
    await response.json();
    if (response.status == 200) { cancelForm(form.id) };
}
/**создаем навигацию по складу */
function addSelfButtons(){
    let cords = document.getElementById('werehButton').getBoundingClientRect();
    let div = document.createElement('div');
    div.id = 'werehouseMenuId';
    div.className = 'werehouseMenu';
    document.body.append(div);
    div.style.left = (cords.left - 63) + 'px';
    div.style.top = cords.bottom + 20 + 'px';
    addButton('listWerehouseButton', '=', listWerehouse, div.id); // список товара на складе
    addButton('arrivalToWerehouseButton', '+', arrivalToWerehouse, div.id); //список прихода
    addButton('writeOffFromWerehouseButton', '-', writeOffFromWerehouse, div.id); //списание со склада
    
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
/** создание таблицы пользователей*/ 
function createTableOfUsers(){
    if (!document.getElementById('usersTable')){
        let html = '<table id="usersTable" class="userstable"><col class="col_1"><col class="col_2"><col class="col_3"><col class="col_4"><col class="col_5"><thead><th>№</th><th>Имя пользователя</th><th>Офис</th><th>Роль</th><th>Удаление</th></thead><tbody id="usersTableBody"></tbody></table>';
        let usersTable = document.createElement('table');
        usersTable.className = "userstable";
        usersTable.id = "usersTable";
        usersTable.innerHTML = html;
        document.body.append(usersTable);
    }    
}
/**получаем данные о всех пользователях */
async function getDataFromUsers (){
    let temp = '';
    let userTable = document.getElementById('usersTableBody');
    let response = await fetch ('/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
      });
    let result = await response.json();
    for(let i=0; i < result.length; i++){
        temp += "<tr id='" + result[i].id + "' onClick='openUserDetail(" + result[i].id +")'><td>" + result[i].id + "<\/td><td>" + result[i].username + "<\/td><td>" + result[i].office + "<\/td><td>" + chooseRole(result[i].roleid) + "<\/td><td><button class='delUserBtn' onClick='removeUser(" + result[i].id + ")'>удалить</button><\/td><\/tr>"
    }
    userTable.innerHTML = temp;
}

function chooseRole(val){
    switch(val){
        case 1:
            return "Инженер";
        case 2:
            return "Менеджер";
        case 3:
            return "Администратор";
        case 4:
            return "Зав склад";
    }
}
/**детали о пользователе */
async function openUserDetail(id){
    if(!document.getElementById('userDetailId')){
         if (document.getElementById('delUserFormId')){
            return;
         }
        let response = await fetch ('/users/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        });
        let result = await response.json();
        let html = `<div id="userDetailIdHeader" class="userDetailHeader"></div><div class="userDetailInfo"><div class="column"><label for="username">Имя пользователя</label><br><label for="office">Офис</label><br><label for="role">Должность</label><br><label for="setpswrd">Сменить пароль</label></div><div class="column"><input type="Text" name="username" id="username" class="noselectable" value="${result[0].username}" readonly="true"><br><input type="Text" name="office" id="office" value="${result[0].office}"><br><select name="Role" id="selectId"><br><option value="1">Инженер</option><option value="2">Менеджер</option><option value="3">Администратор</option><option value="4">Зав склад</option><input type="button" name="setpswrd" id="newpassId" onclick="setPass(${result[0].id})" value="Новый пароль"></div></div><div class="userDetailSubButtons"><input type="button" class="submitButton" onclick="saveUserInfo(${result[0].id})" value="Сохранить"><input type="button" class="submitButton" onclick="cancelForm('userDetailId')" value="Отмена"></div>`;
        let form = document.createElement('form');
        form.id = "userDetailId"
        form.className = "userDetailForm";
        form.innerHTML = html;
        document.body.append(form);
        let selected = document.getElementById('selectId').getElementsByTagName('option');
        for(let a=0;a<selected.length;a++){
            if(selected[a].value == result[0].roleid) selected[a].selected = true;
        }
        dragElement(document.getElementById("userDetailId"));
    }
}
/**форма нового пароля */
function setPass(id){
    if (!document.getElementById('formNewPassId')){
        let html = `<div><label for="newPass">Новый пароль</label><input type="text" id="newPass" name="newPass"></div><div><label for="confPass">Подтвердите пароль</label><input type="text" id="confPass" name="confPass"></div><div class="submitBtns"><input type="button" onclick="saveNewPass(${id})" value="Сохранить"><input type="button" onclick="cancelForm('formNewPassId')" value="Отменить"></div>`;
        let form = document.createElement('form');
        form.id = "formNewPassId";
        form.className = "userDetailForm";
        form.innerHTML = html;
        document.body.append(form);
    }
}    
/**проверка введенных паролей */
function checkCorrectPass(){
    let pass = document.getElementById('newPass');
    let cnfpass = document.getElementById('confPass');
    if (!pass.value || pass.value.length<8){
        pass.value = "";
        pass.style.backgroundColor = "#FFC0CB";
        pass.placeholder = "пароль >8 символов"
    }else if (pass.value != cnfpass.value){
        pass.value = "";
        cnfpass.value = "";
        pass.style.backgroundColor = "#FFC0CB";
        cnfpass.style.backgroundColor = "#FFC0CB";
        pass.placeholder = "разные пароли";
    }else{
        return true;
    }
}
/**Сохранение нового пароля */
async function saveNewPass(id){
    if(checkCorrectPass()){
        let form = document.getElementById('formNewPassId');
        let data = {
            'password': `${form.elements.newPass.value}`, 
            'id': `${id}`
        }
        await fetch ('/setpassuser', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
        body: JSON.stringify(data),
        });
        cancelForm('formNewPassId');
    };
}
/**схоранить детали пользователя */
async function saveUserInfo(id){
    let form = document.getElementById('userDetailId');
    let data = [form.elements.office.value, form.elements.selectId.value, id];
    await fetch ('/users/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
    });
    cancelForm('userDetailId');
    getDataFromUsers();
}
/**обработчик кнопки Новый пользователь */   
function newUser(){
       let html = `<div id="newUserFormIdHeader" class="newUserFormHeader">Новый пользователь</div><div class="userDetailInfo"><div class="column"><label for="username">Имя пользователя</label><br><label for="password">Пароль</label><br><label for="role">Должность</label><br><label for="office">Офис</label><br></div><div class="column"><input type="text" id="username" name="username"><input type="text" id="password" name="password"><select id="role" name="role"><option value="user">Инженер</option><option value="moderator">Менеджер</option><option value="admin">Администратор</option><option value="werehouse">Зав склад</option><input type="text" id="office" name="office"></div></div><div class="userDetailSubButtons"><input type="button" onclick="saveNewUser()" value="Сохранить" class="submitButton"><input type="button" onclick="cancelForm('newUserFormId')" value="Отменить" class="submitButton"></div>`;
       let form = document.createElement('form');
       form.id = "newUserFormId";
       form.className = "userDetailForm";
       form.innerHTML = html;
       document.body.append(form);
       dragElement(document.getElementById("newUserFormId"));
       
}
   /**сохранение нового пользователя */
async function saveNewUser(){
    let form = document.getElementById('newUserFormId');
    if (!form.elements.password.value || form.elements.password.length <8){
        form.elements.password.value = "";
        form.elements.password.placeholder = "пароль < 8 символов";
        form.elements.password.style.backgroundColor = "#FFC0CB";
    }else{
        let data = {
            'username': form.elements.username.value,
            'password': form.elements.password.value,
            'office': form.elements.office.value,
            'roles': [form.elements.role.value],
            }
        let responce = await fetch ('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data),
        });
        let result = await responce.json();
        if (responce.status = 400){
            form.elements.username.value = "";
            form.elements.username.placeholder = result.message;
        }
        if (responce.status == 200){
            cancelForm('newUserFormId');
            getDataFromUsers();
        }
    }
}

   /**форма подтверждение на удаление пользователя */
function removeUser(id){
    if (!document.getElementById('delUserFormId')){
        let html = `<div id="delUserFormIdHeader" class="newUserFormHeader">Удаление пользователя</div><div class="userDetailInfo"><p>Вы уверены?</p></div><div class="userDetailSubButtons"><input type="button" class="submitButton" onclick="deleteUser(${id})" value="ДА!"><input type="button" class="submitButton" onclick="cancelForm('delUserFormId')" value="Отменить"></div>`;
        let form = document.createElement('form');
        form.id = "delUserFormId";
        form.className = "userDetailForm";
        form.innerHTML = html;
        document.body.append(form);
        dragElement(document.getElementById("delUserFormId"));
    }
}
   /**функция удаления пользователя */
async function deleteUser(id){
    await fetch ('/deluser/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({'id': id}),
    });
    cancelForm('delUserFormId');
    getDataFromUsers();
}
/**отмена форм param==form.id */
function cancelForm(id){
    document.getElementById(id).remove();
}
/**форма новой заявки */
function newTask(){
    if (!document.getElementById('newTaskId')){
        let html = `<div id="addNewTaskIdHeader" class="addNewTaskHeader"><a>Новая заявка</a></div><table class="addNewTask"><tbody><tr><td><a>ФИО</a></td><td><input type="text" id="name"></td></tr><tr><td><a>Телефон</a></td><td><input type="text" id="phone"></td></tr><tr><td><a>Адрес</a></td><td><input type="text" id="adress"></td></tr><tr><td colspan="2"><hr></td></tr><tr><td><a>Производитель</a></td><td><input type="text" id="vendor"></td></tr><tr><td><a>Модель</a></td><td><input type="text" id="model"></td></tr><tr><td><a>Серийный номер</a></td><td><input type="text" id="serial"></td></tr><tr><td><a>Дефект</a></td><td><input type="text" id="def"></td></tr><tr id="warrRowId"><td><a>Гарантия?</a></td><td><input type="checkbox" id="warranty" onclick="addPurchase()"></td></tr><tr><td><a>Нужна квитанция?</a></td><td><input type="checkbox" id="print" checked></td></tr></tbody></table><div class="newTaskSubButtons"><input type="button" class="submitButton" value="Cоздать" onclick="checkNewTask()"><input type="button" class="submitButton" value="Отмена" onclick="cancelForm('newTaskId')"></div>`;
        let form = document.createElement('form');
        form.id = "newTaskId";
        form.className = "newTaskForm";
        form.innerHTML = html;
        form.action = `javascript:checkNewTask()`;
        form.method = 'post';
        document.body.append(form);
        dragElement(document.getElementById("newTaskId"));
    }
}
/**дата покупки при выборе гарантии */
function addPurchase(){
    if (document.getElementById('warranty').checked){
        let tr = document.createElement('tr');
        tr.id = "purchaseRow"
        tr.innerHTML = `<td><a>Дата покупки</a></td><td><input type="date" id="datePurchase"></td>`;;
        let warrRow = document.getElementById('warrRowId');
        warrRow.before(tr);
        document.getElementById('datePurchase').max = new Date().toLocaleDateString('en-ca');
        }else{
        document.getElementById('purchaseRow').remove();
        
    }
    
}

/**проверка заполнености формы */
function checkNewTask(){
    let form = document.getElementById('newTaskId');
    let a = 0;
    if (!form.elements.name.value) {form.elements.name.style.backgroundColor = "#FFC0CB"; form.elements.name.placeholder = "ЗАПОЛНИТЕ ПОЛЕ!"; a++};
    if (!form.elements.phone.value) {form.elements.phone.style.backgroundColor = "#FFC0CB"; form.elements.phone.placeholder = "ЗАПОЛНИТЕ ПОЛЕ!"; a++};
    if (!form.elements.adress.value) {form.elements.adress.style.backgroundColor = "#FFC0CB"; form.elements.adress.placeholder = "ЗАПОЛНИТЕ ПОЛЕ!"; a++};
    if (!form.elements.vendor.value) {form.elements.vendor.style.backgroundColor = "#FFC0CB"; form.elements.vendor.placeholder = "ЗАПОЛНИТЕ ПОЛЕ!"; a++};
    if (!form.elements.model.value) {form.elements.model.style.backgroundColor = "#FFC0CB"; form.elements.model.placeholder = "ЗАПОЛНИТЕ ПОЛЕ!"; a++};
    if (!form.elements.serial.value) {form.elements.serial.style.backgroundColor = "#FFC0CB"; form.elements.serial.placeholder = "ЗАПОЛНИТЕ ПОЛЕ!"; a++};
    if (!form.elements.def.value) {form.elements.def.style.backgroundColor = "#FFC0CB"; form.elements.def.placeholder = "ЗАПОЛНИТЕ ПОЛЕ!"; a++};
    if (form.elements.warranty.checked){ if (!form.elements.datePurchase.value) {form.elements.datePurchase.style.backgroundColor = "#FFC0CB"; a++};};
    if (a==0){saveNewTask()};
}
/** сохранение новой заявки */
async function saveNewTask(){
    let form = document.getElementById('newTaskId');
    let purchase = "";
    if (form.elements.warranty.checked) {purchase = form.elements.datePurchase.value};
    let data = {
        'name': `${form.elements.name.value}`,
        'phone': `${form.elements.phone.value}`,
        'adress': `${form.elements.adress.value}`,
        'vendor': `${form.elements.vendor.value.toUpperCase()}`,
        'model': `${form.elements.model.value.toUpperCase()}`,
        'serial': `${form.elements.serial.value.toUpperCase()}`,
        'def': `${form.elements.def.value}`,
        'owner': `${sessionStorage.getItem('office')}`,
        'stat': 'def',
        'comm': '',
        'sum': '',
        'warr': form.elements.warranty.checked,
        'purchase': purchase,
        'compliteDate': '',
        'countOfprint': '',
    };
    let response = await fetch ('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
    });
    let result = await response.json();
    if (response.status == 200){
        if (form.elements.print.checked){ getKvit(result.insertId);};
        cancelForm('newTaskId');
        getDataFromTasks();
      }
}
/**получаем pdf квитанцию */
async function getKvit(id){
    let res = await fetch('/print/kvit/' + id, {
        method: 'GET',
        headers: {
          'responseType': 'blob'
        } 
      })
    let pdf = await res.blob();
    let pdfObj = URL.createObjectURL(pdf);
    window.open(pdfObj);
}

/** создание таблицы заявок*/ 
function createTableOfTasks(){
    if (!document.getElementById('tasksTable')){
        let html = '<table><col class="tasks_col_1"><col class="tasks_col_2"><col class="tasks_col_3"><col class="tasks_col_4"><col class="tasks_col_5"><col class="tasks_col_6"><col class="tasks_col_7"><col class="tasks_col_8"><col class="tasks_col_9"><col class="tasks_col_10"><col class="tasks_col_11"><col class="tasks_col_12"><col class="tasks_col_13"><col class="tasks_col_14"><thead><th>№</th><th>Дата</th><th>ФИО</th><th>Телефон</th><th>Адрес</th><th>Производитель</th><th>Модель</th><th>Серийный номер</th><th>Дефект</th><th>Менеджер</th><th>Статус</th><th>Комент</th><th>Сумма</th><th>Отпечатки</th></thead><tbody id="tasksTableBody"></tbody></table>';
        let table = document.createElement('table');
        table.className = "taskstable";
        table.id = "tasksTable";
        table.innerHTML = html;
        document.body.append(table);
    }    
}
/** заполнение таблицы с заявками */
async function getDataFromTasks(){
    let temp = "";
    let tmp = "";
    let table = document.getElementById("tasksTableBody");
    let response = await fetch ('/tasks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    });
    let result = await response.json();
    /** приводим дату/время в нормальный вид */
    for(let i=0; i < result.length; i++) {
        tmp = result[i].date.slice(8, 10) + '.' + result[i].date.slice(5, 7) + '.' + result[i].date.slice(0, 4) + ' ' + result[i].date.slice(11, 16);
        result[i].date = tmp;
    }
    /**заполняем таблицу */
    for(let i=0; i < result.length; i++) {
        temp += "<tr id='" + result[i].numb + "' onClick='detailTask(" + result[i].numb +", " + result[i].warr + ")' title='" + setTitle(result[i].warr) + "'><td bgcolor='" + selectColor(result[i].warr) + "'>" + result[i].numb + "<\/td><td>" + result[i].date + "<\/td><td>" + result[i].name + "<\/td><td>" + result[i].phone + "<\/td><td>" + result[i].adress + "<\/td><td>" + result[i].vendor + "<\/td><td>" + result[i].model + "<\/td><td>" + result[i].serial + "<\/td><td>" + result[i].def + "<\/td><td>" + result[i].owner + "<\/td><td>" + selectStatus(result[i].stat) + "<\/td><td>" + result[i].comm + "<\/td><td>" + result[i].sum + "<\/td><td>" + result[i].countOfPrint + "<\/td><\/tr>";
    }
    table.innerHTML = temp;
    hideColumn();
    
}
/**отключение видимост стоблцов на примере ОТПЕЧАТКИ*/
function hideColumn(){
    let th = document.getElementById('tasksTable').querySelectorAll('th')
    th[13].style.display = "none";

    let tr = document.getElementById('tasksTableBody').querySelectorAll('tr');
     for(let i=0;i<tr.length;i++){
         let td = tr[i].querySelectorAll('td');
            td[13].style.display = "none";
     }
}
/**изменяем цвет фона гарантийных заявок */
function selectColor(warr){
    if (warr) {return "#3CB371"} else {return "#AFCDE7"};
}
/**подсказка при наведении на номер заявки гарантийный/платный */
function setTitle(warr){
    if (warr) {return "гарантийный ремонт"} else {return "платный ремонт"};
}
  /**изменяем значение стат понятное для пользователя */
function selectStatus(val){
    switch(val){
        case "def": return "Дефектация";
        case "complite": return "Ремонт выполнен";
        case "waiting": return "Ожидание запчастей";
        case "needcall": return "Согласовать с клиентом";
        case "act": return "АКТ дефектации";
        case "closed": return "Техника у клиента";
    }
}
/**получаем информацию о заявке */
function detailTask(id, warr){
    if(!document.getElementById('detailTaskFormId')){
        let tr = document.getElementById(id);
        let htmlForPay = `<div id="detailTaskFormIdHeader" class="detailTaskFormIdHeader"><a>№${tr.cells[0].innerHTML} от ${tr.cells[1].innerHTML}</a></div><div class="detailTaskInfo"  id="detailTaskTbody"> <div class="printMenuButton"><img src="/images/printer.png" onclick="printMenu(${id})"><div class="printOptions" id ="printOptions" style="display: none;"><div onclick="getKvit(${id})"><a>Квитанция</a></div></div></div><table> <tbody> <tr> <td width="33%"><a>${tr.cells[5].innerHTML}</a></td> <td width="33%"><a>${tr.cells[6].innerHTML}</a></td> <td width="33%"><a>${tr.cells[7].innerHTML}</a></td> </tr> <tr><td colspan="3"><a>${tr.cells[8].innerHTML}</a></td> </tr> <tr><td colspan="3"><hr></td></tr> <tr> <td rowspan="3" width="50%"><label for="comm">Выполненные работы</label><textarea placeholder="Какие работы были выполнены, или любые другие комментарии" id="whatWasDoneId" name="comm">${tr.cells[11].innerHTML}</textarea> </td> <td><a>Статус</a></td> <td><select id="selStatusId" value="${tr.cells[10].innerHTML}"><option value="def">Дефектация</option><option value="complite">Ремонт выполнен</option><option value="waiting">Ожидание запчастей</option><option value="needcall">Согласовать с клиентом</option><option value="act">АКТ дефектации</option><option value="closed">Техника у клиента</option></select></td> </tr> <tr><td><lable for="countOfPrint">Кол-во отпечатков</lable></td><td><input type="number" id="countOfPrint" min="0" value="${tr.cells[13].innerHTML}"></td></tr><tr id="lastRow"> <td><a>Сумма</a></td> <td><input type="text" id="sumId" value="${tr.cells[12].innerHTML}"></td> </tr></tbody> </table> </div><div class="detailTaskSubButtons"><input type="button" value="Сохранить" onClick ="saveDetailTask(${id},${warr})" class="submitButton"><input type="button" value="Отмена" onClick="cancelForm('detailTaskFormId')" class="submitButton"></div>`;
        let htmlForWarr = `<div id="detailTaskFormIdHeader" class="detailTaskFormIdHeader"><a>№${tr.cells[0].innerHTML} от ${tr.cells[1].innerHTML}</a></div><div class="detailTaskInfo"  id="detailTaskTbody"><div class="printMenuButton"><img src="/images/printer.png" onclick="printMenu(${id})"><div class="printOptions" id ="printOptions" style="display: none;"><div onclick="getKvit(${id})"><a>Квитанция</a></div><div onclick="checkTypeOfWork(${id})"><a>АКТ выполненных работ</a></div><div><a>АКТ дефектации</a></div></div></div> <table> <tbody> <tr> <td width="33%"><a>${tr.cells[5].innerHTML}</a></td> <td width="33%"><a>${tr.cells[6].innerHTML}</a></td> <td width="33%"><a>${tr.cells[7].innerHTML}</a></td> </tr> <tr><td colspan="3"><a>${tr.cells[8].innerHTML}</a></td> </tr> <tr><td colspan="3"><hr></td></tr> <tr> <td rowspan="3" width="50%"><label for="comm">Выявленный дефект</label><textarea placeholder="Вывленный дефект в результате диагностики" id="whatWasDoneId" name="comm">${tr.cells[11].innerHTML}</textarea> </td> <td><a>Статус</a></td> <td><select id="selStatusId" value="${tr.cells[10].innerHTML}"><option value="def">Дефектация</option><option value="complite">Ремонт выполнен</option><option value="waiting">Ожидание запчастей</option><option value="needcall">Согласовать с клиентом</option><option value="act">АКТ дефектации</option><option value="closed">Техника у клиента</option></select></td> </tr> <tr><td><lable for="countOfPrint">Кол-во отпечатков</lable></td><td><input type="number" id="countOfPrint" min="0" value="${tr.cells[13].innerHTML}"></td></tr> <tr id="lastRow"> <td><a>Статус заказа</a></td> <td><input type="text" id="orderStatus" value="" readonly="true"></td> </tr></tbody> </table> </div><div class="detailTaskSubButtons"><input type="button" value="Сохранить" onClick ="saveDetailTask(${id},${warr})" class="submitButton"><input type="button" value="Отмена" onClick="cancelForm('detailTaskFormId')" class="submitButton"></div>`;
        let detailTaskForm = document.createElement('form');
        detailTaskForm.id = "detailTaskFormId";
        detailTaskForm.className = "detailTaskForm";
        if (warr) {
            detailTaskForm.innerHTML = htmlForWarr;
        }else{
            detailTaskForm.innerHTML = htmlForPay;
        }        
        detailTaskForm.action = `javascript:saveDetailTask(${id})`;
        detailTaskForm.method = 'post';
        document.body.append(detailTaskForm);
/**выбор селектора "статус" согласно значению из таблицы */
        let selected = document.getElementById('selStatusId').getElementsByTagName('option');
        for(let a=0;a<selected.length;a++){
            if(selected[a].text == tr.cells[10].innerHTML) selected[a].selected = true;
        }
        if (warr){ 
            addPartField(id);
                   
        }
        dragElement(document.getElementById("detailTaskFormId"));
    }
}
/**получаем данные о запчастях в гарантийной заявке */
async function getDataPartsFromTask(id){
    let response = await fetch ('/orders/task/' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        });
    let result = await response.json();
    let orderStatus = document.getElementById('orderStatus');
    //console.log(result);
    if(result.length>0 && Object.keys(result[0].content).length>0){
        switch (result[0].status){
            case 1: orderStatus.value = "В обработке"; orderStatus.style.backgroundColor = "#FFFACD"; orderStatus.setAttribute('disabled', true); break
            case 2: orderStatus.value = "Выдать со склада"; orderStatus.style.backgroundColor = "#90EE90"; orderStatus.setAttribute('disabled', true); break
            case 3: orderStatus.value = "Заказан у поставщика"; orderStatus.style.backgroundColor = "#F0FFF0"; orderStatus.setAttribute('disabled', true); break
            case 4: orderStatus.value = "Отменен"; orderStatus.style.backgroundColor = "#FF6347"; orderStatus.setAttribute('disabled', true); break
        };
        let parts = [];
        parts = Object.entries(result[0].content);
             for(let i=0;i<parts.length;i++){
                addNewRow(i, parts[i][0], parts[i][1]);
                getInfoParts(parts[i][0], 'lable'+i);
             };
         if(result[0].status == 2 || result[0].status == 3){
             let inputs = document.getElementById('addPartNumberId').querySelectorAll('input');
             for(i=0;i<inputs.length;i++){
                 inputs[i].readOnly = true;
                 inputs[i].style.color = "#C0C0C0";
                 inputs[i].setAttribute ('onClick', '');
             }
         
        }
            
    }else{
        orderStatus.value = "Заказов не было"; orderStatus.style.backgroundColor = "#F5F5F5"; orderStatus.setAttribute('disabled', true);
        addNewRow(0, "", 1);
    }
}
/**получаем название запчасти по партномеру */
async function getInfoParts(pnumber, id){
    pnumber = String(pnumber).trim();
    if(pnumber.length>0){
        let response = await fetch ('/orders/info/' + pnumber, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
                },
            });
        let result = await response.json();
        let shortId = id.slice(0, 5);
        if (result.length > 0){
            if (shortId == 'input'){
                document.getElementById(id).value = result[0].description;
            }else{
                document.getElementById(id).innerHTML = result[0].description;
            };

        }else{

            document.getElementById(id).innerHTML = "Некорректный партномер!"
        }
    }    
}

/**рисуем таблицу для запчстей */
function addPartField(id){
    let lastRow = document.getElementById('detailTaskTbody');
    let table = document.createElement('table');
    table.className = "addPartNumber";
    table.id = "addPartNumberId";
    table.innerHTML = `<table><col class="part_col_1"><col class="part_col_2"><col class="part_col_3"><col class="part_col_4"><thead><td width="20px"></td><td>Партномер</td><td>Кол-во</td><td>Название</td></thead><tbody id="addPartNumberBody"></tbody></table>`;
    lastRow.append(table);
    getDataPartsFromTask(id);
    
}
/**новая строка для запчастей */
function addNewRow(i, partNumber, count){
    if (partNumber == undefined) partNumber = "";
    if (count == undefined) count = "1";
    let tbody = document.getElementById('addPartNumberBody');
    let tr = document.createElement('tr');
    tr.id = 'firstRow' + i;
    tr.innerHTML = `<td><input type="button" value="+" id="addPartButton` + i + `" onclick="addNewRow(`+ (i+1) +`)"></td><td><input type="text" value="`+ partNumber +`" id="partNumber` + i + `" placeholder="Введите партномер"></td><td><input type="number" value="`+ count +`" id="count` + i + `" min="1" class="count"></td><td><label id="lable` + i +`" class="partLable"></label></td>`;
    tbody.append(tr);
    document.getElementById('partNumber' + i).addEventListener('blur', function() {getInfoParts(this.value, "lable" + i)});
    if (i>0){
        document.getElementById('addPartButton' + (i-1)).value = "-";
        document.getElementById('addPartButton' + (i-1)).setAttribute('onclick', "javascript:cancelForm('firstRow"+ (i-1) +"')");
    }
    
   
}
/**сохраняем запчасти*/
async function savePartsForTask(id){
    let dataObj = new Object();
    let table = document.getElementById('addPartNumberId');
    let rows = table.querySelectorAll('tr');

        for(let i=1;i<rows.length;i++){
            let inputs = rows[i].querySelectorAll('input');
           // console.log(inputs);
            if(inputs[1].value.trim().length>0){dataObj[inputs[1].value.trim()] = inputs[2].value};
        }
    
        let responce = await fetch ('/orders/new/'+ id, {
            method: 'POST',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(dataObj),
            });
    
    
}

/**сохраняем измененную заявку */
async function saveDetailTask(id, warr){
    let data = [];
    if(warr){
        savePartsForTask(id);
        data = [document.getElementById('selStatusId').value, document.getElementById('whatWasDoneId').value, '', document.getElementById('countOfPrint').value, id];
    }else{
        data = [document.getElementById('selStatusId').value, document.getElementById('whatWasDoneId').value, document.getElementById('sumId').value, document.getElementById('countOfPrint').value, id];
    };
    let responce = await fetch ('/tasks/'+ id, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
    });
    let result = await responce.json();
    if (responce.status == 200){
        cancelForm('detailTaskFormId');
        getDataFromTasks();
    }
    
}
/**нажатие кнопки меню печати */
function printMenu(id){
    let options = document.getElementById('printOptions')
    if (options.style.display == "none") {
        options.style.display = "block";
    }else{
        options.style.display = "none";
    }
}
/**проверка выполненных работ для АКТа */
function checkTypeOfWork(id){
    let html = `<div class="checkTypeOfWorkHeader" id="checkTypeOfWorkIdHeader"></div><div class="checkTypeOfWorkInfo"><p>Заполните поля выполненных работ</p><table><thead><tr><td width="120px">Партномер</td><td>Наименование</td><td width="250px">Выполненные работы</td><td width="45px">Код услуги</td></tr></thead><tbody id="typeOfWorkBody"></tbody></table></div><div class="typeOfWorksubButtons"><input type="button" value="Печать" onClick ="getACTofComplite(${id})" class="submitButton"><input type="button" value="Отмена" onClick="cancelForm('checkTypeOfWorkId')" class="submitButton"></div>`;
    let form = document.createElement('form');
    form.id = "checkTypeOfWorkId";
    form.className = "checkTypeOfWork";
    form.innerHTML = html;
    document.body.append(form);
    dragElement(document.getElementById("checkTypeOfWorkId"));
   
    let table = document.getElementById('addPartNumberBody');
    let trs = table.querySelectorAll('tr');
        for(let i=0;i<trs.length;i++){
            createRowForWorks(i, document.getElementById('lable'+i).innerText, document.getElementById('partNumber'+i).value);            
        }
}
/**рисуем строку для ВЫПОЛНЕННЫХ РАБОТ */
function createRowForWorks(i, desc, pnumber){
    let tbody = document.getElementById('typeOfWorkBody');
    let tr = document.createElement('tr');
    tr.id = 'workRow' + i;
    tr.innerHTML = '<td><label id="labelpart' + i +'">'+ pnumber +'</label></td><td><label id="labelname' + i +'">'+ desc +'</label></td><td><input type="text" width="250px" value="" id="typeWork'+ i +'"></td><td ><select id="selType' + i +'"><option value="0">REP</option><option value="1">PRPH</option></td>';
    tbody.append(tr);
    getWorks(pnumber, 'typeWork' + i, 'selType' + i);
}
/**проверка на наличие сохраненных работ */
async function getWorks(pnumber, idInput, idSel){
    let selected = document.getElementById(idSel).getElementsByTagName('option');
    if(pnumber.length>0){
        let response = await fetch ('/orders/typeofwork/' + pnumber, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
                },
            });
        let result = await response.json();
        console.log(result);
        if (result.length > 0){
            document.getElementById(idInput).value = result[0].typeOfWork;
            if (result[0].selType == 1) selected[1].selected = true;
            if (result[0].selType == 0) selected[0].selected = true;
        }else{
            document.getElementById(idInput).value = ""
        }
    }    
}
/**сохраняем тип работ */
async function saveTypeOfWork(){
    let dataAll = [];
    let data = [];
    let tr = document.getElementById('typeOfWorkBody').querySelectorAll('tr');
        for(let i=0;i<tr.length;i++){
            data = [document.getElementById("labelpart" + i).innerText, document.getElementById('typeWork' + i).value, document.getElementById('selType' + i).value];
            dataAll.push(data);
        }
    let response = await fetch ('/orders/typeofwork', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json;charset=utf-8'
        },
            body: JSON.stringify(dataAll),
        });

}
/**получаем АКТ выполненных работ */
async function getACTofComplite(id){
    saveTypeOfWork();

    let res = await fetch('/print/avr/' + id, {
        method: 'GET',
        headers: {
          'responseType': 'blob'
        } 
      })
    let pdf = await res.blob();
    let pdfObj = URL.createObjectURL(pdf);
    window.open(pdfObj);
}
/**таблица списка наличия товаров на складе */
function listWerehouse(){
    addTopButtons();
    addButton('findPartButton', '?', findPart);
    createTableOfWerehouse(1);
    getDataToWerehouseTable(1);
}
/**таблица списка приходов на склад */
function arrivalToWerehouse(){
    addTopButtons();
    addButton('addToButton', '+', addTo);
    createTableOfWerehouse(2);
    getDataToWerehouseTable(2);
}
/**таблица списаний со склада */
function writeOffFromWerehouse(){
    addTopButtons();
    addButton('writeOffButton', '+', writeOff);
    createTableOfWerehouse(3);
    getDataToWerehouseTable(3);
}
/**поиск детали */
function findPart(){

}
/** добавление на склад */
function addTo(){
    if (!document.getElementById('addToId')){
        let form = document.createElement('form');
        form.id = 'addToId';
        form.className = 'addTo';
        form.innerHTML = `<div id="addToIdHeader" class="addToHeader">ПОПОЛНЕНИЕ склада</div><div id="addToContent" class="addToContent"><select id="fromWho"><option value="0">Покупка</option><option value="1">EPSON</option></select><table><thead><tr><td></td><td>Партномер</td><td>Описание</td><td>Количество</td><td>Цена</td></tr></thead><tbody id="addToBody"></tbody></table></div><div class="addToSubButtons"><input type="button" class="submitButton" onclick="saveAddTo()" value="Сохранить"><input type="button" class="submitButton" onclick="cancelForm('addToId')" value="Отмена"></div>`;
        document.body.append(form);
        addRowForWerehouse(0);
        dragElement(document.getElementById(form.id));
    }
}
/**списание со склада */
function writeOff(){
    if (!document.getElementById('writeOffId')){
        let form = document.createElement('form');
        form.id = 'writeOffId';
        form.className = 'writeOff';
        form.innerHTML = `<div id="writeOffIdHeader" class="writeOffHeader">СПИСАНИЕ со склада</div><div id="writeOffContent" class="writeOffContent"><select id="type"><option value="0">Гарантийный ремонт</option><option value="1">Продажа</option><option value="2">Списание</option></select><input type="number" min="1" id="taskNumber" placeholder="№ заявки"><input type="text" id="where" placeholder="ФИО инженера"><table><thead><tr><td></td><td>Партномер</td><td>Описание</td><td>Наличие</td><td>Количество</td><td width="20px">Мин цена</td><td>Цена</td></tr></thead><tbody id="writeOffBody"></tbody></table></div><div class="writeOffSubButtons"><input type="button" class="submitButton" onclick="checkWriteOff()" value="Сохранить"><input type="button" class="submitButton" onclick="cancelForm('writeOffId')" value="Отмена"></div>`;
        document.body.append(form);
        writeOffRowForWerehouse(0);
        dragElement(document.getElementById(form.id));

        let selector = document.getElementById('type');
        selector.addEventListener('change', (event) =>{
            switch (selector.value) {
                case '0': document.getElementById('taskNumber').style.display = 'inline'; document.getElementById('where').placeholder = "ФИО инженера"; break;
                case '1': document.getElementById('taskNumber').style.display = 'none'; document.getElementById('taskNumber').value = ''; document.getElementById('where').placeholder = "ФИО получателя"; break;
                case '2': document.getElementById('taskNumber').style.display = 'none'; document.getElementById('taskNumber').value = ''; document.getElementById('where').placeholder = "ФИО ответственного"; break;
            };
        });

    }
}
/**сохранение формы пополнения склада */
async function saveAddTo(){
    let dataObj = {
        'fromWho': document.getElementById('fromWho').value,
        'partsCount': 0,
        'sum': 0,
        'content': '',
    };
    
    let trs = document.getElementById('addToBody').querySelectorAll('tr')
        for(let i=0;i<trs.length;i++){
            let inputs = trs[i].querySelectorAll('input');
            if (inputs[1].value.trim().length > 1){
                dataObj.partsCount += inputs[3].valueAsNumber;
                dataObj.sum += ((inputs[4].valueAsNumber * 100) * inputs[3].valueAsNumber) / 100;
                dataObj.content += inputs[1].value + '$'+ inputs[2].value + '$'+ inputs[3].valueAsNumber + '$' + inputs[4].valueAsNumber + '@';
            };
    }
    dataObj.content = dataObj.content.slice(0, -1);
    let responce = await fetch ('/arrival/new/', {
        method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(dataObj),
        });
    let result = await responce.json();
    if (responce.status == 200){
        arrivalToWerehouse();
      }
}
/**проверка заполнености формы списания со склада */
function checkWriteOff(){
    let form = document.getElementById('writeOffId');
    let selector = document.getElementById('type');
    let objData = {
        'type': `${selector.value}`,
        'taskNumber': 0,
        'where': '',
        'partsCount': 0,
        'sum': 0,
        'content': '',
    };
    if (selector.value == 0){
        if (form.elements.taskNumber.value.length > 0){
            objData.taskNumber = form.elements.taskNumber.valueAsNumber;
            form.elements.taskNumber.style.backgroundColor = "";
        }else{            
            form.elements.taskNumber.style.backgroundColor = "red";
            return;
        }
    }else{
        objData.taskNumber = null;
    }

    if(form.elements.where.value.length > 0){
        objData.where = form.elements.where.value;
        form.elements.where.style.backgroundColor = "";
    }else{
        form.elements.where.style.backgroundColor = "red";
        return;
    }

    let trs = document.getElementById('writeOffBody').querySelectorAll('tr');
    for(let i=0;i<trs.length;i++){
        let inputs = trs[i].querySelectorAll('input');
        
            if (inputs[1].value.trim().length > 1){
                if (parseFloat(inputs[4].value) <= parseFloat(inputs[3].value) && parseFloat(inputs[6].value) >= parseFloat(inputs[5].value)){
                objData.content += inputs[1].value + '$'+ inputs[2].value + '$'+ inputs[4].valueAsNumber + '$' + parseFloat(inputs[6].value) + '@';
                objData.partsCount += inputs[4].valueAsNumber;
                objData.sum += ((inputs[6].valueAsNumber * 100) * inputs[4].valueAsNumber) / 100;
                } else {
                    if(parseFloat(inputs[4].value) > parseFloat(inputs[3].value)) {
                    inputs[4].style.backgroundColor = "red";
                    }
                    if(parseFloat(inputs[6].value) < parseFloat(inputs[5].value)) {
                    inputs[6].style.backgroundColor = "red";
                    }
                return;
                }   
            } 
    }
    objData.content = objData.content.slice(0, -1);
    saveWriteOff(objData);

}

/**сохранение СПИСАНИЕ со склада */
async function saveWriteOff(objData){
    let responce = await fetch ('/writeoff/new/', {
        method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(objData),
        });
    await responce.json();
    if (responce.status == 200){
        writeOffFromWerehouse();
      }
}
/**строка для СПИСАНИЕ СО СКЛАДА */
function writeOffRowForWerehouse(i){
    let tbody = document.getElementById('writeOffBody');
    let row = document.createElement('tr');
    row.id = "rowWerehouse" + i;
    row.innerHTML = `<td><input type="button" id="addRowButton`+ i +`" onclick="writeOffRowForWerehouse(${i+1})" value="+"></td><td><input type="text" id="inputPartNumber`+ i +`"></td><td><input type="text" id="inputDescription`+i+`" readonly></td><td><input type="text" id="available`+i+`" class="helpFields" readonly></td><td><input type="number" id="inputCount`+ i +`" min="1" value="1"></td><td><input type="text" id="minPrice`+i+`" class="helpFields" readonly></td><td><input type="number" id="inputPrice`+ i +`" min="0" value="0" step="0.01"></td>`;
    tbody.append(row);
    document.getElementById('inputCount' + i).addEventListener('change', function() {if (parseFloat(document.getElementById('available' + i).value) < parseFloat(this.value)) {this.style.backgroundColor = "red"; this.style.color = "white";}else{this.style.backgroundColor = ""; this.style.color = ""}});
    document.getElementById('inputPrice' + i).addEventListener('change', function() {if (parseFloat(document.getElementById('minPrice' + i).value) > parseFloat(this.value)) {this.style.backgroundColor = "red"; this.style.color = "white";}else{this.style.backgroundColor = ""; this.style.color = ""}});
    document.getElementById('inputPartNumber' + i).addEventListener('blur', function() {getAvailable(this.value, "inputDescription" + i, "available" + i, "minPrice" + i)});
    if (i>0) {
        document.getElementById('addRowButton' + (i-1)).value = "-";
        document.getElementById('addRowButton' + (i-1)).setAttribute('onclick', 'javascript:cancelForm("rowWerehouse'+ (i-1) +'")');
        document.getElementById('writeOffContent').scrollTop = document.getElementById('writeOffContent').scrollHeight;
    };
}
/**проверка наличия на складе
 * pnumber = партномер детали
 * idDesc = id поля описание
 * idCount = id поля наличие на складе
 * idMinPrice = id поля минимальная цена
 */
async function getAvailable(pnumber, idDesc, idCount, idMinPrice){
    pnumber = String(pnumber).trim();
    if(pnumber.length>0){
        let response = await fetch ('/availablity/info/' + pnumber, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
                },
            });
        let result = await response.json();
        if (result.length > 0){
                document.getElementById(idDesc).value = result[0].description;
                document.getElementById(idCount).value = result[0].count;
                document.getElementById(idMinPrice).value = result[0].sellprice;
        }else{
                document.getElementById(idDesc).value = "НЕТ В НАЛИЧИИ";
                document.getElementById(idCount).value = "";
                document.getElementById(idMinPrice).value = "";
        }
    }    

}
/**строка партномер, описание, количество, цена ПОЛОЛНЕНИЕ СКЛАДА*/
function addRowForWerehouse(i){
    let tbody = document.getElementById('addToBody');
    let row = document.createElement('tr');
    row.id = "rowWerehouse" + i;
    row.innerHTML = `<td><input type="button" id="addRowButton`+ i +`" onclick="addRowForWerehouse(${i+1})" value="+"></td><td><input type="text" id="inputPartNumber`+ i +`"></td><td><input type="text" id="inputDescription`+i+`"></td><td><input type="number" id="inputCount`+ i +`" min="1" value="1"></td><td><input type="number" id="inputPrice`+ i +`" min="0" value="0"></td>`;
    tbody.append(row);
    document.getElementById('inputPartNumber' + i).addEventListener('blur', function() {getInfoParts(this.value, "inputDescription" + i)});
    if (i>0) {
        document.getElementById('addRowButton' + (i-1)).value = "-";
        document.getElementById('addRowButton' + (i-1)).setAttribute('onclick', 'javascript:cancelForm("rowWerehouse'+ (i-1) +'")');
        document.getElementById('addToContent').scrollTop = document.getElementById('addToContent').scrollHeight;
    };
}
/**таблица наличие на складе */
function createTableOfWerehouse(type){
let listHtml = `<table><col class="col-list1"><col class="col-list2"><col class="col-list3"><col class="col-list4"><thead><tr><th></th><th>Партномер</th><th>Описание</th><th>Количество</th><th>Приходная цена</th></tr></thead><tbody id="werehouseTbody"></tbody></table>`;
let arrivalHtml = `<table><col class="col-arrival1"><col class="col-arrival2"><col class="col-arrival3"><col class="col-arrival4"><col class="col-arrival5"><col class="col-arrival6"> <thead><tr><th>№</th><th>Дата</th><th>От кого</th><th>Общее кол-во</th><th>Общая сумма</th><th>контент</th></tr></thead><tbody id="werehouseTbody"></tbody></table>`;
let writeOffHtml = `<table><col class="col-writeOff1"><col class="col-writeOff2"><col class="col-writeOff3"><col class="col-writeOff4"><col class="col-writeOff5"><col class="col-writeOff6"><col class="col-writeOff7"><col class="col-writeOff8"><thead><tr><th>№</th><th>Дата</th><th>Тип</th><th>Номер заявки</th><th>ФИО</th><th>Общее кол-во</th><th>Общая сумма</th><th>контент</th></tr></thead><tbody id="werehouseTbody"></tbody></table>`;
let html = "";
switch(type){
    case 1:  html = listHtml; break;
    case 2:  html = arrivalHtml; break;
    case 3:  html = writeOffHtml; break;
}
let table = document.createElement('table');
table.id = 'werehouseTableId';
table.className = 'werehouseTable';
table.innerHTML = html;
document.body.append(table);
 
}
/**прячем столб Content в werehouse*/
function hideColumnWerehouse(){
    let ths = document.getElementById('werehouseTableId').querySelectorAll('th');
    let trs = document.getElementById('werehouseTbody').querySelectorAll('tr');
    if (ths.length == 8){
        ths[7].style.display = "none";
        for(let i=0;i<trs.length;i++){
            let tds = trs[i].querySelectorAll('td');
            tds[7].style.display = "none";
        }
    }
    if (ths.length == 6){
        ths[5].style.display = "none";
        for(let i=0;i<trs.length;i++){
            let tds = trs[i].querySelectorAll('td');
            tds[5].style.display = "none";
        }
    }
}


/**получение данных в таблицу склада */
async function getDataToWerehouseTable(type){
    let url = "";
    let row = "";
    switch(type){
        case 1: url = '/availablity/'; break;
        case 2: url = '/arrival/';  break;
        case 3: url = '/writeoff/'; break;
    }
    let temp = "";
    let tmp = "";
    let table = document.getElementById("werehouseTbody");
    let response = await fetch (url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    });
    let result = await response.json();
    /** приводим дату/время в нормальный вид */
    if(type>1){
        for(let i=0; i < result.length; i++) {
            tmp = result[i].date.slice(8, 10) + '.' + result[i].date.slice(5, 7) + '.' + result[i].date.slice(0, 4) + ' ' + result[i].date.slice(11, 16);
            result[i].date = tmp;
        }
    }
    
    /**заполняем таблицу */
    for(let i=0; i < result.length; i++) {
        switch(type){
            case 1: row = "<tr id='" + result[i].partNumber + "' onClick='detailPartList(" + result[i].partNumber +")'><td></td><td>" + result[i].partNumber + "<\/td><td>" + result[i].description + "<\/td><td>" + result[i].count + "<\/td><td>" + result[i].price + "<\/td><\/tr>"; break;
            case 2: row = "<tr id='" + result[i].id + "' onClick='detailArrival(" + result[i].id +")'><td>" + result[i].id + "<\/td><td>" + result[i].date + "<\/td><td>" + setFromWho(result[i].fromWho) + "<\/td><td>" + result[i].partsCount + "<\/td><td>" + result[i].sum + "<\/td><td>" + result[i].content + "<\/td><\/tr>"; break;
            case 3: row = "<tr id='" + result[i].id + "' onClick='detailWriteOff(" + result[i].id +")'><td>" + result[i].id + "<\/td><td>" + result[i].date + "<\/td><td>" + setTypeWriteOff(result[i].type) + "<\/td><td>" + checkTaskNumber(result[i].taskNumber) + "<\/td><td>" + result[i].where + "<\/td><td>" + result[i].partsCount + "<\/td><td>" + result[i].sum + "<\/td><td>" + result[i].content + "<\/td><\/tr>"; break;
        }
        temp += row;
    }
    table.innerHTML = temp;
    hideColumnWerehouse();

}
/**селектор для поплнения склада */
function setFromWho(fromWho){
    if (fromWho == 0) return "Покупка";
    if (fromWho == 1) return "EPSON"
}
/**селектор для списания со склада */
function setTypeWriteOff(type){
    switch (type){
        case 0: return "Гарантийный ремонт";
        case 1: return "Продажа";
        case 2: return "Списание";
    }
}
/**убираем null из номера заявок */
function checkTaskNumber(taskNumber){
    if(taskNumber >= 1) {return taskNumber;} else {return ""}
}
/**детали по запчасти */
function detailPartList(id){

}
/**детали пополнения склада */
function detailArrival(id){

}
/**детали списания со склада */
function detailWriteOff(id){

}


/**перетаскивание объекта за header */
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "Header")) {
      document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }
  /**обработчик нажатия кнопки мыши */
    function dragMouseDown(e) {
      e = e || window.event;
      // записываем стартовые значения курсора мыши
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // вызов функции расчета координат курсора
      document.onmousemove = elementDrag;
    }
  /**расчет новых координат */
    function elementDrag(e) {
      e = e || window.event;
      // расчет позиции курсора
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // установка новой позиции
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  /**обработчик отжатия кнопки мыши */
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
