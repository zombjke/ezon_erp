/**ПОЛЬЗОВАТЕЛИ */
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