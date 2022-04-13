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
/**обработка кнопки ОТЧЕТ */
function reportPage(){
    addTopButtons();
}
/**страем все с документа и рисуем вверхние кнопки */
function addTopButtons(){
    let html = `<div class="topButtons"><button id="tasksButton" class="button" onclick="tasksPage()">Система заявок</button><button id="storeButton" class="button" onclick="storePage()">Система заказов</button><button id="reportButton" class="button" onclick="reportPage()">Отчет</button><button id="logOutButton" class="button" onclick="logOut()">Выход из системы</button><hr></div>`;
    document.body.innerHTML = "";
    document.body.innerHTML = html;
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
    let response = await fetch ('/tasks/user/', {
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
    th[9].style.display = "none";

    let tr = document.getElementById('tasksTableBody').querySelectorAll('tr');
     for(let i=0;i<tr.length;i++){
         let td = tr[i].querySelectorAll('td');
            td[13].style.display = "none";
            td[9].style.display = "none";
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