function userListDiv(mobile, message, messageTime, protocolo, name, cpf) {
    let nameInfo;
    if(name != '' && name != null){
        nameInfo = name
    } else {
        nameInfo = '+' + mobile
    }
    let component = `
        <div id="list${mobile}" class="user-list-item" onclick="openChat(this.id)">
            <div class="user-photo">
                <span id="notifyUser${mobile}" class="message-notify" ></span>
                <img src="../atendente/assets/images/avatarLog.png" alt="" class="user-list-item-avatar">
            </div>
            <div class="user-list-item-text-group">
                <div>
                    <span id="userInfoName${mobile}" > ${nameInfo} </span>
                </div>
                <div class="user-list-item-message-group">
                    <span id="lastMessage${mobile}" class="user-list-item-message-content">
                        ${message}
                    </span>
                </div>
                <div>
                    ${mobile}
                </div>
                <div id="protocol${mobile}">
                    ${protocolo}
                </div>
                <div id="cpf${mobile}" style="display: none"></div>
            </div>
            <div class="user-list-item-time-group">
                <div>
                    <span id="lastMessageTime${mobile}" >${messageTime}</span>
                </div>
                <div>
                    <img src="../atendente/assets/images/whatsIcon.png">
                </div>
            </div>
        </div>
    `
    return component
}

function userChatDiv(mobile) {
    let component = `
        <div id="chat${mobile}" class="chat-body-messages closedChat">
        </div>
    `
    return component;
}

function questionsDiv(id, message) {
    let component = `
        <button class="chat-info-group-buttons" onclick="quickQuestion(${id})">
            <span id="question-${id}" class="chat-info-text">
                ${message}
            </span>
            <span class="elipisis">...</span>
        </button>
    `
    return component
}

function messageDate(date) {
    var msg = "<center><div class='center' style='padding: 5px 0px; width: 120px;'>";
    msg += "<div class='date-color' style='word-wrap: break-word; border-radius: 10px; padding: 4px'>";
    msg += "<center><i class='fa fa-calendar'></i> " + date + "</center>";
    msg += "</div></div></center>";

    return (msg);
}

function messageRight(message, messageTime) {
    let component = `
        <div class="chat-body-messages-block-right">
            ${message}
            <div class="chat-body-messages-block-right-time">
                ${messageTime}
            </div>
        </div>
    `
    return component
}

function messageLeft(message, messageTime) {
    let component = `
        <div class="chat-body-messages-block-left">
            ${message}
            <div class="chat-body-messages-block-left-time">
                ${messageTime}
            </div>
        </div>
    `
    return component
}

function messageImageRight(image, caption, messageTime) {
    let component = `
        <div class="chat-body-messages-block-right">
            <a href="${image}" target="_blank">
                <img src="${image}" class="chat-body-messages-image" alt="">
            </a>
            ${caption}
            <div class="chat-body-messages-block-right-time">
                ${messageTime}
            </div>
        </div>
    `
    return component
}

function messageImageLeft(image, caption, messageTime) {
    let component = `
        <div class="chat-body-messages-block-left">
            <a href="${image}" target="_blank">
                <img src="${image}" class="chat-body-messages-image" alt="">
            </a>
            ${caption}
            <div class="chat-body-messages-block-left-time">
                ${messageTime}
            </div>
        </div>
    `
    return component
}

function messageAudioRight(url, caption, messageTime) {
    let component = `
        <div class="chat-body-messages-block-right">
            <audio controls>
                <source src="${url}" type="audio/ogg">
                <source src="${url}" type="audio/mpeg">
                Your browser does not support the audio tag.
            </audio> 
            ${caption}
            <div class="chat-body-messages-block-right-time">
                ${messageTime}
            </div>
        </div>
    `
    return component
}

function messageAudioLeft(url, caption, messageTime) {
    let component = `
        <div class="chat-body-messages-block-left">
            <audio controls>
                <source src="${url}" type="audio/ogg">
                <source src="${url}" type="audio/mpeg">
                Your browser does not support the audio tag.
            </audio> 
            ${caption}
            <div class="chat-body-messages-block-left-time">
                ${messageTime}
            </div>
        </div>
    `
    return component
}

function messageAttachRight(url, caption, messageTime) {
    let component = `
        <div class="chat-body-messages-block-right">
            <a href="${url}" target="_blank"><strong>Enviou um arquivo...</strong></a>
            ${caption}
            <div class="chat-body-messages-block-right-time">
                ${messageTime}
            </div>
        </div>
    `
    return component
}

function messageAttachLeft(url, caption, messageTime) {
    let component = `
        <div class="chat-body-messages-block-left">
            <a href="${url}" target="_blank"><strong>Enviou um arquivo...</strong></a>
            ${caption}
            <div class="chat-body-messages-block-left-time">
                ${messageTime}
            </div>
        </div>
    `
    return component
}