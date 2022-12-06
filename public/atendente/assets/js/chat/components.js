function userListDiv(mobile, message, messageTime, protocolo, name) {
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
                <img src="https://cdn.ubicuacloud.com/file/null" alt="" class="user-list-item-avatar">
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
                    ${protocolo}
                </div>
            </div>
            <div class="user-list-item-time-group">
                <div>
                    <span id="lastMessageTime${mobile}" >${messageTime}</span>
                </div>
                <div>
                    <img src="../assets/images/whatsIcon.png">
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
            <img src="${image}" class="chat-body-messages-image" alt="">
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
            <img src="${image}" class="chat-body-messages-image" alt="">
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
            <a href="${url}" target="_blank"><strong>Enviou um audio...</strong></a>
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
            <a href="${url}" target="_blank"><strong>Enviou um audio...</strong></a>
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