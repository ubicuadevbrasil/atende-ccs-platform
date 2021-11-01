// $(document).click(
//     function (event) {
//         if (!$(event.target).closest(".modal-content").length && !$(event.target).closest(".button").length) {
//             $(".modal").css("display", "none")
//         }
//     }
// )

$(".close").click(
    function (evt) {
        $(evt.target).closest(".modal").css("display", "none")
    })

$(".close-icon").click(
    function (evt) {
        $(evt.target).closest(".modal").css("display", "none")
    })