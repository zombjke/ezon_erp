function loadScript(src) {
    let script = document.createElement('script');
    script.src = src;
    document.head.append(script);
  }

  loadScript("/javascripts/modules/general.js");
  loadScript("/javascripts/modules/navigation.js");
  loadScript("/javascripts/modules/orders.js");
  loadScript("/javascripts/modules/wereh.js");


