function allBooks(button){
    let id = button.id;
    callAjaxGet(id, (res) => {
        let arrID = JSON.parse(res);
        for(id of arrID){
            let cur_th = document.getElementById(id);
            cur_th.style.visibility = "visible";
        }
    });
}

function available(button){
    let id = button.id;
    callAjaxGet("allBooks", (res) => {
        let arrID = JSON.parse(res);
        for(id of arrID){
            let cur_th = document.getElementById(id);
            cur_th.style.visibility = "visible";
        }
    });
    callAjaxGet(id, (res) => {
        let arrID = JSON.parse(res);
        for(id of arrID){
            let cur_th = document.getElementById(id);
            cur_th.style.visibility = "hidden";
        }
    });
}

function expired(button) {
    let id = button.id;
    callAjaxGet("allBooks", (res) => {
        let arrID = JSON.parse(res);
        for(id of arrID){
            let cur_th = document.getElementById(id);
            cur_th.style.visibility = "visible";
        }
    });
    callAjaxGet(id, (res) => {
        let arrID = JSON.parse(res);
        for(id of arrID){
            let cur_th = document.getElementById(id);
            cur_th.style.visibility = "hidden";
        }
    });
}

function callAjaxGet(id, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) callback(this.responseText);
    };
    xhttp.open("GET", `/library/${id}`, true);
    xhttp.send();
}