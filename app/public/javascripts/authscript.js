function alertBox(message){
  let box = document.getElementById('messageBox');
  box.style.display = "block";
  box.value = message;
}
/**отправка логин/пароля */
async function login(){
    let user = document.getElementById('user').value;
    let pass = document.getElementById('pass').value;
    if (!user || !pass){
        return alertBox('Заполните поля login/password');
    }
    let reqBody = {
        "username": `${document.getElementById('user').value}`,
        "password": `${document.getElementById('pass').value}`,
    }
        
    let responce = await fetch ('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          //'Accept': '*/*',
          //'Access-Control-Allow-Headers': ', Content-Type',
          //'Origin': 'http://localhost:3000',

        },
        body: JSON.stringify(reqBody),        
      });
    let result = await responce.json();
    if (responce.status >= 400){
      return alertBox(result.message);
    }else if(responce.status == 200){
      sessionStorage.setItem('username', result.username);
      sessionStorage.setItem('office', result.office);
      window.location.replace(result.redirect);
    }
  
             
      

}
/**чтение кук по имени */
function readCookie(name) {

  var name_cook = name+"=";
  var spl = document.cookie.split(";");

  for(var i=0; i<spl.length; i++) {

    var c = spl[i];
  
    while(c.charAt(0) == " ") {
  
      c = c.substring(1, c.length);
    
    }
  
    if(c.indexOf(name_cook) == 0) {
    
      return c.substring(name_cook.length, c.length);
    
    }
  
  }

  return null;

}