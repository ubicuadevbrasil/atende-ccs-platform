//filtros
$('.filters').append(`
<div class="cardFilter">
<div class="cardFilterImg">
    <img class="cpfIcon" src="./assets/images/cpfbranco.png">
</div>
<input class="cpfSearch" placeholder="CPF/CNPJ" type="text" onkeypress="$(this).mask('000.000.000-00/9999-99')">
</div>

<div class="cardFilter">
<div class="cardFilterImg">
    <img class="phoneIcon" src="./assets/images/telefone.png">
</div>
<input class="phoneSearch" placeholder="Celular" type="text" onkeypress="$(this).mask('+00 (00) 0000-00009')">
</div>

<div class="cardFilter">
<div class="cardFilterImg">
    <img class="dateIcon" src="./assets/images/calendrario.png">
</div>
<input class="dateRangePicker" placeholder="Período" type="text" readonly="true">
</div>

<div class="cardFilter">
<div class="cardFilterImg">
    <img class="barsIcon" style="height: 20px; width: 20px;" src="./assets/images/menuHamburguer.png">
</div>
<input class="protocolSearch" placeholder="N° Protocolo" type="text" maxlength="4">
</div>

<div style="margin-left: 35px" class="cardFilter">
<div class="cardFilterImg">
    <img class="searchIcon" src="./assets/images/search.png">
</div>
<input placeholder="Busca" class="searchInput" type="text" readonly="true">
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
$("#buttonReturn").on('click', function() {
    window.location.replace("https://ccs.atendimento-kainos.com.br/atendente/whats.html");
})

