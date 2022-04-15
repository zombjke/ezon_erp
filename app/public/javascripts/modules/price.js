/**ЦЕНА ПРОДАЖИ*/
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