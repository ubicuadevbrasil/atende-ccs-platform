// All Modals
let mediaModal = `
    <div id="mediaModal" class="modal">
        <div class="modal-content anexo-content">
            <div class="modal-header" style="background-color: #0E6058">
                <i class="fas fa-paperclip"></i>
                <span class="modal-header-label">Anexo</span>
                <span class="close-icon">&times;</span>
            </div>
            <div class="modal-body">
                <span id="modal-text">Que tipo de arquivo deseja enviar?</span>
                <div class="buttons">
                    <button id="insertDoc" class="modal-button anexo-button"><i class="fas fa-file"></i>
                        Documento</button>
                    <button id="insertAudio" class="modal-button anexo-button"><i class="fas fa-headphones"></i>
                        Áudio</button>
                    <button id="insertVideo" class="modal-button anexo-button"><i class="fas fa-video"></i>
                        Video</button>
                    <button id="insertImage" class="modal-button anexo-button"><i class="far fa-image"></i>
                        Imagem</button>
                </div>
            </div>
        </div>
    </div>
`

let successModal = `
    <div id="succesModal" class="modal">
        <div class="modal-content">
            <div class="modal-header warning-header" style="background-color: #61dd56;">
                <i class="fas fa-exclamation"></i>
            </div>
            <div class="modal-body">
                <span id="succesModalTitle"></span>
                <span id="succesModalDesc"></span>
                <button class="modal-button close" style="background-color: #a8d18c;">OK</button>
            </div>
        </div>
    </div>
`

let closeChatModal = `
    <div id="interactionEndedModal" class="modal">
        <div class="modal-content">
            <div class="modal-header warning-header" style="background-color: #61dd56;">
                <i class="fas fa-exclamation"></i>
            </div>
            <div class="modal-body">
                <span id="succesModalTitle">Interação encerrada com sucesso.</span>
                <button class="modal-button close" style="background-color: #a8d18c;">OK</button>
            </div>
        </div>
    </div>
`

let alertModal = `
    <div id="warningModal" class="modal">
        <div class="modal-content">
            <div class="modal-header warning-header" style="background-color: #E2BD23;">
                <i class="fas fa-exclamation"></i>
            </div>
            <div class="modal-body">
                <span id="warningModalTitle"></span>
                <span id="warningModalDesc"></span>
                <button class="modal-button close" style="background-color: #E2BD23;">OK</button>
            </div>
        </div>
    </div>
`

let formModal = `
    <div id="formModal" class="modal">
        <div class="modal-content">
            <div class="modal-header padding-header" style="background-color: var(--color-primary);">
                <i class="fas fa-user-edit"></i>
                <span class="modal-header-label">Encerrar Atendimento</span>
            </div>
            <div class="modal-body">
                <select id="endOptions" class="formEncInput" name="">
                    <option>Selecione</option>
                </select>
                <input id="endFormCpf" class="formEncInput" type="text" placeholder="CPF">
                <input id="endFormBanco" class="formEncInput" type="text" placeholder="Banco">
                <input id="endFormProtocolo" class="formEncInput" type="text" placeholder="Protocolo">
                <div style="display: grid; grid-template-columns: 1fr 1fr;">
                    <button id="confirmEnd" class="modal-button close"
                        style="background-color: var(--color-primary);">Encerrar</button>
                    <button class="modal-button close">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
`

let transferModal = `
    <div id="transferModal" class="modal">
        <div class="modal-content">
            <div class="modal-header padding-header" style="background-color: var(--color-primary);">
                <i class="fas fa-people-arrows"></i>
                <span class="modal-header-label">Transferir Atendimento</span>
            </div>
            <div class="modal-body">
                <select id="atendentesOnline" class="formEncInput" name="">
                    <option value='0'>Selecione</option>
                </select>
                <div style="display: grid; grid-template-columns: 1fr 1fr;">
                    <button id="confirmTransferAgents" class="modal-button close"
                        style="background-color: var(--color-primary);">Transferir</button>
                    <button class="modal-button close">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
`

let singupModal = `
    <div id="signupModal" class="modal">
        <div class="modal-content">
            <div class="modal-header padding-header" style="background-color: var(--color-primary);">
                <i class="fas fa-edit"></i>
                <span class="modal-header-label">Cadastrar cliente</span>
            </div>
            <div class="modal-body">
                <div class="modal-fields">
                    <div class="field">
                        <input id="userNome" type="text" placeholder="Nome" class="formEncInput">
                    </div>
                    <div class="field">
                        <input id="userCPF" type="text" placeholder="CPF" class="formEncInput">
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="modal-button close cancel-button">Cancelar</button>
                    <button id="singupButton" class="modal-button close"
                        style="background-color: var(--color-primary);">OK</button>
                </div>
            </div>
        </div>
    </div>
`

let editAnswerModal = `
    <div id="editAnswerModal" class="modal" style="padding-top: 25px;">
        <div class="modal-content editor-answer">
            <div class="modal-header modal-cadastro-header" style="background-color: var(--color-primary);">
                <i class="fas fa-edit"></i>
                <span class="modal-header-label" style="margin-left: 1rem;">Editor de respostas programadas</span>
                <span class="close-icon">&times;</span>
            </div>
            <div class="modal-body">

                <p>Escreva nos campos de 1 a 5 mensagens pré-programadas para envio para o cliente. Limite 1024
                    caracteres</p>

                <div class="modal-fields">
                    <div class="field" style="align-items: flex-start;">
                        <label for="field1">Resposta 1</label>
                        <div class="input-row">
                            <input type="text" id="questioInput1" placeholder="Digite aqui uma frase..."
                                class="modal-input2">
                        </div>
                    </div>
                    <div class="field" style="align-items: flex-start;">
                        <label for="field2">Resposta 2</label>
                        <div class="input-row">
                            <input type="text" id="questioInput2" placeholder="Digite aqui uma frase..."
                                class="modal-input2">
                        </div>
                    </div>
                    <div class="field" style="align-items: flex-start;">
                        <label for="field3">Resposta 3</label>
                        <div class="input-row">
                            <input type="text" id="questioInput3" placeholder="Digite aqui uma frase..."
                                class="modal-input2">
                        </div>
                    </div>
                    <div class="field" style="align-items: flex-start;">
                        <label for="field4">Resposta 4</label>
                        <div class="input-row">
                            <input type="text" id="questioInput4" placeholder="Digite aqui uma frase..."
                                class="modal-input2">
                        </div>
                    </div>
                    <div class="field" style="align-items: flex-start;">
                        <label for="field5">Resposta 5</label>
                        <div class="input-row">
                            <input type="text" id="questioInput5" placeholder="Digite aqui uma frase..."
                                class="modal-input2">
                        </div>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="modal-button close cancel-button">Cancelar</button>
                    <button id="editQuestionsButton" class="modal-button close"
                        style="background-color: #25D366;">Gravar</button>
                </div>
            </div>
        </div>
    </div>
`

let historyModal = `
    <div id="historicoModal" class="modal modal-history">
        <div class="modal-content history-modal-content">
            <div class="modal-header padding-header" style="background-color: var(--color-primary);">
                <i class="fas fa-history"></i>
                <span class="modal-header-label">Historico do Usuario</span>
                <span class="close-icon">&times;</span>
            </div>
            <div id="chatHistory" class="modal-body modal-history-background">
            </div>
        </div>
    </div>
`

let mailingModal = `
    <div id="mailingModal" class="modal">
        <div class="modal-content mailing-modal">
            <div class="modal-header modal-cadastro-header" style="background-color: var(--color-primary);">
                <i class="fas fa-edit"></i>
                <span class="modal-header-label" style="margin-left: 1rem;">Chamar Mailing</span>
                <span class="close-icon">&times;</span>
            </div>
            <div class="modal-body mailing-modal-body" style="overflow-y: scroll; overflow-x: hidden; max-height: 60vh;">
                <table id="table_id" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Banco</th>
                            <th>Cpf</th>
                            <th>Celular</th>
                            <th>Chamar</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`

let themeModal = `
    <div id="editThemeModal" class="modal">
        <div class="modal-content">
            <div class="modal-header modal-cadastro-header" style="background-color: var(--color-primary);">
                <i class="fas fa-edit"></i>
                <span class="modal-header-label" style="margin-left: 1rem;">Selecione o tema</span>
                <span class="close-icon" id="buttonThemeClose">&times;</span>
            </div>
            <div class="modal-body">
                <div class="theme-buttons">

                    <button class="theme-button" onclick="selectTheme('THM-1')">
                        <div class="theme-button-color-array theme-cornor-left" style="background-color: #4F345A;">
                        </div>
                        <div class="theme-button-color-array" style="background-color: #5D4E6D;"></div>
                        <div class="theme-button-color-array" style="background-color: #8FA998;"></div>
                        <div class="theme-button-color-array" style="background-color: #9CBFA7;"></div>
                        <div class="theme-button-color-array theme-cornor-right" style="background-color: #C9F299;">
                        </div>
                    </button>

                    <button class="theme-button" onclick="selectTheme('THM-2')">
                        <div class="theme-button-color-array theme-cornor-left" style="background-color: #423E28;">
                        </div>
                        <div class="theme-button-color-array" style="background-color: #50723C;"></div>
                        <div class="theme-button-color-array" style="background-color: #63B995;"></div>
                        <div class="theme-button-color-array" style="background-color: #86DEB7;"></div>
                        <div class="theme-button-color-array theme-cornor-right" style="background-color: #ADEEE3;">
                        </div>
                    </button>

                    <button class="theme-button" onclick="selectTheme('THM-3')">
                        <div class="theme-button-color-array theme-cornor-left" style="background-color: #432371;">
                        </div>
                        <div class="theme-button-color-array" style="background-color: #714674;"></div>
                        <div class="theme-button-color-array" style="background-color: #9F6976;"></div>
                        <div class="theme-button-color-array" style="background-color: #CC8B79;"></div>
                        <div class="theme-button-color-array theme-cornor-right" style="background-color: #FAAE7B;">
                        </div>
                    </button>

                    <button class="theme-button" onclick="selectTheme('THM-4')">
                        <div class="theme-button-color-array theme-cornor-left" style="background-color: #0D41E1;">
                        </div>
                        <div class="theme-button-color-array" style="background-color: #0C63E7;"></div>
                        <div class="theme-button-color-array" style="background-color: #0A85ED;"></div>
                        <div class="theme-button-color-array" style="background-color: #09A6F3;"></div>
                        <div class="theme-button-color-array theme-cornor-right" style="background-color: #07C8F9;">
                        </div>
                    </button>

                    <button class="theme-button" onclick="selectTheme('THM-5')">
                        <div class="theme-button-color-array theme-cornor-left" style="background-color: #E85C90;">
                        </div>
                        <div class="theme-button-color-array" style="background-color: #C481A7;"></div>
                        <div class="theme-button-color-array" style="background-color: #A0A6BE;"></div>
                        <div class="theme-button-color-array" style="background-color: #7CCAD5;"></div>
                        <div class="theme-button-color-array theme-cornor-right" style="background-color: #58EFEC;">
                        </div>
                    </button>
                    <button class="theme-button" onclick="selectTheme('THM-6')">
                        <div class="theme-button-color-array theme-cornor-left" style="background-color: #0C1221;">
                        </div>
                        <div class="theme-button-color-array" style="background-color: #141D38;"></div>
                        <div class="theme-button-color-array" style="background-color: #1D2A4C;"></div>
                        <div class="theme-button-color-array" style="background-color: #263860;"></div>
                        <div class="theme-button-color-array theme-cornor-right" style="background-color: #334E7F;">
                        </div>
                    </button>
                </div>
                <div class="modal-buttons">
                    <button class="modal-button close cancel-button" id="buttonThemeCancel">Cancelar</button>
                    <button id="applyThemeButton" class="modal-button close"
                        style="background-color: var(--color-primary);">Aplicar</button>
                </div>
            </div>
        </div>
    </div>
`

// Append Modals
$("body").append(mediaModal);
$("body").append(successModal);
$("body").append(closeChatModal);
$("body").append(alertModal);
$("body").append(formModal);
$("body").append(transferModal);
$("body").append(singupModal);
$("body").append(editAnswerModal);
$("body").append(historyModal);
$("body").append(mailingModal);
$("body").append(themeModal);

// Close Event
$(".close").click(
    function (evt) {
        $(evt.target).closest(".modal").fadeOut("fast")
    })

// Close Event
$(".close-icon").click(
    function (evt) {
        $(evt.target).closest(".modal").fadeOut("fast")
    })