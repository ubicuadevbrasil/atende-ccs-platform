$(document).ready(function(){
    handleSidebarHover()
    handleHamburguerIconClick()
    
})

var sidebarExpanded = false

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
