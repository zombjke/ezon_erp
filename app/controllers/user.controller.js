const { authJwt } = require("../middleware/authJwt");
const pool = require('../config/pool.config');
var bcrypt = require("bcryptjs");
const pdf = require('html-pdf');
const kvit = require('../data/kvit');
const avr = require('../data/avr');
const dir = ('../data/');


exports.allAccess = (req, res) => {

    res.render('auth');

};

exports.userBoard = (req, res) => {
  res.render('tasks');
};

exports.adminBoard = (req, res) => {
  res.render('adminpage');
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getAllUsers = (req, res) => {
  pool.query('SELECT id, username, office, roleid FROM users, user_roles WHERE users.id = user_roles.userId', (error, result) => {
    if (error) throw error;
  //  console.log(result);
    res.send(result);
  });
}

exports.getUser = (req, res) => {
  let id = req.params.id;
  pool.query('SELECT users.id, users.username, users.office, user_roles.roleid FROM users, user_roles WHERE users.id = ? AND users.id = user_roles.userId', id, (error, result) => {
    if (error) throw error;
  //  console.log(result);
    res.send(result);
    
  });
}

exports.changeUser = (req, res) => {
  if(!req.body) return res.sendStatus(400);
 // console.log(req.body);
  pool.query('UPDATE users, user_roles SET users.office = ?, user_roles.roleid = ? WHERE users.id = ? AND users.id = user_roles.userId', req.body, (error, result) => {
    if (error) throw error;
    res.status(200).send(result);    
  });
}

exports.setUserPassword = (req, res) => {
  if(!req.body) return res.sendStatus(400);
  //console.log(req.body);
    let id = req.body.id;
    let pass = bcrypt.hashSync(req.body.password, 8);
    data = [pass, id];  
    
    pool.query('UPDATE users SET password = ? WHERE id = ?', data, (error, result) => {
    if (error) throw error;
    res.status(200).send(result);    
  });
}

exports.delUser = (req, res) => {
  if(!req.body) return res.sendStatus(400);
 // console.log(req.body);
    pool.query('DELETE FROM users, user_roles USING users, user_roles WHERE users.id = ? AND users.id = user_roles.userId', req.body.id, (error, result) => {
    if (error) throw error;
    res.status(200).send(result);    
  });
}

exports.getTasks = (req, res) => {
  pool.query('SELECT * FROM application WHERE stat != "closed"', (error, result) => {
    if (error) throw error;
 //   console.log(result);
    res.status(200).send(result);
  });
}

exports.changeTask = (req, res) => {
  if(!req.body) return res.sendStatus(400);
  //console.log(req.body);
  if (req.body[0] == 'complite'){
    let today = new Date().toLocaleDateString('en-ca');
    let data = [today, req.body[3]]
    pool.query('UPDATE application SET compliteDate = ? WHERE numb = ?', data, (error, result) => {
      if (error) throw error;
    });
  }
    pool.query('UPDATE application SET stat = ?, comm = ?, sum = ?, countOfprint =? WHERE numb = ?', req.body, (error, result) => {
      if (error) throw error;
      res.status(200).send(result);    
    });
  
  
}

exports.saveNewTask = (req, res) => {
  if(!req.body) return res.sendStatus(400);
    pool.query('SELECT office FROM users WHERE id = ?', req.userId, (error, result) => {
    if (req.body.owner == result[0].office){
        pool.query('INSERT INTO application SET ?', req.body, (error, result) => {
          if (error) throw error;  
          res.status(200).send(result);
        });
    }else{
      res.redirect('/');
    }
  });
}

exports.getKvit = (req, res) => {
  let fileName = 'kvit.pdf';
  pool.query('SELECT * FROM application WHERE numb = ?', req.params.id, (error, result) => {
    if (error) throw error;
//console.log(result);
  pdf.create(kvit(result[0]), {format: 'A4'}).toFile(__dirname + fileName, (err) => {
      if(err) {
        console.log(err);
          res.send(Promise.reject());
      }
          res.sendFile(__dirname + fileName);      
    });
  });
}

exports.newOrderWarr = (req, res) => {
  if(!req.body) return res.sendStatus(400);
  pool.query('SELECT office FROM users WHERE id = ?', req.userId, (error, result) => {
    if (error) throw error;
    let office = result[0].office;
    let taskId = req.params.id;
    let content = JSON.stringify(req.body);
    let data = {
      'purchaseDate': '',
      'issueDate': '',
      'taskId': taskId,
      'owner': office,
      'content': content,
    };

    pool.query('SELECT * FROM orders WHERE taskId = ?', taskId, (error, result) => {
      if (error) throw error;
        if (result.length > 0){
          if (result[0].status == 1 || result[0].status == 4){
            data['id'] = `${result[0].id}`;
           // console.log(data);
            pool.query('UPDATE orders SET purchaseDate = ?, issueDate = ?, taskId = ?, owner = ?, content = ? WHERE id = ?', Object.values(data), (error, result) => {
              if (error) throw error;
              res.status(200).send(result);
            });
          }
        }else{
          pool.query('INSERT INTO orders SET ?', data, (error, result) => {
            if (error) throw error;
            res.status(200).send(result);
          });
        }
    });
  });
}

exports.getDataPartFromTask = (req, res) => {
    pool.query('SELECT status, content FROM orders WHERE taskId = ?', req.params.id, (error, result) => {
      if (error) throw error;
      res.status(200).send(result);
    });
}

exports.getInfoParts = (req, res) => {
 // console.log(req.params.id);
    pool.query('SELECT description FROM werehouse WHERE partNumber = ?', req.params.id, (error, result) => {
      if (error) throw error;
      res.status(200).send(result);
    });
}

exports.getTypeOfWork = (req, res) => {
 // console.log(req.params.id);
  pool.query('SELECT typeOfWork, selType FROM works WHERE partNumber = ?', req.params.id, (error, result) => {
    if (error) throw error;
    res.status(200).send(result);
  });
}

exports.setTypeOfWork = (req, res) => {
  if(!req.body) return res.sendStatus(400);
  

  for(let i=0;i<req.body.length;i++){
      pool.query('SELECT partNumber FROM works WHERE partNumber = ?', req.body[i][0], (error, result) => {
      if (error) throw error;
      
      let data = {
        'typeOfWork': req.body[i][1],
        'selType': req.body[i][2],
        'partNumber': req.body[i][0],
        
        };
      if (result.length > 0){
          pool.query('UPDATE works SET typeOfWork = ?, selType = ? WHERE partNumber = ?', Object.values(data), (error, result) => {
          if (error) throw error;
          });
      };
      if(result.length === 0){
          pool.query('INSERT INTO works SET ?', data, (error, result) => {
          if (error) throw error;
          });
      }
      res.status(200);
      });
  }
}

exports.getAvr = (req, res) => {
  let fileName = 'avr.pdf';
  
  pool.query('SELECT * FROM application WHERE numb = ?', req.params.id, (error, result) => {
    if (error) throw error;
    let content =[];
    let dataAll = {
      'numb': result[0].numb,
      'date': result[0].date,
      'name': result[0].name,
      'phone': result[0].phone,
      'model': result[0].model,
      'serial': result[0].serial,
      'def': result[0].def,
      'compliteDate': result[0].compliteDate,
      'purchase': result[0].purchase,
      'comm': result[0].comm,
      };
      pool.query('SELECT content FROM orders WHERE taskId = ?', req.params.id, (error, result) => {
        if (error) throw error;
        content = Object.entries(result[0].content);
      
     //   console.log(content[0][0]);
       for(let i=0;i<content.length;i++){
          pool.query('SELECT werehouse.description, works.typeOfWork, works.selType FROM werehouse, works WHERE werehouse.partNumber = ? AND works.partNumber = werehouse.partNumber', content[i][0], (error, result) => {
             if (error) throw error;
             
             if (result.length>0){
               if (result[0].description) {
                  content[i].push(result[0].description);
               }else{
                content[i].push(' ');
               }
              if (result[0].typeOfWork){
                content[i].push(result[0].typeOfWork);
              }else{
                content[i].push(' ');
              }
              if (result[0].selType){
                content[i].push('PRPH');
                
               
              }else{
                content[i].push('REP');
              }

              content[i].push('1');
              
              
             }         
            
         
        });
        };
        for(let i=content.length;i<6;i++){
          content[i] = [' ', ' ', ' ', ' ', ' ', ' '];
        };
       
       dataAll.content = content;
       setTimeout(function(){
        pdf.create(avr(dataAll), {format: 'A4'}).toFile(__dirname + fileName, (err) => {
          if(err) {
            console.log(err);
            res.send(Promise.reject());
          }
            res.sendFile(__dirname + fileName);      
        });
      },2000);
    });
  });
}

exports.getAvailablity = (req, res) => {
  pool.query('SELECT * FROM availablity WHERE count > 0', (error, result) => {
    if (error) throw error;
  //  console.log(result);
    res.status(200).send(result);
  });
}

exports.getArrival = (req, res) => {
  pool.query('SELECT * FROM arrival', (error, result) => {
    if (error) throw error;
  //  console.log(result);
    res.status(200).send(result);
  });
}

exports.getWriteOff = (req, res) => {
  pool.query('SELECT * FROM writeoff', (error, result) => {
    if (error) throw error;
    //console.log(result);
    res.status(200).send(result);
  });
}

exports.newAvailablity = (req, res) => {
    if(!req.body) return res.sendStatus(400);
}

exports.newArrival = (req, res) => {
  if(!req.body) return res.sendStatus(400);
    pool.query('INSERT INTO arrival SET ?', req.body, (error, result) => {
    if (error) throw error;
  
   let arrs = req.body.content.split('@');
   for(let i=0;i<arrs.length;i++){
     let contents = arrs[i].split('$');
     let data = {
       'count': contents[2],
       'price': contents[3],
       'partNumber': contents[0],
       
     }
     let data1 = {
      'partNumber': contents[0],
      'description': contents[1],
      'count': contents[2],
      'price': contents[3],
    }
   //  console.log(contents[0]);
    pool.query('SELECT partNumber FROM availablity WHERE partNumber = ?', contents[0], (error, result) => {
      if (error) throw error;
      if (result.length > 0){
        pool.query('UPDATE availablity SET count = count + ?, price = ? WHERE partNumber = ?', Object.values(data), (error, result) => {
          if (error) throw error;
          
        });
      }
      if (result.length == 0){
        pool.query('INSERT INTO availablity SET ?', data1, (error, result) => {
          if (error) throw error;
          
        });
      }
    });
  }

  res.status(200).send(result);
  });

  
}

exports.newWriteOff = (req, res) => {
  if(!req.body) return res.sendStatus(400);

}