// Detect Connection
$("#user-name").text(sessionStorage.getItem('fkname'));
selectTheme(sessionStorage.getItem('tema'), false);
$("#user-profile-pic").prop("src", "../atendente/assets/images/" + (sessionStorage.getItem('avatar')) + ".png");

//filtros
$('.filters').append(`
<div class="cardFilter">
<div class="cardFilterImg">
    <img class="cpfIcon" src="./assets/images/cpfbranco.png">
</div>
<input id="cpfSearch" class="cpfSearch" placeholder="CPF/CNPJ" type="text" onkeypress="$(this).mask('000.000.000-00/9999-99')">
</div>

<div class="cardFilter">
<div class="cardFilterImg">
    <img class="phoneIcon" src="./assets/images/telefone.png">
</div>
<input id="phoneSearch" class="phoneSearch" placeholder="Celular" type="text" onkeypress="$(this).mask('+00 (00) 0000-00009')">
</div>

<div class="cardFilter">
<div class="cardFilterImg">
    <img class="dateIcon" src="./assets/images/calendrario.png">
</div>
<input id="dateSearch" class="dateRangePicker" placeholder="Período" type="text" readonly="true">
</div>

<div class="cardFilter">
<div class="cardFilterImg">
    <img class="barsIcon" style="height: 20px; width: 20px;" src="./assets/images/menuHamburguer.png">
</div>
<input id="protocolSearch" class="protocolSearch" placeholder="N° Protocolo" type="text" maxlength="4">
</div>

<div style="margin-left: 35px" class="cardFilter">
<div class="cardFilterImg">
    <img class="searchIcon" src="./assets/images/search.png">
</div>
<input id="btnBusca" placeholder="Busca" class="searchInput" type="text" readonly="true">
</div>
`)

//datatable
$('.dataTable').append(`
<table id="dataTable" class="tableStyle">
    <thead>
        <tr id="tableHead">
        </tr>
    </thead>
    <tbody id="tableBody">
    </tbody>
</table>
`)

// retornar para tela anterior
$("#buttonReturn").on('click', function () {
    window.location.replace("https://ccs.atendimento-fortalcred.com.br/atendente/chat.html");
})

// Select Theme
function selectTheme(theme, cancel = false) {
    let r = document.querySelector(':root');

    switch (theme) {
        case 'THM-1':
            r.style.setProperty('--color-primary', '#4F345A');
            r.style.setProperty('--color-secondary', '#5D4E6D');
            r.style.setProperty('--color-text-primary', '#fff');
            r.style.setProperty('--color-text-secondary', '#fff');
            r.style.setProperty('--color-hover-secondary', '#C9F299');
            break;

        case 'THM-2':
            r.style.setProperty('--color-primary', '#423E28');
            r.style.setProperty('--color-secondary', '#50723C');
            r.style.setProperty('--color-text-primary', '#fff');
            r.style.setProperty('--color-text-secondary', '#fff');
            r.style.setProperty('--color-hover-secondary', '#ADEEE3');
            break;

        case 'THM-3':
            r.style.setProperty('--color-primary', '#432371');
            r.style.setProperty('--color-secondary', '#714674');
            r.style.setProperty('--color-text-primary', '#fff');
            r.style.setProperty('--color-text-secondary', '#fff');
            r.style.setProperty('--color-hover-secondary', '#FAAE7B');
            break;

        case 'THM-4':
            r.style.setProperty('--color-primary', '#0D41E1');
            r.style.setProperty('--color-secondary', '#0C63E7');
            r.style.setProperty('--color-text-primary', '#fff');
            r.style.setProperty('--color-text-secondary', '#fff');
            r.style.setProperty('--color-hover-secondary', '#07C8F9');
            break;

        case 'THM-5':
            r.style.setProperty('--color-primary', '#E85C90');
            r.style.setProperty('--color-secondary', '#C481A7');
            r.style.setProperty('--color-text-primary', '#fff');
            r.style.setProperty('--color-text-secondary', '#fff');
            r.style.setProperty('--color-hover-secondary', '#58EFEC');
            break;

        case 'THM-6':
            r.style.setProperty('--color-primary', '#1D2A4C');
            r.style.setProperty('--color-secondary', '#263860');
            r.style.setProperty('--color-text-primary', '#fff');
            r.style.setProperty('--color-text-secondary', '#fff');
            r.style.setProperty('--color-hover-secondary', '#334E7F');
            break;

        default:
            break;
    }

    if (cancel) {
        r.style.setProperty('--color-primary', currentColorPrimary);
        r.style.setProperty('--color-secondary', currentColorSecondary);
        r.style.setProperty('--color-text-primary', currentColorTextPrimary);
        r.style.setProperty('--color-text-secondary', currentColorTextSecondary);
        r.style.setProperty('--color-hover-secondary', currentHoverSecondary);
    } else {
        sessionStorage.setItem('tema', theme)
    }
}