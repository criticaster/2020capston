
// function getSelectedWord(){
// 	var word = "";
// 	if(window.getSelection){
// 		txt = window.getSelection().toString();
// 	}
// 	else if(window.document.getSelection){
// 		txt = window.document.getSelection().toString();
// 	}
// 	else if(window.document.selection) {
// 		txt = window.document.selection.createRange().text;
// 	}
// 	return txt;
// }

// var setContents = function(e) {
// 	var word = getSelectedWord();
// 	if(word == ""){
// 		window.document.getElementById('mousePosition').innerHTML = e.x + 'x' + e.y;
// 	}
// 	else {
// 		window.document.getElementById('mousePosition').innerHTML = word;
// 	}
// };

// var toggle = function() {
// 	var el = window.document.createElement('div');
// 	el.setAttribute('id', 'mousePosition');
// 	el.innerHTML = '0x0';

// 	window.document.body.appendChild(el);
// 	window.document.addEventListener('mousemove', setContents);
// };

// toggle();