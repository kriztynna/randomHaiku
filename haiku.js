var fs = require("fs");
// open the cmu dictionary file for "reading" (the little r)
// cmudict_file = File.open('cmudict.txt', 'r')
var dictionary = {}

fs.readFile('cmudict.txt', function(err, data) {
  if(err) {
    return console.log(err);
  }
  var lines = data.toString().split("\n");
  
  lines.forEach(function(line) {
  	var line_split = line.split("  ");
  	var word = line_split[0];
  	var phoneme_layout = line_split[1];
  	var phonemes = phoneme_layout.split(" ");
  	var syb = phonemes.filter(function(a){return a.match(/\d/);}).length; 
    var emphasis = phonemes.filter(function(a){return a.match(/\d/);}).map(function(a){return Number(a.match(/\d/)[0]);});
    var new_word = {
    	"word": word,
    	"phonemes": phonemes,
    	"syb": syb,
    	"emphasis": emphasis
    };
    if (!dictionary[syb]){
    	dictionary[syb] = [new_word];
    }
    else {
    	dictionary[syb].push(new_word);
    }
  });
  haikuMaker(dictionary);
});

function haikuMaker(dictionary){
  var lines = genLines();
  var haiku = [];
  // makes each line
  for (var i=0;i<lines.length;i++){
    var line = [];
    // makes each word in the line
    for (var j=0; j<lines[i].length;j++){
      line.push(pickAWord(dictionary,lines[i][j]).replace(/\((\d)\)/,"").toLowerCase());
    }
    line = line.join(" ");
    line = line.charAt(0).toUpperCase() + line.slice(1);
    haiku.push(line);
  }
  haiku = haiku.join("\n");
  console.log(haiku);
}

function genLines(){
  var lines = [[5],[7],[5]];
  for (var i = 0; i<lines.length;i++){
    var splits = Math.floor(Math.random() * lines[i][0])
    for (var j=1;j<=splits;j++){
      splitLine(lines[i]);
    }
  }
  return lines;
}

function splitLine (input){
  var sybs = Math.floor(Math.random() * input.slice(-1)[0]) + 1;
  var remaining = input.slice(-1)[0] - sybs;
  input.pop()
  input.push(sybs);
  if (remaining!=0) {
    input.push(remaining);
  }
}

function pickAWord(dictionary,sybCount){
	var index = Math.floor(Math.random() * dictionary[sybCount].length);
	return dictionary[sybCount][index]["word"];
}