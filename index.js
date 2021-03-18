
const api_url = 'http://localhost:8081/chat'
const sock_url = "ws://localhost:8081/websocket";
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

var user_info = {
    "userId": "",
    "userName": "",
    "userSession": "",
    "roomId": ""
}

var ws;

connectChannel = function(roomId) {
    this.user_info.userId = this.generateUserId();
    this.user_info.userName = document.getElementById("newChannelNm").value;
    this.user_info.roomId = roomId;

    if(ws!==undefined && ws.readyState!==WebSocket.CLOSED){
        writeResponse("WebSocket is already opened.");
        return;
    }
    
    ws=new WebSocket(sock_url +"/"+ this.user_info.roomId +"/"+this.user_info.userId+"/"+encodeURIComponent(this.user_info.userName));
    ws.onopen=function(event){
        //50초마다 세션 유지를 위한 메시지 전달
        timerId = setInterval(currentSession, 50000);
        
   };
}

sendMessage = function() {

    if (ws !== undefined && ws.readyState == WebSocket.OPEN){
        var msg = {
            type: "message",
            text: document.getElementById("msg").value,
            roomId: this.user_info.roomId,
            userId: this.user_info.userId,
            sessionId: this.user_info.userSession,
            date: Date.now()
        }
        ws.send(msg);
    }
};
    

createChannel = function() {
    axios({
        method: 'post', //통신 방식
        url: api_url + '/room', //통신할 페이지
        data: {
            "name": document.getElementById("newChannelNm").value            
        } //인자로 보낼 데이터
        })
        .then(response=>{
            var room = response.data;
            console.log(room.name);
            this.getChannels();
        })
        .catch(error=>{
            //document.getElementById('room_list').innerText='error';
            console.log(error);
        })
};

getChannels = function() {
    axios({
        method: 'get', //통신 방식
        url: api_url + '/rooms', //통신할 페이지
        data: {} //인자로 보낼 데이터
      })
        .then(response=>{
            var rooms = response.data;
            console.log(rooms[0].roomId);
            var html = "<ul>";
            for (var i = 0; i < rooms.length; i++){
                html += "<li value='" + rooms[i].roomId + "'>" + rooms[i].name + "</li>";
                html += "<button id='btnConn" + rooms[i].roomId +"' onClick=joinChannel('" + rooms[i].roomId + "');>접속</button>";
                console.log(rooms[i]);
            }
            html += '</ul>';
            document.getElementById('room_list').innerHTML=html;
        })
        .catch(error=>{
            document.getElementById('room_list').innerText='error';
            console.log(error);
        })
};

joinChannel = function(room) {
    localStorage.setItem('wschat.sender',document.getElementById("user").value);
    localStorage.setItem('wschat.roomId',room);
    location.href="./room.html";
}

generateUserId = function() {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < 8; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    console.log(result);
    return result;
}
