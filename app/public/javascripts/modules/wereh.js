/**СКЛАД */
/**создаем меню навигации по складу */
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
    document.getElementById('listWerehouseButton').innerHTML += "<span class='textInButton'>  Наличие на складе</span>"
    document.getElementById('arrivalToWerehouseButton').innerHTML += "<span class='textInButton'>  Пополнение склада</span>"
    document.getElementById('writeOffFromWerehouseButton').innerHTML += "<span class='textInButton'>  Списание со склада</span>"
}
/**таблица списка наличия товаров на складе */
function listWerehouse(){
    addTopButtons();
    addSerchBar();
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
        form.innerHTML = `<div id="writeOffIdHeader" class="writeOffHeader">СПИСАНИЕ со склада</div><div id="writeOffContent" class="writeOffContent"><select id="type"><option value="0">Гарантийный ремонт</option><option value="1">Продажа</option><option value="2">Списание</option></select><input type="number" min="1" id="taskNumber" placeholder="№ заявки"><input type="text" id="where" placeholder="ФИО инженера"><div class="sumAllDiv"><label>ИТОГО</label><input type="text" id="sumAll" readonly></div><table><thead><tr><td></td><td>Партномер</td><td>Описание</td><td>Наличие</td><td>Количество</td><td width="20px">Мин цена</td><td>Цена</td><td>Сумма</td></tr></thead><tbody id="writeOffBody"></tbody></table></div><div class="writeOffSubButtons"><input type="button" class="submitButton" onclick="checkWriteOff()" value="Сохранить"><input type="button" class="submitButton" onclick="cancelForm('writeOffId')" value="Отмена"></div>`;
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
            form.elements.taskNumber.style.outline = "";
        }else{            
            form.elements.taskNumber.style.outline = "2px solid red";
            return;
        }
    }else{
        objData.taskNumber = null;
    }

    if(form.elements.where.value.length > 0){
        objData.where = form.elements.where.value;
        form.elements.where.style.outline = "";
    }else{
        form.elements.where.style.outline = "2px solid red";
        return;
    }

    let trs = document.getElementById('writeOffBody').querySelectorAll('tr');
    for(let i=0;i<trs.length;i++){
        let inputs = trs[i].querySelectorAll('input');
            if(i==0 && i+1==trs.length && inputs[1].value.trim().length <= 1){
                inputs[1].style.outline = "2px solid red";
                return;
            }
        
            if (inputs[1].value.trim().length > 1){
                if (parseFloat(inputs[4].value) <= parseFloat(inputs[3].value) && parseFloat(inputs[6].value) >= parseFloat(inputs[5].value)){
                objData.content += inputs[1].value + '$'+ inputs[2].value + '$'+ inputs[4].valueAsNumber + '$' + parseFloat(inputs[6].value) + '@';
                objData.partsCount += inputs[4].valueAsNumber;
                objData.sum += ((inputs[6].valueAsNumber * 100) * inputs[4].valueAsNumber) / 100;
                } else {
                    if(parseFloat(inputs[4].value) > parseFloat(inputs[3].value)) {
                    inputs[4].style.outline = "2px solid red";
                    }
                    if(parseFloat(inputs[6].value) < parseFloat(inputs[5].value)) {
                    inputs[6].style.outline = "2px solid red";
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
    row.innerHTML = `<td><input type="button" id="addRowButton`+ i +`" onclick="writeOffRowForWerehouse(${i+1})" value="+"></td><td><input type="text" id="inputPartNumber`+ i +`"></td><td><input type="text" id="inputDescription`+i+`" readonly></td><td><input type="text" id="available`+i+`" class="helpFields" readonly></td><td><input type="number" class="shortFields" id="inputCount`+ i +`" min="1" value="1"></td><td><input type="text" id="minPrice`+i+`" class="helpFields" readonly></td><td><input type="number" class="shortFields" id="inputPrice`+ i +`" min="0" value="0" step="0.01"></td><td><input type="text" id="sumPrice`+i+`" class="helpFields" readonly></td>`;
    tbody.append(row);
    document.getElementById('inputCount' + i).addEventListener('change', function() {sumPrice('inputCount' + i, 'inputPrice' + i, 'sumPrice'+i); sumAllPrice(); if (parseFloat(document.getElementById('available' + i).value) < parseFloat(this.value)) {this.style.backgroundColor = "red"; this.style.color = "white";}else{this.style.backgroundColor = ""; this.style.color = ""}});
    document.getElementById('inputPrice' + i).addEventListener('change', function() {sumPrice('inputCount' + i, 'inputPrice' + i, 'sumPrice'+i); sumAllPrice(); if (parseFloat(document.getElementById('minPrice' + i).value) > parseFloat(this.value)) {this.style.backgroundColor = "red"; this.style.color = "white";}else{this.style.backgroundColor = ""; this.style.color = ""}});
    document.getElementById('inputPartNumber' + i).addEventListener('blur', function() {getAvailable(this.value, "inputDescription" + i, "available" + i, "minPrice" + i)});
    if (i>0) {
        document.getElementById('addRowButton' + (i-1)).value = "-";
        document.getElementById('addRowButton' + (i-1)).setAttribute('onclick', 'javascript:cancelForm("rowWerehouse'+ (i-1) +'")');
        document.getElementById('writeOffContent').scrollTop = document.getElementById('writeOffContent').scrollHeight;
    };
}
/**обработка суммы строки СПИСАНИЕ СО СКЛАДА*/
function sumPrice(inputCountId, inputPriceId, sumPriceId){
    document.getElementById(sumPriceId).value = (document.getElementById(inputCountId).valueAsNumber * document.getElementById(inputPriceId).valueAsNumber).toFixed(2);
   
}
/**сумма всех сумм СПИСАНИЕ СО СКЛАДА*/
function sumAllPrice(){
    let tmp = 0;
    let trs = document.getElementById('writeOffBody').querySelectorAll('tr');
    for(let i=0;i<trs.length;i++){
        let inputs = trs[i].querySelectorAll('input');
        if (inputs[7].value.length > 0) tmp += parseFloat(inputs[7].value);
    }
    document.getElementById('sumAll').value = tmp.toFixed(2);
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
                document.getElementById(idMinPrice).value = result[0].sellprice.toFixed(2);
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
    document.getElementById('inputPartNumber' + i).addEventListener('blur', function() {getInfoPartsWereh(this.value, "inputDescription" + i, "inputPrice" +i)});
    if (i>0) {
        document.getElementById('addRowButton' + (i-1)).value = "-";
        document.getElementById('addRowButton' + (i-1)).setAttribute('onclick', 'javascript:cancelForm("rowWerehouse'+ (i-1) +'")');
        document.getElementById('addToContent').scrollTop = document.getElementById('addToContent').scrollHeight;
    };
}
/**заполнение дескрипшона и цены при пополнении склада */
async function getInfoPartsWereh(pnumber, idDesc, idPrice){
    pnumber = String(pnumber).trim();
    if(pnumber.length>0){
        let response = await fetch ('/price/info/' + pnumber, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
                },
            });
        let result = await response.json();
         //   console.log(result[0]);
        if (result.length > 0){
                document.getElementById(idDesc).value = result[0].description;
                document.getElementById(idPrice).value = convert(result[0].price);
        }    
    }
}
/**конвертация цены */
function convert(price){
    let tmp = '';
    for(let i=0;i<price.length;i++){
        if (price[i] != ',') tmp += price[i];
        if (price[i] == ',') tmp += '.';
    }
    return tmp;
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
/**поиск детали */
function findPart(){
    let parts = document.getElementById('werehouseTbody').querySelectorAll('tr');
    let body = document.getElementById('inputSearchWereh').value;
    if(body.length>0){
        searchPlace();
        document.getElementById('searchIcon').className = 'bi bi-x-circle';
    }else{
        document.getElementById('searchIcon').className = 'bi bi-search';
        cancelSearch();
        
    }
    let tr = "";
    if(body.length>3){
        for(let i=0;i<parts.length;i++){
            let td = parts[i].querySelectorAll('td');
            if (td[1].innerText.toUpperCase().includes(body)){
                tr += "<tr><td>" + td[1].innerText + "</td><td>" + td[2].innerText + "</td><td>" + td[3].innerText + "</td></tr>";
               
            }
        }
        document.getElementById('searchTable').innerHTML = tr;
    }
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

/**поисковая панель */
function addSerchBar(){
    let searchBar = document.createElement('div');
    searchBar.className = "searchWereh";
    searchBar.id = "searchWereh";
    searchBar.innerHTML = `<input type="text" placeholder="Поиск по партномеру..." id="inputSearchWereh"></input><span class="searchIcon" onclick="cancelSearch()"><i id="searchIcon" class="bi bi-search"></i></span>`;
    document.body.append(searchBar);
    document.getElementById('inputSearchWereh').addEventListener('input', findPart);
}
/**отмена поиска */
function cancelSearch(){
    if (document.getElementById('searchPlace')){
        document.getElementById('searchIcon').className = 'bi bi-search';
        document.getElementById('inputSearchWereh').value = "";
        cancelForm('searchPlace');
    }
    
}
/**поле для результатов поиска */
function searchPlace(){
    if (!document.getElementById("searchPlace")){
        let place = document.createElement('div')
        place.className = "searchPlace";
        place.id = "searchPlace";
        place.innerHTML = `<table><thead><tr><th>Парт номер</th><th>Описание</th><th>Количество</th></tr></thead><tbody id="searchTable"></tbody></table>`;
        document.body.append(place);
    }
}