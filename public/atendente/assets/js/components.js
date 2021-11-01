// ? Open chat
function openUserChat(mobile) {
    // Set current user mobile
    currentUserMobile = mobile;
    // Set Chat name with user mobile
    $('#namchat11').text(currentUserMobile);
    // Hide non current chats && Deselect other user on the user list
    hideChats();
    notActive();
    // Arrange chat with user
    document.getElementById("chat" + currentUserMobile).style.display = "block";
    document.getElementById('id' + currentUserMobile).style.backgroundColor = "#e8e8e8";
    // Scroll chat to last message send
    let altchat = document.getElementById("chat11");
    let altscroll = document.getElementById("chat" + currentUserMobile).offsetHeight;
    altchat.scrollBy(0, altscroll);
    // Remove user badge
    $('#s' + currentUserMobile).text(0);
    $('#s' + currentUserMobile).fadeOut(1);
}

// ! Scroll Chat
function pageScroll() {
    let altChat = document.getElementById('chat11');
    let altScroll = document.getElementById('chat11').offsetHeight;
    altChat.scrollBy(0, altScroll);
}

// ! Hide Chats
function hideChats() {
    let chats = document.getElementById("chat11").children;
    for (i = 0; i < chats.length; i++) {
        chats[i].style.display = "none";
    }
}

// ! Deselect other users
function notActive() {
    var chats = document.getElementById("ulConversation").children;
    for (i = 0; i < chats.length; i++) {
        chats[i].style.backgroundColor = "#fff";
    }
}

// ? Change Hash to Base64
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

// ! Close chat with user
async function closeChat(mobile) {
    // Clear current chat panel
    $('#contatos').removeClass('form-loading');
    $('#id' + mobile).remove();
    $('#chat' + mobile).remove();
    $("#imgchat11").attr('src', appCdnFile + 'null');
    $('#namchat11').text('');
    await hideChats();
    $('#newchat').fadeIn(1);
    $('#contatos').removeClass('form-loading');
    // Clear Current mobile
    currentUserMobile = "";
}