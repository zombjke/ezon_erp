/**ФУНКЦИИ НАВИГАЦИИ */
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