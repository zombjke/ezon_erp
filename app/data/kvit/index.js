module.exports = ({ numb, date, name, phone, adress, vendor, model, serial, def, warr }) => {

    let tmp = "";
    tmp = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
      //  tmp = date.slice(8, 10) + '.' + date.slice(5, 7) + '.' + date.slice(0, 4) + ' ' + date.slice(11, 16);
     date = tmp;   
    
     let warranty ="";
     if (warr) {
       warranty = "*гарантийный ремонт";
     }else{
       warranty = "*платный ремонт";
     }
     
      
return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Квитанция для печати</title>
<style>
  .line_1{
    margin: 2% 0 2% 0;
    border-top: 1px dashed;
  }
  .table_1 {
    border: 1px solid black;
    border-collapse: collapse;
    text-align: center;
  }
  .table_1 td {
    border: 1px solid black;
    border-collapse: collapse;
  }
  

</style>

</head>

<body>

<div class="header" id="header" align="center"><strong>КВИТАНЦИЯ № ${numb} от ${date}</strong></div>
<table width="100%" border="0">
  <tbody>
    <tr>
      <td width="10%" rowspan="5"><img src="http://localhost:3000/images/ezon-logo.jpg" width="150" height="100" alt=""/></td>
      <td width="90%"><strong>ООО &quot;EZON SERVICE PRINT&quot;</strong></td>
    </tr>
    <tr>
      <td><strong>Адрес</strong>: Юнусобадский р-н, ул. Гуллола, д. 28</td>
    </tr>
    <tr>
      <td><strong>р/с</strong> 2020 8000 3052 5393  8001 <strong>МФО</strong>: 00444</td>
    </tr>
    <tr>
      <td><strong>ИНН:</strong> 307551188          <strong>ОКЭД:</strong> 95110</td>
    </tr>
    <tr>
      <td><strong>Телефон:</strong> (78) 122-2-122; (55) 502-17-22; (90) 808-32-26</td>
    </tr>
  </tbody>
</table>
	<hr>	
<table width="100%" border="0">
  <tbody>
    <tr>
      <td width="33%"><strong>Заказчик: </strong> ${name}</td>
      <td width="33%"><strong>Телефон: </strong> ${phone}</td>
      <td width="33%"><strong>Адрес: </strong> ${adress}</td>
    </tr>
  </tbody>
</table>
	<hr>
<table width="100%" class="table_1">
	  <tbody>
	    <tr>
	      <td width="25%"><strong>Производитель</strong></td>
	      <td width="25%"><strong>Модель</strong></td>
	      <td width="25%"><strong>Серйный номер</strong></td>
	      <td width="25%"><strong>Неисправность</strong></td>
        </tr>
	    <tr>
	      <td>${vendor}</td>
	      <td>${model}</td>
	      <td>${serial}</td>
	      <td>${def}</td>
        </tr>
  </tbody>
	
</table>
	<table width="100%" border="0">
  <tbody>
  <tr> <td> ${warranty} </td> </tr>
    <tr>
      <td colspan="2" align="center" ><strong>Условия приема оборудования в ремонт</strong></td>
    </tr>
    <tr>
      <td colspan="2"><p>1.  Оборудование с согласия Заказчика, принято без разборки и проверки  неисправностей, без проверки внутренних повреждений. Заказчик согласен, что все  неисправности и внутренние повреждения, которые могут быть обнаружены в  оборудовании при его техническом обслуживании, возникли до приема оборудования  по этой квитанции.<br>
        2.  Гарантия распространяется ТОЛЬКО на выполненные работы и замененные запчасти.  Гарантия не действует при нарушении правил эксплуатации,установленных заводом-изготовителем техники,а также в случае  неквалифицированного ремонта сторонними ремонтными организациями.<br>
        3.  Срок выполнения ремонта (выполнения ремонтных работ по устранению недостатка)  составляет до 20 рабочих дней при условии наличия необходимых запасных частей  (з/ч) на складе. В случае заказа з/ч, срок ремонта может быть увеличен на срок  от 7 до 60 рабочих дней.<br>
        4.  Бесплатный срок хранения готового оборудования – 10 дней со дня уведомления  Заказчика. По истечении данного срока стоимость хранения оборудования составит  30.000 в сутки.<br>
        5.  Сервисный центр оставляет за собой право в одностороннем порядке отказать в ремонте  оборудования без объяснения причины принятого решения.<br>
        6.  Окончательная стоимость ремонта может быть установлена только после проведения  диагностики. При приёме оборудования в ремонт согласовывается только  предварительная стоимость работ.<br>
        7.  КЛИЕНТ  ПРИНИМАЕТ НА СЕБЯ ВЕСЬ РИСК, СВЯЗАННЫЙ С ПРОЯВЛЕНИЕМ В ПРОЦЕССЕ РЕМОНТА  НЕИСПРАВНОСТЕЙ, НЕ УКАЗАННЫХ В КВИТАНЦИИ.<br>
    </tr>
    <tr>
      <td>Заказчик_________________________ </td>
      <td align="right">Приемщик________________________</td>
    </tr>
  </tbody>
</table>
<hr class="line_1">
<div class="header" id="header" align="center"><strong>КВИТАНЦИЯ №${numb} от ${date}</strong></div>
<table width="100%" border="0">
  <tbody>
    <tr>
      <td width="10%" rowspan="5"><img src="http://localhost:3000/images/ezon-logo.jpg" width="150" height="100" alt=""/></td>
      <td width="90%"><strong>ООО &quot;EZON SERVICE PRINT&quot;</strong></td>
    </tr>
    <tr>
      <td><strong>Адрес</strong>: Юнусобадский р-н, ул. Гуллола, д. 28</td>
    </tr>
    <tr>
      <td><strong>р/с</strong> 2020 8000 3052 5393  8001 <strong>МФО</strong>: 00444</td>
    </tr>
    <tr>
      <td><strong>ИНН:</strong> 307551188          <strong>ОКЭД:</strong> 95110</td>
    </tr>
    <tr>
      <td><strong>Телефон:</strong> (78) 122-2-122; (90) 808-32-26; (90) 990-18-17; (93) 553-06-50</td>
    </tr>
  </tbody>
</table>
	<hr>	
<table width="100%" border="0">
  <tbody>
    <tr>
      <td width="33%"><strong>Заказчик: </strong>${name}</td>
      <td width="33%"><strong>Телефон: </strong>${phone}</td>
      <td width="33%"><strong>Адрес: </strong>${adress}</td>
    </tr>
  </tbody>
</table>
	<hr>
<table width="100%" class="table_1">
	  <tbody>
	    <tr>
	      <td width="25%" align="center"><strong>Производитель</strong></td>
	      <td width="25%" align="center"><strong>Модель</strong></td>
	      <td width="25%" align="center"><strong>Серйный номер</strong></td>
	      <td width="25%" align="center"><strong>Неисправность</strong></td>
        </tr>
	    <tr>
	      <td align="center">${vendor}</td>
	      <td align="center">${model}</td>
	      <td align="center">${serial}</td>
	      <td align="center">${def}</td>
        </tr>        
  </tbody>
	</table>
  <a> ${warranty} </a>
</body>
</html>`;
};