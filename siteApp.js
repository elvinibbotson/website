function id(el) {
	return document.getElementById(el);
}
'use strict';

// GLOBAL VARIABLES	
// var db=null;
// var list={};
// var currentListItem=null;
var sets=[{'name':'Bonsall Barns','text':'Six ink A5 line drawings of barns in various states of repair around Bonsall in Derbyshire','images':['SK274577','SK273588','SK266572','SK262575','SK241598','SK259579']},
{'name':'birds','text':'twenty A5 drawings and paintings of British birds','images':['house sparrow','lesser black-backed gull','cormorant','magpie','grey wagtail','greenfinch','hen harrier','black-throated diver','buzzard','avocet','eider','heron','jay','barn owl','swallow','song thrush','razorbill','nuthatch','mallard','marsh tit']},
{'name':'Orkney','text':'Twelve A5 drawings and paintings around Orkney','images':['Kirkwall Street','Stones of Stenness','Marwick','Hoy Sound','Hoxa Head','Brodgar','Waulkmill Bay','Watchstone, Brodgar','Skaill Bay beach','Skaill Bay - Rippled Sand','Ring of Brodgar','Pier Arts Centre, Stromness']},
{'name':'pastoral','text':'Ten 21cm square drawings of everyday farm structures','images':['Alton pig farm','Cherry Orchard Farm barn','Cherry Orchard Farm sheds','fence','Hopton Lane shelter','Lawn Farm barn','Lawn Farm silo','Lawn Farm silos','Sandhall Farm','shepherd hut']}];
var setIndex;
var selling=[{'name':'Bonsall Barns','text':'Available in the shop as a set of A5 prints with a map showing the locations of the barns - all printed on cartridge paper: £15 including UK postage'},
{'name':'pastoral','text':'Available in the shop as a set of 10 prints on cartridge paper 21cm square: £25 including UK postage'}];
/*,{'name':'birds','text':'Available in the shop as a set of A5 colour and b&w prints on cartridge paper with a key sheet'}];*/
var images=[];
var image;
var page='setList'; // start with list of image sets
var pages=['setList'];
// var currentDialog='messageDialog';
// var depth=0; // 0 is project list; 1 is element list; 2 is layer laist
var dragStart=null;
var swipeStart=null;

 
// DRAG TO NAVIGATE
id('main').addEventListener('touchstart', function(event) {
    dragStart=event.changedTouches[0].clientX;
    console.log('drag start at '+dragStart);
})

id('main').addEventListener('touchend', function(event) {
    var drag=dragStart-event.changedTouches[0].clientX;
    console.log('dragged '+drag);
    var p;
    if((drag<-50)&&(pages.length>1)) { // drag right to go back...
        console.log('BACK from '+pages[pages.length-1]+' to '+pages[pages.length-2]);
        p=pages.pop();
		console.log('hide '+p);
    	id(p).style.display='none';
    	page=pages[pages.length-1];
    	console.log('show '+page);
    	id(page).style.display='block';
    	setHeader();
    }
    else if(drag>50) { // drag left to close dialogs
    	console.log('FORWARDS');
    	p=pages[pages.length-1];
    	id(p).style.display='none';
    	switch(p) {
    		case 'setList':
    		case 'set':
    			page='shopping';
    			break;
    		case 'shopping':
    			page='apps';
    			break;
    		case 'apps':
    			page='jottings';
    			break;
    		case 'jottings':
    			page='about';
    	}
    	pages.push(page);
    	id(page).style.display='block';
    	setHeader();
    }
})

// ACTION BUTTON
id('action').addEventListener('click',function() {
	if(page=='set') {
		console.log('BACK TO LIST');
		id('set').style.display='none';
		id('setList').style.display='block';
		page='setList';
		pages.pop();
		console.log(pages.length+' pages');
		id('action').style.background='url(menu.svg) center center no-repeat';
	}
	else {
		console.log('MENU');
		id('menu').style.display='block';
	}
})

// HEADER
id('headerName').addEventListener('click',function() {
	console.log('go from '+page+' to profile page');
	id(page).style.display='none';
	page='profile';
	pages.push(page);
	id(page).style.display='block';
	id('headerTopic').innerHTML='PROFILE';
	closeMenu();
})

// MENU OPTIONS
id('close').addEventListener('click',closeMenu);
id('imagesOption').addEventListener('click',function() {
	console.log('go to images page');
})
id('buyOption').addEventListener('click',function() {
	console.log('go from '+page+' to buy page');
	id(page).style.display='none';
	page='buy';
	pages.push(page);
	id(page).style.display='block';
	id('headerTopic').innerHTML='BUY';
	closeMenu();
})
/*
id('appsOption').addEventListener('click',function() {
	console.log('go from '+page+' to apps page');
	id(page).style.display='none';
	page='apps';
	pages.push(page);
	id(page).style.display='block';
	id('headerTopic').innerHTML='APPS';
	closeMenu();
})
*/
id('profileOption').addEventListener('click',function() {
	console.log('go from '+page+' to profile page');
	id(page).style.display='none';
	page='profile';
	pages.push(page);
	id(page).style.display='block';
	id('headerTopic').innerHTML='PROFILE';
	closeMenu();
})
id('appsLink').addEventListener('click',function() {
	console.log('go from '+page+' to apps page');
	id(page).style.display='none';
	page='apps';
	pages.push(page);
	id(page).style.display='block';
	id('headerTopic').innerHTML='APPS';
})

// SWIPE IMAGE
id('setImage').addEventListener('touchstart',function(event) {
	swipeStart=event.changedTouches[0].clientX;
    console.log('swipe start at '+swipeStart);
})
id('setImage').addEventListener('touchend',function(event) {
	var swipe=swipeStart-event.changedTouches[0].clientX;
	event.stopPropagation(); // avoid swipe changing page
    console.log('dragged '+swipe);
    if(swipe<-50) previous(); // swipe right for previous image...
    else if(swipe>50) next(); // swipe left for next image
})

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
		id('setList').appendChild(listItem);
	}
	page='setList';
	// id('action').innerHTML='<img src="menu.svg"/>';
	id('action').style.background='url(menu.svg) center center no-repeat';
}

// SHOW CURRENT SET
function showSet() {
	console.log('SHOW SET '+setIndex);
	images=sets[setIndex].images;
	image=0;
	id('image').src='images/'+sets[setIndex].name+'/'+images[image]+'.JPG';
	id('caption').innerText=images[image];
	id('setTitle').innerHTML='<b>'+sets[setIndex].name+'</b>';
	id('setText').innerHTML=sets[setIndex].text;
	id('saleText').innerHTML='';
	var n=0;
	found=false;
	console.log('check '+selling.length+'sale items');
	while(n<selling.length && !found) {
		if(selling[n].name==sets[setIndex].name) found=true;
		else n++;
	}
	console.log('found: '+found);
	if(found) {
		var name=sets[setIndex].name.replaceAll(' ','-');
		console.log('shop page: '+name);
		id('saleText').innerHTML=selling[n].text+'<br><a href="https://elvinibbotson.bigcartel.com/product/'+name+'"><button class="text-button">BUY</button></a>'; // add onclick to got to right page at shop site
	}
	id('setList').style.display='none';
	id('set').style.display='block';
	page='set';
	pages.push(page);
	console.log(pages.length+' pages');
	id('action').style.background='url(back.svg) center center no-repeat';
}

// STEP THROUGH SET IMAGES
id('previous').addEventListener('click',previous);
id('next').addEventListener('click',next);

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

function previous() {
	console.log('PREVIOUS IMAGE');
	image--; // previous image
	if(image<0) image=images.length-1; // loop back to last images
	id('image').src='images/'+sets[setIndex].name+'/'+images[image]+'.JPG';
	id('caption').innerText=images[image];
}

function next() {
	console.log('NEXT IMAGE');
	image++; // previous image
	if(image==images.length) image=0; // loop back to first image
	id('image').src='images/'+sets[setIndex].name+'/'+images[image]+'.JPG';
	id('caption').innerText=images[image];
}

function setHeader() {
	console.log('set header for page '+page);
	var title;
	switch(page) {
		case 'setList':
		case 'set':
			title='IMAGES';
			break;
		case 'shopping':
			title='SHOPPING';
			break;
		case 'apps':
			title='APPS';
			break;
		// etc
	}
	id('headerTopic').innerText=title;
	id('action').style.background='url(menu.svg) center center no-repeat';
}

function closeMenu() {
	id('menu').style.display='none';
}

function trim(text,len) {
	if(text.length>len) return(text.substr(0,len-2)+'..');
	else return text;
	
}

// START-UP CODE
// lastSave=window.localStorage.getItem('lastSave');
// console.log("last save: "+lastSave);
// load items from database
// var request=window.indexedDB.open("siteDB",2);
/* request.onsuccess=function (event) {
	db=event.target.result;
	console.log("DB open");
	// display('HI THERE');
	sets=shuffle(sets); // at start, shuffle order of sets and of images in each set
	for(var i in sets) sets[i].images=shuffle(sets[i].images); 
	console.log('shuffled first set: '+sets[0].name+'; first image: '+sets[0].images[0]);
	listSets();
};

var w=id('menu').offsetWidth;
id('menu').style.left=(-1*w)+'px';
*/
sets=shuffle(sets); // at start, shuffle order of sets and of images in each set
for(var i in sets) sets[i].images=shuffle(sets[i].images); 
console.log('shuffled first set: '+sets[0].name+'; first image: '+sets[0].images[0]);
listSets();
/*
request.onupgradeneeded=function(event) {
	db=event.currentTarget.result;
	// SET UP OBJECT STORES
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
}
request.onerror=function(event) {
	display("indexedDB error code "+event.target.errorCode);
};
*/	
/* implement service worker if browser is PWA friendly
if (navigator.serviceWorker.controller) {
	console.log('Active service worker found, no need to register')
} else { //Register the ServiceWorker
	navigator.serviceWorker.register('siteSW.js', {
		scope: '/site/'
	}).then(function(reg) {
		console.log('Service worker has been registered for scope:'+ reg.scope);
	});
}
*/

