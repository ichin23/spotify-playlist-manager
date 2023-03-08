import data from './tokens.json' assert { type: 'json' };
var href = window.location.href.split("/")[2];

document.getElementById("loginButton").addEventListener("click", ()=>{
    window.location.replace("https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: 'token',
      client_id: data["client_id"],
      scope: data["scope"],
      redirect_uri: "http://localhost:5500/"    
    }).toString())
})



//VERIFICA SE É SESSÃO DE LOGIN QUE CONTEM OS DADOS NA URL
try{
    var url = window.location.href.split('#')
    if(url.length>1){

        console.log(url)
        var params = url[1].split("&")
        console.log(params)
        var list = []
        params.forEach(element=>{
            list.push(element.split("="))
        })
        var access_token = null
        list.forEach(element=>{
            console.log(element)
            if(element[0]=="access_token"){
                access_token=element[1]
                localStorage.setItem("access_token", access_token)
            }else if(element[0]=="expires_in"){
                console.log(element[0])
                var expire=parseInt(element[1])
                var date = new Date()
                date.setSeconds(date.getSeconds()+expire)
                
                localStorage.setItem("expire", (date).toISOString())
            }
        })
        window.location.href="screens/home.html"
    }
}catch(e){
    console.log(e);
}

//VERIFICA SE É SESSÃO SEM DADOS PRÉ-SALVOS
if( access_token==undefined){
    console.log(localStorage.getItem("access_token"))
    if(localStorage.getItem("access_token")!=undefined){
        access_token=localStorage.getItem("access_token")
    }
    if(localStorage.expire!=undefined){
        var expire=localStorage.expire
        var expireDate = new Date(expire)
        if(expireDate<Date.now()){
            
        }
    }
    else{
        
    }
    
}
