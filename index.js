String.prototype.startCase = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

var json = {
  "Hello" : "Hi There",
  "Hi" : "Hi There",
}

var conversation = [];
var recognition = new webkitSpeechRecognition();
document.getElementById("data").innerHTML = "Click on <i class='fa fa-microphone'></i>";

function loader(mode){
  document.getElementById("loader").style.visibility = mode;
}
recognition.lang = "en-US";
recognition.continuous = true;
recognition.interimResults = true;

var msg = new SpeechSynthesisUtterance();

msg.rate = 1;
msg.pitch = 1;
msg.volume = 100;

window.speechSynthesis.onvoiceschanged = function() {
    var voices = window.speechSynthesis.getVoices();
  msg.voice = voices[0];
};

window.speechSynthesis.speaking = function(event){
  console.log(event);
}

recognition.onend = function(e){
  console.log('end');
  loader("hidden");
  if(document.getElementById('mike').classList.contains('active')){
    document.getElementById('mike').classList.toggle("active");
  }
  document.getElementById("data").innerHTML = "Click on <i class='fa fa-microphone'></i>";
}

recognition.onresult = function(e) { 
  var data = "";
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    data += event.results[i][0].transcript.startCase();
    if(event.results[i].isFinal == true){
      var text = event.results[i][0].transcript.startCase();
      var chat = {
        person : 'user',
        content : text
      }
      conversation.push(chat);
      response(chat.content); 
    }  
  }
  loader("hidden");
  document.getElementById("data").innerText = data;
}

document.getElementById('mike').onclick = function(){
  if(document.getElementById('mike').classList.contains('active')){
    recognition.stop();
    loader("hidden");
  }else{
    conversation = [];
    recognition.start();
    loader("visible");
    document.getElementById("data").innerText = "Speak now :)";
  }
  document.getElementById('mike').classList.toggle("active")
}

function response(source){
  console.log("speech", source)
  if(source == "Goodbye" || source == "goodbye"){
    recognition.stop();
  }
  if(json.hasOwnProperty(source.replace( " ", "_"))){
    msg.text = json[source];  
  }else{
    msg.text = source;  
  }
  window.speechSynthesis.speak(msg);
}