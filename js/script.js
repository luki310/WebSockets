(function(){

    var chat = {

        renderRow: function(dataObj) {
            var chatRow = document.createElement("div"),
                date = new Date(),
                time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
                message = null;

            chatRow.classList.add("chatRow");

            if(dataObj.type == "status")
                message = "<span class='status'>" + dataObj.message + "</span>";
            else
                message = "<span class='name'>" + dataObj.name + "</span><span class='message'>" + dataObj.message + "</span>";

            chatRow.innerHTML = "<span class='time'>" + time + "</span>\n" + message;

            this.chatWindow.appendChild(chatRow);
            this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
        },

        displayMess: function(e){
            var dataObj = JSON.parse(e.data);
            this.renderRow(dataObj);
        },

        sendMessage: function(){
            var message = this.messageInput.value;

            if(!!message){
                this.sendData({
                    type: "message",
                    name: name
                });

                this.messageInput.value = "";
            }
        },

        sendData: function(msgObj){
            var data = JSON.stringify(msgObj);

            this.soccet.send(data);
        },

       joinToChat: function(e) {
            var name = this.nameInput.value;

            if(!!name) {
                this.sendData({
                    type: "join",
                    name: name
                });

                e.target.onclick = null;
                e.target.setAttribute("disabled", "disabled");
                this.nameInput.setAttribute("readonly", "readonly");

                this.submitButton.removeAttribute("disabled");
                this.submitButton.onclick = this.sendMessage.bind(this);
            }

        },

        stopApp: function() {
            this.joinButton.onclick = null;
            this.joinButton.setAttribute("disabled", "disabled");

            this.submitButton.onclick = null;
            this.submitButton.setAttribute("disabled", "disabled");

            this.renderRow({
                type: "status",
                message: "Przerwano połączenie z serwerem."
            });

        },

        connectToServer: function(){
            this.soccet = new WebSocket("ws://localhost:8080");
            this.soccet.onmessage = this.displayMess.bind(this);
            this.soccet.onclose = this.stopApp.bind(this);
        },


        init: function (){
            if(!window.WebSocket) return;

            this.nameInput = document.querySelector("#name");
            this.joinButton = document.querySelector("#join");
            this.chatWindow = document.querySelector("#win-chat");
            this.messageInput = document.querySelector("#message");
            this.submitButton = document.querySelector("#submit");

            this.joinButton.onclick = this.joinToChat.bind(this);
            this.connectToServer();
        }


    };
chat.init();

})();