// Two-Way Morse Translator
var useAltChars = false;
var master = {
  'a': '.-',    'b': '-...',  'c': '-.-.',
  'd': '-..',   'e': '.',     'f': '..-.',
  'g': '--.',   'h': '....',  'i': '..',
  'j': '.---',  'k': '-.-',   'l': '.-..',
  'm': '--',    'n': '-.',    'o': '---',
  'p': '.--.',  'q': '--.-',  'r': '.-.',
  's': '...',   't': '-',     'u': '..-',
  'v': '...-',  'w': '.--',   'x': '-..-',
  'y': '-.--',  'z': '--..',  '0': '-----',
  '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....',
  '7': '--...', '8': '---..', '9': '----.',
  ' ': ''
};

// Used to parse characters as sound wavs for audio playback
function wavParse(char) {
	if (char == '.' || char == '•') {
		return 'img/dit1s.wav';
	} else if (char == '-' || char == '—') {
		return 'img/dit2s.wav';
	} else if (char == ' ') {
		return 'img/duh1s.wav';
	}
}

// Reads the morse string to playback audio
function playMorse(morse) {
  var speaker = document.getElementById('speakerbox');
  var $button = $('.btn-custom:nth-of-type(2)');
  var morseArr = morse.split('');
  var i = 0;
  speaker.src = wavParse(morseArr[i]);
  speaker.play();

  // Queue the next soundfile after one has ended
  speaker.addEventListener('ended', function() {
    if (i < morseArr.length - 1) {
      i++;
      $button.css('background-color', '#55dd55');
      speaker.src = wavParse(morseArr[i]);
      speaker.play();
    } else if (i >= morseArr.length - 1) {
      $button.css('background-color', 'white');
    }
  });
  i = 0;
};


function textToMorse(string) {
  var output = '';
  var temp = string.toLowerCase().replace(/[^a-z0-9\s+]/g, '').split('');

  for (var j = 0; j < temp.length; j++) {
    if (temp[j]) {
    	output += master[temp[j]] + ' ';
    }
  }

  if (useAltChars) {
    return output.replace(/[-]/g, '—').replace(/[.]/g, '•').slice(0,-1);
  } else {
    return output.slice(0,-1); 
  }

};


function morseToText(string) {
  if (string.charAt(0) == '•' || string.charAt(0) == '—') {
    string = string.replace(/—/g, '-').replace(/•/g, '.');
  }

  var output = '';
  var temp = string.split(' ');

  for (var i = 0; i < temp.length; i++) {
    for (var key in master) {
      if (temp[i] == master[key]) {
          output += key;
      }
    }
  }
  return output;
};
 


$(document).ready(function() { 
  var $output = $('#morse-in textarea');
  var $input = $('#text-in textarea');

  // Text to morse
  $('.btn-custom:first-of-type').click(function() {
    if ($input.val) {
      $output.val(textToMorse($input.val()));
    }
  });

  // Play sound
  $('.btn-custom:nth-of-type(2)').click(function() {
    if ($output.val()){ 
      playMorse($output.val());
    }
  });

  // Change chars for better readability
  $('.btn-custom:nth-of-type(3)').click(function() {
    useAltChars = !useAltChars;
    if (useAltChars){
      var temp = $output.val().replace(/[-]/g, '—').replace(/[.]/g, '•');
      $output.css('letter-spacing', '3px');
      $output.attr('placeholder', textToMorse($input.attr('placeholder')));
      $output.val(temp);
    } else {
      var temp = $output.val().replace(/[—]/g, '-').replace(/[•]/g, '.');
      $output.css('letter-spacing', '1px');
      $output.attr('placeholder', textToMorse($input.attr('placeholder')));
      $output.val(temp);
    }
  });

  // Morse to text
  $('.btn-custom:last-of-type').click(function() {
    if ($output.val()) {
      $input.val(morseToText($output.val()));
    }
  });

});
