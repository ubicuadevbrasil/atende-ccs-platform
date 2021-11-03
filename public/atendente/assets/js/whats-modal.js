// $(document).click(
//     function (event) {
//         if (!$(event.target).closest(".modal-content").length && !$(event.target).closest(".chat-options-group-buttons").length) {
//             $(".modal").fadeOut("fast")
//         }
//     }
// )

$(".close").click(
    function (evt) {
        $(evt.target).closest(".modal").fadeOut("fast")
    })

$(".close-icon").click(
    function (evt) {
        $(evt.target).closest(".modal").fadeOut("fast")
    })