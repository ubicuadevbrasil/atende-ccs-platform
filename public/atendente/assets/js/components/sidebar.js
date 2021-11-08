let sidebarExpanded = false;
let sidebar = `
    <span class="expand-sidebar-icon" id="hamburgerIcon">
        <div id="nav-icon4">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </span>

    <div class="hide-container" style="display: none;">
        <div class="user-icon-container">
            <span class="user-icon">
                <img id="user-profile-pic" style="width: 100px;" src="../atendente/assets/images/AVT-1.png"
                    alt="user-icon">
            </span>
            <span class="engrenagem-icon">
                <img src="../atendente/assets/images/engrenagem.png" alt="engrenagem">
            </span>
        </div>

        <div class="change-profile-modal">
            <button class="user-pic-button">
                <img id="AVT-1" class="avatar-pic" src="../atendente/assets/images/AVT-1.png" alt="user-icon">
            </button>
            <button class="user-pic-button">
                <img id="AVT-2" class="avatar-pic" src="../atendente/assets/images/AVT-2.png" alt="user-icon">
            </button>
            <button class="user-pic-button">
                <img id="AVT-3" class="avatar-pic" src="../atendente/assets/images/AVT-3.png" alt="user-icon">
            </button>
            <button class="user-pic-button">
                <img id="AVT-4" class="avatar-pic" src="../atendente/assets/images/AVT-4.png" alt="user-icon">
            </button>
            <button class="user-pic-button">
                <img id="AVT-5" class="avatar-pic" src="../atendente/assets/images/AVT-5.png" alt="user-icon">
            </button>
            <button class="user-pic-button">
                <img id="AVT-6" class="avatar-pic" src="../atendente/assets/images/AVT-6.png" alt="user-icon">
            </button>
            <button class="user-pic-button">
                <img id="AVT-7" class="avatar-pic" src="../atendente/assets/images/AVT-7.png" alt="user-icon">
            </button>
            <button class="user-pic-button">
                <img id="AVT-8" class="avatar-pic" src="../atendente/assets/images/AVT-8.png" alt="user-icon">
            </button>
            <button class="user-pic-button">
                <img id="AVT-9" class="avatar-pic" src="../atendente/assets/images/AVT-9.png" alt="user-icon">
            </button>
        </div>

        <div class="user-name-container">
            <span style="font-size: 13px;">Atendente:</span>
            <span id="user-name" style="font-size: 22px;"></span>
        </div>
    </div>
    <div class="side-bar-buttons">
        <div class="top-buttons">
            <button id="buttonResponseEdit" class="side-bar-button">
                <i class="fas fa-pencil-alt"></i>
                <span class="d-none editor-label" name="editor-label">Editor de respostas</span>
            </button>

            <button id="buttonThemeEdit" class="side-bar-button">
                <i class="fas fa-palette"></i>
                <span class="d-none editor-label" name="editor-label">Editar Tema</span>
            </button>
        </div>

        <button id="buttonLogout" class="side-bar-button">
            <i class="fas fa-power-off"></i>
            <span class="d-none editor-label" name="editor-label">Log out</span>
        </button>
    </div>
`;

$("#sidebar").append(sidebar);

if(window.location.pathname == "/atendente/consulta.html"){
    $("#buttonResponseEdit").remove();
    $("#buttonThemeEdit").remove();
}

$(document).ready(function(){
    handleSidebarHover()
    handleHamburguerIconClick()
})

function handleSidebarHover(){

    $("#hamburgerIcon").click(() => {

         if (!sidebarExpanded){

             // left sidebar
            $("#sidebar").css({"width": "15vw"})
            $("#hamburgerIcon").css({"margin-left": "auto", "margin-right": "1vw"})
            $("span[name=editor-label]").toggleClass("d-none")
            $(".side-bar-button").css("font-size", "15px")
            $(".hide-container").fadeIn("fast")

            //right sidebar
            $(".right-side-label").toggleClass("d-none")
            $(".panel-body").css("grid-template-columns", "1fr 5fr 15fr 1fr")
            $(".chat-info-text").css("display", "none")
            $(".elipisis").css("display", "block")

            sidebarExpanded = !sidebarExpanded
        } else {
            $(".hide-container").css("display", "none")
            $("#sidebar").css({"width": ""})
            $("#hamburgerIcon").css({"margin-left": "", "margin-right": ""})
            $("span[name=editor-label]").toggleClass("d-none")
            $(".side-bar-button").css("font-size", "25px") 
            
            $(".right-side-label").toggleClass("d-none") 
            $(".panel-body").css("grid-template-columns", "1fr 5fr 15fr 5fr")
            $(".chat-info-text").css("display", "block")
            $(".elipisis").css("display", "none")

            sidebarExpanded = !sidebarExpanded
        }
    })

}

function handleHamburguerIconClick(){
    $('#nav-icon4').click(function(){
            $(this).toggleClass('open');
        });
}
