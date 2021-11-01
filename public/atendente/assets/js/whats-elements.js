function userListDiv(mobile, message, messageTime, protocolo) {
    let component = `
        <div id="list${mobile}" class="user-list-item" onclick="openChat(this.id)">
            <div>
                <img src="https://cdn.ubicuacloud.com/file/null" alt="" class="user-list-item-avatar">
            </div>
            <div class="user-list-item-text-group">
                <div>
                    +${mobile}
                </div>
                <div class="user-list-item-message-group">
                    <span class="user-list-item-message-content">
                        ${message}
                    </span>
                </div>
                <div>
                    ${protocolo}
                </div>
            </div>
            <div class="user-list-item-time-group">
                <div>
                    <span>${messageTime}</span>
                </div>
                <div>
                    <img src="../atendente/assets/images/whatsIcon.png" alt="">
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