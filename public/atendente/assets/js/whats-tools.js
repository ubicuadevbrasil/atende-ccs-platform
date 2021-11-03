// Upload File
function uploadFile(file, uploadType) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        let fd = new FormData();
        xhr.open("POST", appCdnUpload, true);
        xhr.onreadystatechange = async function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Get File Hash
                let cdnFileInfo = xhr.responseText;
                let jsonHash = JSON.parse(cdnFileInfo);
                let fileHash = jsonHash.hashfile;
                // Prep File Json
                let fileJson = {
                    mobile: currentUserMobile,
                    type: uploadType,
                    hashfile: fileHash,
                    descfile: file.name,
                    myMedia: loadBase64(fileHash)
                }
                // Emit socket event to send media message
                socket.emit('send_media', fileJson);
                // Close Modal
                $("#mediaModal").css("display", "none");
                // Arrange media preview in chat
                let uploadTime = await getTime();
                let imageUrl = 'https://cdn.ubicuacloud.com/file/' + fileHash;
                let messageComponent
                if (uploadType == 'image') {
                    messageComponent = messageImageRight(imageUrl, '', uploadTime);
                } else if (uploadType == 'audio' || uploadType == 'video' || uploadType == 'document') {
                    messageComponent = messageAttachRight(imageUrl, '', uploadTime);
                }
                // Append message and Scroll
                $('#chat' + currentUserMobile).append(messageComponent);
                // Scroll to last message
                document.getElementById(`chat${currentUserMobile}`).scrollBy(0, 9999999999999999);
            } else {
                // Erro warning
                console.log('> Erro ao fazer upload do arquivo...');
            }
        };
        // FormData and XML prep's
        fd.append("inserirdoc", file);
        xhr.send(fd);
        // Clear file input
        switch (uploadType) {
            case 'image':
                $('#imageInput').val('');
                break;
            case 'audio':
                $('#audioInput').val('');
                break;
            case 'video':
                $('#videoInput').val('');
                break;
            case 'document':
                $('#docInput').val('');
                break;
            default:
                break;
        }
    })
}

// Prepare chat for history
function arrangeUserChat(contacts, logs) {
    return new Promise(function (resolve, reject) {
        let contactsLength = contacts.length;
        let logsLength = logs.length;
        for (i = 0; i < contactsLength; i++) {
            // Get last message and message time
            let userLastMsg, userLastMsgTime;
            for (b = 1; b < logsLength; b++) {
                if (logs[logsLength - b].sessionid == contacts[i].sessionid) {
                    if (logs[logsLength - b].msgtype == "chat") {
                        userLastMsg = logs[logsLength - b].msgtext
                    } else if (logs[logsLength - b].msgtype == "transfer") {
                        userLastMsg = "Atendimento transferido..."
                    } else {
                        userLastMsg = "Enviou um arquivo..."
                    }
                    userLastMsgTime = logs[logsLength - b].dt
                    break
                }
            }
            // Convert info Types
            if (!userLastMsg) { userLastMsg = '' }
            if (!userLastMsgTime) { userLastMsgTime = '' } else { userLastMsgTime = dateConvert(userLastMsgTime) }
            // User info
            let userMobile = contacts[i].mobile;
            let account = contacts[i].account;
            let userAtendir = contacts[i].atendir;
            let userName = contacts[i].name;
            // User components
            let userChat = $("#list" + userMobile);
            let userChatDisplay = $("#chat" + userMobile);
            // Clear user Chat if already exists
            if (userChatDisplay.length == 0) { userChatDisplay.empty() }
            // Arrange user Chats
            if (userChat.length == 0) {
                let userChatComponent = userListDiv(userMobile, userLastMsg, userLastMsgTime, '123456', userName);
                if (userAtendir == 'in') {
                    inUsersDisplay.append(userChatComponent);
                } else if (userAtendir == 'out') {
                    outUsersDisplay.append(userChatComponent);
                }
            }
            // Display user in Contacts List
            let userChatDisplayComponent = userChatDiv(userMobile);
            if (userChatDisplay.length == 0) {
                chatDefault.first().after(userChatDisplayComponent)
            }
        }
        resolve('ok')
    })
}

// Answer New Queue
function answerNewQueue(payload) {
    return new Promise(function (resolve, reject) {
        // User Info
        let userMobile = payload.mobile;
        let userName = payload.name;
        // Prep user components
        if (userMobile != null) {
            // Create user components
            let userChatComponent = userListDiv(userMobile, '', '', '123456', userName);
            inUsersDisplay.append(userChatComponent);
            let userChatDisplayComponent = userChatDiv(userMobile);
            // Arrange user Chat component
            let userChatComponentDisplay = document.getElementById("chat" + userMobile);
            if (userChatComponentDisplay == null) { chatScreen.first().after(userChatDisplayComponent) }
        }
        resolve('ok')
    })
}

// Arrange Agent Chat History
function historyMessage(contacts, logs, area) {
    let contactsLength = contacts.length;
    let logsLength = logs.length;
    for (i = 0; i < contactsLength; i++) {
        if(area == 'chatPannel'){
            $('#chat' + contacts[i].mobile).empty();
        } else if (area == 'chatHistory'){
            $('#chatHistory').empty();
        }
    }
    for (a = 0; a < logsLength; a++) {
        let messageTime = dateConvert(logs[a].dt);
        for (i = 0; i < contactsLength; i++) {
            let messageComponent;
            if ((contacts[i].sessionid == logs[a].sessionid) || (contacts[i].sessionBot == logs[a].sessionid) || (contacts[i].sessionBotCcs == logs[a].sessionid)) {
                if (logs[a].msgdir === 'i') {
                    if (logs[a].msgtype === 'chat') {
                        messageComponent = messageLeft(logs[a].msgtext, messageTime);
                    } else if (logs[a].msgtype === 'image') {
                        messageComponent = messageImageLeft(logs[a].msgurl, logs[a].msgcaption, messageTime);
                    } else {
                        messageComponent = messageAttachLeft(logs[a].msgurl, logs[a].msgcaption, messageTime);
                    }
                } else if (logs[a].msgdir === 'o') {
                    if (logs[a].msgtype === 'chat' || logs[a].msgtype === 'transfer') {
                        messageComponent = messageRight(logs[a].msgtext, messageTime);
                    } else if (logs[a].msgtype === 'image') {
                        messageComponent = messageImageRight(logs[a].msgurl, logs[a].msgcaption, messageTime);
                    } else {
                        messageComponent = messageAttachRight(logs[a].msgurl, logs[a].msgcaption, messageTime);
                    }
                }
                if(area == 'chatPannel'){
                    $('#chat' + contacts[i].mobile).append(messageComponent);
                } else if (area == 'chatHistory'){
                    $('#chatHistory').append(messageComponent);
                }
            }
        }
    }
}

// Timer
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Agent Logout
function logoutAgent() {
    sessionStorage.clear();
    socket.disconnect();
    window.location = "index.html";
}

// Call mobile from Mailing
function callMobile(mobile) {
    $('#mailingModal').fadeOut("fast");
    socket.emit('bi-atendemail', {
        fkid: agentFkid,
        fkname: agentFkname,
        mobile: mobile
    });
}

// OpenChat
function openChat(mobile) {
    let chatComponents = $('#chatPanel').children();
    mobile = mobile.replace('list', '')
    for (i = 0; i < chatComponents.length; i++) {
        if (chatComponents[i].id.indexOf('chat') > -1 && chatComponents[i].id != `chat${mobile}` && chatComponents[i].className.indexOf('closedChat') == -1) {
            document.getElementById(chatComponents[i].id).classList.add('closedChat');
        } else if (chatComponents[i].id == `chat${mobile}` && chatComponents[i].className.indexOf('closedChat') > -1) {
            // Set current user mobile
            currentUserMobile = mobile;
            document.getElementById(chatComponents[i].id).classList.remove('closedChat');
            document.getElementById('userChatAvatar').classList.remove('closedChat');
            document.getElementById('closeChatButton').classList.remove('closedChat');
            document.getElementById(`chat${mobile}`).scrollBy(0, 9999999999999999);
            document.getElementById('userMobileSpan').innerText = `+${mobile}`
        }
        if (chatComponents[i].id == `chat${mobile}`) {
            // Set current user mobile
            document.getElementById(`notifyUser${currentUserMobile}`).innerText = ''
        }
    }
}

// Loda Base64
function loadBase64(hashFile) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            return this.response
        }
    }
    xhttp.open("GET", appCdnBase + hashFile, true);
    xhttp.send();
}

// Data Convert
function dateConvert(data) {
    let dateTime = new Date(data);
    let minutos = dateTime.getMinutes();
    let horas = dateTime.getHours();
    let segundos = dateTime.getSeconds();
    if (horas < 10) { horas = "0" + horas }
    if (minutos < 10) { minutos = "0" + minutos }
    if (segundos < 10) { segundos = "0" + segundos }
    if (segundos == 0) { segundos = "00" }
    let dataFormatada = (horas + ":" + minutos);
    return (dataFormatada);
}

// Get Message TIme
function getTime() {
    return new Promise(function (resolve, reject) {
        let date = new Date();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        if (minutes < 10) { minutes = "0" + minutes; }
        let time = '' + hour + ':' + minutes + '';
        resolve(time)
    })
}

// Call Warning Modal
function callWarningModal(title, desc) {
    $("#warningModalTitle").text(title);
    $("#warningModalDesc").text(desc);
    $("#warningModal").fadeIn("fast");
}

// Call Success Modal
function callSuccessModal(title, desc) {
    $("#succesModalTitle").text(title);
    $("#succesModalDesc").text(desc);
    $("#succesModal").fadeIn("fast");
}

// Send Quick Question
function quickQuestion(id) {
    return new Promise(function (resolve, reject) {
        let question = $('#question-' + id)[0].innerText;
        $('#messageInputBox').val(question);
        resolve('ok')
    })
}