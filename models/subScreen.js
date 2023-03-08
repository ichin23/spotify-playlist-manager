class SubScreen {
  constructor(path, title) {
    this.path = path;
    this.title = title;
  }

  putPage(element) {
    return new Promise((resolve, reject)=>{

      if (window.XMLHttpRequest) {
        var xmlhttp = new XMLHttpRequest();
      }
      xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        element.innerHTML = xmlhttp.responseText;
        resolve(200)
      }else if(xmlhttp.readyState == 4){
        reject(404)
      }
    };
    xmlhttp.open("GET", this.path);
    xmlhttp.send();
  });
  }
}

export { SubScreen };
