/**автоматическое обновление данных в таблице при загрузке документа */
document.addEventListener("DOMContentLoaded", () => {
  addInfoToTable();
});

/** генерация уникальных имен */
function setName(name) {
    if (name === null) {
        name = 0;
    }else{
        name++;
    };    
    return name;
}
/** создание нового оповещения */
function newDiv (msg, col){
    name = setName(name);
    let div = document.createElement('div');
    let text = `Для вас сообщение № ${name}, нажмите для квитирования.`;
    div.id = "req" + name;
    let str = `<strong>ВНИМАНИЕ!</strong>`;
    div.className = "alert";
    switch (col) {
      case 'null':
        break;
      case 1: 
        div.style.backgroundColor = "#f0a0a0";
        break;
      case 2:
        div.style.backgroundColor = "#0044ff";
        break;
      default:
        div.style.backgroundColor = "#9bdba5";
        break;
    }    
    if (!msg){
      div.innerHTML = str + text;   
    }else{
      div.innerHTML = str + msg;
    }    
    document.body.append(div);
    setTimeout(remDivsInt, 3000, div.id);
        
}
/**атоматическое удалние дивов */
function remDivsInt(id){
  let rem = document.getElementById(id);
  rem.remove();
}
/* удаление всех оповещений */
function remDivs (){
    let divs = document.body.querySelectorAll('div.alert');
            for (let div of divs){
            div.remove();
     }
     name = 0;
}

/* создание новой формы, новая зявка */
function newForm(){
    if (!document.getElementById('addNewFormId')){
        let htmlform = '<form><div id="addNewFormIdHeader" class="addNewHeader"></div><div id="addNew1" class="form-text"><label class="lable-text" id="addNew2" for="name">ФИО</label><input type="text" class="input-text" id="addNew3" name="name"></div><div id="addNew4" class="form-text"><label class="lable-text" id="addNew5" for="phone">Телефон</label><input type="text" class="input-text" id="addNew6" name="phone"></div><div id="addNew7" class="form-text"><label class="lable-text" id="addNew8" for="adress">Адресс</label><input type="text" class="input-text" id="addNew9" name="adress"></div><hr class="line" id="addNew25"><div id="addNew10" class="form-text"><label class="lable-text" id="addNew11" for="vendor">Производитель</label><input type="text" class="input-text" id="addNew12" name="vendor"></div><div id="addNew13" class="form-text"><label class="lable-text" id="addNew14" for="model">Модель</label><input type="text" class="input-text" id="addNew15" name="model"></div><div id="addNew16" class="form-text"><label class="lable-text" id="addNew17" for="serial">Серийный №</label><input type="text" class="input-text" id="addNew18" name="serial"></div><div id="addNew19" class="form-text"><label class="lable-text" id="addNew20" for="def">Дефект</label><input type="text" class="input-text" id="addNew21" name="def"></div><div class="form-text"><label class="lable-text" for="print">Распечатать квитанцию?</label><input type="checkbox" id="check_1" name="print"></div><div id="addNew22" class="form-buttons"><input type="button" value="OK" class="sub-button" id="addNew23" onclick="check()"><input type="button" name="reset" id="addNew24" value="Cancel" class="sub-button" onclick="delForm()"></div></form>'
        let form = document.createElement('form');
        form.name ="newForm";
        form.method = "post";
        form.action ="/tasks";
        form.id = "addNewFormId";
        form.className = "addNewForm";
        form.innerHTML = htmlform;
        document.body.append(form);
        document.getElementById('newFormButton').style.backgroundColor= "#a1a1a1"; //блокировка кнопки Новая форма
        dragElement(document.getElementById("addNewFormId"));
    }
}
/**проверка заполнения всех полей в форме */
function check(){
  let a = 0;
  let form = document.getElementById('addNewFormId');
  (!form.elements.name.value) ? form.elements.name.style.backgroundColor = "#fcd9d9": a++;
  (!form.elements.phone.value) ? form.elements.phone.style.backgroundColor = "#fcd9d9": a++;
  (!form.elements.adress.value) ? form.elements.adress.style.backgroundColor = "#fcd9d9": a++;
  (!form.elements.vendor.value) ? form.elements.vendor.style.backgroundColor = "#fcd9d9": a++;
  (!form.elements.model.value) ? form.elements.model.style.backgroundColor = "#fcd9d9": a++;
  (!form.elements.serial.value) ? form.elements.serial.style.backgroundColor = "#fcd9d9": a++;
  (!form.elements.def.value) ? form.elements.def.style.backgroundColor = "#fcd9d9": a++;
  (a == 7) ? onSubmit() : newDiv('Заполните все поля формы', 1);
  
}

/** отправка данных с формы на сервер */
async function onSubmit(){
    let form = document.getElementById('addNewFormId');
    let formObj = {
      'name': `${form.elements.name.value}`,
      'phone': `${form.elements.phone.value}`,
      'adress': `${form.elements.adress.value}`,
      'vendor': `${form.elements.vendor.value}`,
      'model': `${form.elements.model.value}`,
      'serial': `${form.elements.serial.value}`,
      'def': `${form.elements.def.value}`,
      'stat': 'def',
      'comm': '',
      'sum': '',
    }
    let response = await fetch ('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(formObj),
    });
    let result = await response.json();
    if (response.status == 201){
      /**проверяем checkbox, печатаем квитанцию */
      if (form.elements.print.checked){ getPDF(result.message);};
      delForm();
      newDiv('Заявка принята' + `${result.message}`);
      addInfoToTable();
    }

/**получаем PDF квитанцию */
async function getPDF(id){
  let res = await fetch('/print/' + id, {
    method: 'GET',
    headers: {
      'responseType': 'blob'
    } 
  })
  let pdf = await res.blob();
  let pdfObj = URL.createObjectURL(pdf);
  window.open(pdfObj);
}

}
/* удаление формы, кнопка Cancel*/
function delForm(){
    let closeForm = document.getElementById('addNewFormId');
    if (closeForm != null){
        closeForm.remove();
        document.getElementById('newFormButton').style.backgroundColor= "";  //снятие блокировки с кнопки
    } 
}
/** заполнение таблицы с заявками */
async function addInfoToTable(){
  let temp = "";
  let tmp = "";
  let table = document.getElementById("tableBody");
  let response = await fetch ('/table', {
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
  temp += "<tr id='" + result[i].numb + "' onClick='openApp(" + result[i].numb +")'><td>" + result[i].numb + "<\/td><td>" + result[i].date + "<\/td><td>" + result[i].name + "<\/td><td>" + result[i].phone + "<\/td><td>" + result[i].adress + "<\/td><td>" + result[i].vendor + "<\/td><td>" + result[i].model + "<\/td><td>" + result[i].serial + "<\/td><td>" + result[i].def + "<\/td><td>" + result[i].owner + "<\/td><td>" + selectStatus(result[i].stat) + "<\/td><td>" + result[i].comm + "<\/td><td>" + result[i].sum + "<\/td><\/tr>";
}
table.innerHTML = temp;
}
/**изменяем значение стат понятное для пользователя */
function selectStatus(val){
  let res = ""
  switch(val){
    case "def": 
      res = "Дефектация";
      return res;
      break;
    case "complite":
      res = "Ремонт выполнен";
      return res;
      break;
    case "waiting":
      res = "Ожидание запчастей";
      return res;
      break;
    case "needcall":
      res = "Согласовать с клентом";
      return res;
      break;
    case "act":
      res = "АКТ дефектации";
      return res;
      break;
    case "closed":
      res = "Техника у клиента";
      return res;
      break;
  }
}

/**открытие деталей заявки */
async function openApp(id){
  let app = document.getElementById(id);
  if(!document.getElementById('openAppId')){
  let url = '/table/' + id;
  let response = await fetch (url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  });
  let result = await response.json();
  /** приводим дату/время в нормальный вид */
  for(let i=0; i < result.length; i++) {
    let tmp = result[i].date.slice(8, 10) + '.' + result[i].date.slice(5, 7) + '.' + result[i].date.slice(0, 4) + ' ' + result[i].date.slice(11, 16);
    result[i].date = tmp;
  }
  
  let html = `<form><div id="openAppIdHeader" class="openAppIdHeader"><a>№${result[0].numb} от ${result[0].date}</a></div><div id="openAppInfoId" class="openAppInfo"><a>${result[0].vendor}</a><a>${result[0].model}</a><a>${result[0].serial}</a></div><div id="openAppDefId" class="openAppDef"><a>${result[0].def}</a></div><hr><div id="openAppChangeID" class="openAppChange"><div><label for="com">Выполненные работы</label><textarea placeholder="Какие работы были выполнены, или любые другие комментарии" id="wharWasDoneId" name="comm">${result[0].comm}</textarea></div><div><div class="box"><label for="stat">Статус  </label><select name="stat" id="selStatusId" value="${result[0].stat}"><option value="def">Дефектация</option><option value="complite">Ремонт выполнен</option><option value="waiting">Ожидание запчастей</option><option value="needcall">Согласовать с клиентом</option><option value="act">АКТ дефектации</option><option value="closed">Техника у клиента</option></select></div><div class="box"><label for="sum">Сумма ремонта</label><input type="text" name="sum" id="sumId" value="${result[0].sum}"></div></div></div><div><button value="" onClick ="changeApp(${id})" class="sub-button">OK</button><button value="" onClick="cancelApp()" class="sub-button">Отмена</button></div></form>`;
  let openAppForm = document.createElement('form');
  openAppForm.name ="openAppForm";
  openAppForm.method = "put";
  openAppForm.id = "openAppId";
  openAppForm.className = "openAppForm";
  openAppForm.innerHTML = html;
  document.body.append(openAppForm);
/**выбор селектора "статус" согласно значению из БД */
      let selected = document.getElementById('selStatusId').getElementsByTagName('option');
        for(let a=0;a<selected.length;a++){
          if(selected[a].value == result[0].stat) selected[a].selected = true;
        }

  dragElement(document.getElementById("openAppId"));
}
}

async function changeApp(id){
let form = document.getElementById('openAppId');
let data =[form.elements.stat.value, form.elements.comm.value, form.elements.sum.value, id];

let url = '/table/' + id;
let response = await fetch (url, {
  method: 'put',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify(data),
});
  document.location.replace('.');
}
/**закрытие формы с деталями заявки */
function cancelApp(){
  let closeForm = document.getElementById('openAppId');
    closeForm.remove();
  
}

function logOut(){
document.cookie = `x-access-token=${getCookie('x-access-token')}; max-age=-1;`;
window.location.replace('/');

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


function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}