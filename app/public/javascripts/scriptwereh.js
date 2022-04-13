
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
/**страем все с документа и рисуем вверхние кнопки */
function addTopButtons(){
    let html = `<div class="topButtons"><button id="storeButton" class="button" onclick="storePage()">Система заказов</button><button id="werehButton" class="button" onclick="werehousePage()">Склад</button><button id="logOutButton" class="button" onclick="logOut()">Выход из системы</button><hr></div>`;
    document.body.innerHTML = "";
    document.body.innerHTML = html;
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
/**отмена форм param==form.id */
function cancelForm(id){
    document.getElementById(id).remove();
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
