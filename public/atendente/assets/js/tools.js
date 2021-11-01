// ? Upload Media
function uploadFile(file, uploadType) {
    return new Promise(function (resolve, reject) {
        $('#modalloading').addClass('form-loading');
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
                // Remove loading animation
                $('#modalloading').removeClass('form-loading');
                $('#myModal3').modal('hide');
                // Arrange media preview in chat
                let uploadTime = await getTime();
                if (uploadType == 'document') {
                    let menu = previewdoctxr('https://cdn.ubicuacloud.com/file/' + fileHash, file.name, agentFkname, uploadTime);
                } else if (uploadType == 'audio' || uploadType == 'video' || uploadType == 'image') {
                    let menu = previewaudr('https://cdn.ubicuacloud.com/file/' + fileHash, agentFkname, uploadTime);
                }
                // Append message and Scroll
                $('#chat' + currentUserMobile).append(menu);
                pageScroll();
            } else {
                // Erro warning
                console.log('> Erro ao fazer upload do arquivo...');
                // Remove loading animation
                $('#modalloading').removeClass('form-loading');
                $('#myModal3').modal('hide');
            }
        };
        // FormData and XML prep's
        fd.append("inserirdoc", file);
        xhr.send(fd);
        // Clear file input
        $('#inserirdoc').val('');
    })
}

// ? Prepare chat for history
function arrangeUserChat(contacts) {
    return new Promise(function (resolve, reject) {
        let contactsLength = contacts.length;
        for (i = 0; i < contactsLength; i++) {
            // User info
            let flagcamp = contacts[i].optAtendimento;
            let cnpj = contacts[i].cnpj;
            let tipo = contacts[i].tipo;
            let userMobile = contacts[i].mobile;
            let account = contacts[i].account;
            let userAtendir = contacts[i].atendir;
            let photo = contacts[i].photo;
            let atendir, atendircolor, direction;
            // User components
            let userChat = $("#id" + userMobile);
            let userChatDisplay = $("#chat" + userMobile);
            // Check for Multi or Recorrente
            if (tipo == 1) { tipo = "Multi" } else if (tipo == 2) { tipo = "Recorrente" }
            // Check for type of call (IN/OUT)
            if (userAtendir == "in") {
                atendir = "ion-reply";
                atendircolor = "color: red";
                direction = "reply";
            } else if (userAtendir == "out") {
                atendir = "ion-forward";
                atendircolor = "color: green";
                direction = "foward";
            }
            // Clear user Chat if already exists
            if (userChatDisplay.length == 0) { userChatDisplay.empty() }
            // Arrange user Chats
            if (userChat.length == 0) {
                let userChatComponent = modalpis('', userMobile, account, photo, atendir, atendircolor, direction, tipo, cnpj, flagcamp);
                if (userAtendir == 'in') {
                    inUsersDisplay.append(userChatComponent);
                } else if (userAtendir == 'out') {
                    outUsersDisplay.append(userChatComponent);
                }
            }
            // Display user in Contacts List
            let userChatDisplayComponent = chatbox1(userMobile);
            if (userChatDisplay.length == 0) {
                chatScreen.append(userChatDisplayComponent);
            }
            // Check for account type
            if (account != null) { $('#ac' + userMobile).show() } else { $('#ac' + userMobile).hide() }
        }
        resolve('ok')
    })
}

// ? Answer New Queue
function answerNewQueue(payload) {
    return new Promise(function (resolve, reject) {
        // User Info
        let userMobile = payload.mobile;
        let userAccount = payload.account;
        let userPhoto = payload.photo;
        let userFonte = payload.fonte;
        // Prep user components
        if (userMobile != null) {
            // Create user components
            let userChatComponent = modalpis('', userMobile, userAccount, userPhoto, 'ion-reply', 'color:red', '', '', '', '', userFonte);
            inUsersDisplay.append(userChatComponent);
            let userChatDisplayComponent = chatbox1(userMobile);
            // Arrange user Chat component
            let userChatComponentDisplay = document.getElementById("chat" + userMobile);
            if (userChatComponentDisplay == null) { chatScreen.append(userChatDisplayComponent) }
            // Arranger user in user list
            let userInfoComponent = $('#ac' + userMobile);
            if (userAccount != null) { userInfoComponent.show() } else { userInfoComponent.hide() }
        }
        resolve('ok')
    })
}

// ? Arrange Agent Chat History
function histmsg(contacts, logs) {
    let contactsLength = contacts.length;
    let logsLength = logs.length;
    for (i = 0; i < contactsLength; i++) {
        $('#chat' + contacts[i].mobile).empty();
    }
    for (a = 0; a < logsLength; a++) {
        let messageTime = conversor_remessa(logs[a].dt);
        for (i = 0; i < contactsLength; i++) {
            let messageComponent;
            if ((contacts[i].sessionid == logs[a].sessionid) || (contacts[i].sessionBot == logs[a].sessionid) || (contacts[i].sessionBotCcs == logs[a].sessionid)) {
                if (logs[a].msgdir === 'i') {
                    if (logs[a].msgtype === 'chat') {
                        messageComponent = msgtxtl(logs[a].msgtext, contacts[i].mobile, messageTime);
                    } else if (logs[a].msgtype === 'image') {
                        if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
                            messageComponent = previewimgtx(logs[a].msgurl, contacts[i].mobile, messageTime, logs[a].msgcaption, logs[a].dt);
                        } else {
                            messageComponent = previewimg(logs[a].msgurl, contacts[i].mobile);
                        }
                    } else if (logs[a].msgtype === 'video') {
                        if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
                            messageComponent = previewvidtx(logs[a].msgurl, logs[a].msgcaption, contacts[i].mobile);
                        } else {
                            messageComponent = previewvid(logs[a].msgurl, contacts[i].mobile);
                        }
                    } else if (logs[a].msgtype === 'ptt') {
                        messageComponent = previewaud(logs[a].msgurl, contacts[i].mobile);
                    } else if (logs[a].msgtype === 'audio') {
                        if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
                            messageComponent = previewaudtx(logs[a].msgurl, logs[a].msgcaption, contacts[i].mobile);
                        } else {
                            messageComponent = previewaud(logs[a].msgurl, contacts[i].mobile);
                        }
                    } else if (logs[a].msgtype === 'document') {
                        if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
                            messageComponent = previewdoctx(logs[a].msgurl, logs[a].msgcaption, contacts[i].mobile);
                        } else {
                            messageComponent = previewdoc(logs[a].msgurl, contacts[i].mobile);

                        }
                    }
                } else if (logs[a].msgdir === 'o') {
                    if (logs[a].msgtype === 'chat') {
                        messageComponent = msgtxtr(logs[a].msgtext, logs[a].fromname, messageTime);
                    } else if (logs[a].msgtype === 'transfer') {
                        messageComponent = msgtxtr(logs[a].msgtext, logs[a].fromname, messageTime);
                    } else if (logs[a].msgtype === 'image') {
                        if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
                            messageComponent = previewimgtxr(logs[a].msgurl, logs[a].fromname, messageTime, logs[a].msgcaption, logs[a].dt);
                        } else {
                            messageComponent = previewimgr(logs[a].msgurl, logs[a].fromname);
                        }
                    } else if (logs[a].msgtype === 'video') {
                        if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
                            messageComponent = previewvidtxr(logs[a].msgurl, logs[a].msgcaption, logs[a].fromname);
                        } else {
                            messageComponent = previewvidr(logs[a].msgurl, logs[a].fromname);
                        }
                    } else if (logs[a].msgtype === 'ptt') {
                        messageComponent = previewaudr(logs[a].msgurl, logs[a].fromname);
                    } else if (logs[a].msgtype === 'audio') {
                        if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
                            messageComponent = previewaudrtx(logs[a].msgurl, logs[a].msgcaption, logs[a].fromname);
                        } else {
                            messageComponent = previewaudr(logs[a].msgurl, logs[a].fromname);
                        }
                    } else if (logs[a].msgtype === 'document') {
                        if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
                            messageComponent = previewdoctxr(logs[a].msgurl, logs[a].msgcaption, logs[a].fromname);
                        } else {
                            messageComponent = previewdocr(logs[a].msgurl, logs[a].fromname);
                        }
                    }
                }
                $('#chat' + contacts[i].mobile).append(messageComponent);
            }
        }
    }
}

// ? Timer
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ? Get message style time
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

// ? Agent Logout
function logoutAgent() {
    sessionStorage.clear();
    socket.disconnect();
    window.location = "index.html";
}

// ? Call mobile from Mailing
function callMobile(mobile) {
    $("#mailModal").modal('hide');
    socket.emit('bi-atendemail', {
        fkid: agentFkid,
        fkname: agentFkname,
        mobile: mobile
    });
}

// ? Call Warning Modal
function callWarningModal(title, desc) {
    $("#warningModalTitle").text(title);
    $("#warningModalDesc").text(desc);
    $("#warningModal").modal();
}