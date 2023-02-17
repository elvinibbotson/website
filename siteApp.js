function id(el) {
	return document.getElementById(el);
}
'use strict';

// GLOBAL VARIABLES	
var db=null;
var list={};
var currentListItem=null;
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
	display('HI THERE');
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
