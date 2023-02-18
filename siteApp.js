function id(el) {
	return document.getElementById(el);
}
'use strict';

// GLOBAL VARIABLES	
var db=null;
var list={};
var currentListItem=null;
var sets=[{'name':'Bonsall Barns','images':['SK274577','SK273588','SK266572','SK262575','SK241598','SK259579']},
{'name':'birds','images':['buzzard','avocet']},
{'name':'Orkney','images':['Kirkwall Street','Stones of Stenness','Marwick']}];
var setIndex;
var images=[];
var image;
var currentDialog='messageDialog';
var depth=0; // 0 is project list; 1 is element list; 2 is layer laist
var dragStart={};

 
// DRAG TO CHANGE DEPTH
id('main').addEventListener('touchstart', function(event) {
    dragStart.x=event.changedTouches[0].clientX;
    dragStart.y=event.changedTouches[0].clientY;
    console.log('touch start at '+dragStart.x);
})

id('main').addEventListener('touchend', function(event) {
    var drag={};
    drag.x=dragStart.x-event.changedTouches[0].clientX;
    drag.y=dragStart.y-event.changedTouches[0].clientY;
    console.log('dragged '+drag.x+'; depth: '+depth);
    if(Math.abs(drag.y)>50) return; // ignore vertical drags
    if((drag.x<-50)&&(depth>0)) { // drag right to go back...
        depth--;
    }
    else if(drag.x>50) { // drag left to close dialogs
    	if(currentDialog) showDialog(currentDialog,false);
    }
})

// TAP ON HEADER
id('header').addEventListener('click',function() {
	console.log('depth: '+depth);
	switch(depth) {
	}
	
});

// LIST SETS
function listSets() {
	for(var i in sets) {
		console.log('set '+i+': '+sets[i].name+'; images...');
		for(var j in sets[i].images) console.log(sets[i].images[j]);
		var listItem = document.createElement('li');
		listItem.classList.add('set');
		listItem.index=i;
		listItem.addEventListener('click', function(){setIndex=this.index; showSet();});
		image=document.createElement('img');
		image.classList.add('set-image');
		image.src='images/'+sets[i].name+'/'+sets[i].images[0]+'.JPG';
		console.log('set image: '+image.src);
		listItem.appendChild(image);
		var caption=document.createElement('div');
		caption.classList.add('img-text');
		caption.innerText=' '+sets[i].name+' ';
		listItem.appendChild(caption);
		id('list').appendChild(listItem);
	}
}

// SHOW CURRENT SET
function showSet() {
	console.log('SHOW SET '+setIndex);
}

// DISPLAY MESSAGE
function display(message) {
	id('message').innerText=message;
	showDialog('messageDialog',true);
}

// SHOW/HIDE DIALOG
function showDialog(dialog,show) {
    console.log('show '+dialog+': '+show);
    if(currentDialog) id(currentDialog).style.display='none';
    if(show) {
        id(dialog).style.display='block';
        currentDialog=dialog;
    }
    else {
        id(dialog).style.display='none';
        currentDialog=null;
    }
}

//UTILITY FUNCTIONS
function shuffle(array) {
  var currentIndex=array.length;
  var randomIndex;

  // While there remain elements to shuffle.
  while(currentIndex!==0) {
    // Pick a remaining element.
    randomIndex=Math.floor(Math.random()*currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex],array[randomIndex]]=[array[randomIndex], array[currentIndex]];
  }
  return array;
}

function trim(text,len) {
	if(text.length>len) return(text.substr(0,len-2)+'..');
	else return text;
	
}

// START-UP CODE
lastSave=window.localStorage.getItem('lastSave');
console.log("last save: "+lastSave);
// load items from database
var request=window.indexedDB.open("siteDB",2);
request.onsuccess=function (event) {
	db=event.target.result;
	console.log("DB open");
	// display('HI THERE');
	sets=shuffle(sets); // at start, shuffle order of sets and of images in each set
	for(var i in sets) sets[i].images=shuffle(sets[i].images); 
	console.log('shuffled first set: '+sets[0].name+'; first image: '+sets[0].images[0]);
	listSets();
};
// ***** DELETE layers OBJECT STORE ******
request.onupgradeneeded=function(event) {
	db=event.currentTarget.result;
	/* SET UP OBJECT STORES
	if(!db.objectStoreNames.contains('projects')) {
		dbObjectStore=event.currentTarget.result.createObjectStore("projects",{
			keyPath:'id',autoIncrement: true});
			console.log("projects store created");
	}
	else console.log("projects store exists");
	if(!db.objectStoreNames.contains('elements')) {
		dbObjectStore=event.currentTarget.result.createObjectStore("elements",{
		keyPath:'id',autoIncrement: true});
		console.log("elements store created");
	}
	else console.log("elements store exists");
	if(!db.objectStoreNames.contains('materials')) {
		dbObjectStore=event.currentTarget.result.createObjectStore("materials",{
		keyPath:'id',autoIncrement: true});
		console.log("materials store created");
	*/
}
request.onerror=function(event) {
	display("indexedDB error code "+event.target.errorCode);
};
	
// implement service worker if browser is PWA friendly
if (navigator.serviceWorker.controller) {
	console.log('Active service worker found, no need to register')
} else { //Register the ServiceWorker
	navigator.serviceWorker.register('siteSW.js', {
		scope: '/site/'
	}).then(function(reg) {
		console.log('Service worker has been registered for scope:'+ reg.scope);
	});
}


