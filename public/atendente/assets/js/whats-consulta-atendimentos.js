$(document).ready(function () {
    handleSidebarHover()
})

var sidebarExpanded = false

function handleSidebarHover() {

    $("#hamburgerIcon").click(() => {

        if (!sidebarExpanded) {

            // left sidebar
            $("#sidebar").css({ "width": "17.5vw" })
            $("#hamburgerIcon").css({ "margin-left": "auto", "margin-right": "1vw" })
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
            $("#sidebar").css({ "width": "" })
            $("#hamburgerIcon").css({ "margin-left": "", "margin-right": "" })
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

// show profile photo exchange
$('#engrenagemIcon').on('click', () => {
    $('#alterProfileImg').fadeToggle('slow')
    $('#alterProfileImg').toggleClass('d-none')
})

// profile img options
$("#alterProfileImg").append(`
<div class="alter-profile-img">
<div>
    <button class="profile-icon">
        <img src="../atendente/assets/images/avatar 01.png" alt="user-icon">
    </button>
    <button class="profile-icon">
        <img src="../atendente/assets/images/avatar 02.png" alt="user-icon">
    </button>
    <button class="profile-icon">
        <img src="../atendente/assets/images/avatar 03.png" alt="user-icon">
    </button>
</div>

<div>
    <button class="profile-icon">
        <img src="../atendente/assets/images/avatar 04.png" alt="user-icon">
    </button>
    <button class="profile-icon">
        <img src="../atendente/assets/images/avatar 05.png" alt="user-icon">
    </button>
    <button class="profile-icon">
        <img src="../atendente/assets/images/avatar 06.png" alt="user-icon">
    </button>
</div>
<div>
    <button class="profile-icon">
        <img src="../atendente/assets/images/avatar 07.png" alt="user-icon">
    </button>
    <button class="profile-icon">
        <img src="../atendente/assets/images/avatar 08.png" class="profile-icon" alt="user-icon">
    </button>
    <button class="profile-icon">
        <img src="../atendente/assets/images/avatar 09.png" alt="user-icon">
    </button>
</div>
<button class="alter-profile-btn">Confirmar</button>
</div>`)