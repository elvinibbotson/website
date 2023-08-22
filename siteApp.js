function id(el) {
	return document.getElementById(el);
}
'use strict';

// GLOBAL VARIABLES	
var sets=[{'name':'Bonsall Barns','text':'Six ink A5 line drawings of barns in various states of repair around Bonsall in Derbyshire','images':['SK274577','SK273588','SK266572','SK262575','SK241598','SK259579']},
{'name':'birds','text':'twenty A5 drawings and paintings of British birds','images':['house sparrow','lesser black-backed gull','cormorant','magpie','grey wagtail','greenfinch','hen harrier','black-throated diver','buzzard','avocet','eider','heron','jay','barn owl','swallow','song thrush','razorbill','nuthatch','mallard','marsh tit']},
{'name':'Orkney','text':'Twelve A5 drawings and paintings around Orkney','images':['Kirkwall Street','Stones of Stenness','Marwick','Hoy Sound','Hoxa Head','Brodgar','Waulkmill Bay','Watchstone, Brodgar','Skaill Bay beach','Skaill Bay - Rippled Sand','Ring of Brodgar','Pier Arts Centre, Stromness']},
{'name':'pastoral','text':'Ten 21cm square drawings of everyday farm structures','images':['Alton pig farm','Cherry Orchard Farm barn','Cherry Orchard Farm sheds','fence','Hopton Lane shelter','Lawn Farm barn','Lawn Farm silo','Lawn Farm silos','Sandhall Farm','shepherd hut']},
{'name':'Offbeat Wirksworth','text':'Ten A4 drawings of less-usual views around Wirksworth','images':['Blind Lane','Bowling Green Lane','Brooklands from Hannage Brook','Coldwell Street','Our Lady Church','Red Lion','St Marys and Blind Lane','The Causeway','The Dale meets Greenhill','Town Hall from Bowling Green Lane']},
{'name':'Offbeat Belper','text':'Ten A4 drawings of less-usual views around Belper','images':['Bridge Street','East Mill','Courtaulds Mill','Short Row','Lodge Drive','Belper Lane','Babington Hospital','Ada Belfield Centre','28a','River Gardens Cafe']}];
var setIndex;
var selling=[{'name':'birds','text':'Available in the shop as individual A5 prints or the set of 20'},
{'name':'Bonsall Barns','text':'Available in the shop as individual A5 prints or the set of 6 with a map showing the locations of the barns'},
{'name':'pastoral','text':'Available in the shop as individual 21cm square prints or the set of 10'},
{'name':'Offbeat Belper','text':'Available in the shop as individual A4 prints or the set of 10 with a key map'},
{'name':'Offbeat Wirksworth','text':'Available in the shop as individual A4 prints or the set of 10 with a key map'}];
/*,{'name':'birds','text':'Available in the shop as a set of A5 colour and b&w prints on cartridge paper with a key sheet'}];*/
var books=[{'name':'Offbeat Belper','url':'https://www.lulu.com/shop/elvin-ibbotson/offbeat-belper/paperback/product-mj4dwp.html'},
{'name':'Offbeat Wirksworth','url':'https://www.lulu.com/shop/elvin-ibbotson/offbeat-wirksworth/paperback/product-rndwn5.html'}]
var images=[];
var image;
var page='setList'; // start with list of image sets
var pages=['setList'];
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
})

// ACTION BUTTON
id('action').addEventListener('click',function() {
	console.log('page '+page);
	/*
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
	*/
	if(page=='setList') {
		console.log('MENU');
		id('menu').style.display='block';
	}
	else {
		console.log('BACK from '+pages[pages.length-1]+' to '+pages[pages.length-2]);
        p=pages.pop();
		console.log('hide '+p);
    	id(p).style.display='none';
    	page=pages[pages.length-1];
    	console.log('show '+page);
    	if(page=='setList') listSets();
    	id(page).style.display='block';
    	setHeader();
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
	id('action').style.background='url(back.svg) center center no-repeat';
	closeMenu();
})

// MENU OPTIONS
id('close').addEventListener('click',closeMenu);
id('imagesOption').addEventListener('click',function() {
	console.log('go to images page');
	page='setList';
	pages=['setList'];
	id(page).style.display='block';
	id('headerTopic').innerHTML='IMAGES';
	id('action').style.background='url(menu.svg) center center no-repeat';
	closeMenu();
});
id('buyOption').addEventListener('click',function() {
	console.log('go from '+page+' to buy page');
	id(page).style.display='none';
	page='buy';
	pages.push(page);
	id(page).style.display='block';
	id('headerTopic').innerHTML='BUY';
	id('action').style.background='url(back.svg) center center no-repeat';
	closeMenu();
});
id('profileOption').addEventListener('click',function() {
	console.log('go from '+page+' to profile page');
	id(page).style.display='none';
	page='profile';
	pages.push(page);
	id(page).style.display='block';
	id('headerTopic').innerHTML='PROFILE';
	id('action').style.background='url(back.svg) center center no-repeat';
	closeMenu();
});
id('appsLink').addEventListener('click',function() {
	console.log('go from '+page+' to apps page');
	id(page).style.display='none';
	page='apps';
	pages.push(page);
	id(page).style.display='block';
	id('headerTopic').innerHTML='APPS';
	id('action').style.background='url(back.svg) center center no-repeat';
	closeMenu();
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
	images=[];
	for(var i in sets) {
		var listItem = document.createElement('li');
		listItem.classList.add('set');
		listItem.index=i;
		listItem.addEventListener('click', function(){setIndex=this.index; showSet();});
		images[i]=document.createElement('img');
		images[i].classList.add('set-image');
		// images[i].src='images/'+sets[i].name+'/slideshow.gif'; // show slideshow GIFs or just first image...
		images[i].src='images/'+sets[i].name+'/'+sets[i].images[0]+'.JPG';
		images[i].onload=function(){
			var w=this.naturalWidth;
			var h=this.naturalHeight;
			if(w>0 && h>0) {
				var change=false;
				console.log('IMAGE SIZE: '+w+'x'+h+' SCREEN: '+screen.width+'x'+screen.height);
				if(h>screen.height) {w*=0.8*screen.height/h;change=true;console.log('reduce height');}
				if(w<screen.width) {change=true;console.log('reduce width');}
				else if(w>screen.width) {w=screen.width*0.9; change=true;console.log('reduce width');}
				if(change) this.style.width=w+'px';
			}
		};
		console.log('set image: '+images[i].src);
		listItem.appendChild(images[i]);
		var caption=document.createElement('div');
		caption.classList.add('img-text');
		caption.innerText=' '+sets[i].name+' ';
		listItem.appendChild(caption);
		id('setList').appendChild(listItem);
	}
	page='setList';
	id('action').style.background='url(menu.svg) center center no-repeat';
}

// SHOW CURRENT SET
function showSet() {
	console.log('SHOW SET '+setIndex);
	id('wait').style.display='block';
	images=sets[setIndex].images;
	image=0;
	id('image').src='images/'+sets[setIndex].name+'/'+images[image]+'.JPG';
	/* id('image').onload=function(){
		var w=this.naturalWidth;
		var h=this.naturalHeight;
		if(w>0 && h>0) {
			var change=false;
			console.log('IMAGE SIZE: '+w+'x'+h+' SCREEN: '+screen.width+'x'+screen.height);
			if(h>screen.height) {w*=0.8*screen.height/h;change=true;console.log('reduce height');}
			if(w<screen.width) {change=true;console.log('reduce width');}
			else if(w>screen.width) {w=screen.width*0.9; change=true;console.log('reduce width');}
			if(change) this.style.width=w+'px';
		}
		id('caption').innerText=images[image];
		id('wait').style.display='none';
	}; */
	id('caption').innerText=images[image];
	id('setTitle').innerHTML='<b>'+sets[setIndex].name+'</b>';
	id('setText').innerHTML=sets[setIndex].text;
	id('saleText').innerHTML='';
	var n=0;
	found=false;
	console.log('check '+selling.length+' sale items');
	while(n<selling.length && !found) {
		if(selling[n].name==sets[setIndex].name) found=true;
		else n++;
	}
	console.log('selling found: '+found);
	if(found) {
		var name=sets[setIndex].name.replaceAll(' ','-');
		console.log('shop page: '+name);
		id('saleText').innerHTML=selling[n].text+'<br><a href="https://elvinibbotson.bigcartel.com/product/'+name+'"><button class="text-button">BUY</button></a>'; // add onclick to got to right page at shop site
	}
	n=0;
	found=false;
	console.log('check '+books.length+' books');
	while(n<books.length && !found) {
		console.log('set name: '+sets[setIndex].name+'; books['+n+']: '+books[n].name);
		if(books[n].name==sets[setIndex].name) found=true;
		else n++;
	}
	console.log('book found: '+found);
	if(found) {
		id('saleText').innerHTML+='<br>available as a book from <a href="'+books[n].url+'"><b>the Lulu bookstore</b></a>';
	}
	id('setList').style.display='none';
	id('set').style.display='block';
	page='set';
	pages.push(page);
	console.log(pages.length+' pages');
	id('action').style.background='url(back.svg) center center no-repeat';
	next();
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
	id('wait').style.display='block';
	image--; // previous image
	if(image<0) image=images.length-1; // loop back to last images
	id('image').src='images/'+sets[setIndex].name+'/'+images[image]+'.JPG';
	id('image').onload=function(){
		var w=this.naturalWidth;
		var h=this.naturalHeight;
		if(w>0 && h>0) {
			var change=false;
			console.log('IMAGE SIZE: '+w+'x'+h+' SCREEN: '+screen.width+'x'+screen.height);
			if(h>screen.height) {w*=0.8*screen.height/h;change=true;console.log('reduce height');}
			if(w<screen.width) {change=true;console.log('reduce width');}
			else if(w>screen.width) {w=screen.width*0.9; change=true;console.log('reduce width');}
			if(change) this.style.width=w+'px';
		}
		id('caption').innerText=images[image];
		id('wait').style.display='none';
	};
}

function next() {
	console.log('NEXT IMAGE');
	id('wait').style.display='block';
	image++; // previous image
	if(image==images.length) image=0; // loop back to first image
	id('image').src='images/'+sets[setIndex].name+'/'+images[image]+'.JPG';
	id('image').onload=function(){
		var w=this.naturalWidth;
		var h=this.naturalHeight;
		if(w>0 && h>0) {
			var change=false;
			console.log('IMAGE SIZE: '+w+'x'+h+' SCREEN: '+screen.width+'x'+screen.height);
			if(h>screen.height) {w*=0.8*screen.height/h;change=true;console.log('reduce height');}
			if(w<screen.width) {change=true;console.log('reduce width');}
			else if(w>screen.width) {w=screen.width*0.9; change=true;console.log('reduce width');}
			if(change) this.style.width=w+'px';
		}
		id('caption').innerText=images[image];
		id('wait').style.display='none';
	};
}

function setHeader() {
	console.log('set header for page '+page);
	var title;
	id('action').style.background='url(back.svg) center center no-repeat';
	switch(page) {
		case 'setList':
			id('action').style.background='url(menu.svg) center center no-repeat';
		case 'set':
			title='IMAGES';
			break;
		case 'buy':
			title='BUY';
			break;
		case 'profile':
			title='PROFILE';
			break;
		case 'apps':
			title='APPS';
			break;
		// etc
	}
	id('headerTopic').innerText=title;
	// id('action').style.background='url(menu.svg) center center no-repeat';
}

function closeMenu() {
	id('menu').style.display='none';
}

function trim(text,len) {
	if(text.length>len) return(text.substr(0,len-2)+'..');
	else return text;
	
}

// START-UP CODE

sets=shuffle(sets); // at start, shuffle order of sets and of images in each set
for(var i in sets) sets[i].images=shuffle(sets[i].images); 
console.log('shuffled first set: '+sets[0].name+'; first image: '+sets[0].images[0]);
listSets();

