// WebkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

// Global Vars
var gumStream, recorder, input, encodingType, audioContext
var encodeAfterRecord = true;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var encodingTypeSelect = "mp3";
var recordButton = document.getElementById("buttonSendAudio");
var stopButton = document.getElementById("button-send-audio");
var cancelButton = document.getElementById("button-cancel-audio");

// Listeners
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
cancelButton.addEventListener("click", cancelRecordingWhats);

// Começa a gravação e cria o listener nativo do navegador
function startRecording() {
	// Block Changing Chats
	varOpenChat = false

    $(".chat-body-input-box").css("grid-template-columns", "8% 69% 18% 8%")
    $(".audio-modal").css("display", "flex")
    $("#buttonSendAudio").css("display", "none")
    startTimer()
    
    var constraints = { audio: true, video:false }

    // Listener nativo
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {

		audioContext = new AudioContext();
		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);

		encodingType = 'mp3';
		
		recorder = new WebAudioRecorder(input, {
		  workerDir: "../atendente/assets/js/dependencies/",
		  encoding: 'mp3',
		  numChannels:2,
		  onEncoderLoading: function(recorder, encoding) {
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		  }
		});

		recorder.onComplete = function(recorder, blob) { 
			createDownloadLink(blob,recorder.encoding);
		}

		recorder.setOptions({
		  timeLimit:3600,
		  encodeAfterRecord:encodeAfterRecord,
	      ogg: {quality: 0.5},
	      mp3: {bitRate: 160}
	    });
		recorder.startRecording();
	}).catch(function(err) {
        console.log(err)
	});
}

// Para a gravação da stream e recorder
function stopRecording() {
	gumStream.getAudioTracks()[0].stop();
	recorder.finishRecording();
	// Unblock Changing Chats
	varOpenChat = true
}

// Para a gravação da stream e cancela recorder
function cancelRecordingWhats() {
	gumStream.getAudioTracks()[0].stop();
    recorder.cancelRecording()
	// Unblock Changing Chats
	varOpenChat = true
}

//Envia para o CDN e transforma blob em arquivo
function createDownloadLink(blob,encoding) {
	var url = URL.createObjectURL(blob);
    const reader = new window.FileReader()
    let arquivo = new File([blob], "audio.mp3", { type: "audio/mpeg" })
    reader.readAsDataURL(blob)
    reader.onloadend = async () => {
        const audio = document.createElement('audio')
        uploadAudioFile(arquivo)
        audio.src = reader.result
        audio.controls = true
        audio.nodeType = 'audio/mpeg'
    }
    resetTimer()
}
