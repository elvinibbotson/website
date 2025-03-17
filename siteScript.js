function id(el) {
	return document.getElementById(el);
}
'use strict';

// DATA
var sets=[{'name':'A4','text':'Fifteen A4 monochrome drawings - various subjects','images':['Froggatt Edge','Alport','Black Rock','Aysgarth Falls','Kinder Scout','reflected sedge','Greenhill Wirksworth','farmhouse and sheep','Satanic Mill','furniture shadows','vessels','post in sand','birchwood','Twin Pines','owl']},
{'name':'Bonsall Barns','text':'Six ink A5 line drawings of barns in various states of repair around Bonsall in Derbyshire','images':['SK274577','SK273588','SK266572','SK262575','SK241598','SK259579']},
{'name':'Top Boy','text':'Five pencil portraits of characters in the award-winning Netflix drama','images':['Dushane','Shelley','Jamie','Jaq','Sully']},
{'name':'birds','text':'twenty A5 drawings and paintings of British birds','images':['house sparrow','lesser black-backed gull','cormorant','magpie','grey wagtail','greenfinch','hen harrier','black-throated diver','buzzard','avocet','eider','heron','jay','barn owl','swallow','song thrush','razorbill','nuthatch','mallard','marsh tit']},
{'name':'Orkney','text':'Twelve A5 drawings and paintings around Orkney','images':['Kirkwall Street','Stones of Stenness','Marwick','Hoy Sound','Hoxa Head','Brodgar','Waulkmill Bay','Watchstone, Brodgar','Skaill Bay beach','Skaill Bay - Rippled Sand','Ring of Brodgar','Pier Arts Centre, Stromness']},
{'name':'pastoral','text':'Ten 21cm square drawings of everyday farm structures','images':['Alton pig farm','Cherry Orchard Farm barn','Cherry Orchard Farm sheds','fence','Hopton Lane shelter','Lawn Farm barn','Lawn Farm silo','Lawn Farm silos','Sandhall Farm','shepherd hut']},
{'name':'Offbeat Wirksworth','text':'Ten A4 drawings of less-usual views around Wirksworth','images':['Blind Lane','Bowling Green Lane','Brooklands from Hannage Brook','Coldwell Street','Our Lady Church','Red Lion','St Marys and Blind Lane','The Causeway','The Dale meets Greenhill','Town Hall from Bowling Green Lane']},
{'name':'Offbeat Belper','text':'Ten A4 drawings of less-usual views around Belper','images':['Bridge Street','East Mill','Courtaulds Mill','Short Row','Lodge Drive','Belper Lane','Babington Hospital','Ada Belfield Centre','28a','River Gardens Cafe']},
{'name':'rocks','text':'Five A4 ink paintings/drawings of rocks','images':['Kinder Scout','Froggatt Edge 1','Froggatt Edge 2','Black Rocks','Traeth Porth Ceiriod']}];
var library=[{'name':'Offbeat Belper','text':'Less-seen views around a Derbyshire town'},
{'name':'Offbeat Wirksworth','text':'Less-seen views around a Derbyshire town'},
{'name':'Urban Myths','text':'<b>Urban Myths</b> Ideas for a town'},
{'name':'Retrofit101','text':'A simple guide to making your home energy efficient'},
{'name':'ecollection','text':'Notes on energy in housing'},
{'name':'Land of Hope','text':'An imagined future Orkney'}];
var apps=[{'name':'Labels','text':'A Chrome extension which provides an icon-based alternative to bookmarking. Instead of saving bookmarks you can label websites with icons and retrieve them by searching for labels. To install, download the extension file, rename it "Labels.crx" and drag it into your Chrome extensions manager page after enabling Developer mode - or equivalent for other browsers.'},
{'name':'Ledger','text':'A phone app for the frugal in all of us - lets you keep track of your bank accounts, savings, investments, etc. Boring but useful.'},
{'name':'Lines','text':'A simple but capable 2D drawing app for laptops, chromebooks or tablets. (Still under the final development and testing).<br>You can download the <a href="Lines user guide.pdf" download><b>user guide</b> here</a>'},
{'name':'Lists','text':'An information repository for your phone. Lists allows you to add notes about whatever you like, organised in lists or lists of lists.'},
{'name':'Locker','text':'Keep lists of anything you prefer not to share: bank PINs and logins, website credentials, safe combinations,... whatever. They are held on your phone in encrypted form and to open the app you enter a four-digit PIN'},
{'name':'Locus','text':'Uses OpenStreetMap in its CyclOSM guise. Designed for cyclists, the app shows the latest open-source mapping including contours and cycle routes and allows you to plan and track your rides.'},
{'name':'Logbook','text':'Record significant events and activities and label them, making them easy to find by date, label or content.'},
{'name':'Losses','text':'Relatively quick and easy estimation of fabric heat losses from a building as an aid at the design stage or to assess possible retrofit measures. You define building elements (walls, roof, openings, etc) by area and construction using a menu of predefined materials or specifying your own.'}]
// GLOBAL VARIABLES
var sections=['gallery','library','code'];
var section=0; // start in gallery section
var setIndex;
var images=[];
var image;
var page='gallery'; // start with list of image sets
var pages=['gallery'];
var dragStart=null;
var swipeStart=null;
var sw=window.innerWidth;
var sh=window.innerHeight;
var maxSize=0;
 
// DRAG TO NAVIGATE
id('main').addEventListener('touchstart', function(event) {
    dragStart=event.changedTouches[0].clientX;
    // console.log('drag start at '+dragStart+' - '+pages.length+' pages');
});
id('main').addEventListener('touchend', function(event) {
    var drag=dragStart-event.changedTouches[0].clientX;
    // console.log('dragged '+drag);
    var p;
    if((drag<-50)&&(pages.length>1)) back();
    else if(pages.length<2) { // drag to next/previous section
    	if(drag<-50) previousSection();
    	else if(drag>50) nextSection();
    }
});
function back() {
	// console.log('BACK from '+pages[pages.length-1]+' to '+pages[pages.length-2]);
		if(page=='viewer') {
			id('view').type=null;
			id('view').data=null;
			id('viewer').style.display='none';
		}
        p=pages.pop();
		// console.log('hide '+p);
    	id(p).style.display='none';
    	page=pages[pages.length-1];
    	// console.log('show '+page);
    	id(page).style.display='block';
    	if(pages.length<2) id('header').style.display='block';
    	id(page).scrollTop=0;
    	id('header').style.display='block';
}

// HEADER
id('logo').addEventListener('click',function() {
	// console.log('go from '+page+' to profile page');
	id(page).style.display='none';
	page='profile';
	pages.push(page);
	id(page).style.display='block';
});
id('nextSection').addEventListener('click',function() {
	// SHIFT SECTIONS << IN HEADER AND SHOW LIST OF DRAWINGS, BOOKS OR APPS
	section=(section+1)%3;
	id('currentSection').innerText=sections[section];
	id('nextSection').innerText=sections[(section+1)%3];
	id('previousSection').innerText=sections[(section+2)%3];
	if(section<1) listSets();
	else if(section==1) openLibrary();
	else listApps();
});
id('previousSection').addEventListener('click',function() {
	// SHIFT SECTIONS >> IN HEADER AND SHOW LIST OF DRAWINGS, BOOKS OR APPS
	section=(section+2)%3;
	id('currentSection').innerText=sections[section];
	id('nextSection').innerText=sections[(section+1)%3];
	id('previousSection').innerText=sections[(section+2)%3];
	if(section<1) listSets();
	else if(section==1) openLibrary();
	else listApps();
});

// LIST GALLERY SETS
function listSets() {
	images=[];
	for(var i in sets) {
		var listItem = document.createElement('li');
		listItem.classList.add('list-item');
		listItem.index=i;
		listItem.addEventListener('click', function() {
			setIndex=this.index;
			// console.log('show set '+setIndex);
			openSet();
		});
		images[i]=document.createElement('img');
		images[i].classList.add('set-image');
		images[i].src='images/'+sets[i].name+'/'+sets[i].images[0]+'.JPG';
		// console.log('set: '+sets[i].name);
		images[i].onload=function(){
			var w=this.naturalWidth;
			var h=this.naturalHeight;
			if(w>0 && h>0) {
				var change=false;
				// console.log('IMAGE SIZE: '+w+'x'+h+' SCREEN: '+sw+'x'+sh);
				if(h>maxSize) {
					w=maxSize*w/h;
					h=maxSize;
					change=true;
				}
				if(w>maxSize) {
					h=maxSize*h/w;
					w=maxSize;
					change=true;
				}
				this.style.width=w+'px';
				this.style.height=h+'px';
				// console.log('resize to '+w+'x'+h);
 			}
		};
		// console.log('set image: '+images[i].src);
		listItem.appendChild(images[i]);
		var caption=document.createElement('div');
		caption.classList.add('img-caption');
		caption.innerText=' '+sets[i].name+' ';
		listItem.appendChild(caption);
		id('gallery').appendChild(listItem);
	}
	id(page).style.display='none';
	pages=[];
	page='gallery';
	pages.push(page);
	id(page).style.display='block';
}

// SHOW CURRENT SET
function openSet() {
	// console.log('SHOW SET '+setIndex);
	setImages=sets[setIndex].images;
	// console.log(setImages.length+' images in set '+sets[setIndex].name);
	id('setItems').innerHTML='';
	for(var i in setImages) {
		var listItem = document.createElement('li');
		listItem.classList.add('list-item');
		listItem.index=i;
		images[i]=document.createElement('img');
		images[i].classList.add('set-image');
		images[i].src='images/'+sets[setIndex].name+'/'+setImages[i]+'.JPG';
		images[i].onload=function(){
			var w=this.naturalWidth;
			var h=this.naturalHeight;
			if(w>0 && h>0) {
				var change=false;
				// console.log('IMAGE SIZE: '+w+'x'+h+' SCREEN: '+sw+'x'+sh);
				if(h>maxSize) {
					w=maxSize*w/h;
					h=maxSize;
					change=true;
				}
				if(w>maxSize) {
					h=maxSize*h/w;
					w=maxSize;
					change=true;
				}
				if(change) {
					this.style.width=w+'px';
					this.style.height=h+'px';
					// console.log('resize to '+w+'x'+h);
				}
			}
		};
		listItem.appendChild(images[i]);
		var caption=document.createElement('div');
		caption.classList.add('img-caption');
		caption.innerText=setImages[i];
		listItem.appendChild(caption);
		id('setItems').appendChild(listItem);
	}
	id('setTitle').innerHTML='<b>'+sets[setIndex].name+'</b>';
	id('setText').innerHTML=sets[setIndex].text;
	id(page).style.display='none';
	id('header').style.display='none';
	id('setItems').scrollTop=0;
	page='set';
	id(page).style.display='block';
	pages.push(page);
	// console.log(pages.length+' pages');
}

function openLibrary() {
	// console.log('OPEN LIBRARY');
	for(var i in library) {
		var listItem = document.createElement('li');
		listItem.classList.add('list-item');
		listItem.index=i;
		listItem.addEventListener('click', function() {
			libraryIndex=this.index;
			// console.log('show library item '+libraryIndex);
			openBook();
		});
		images[i]=document.createElement('img');
		images[i].classList.add('set-image');
		images[i].src='library/'+library[i].name+'.png';
		images[i].style.width='250px';
		// console.log('library item: '+library[i].name);
		listItem.appendChild(images[i]);
		var caption=document.createElement('div');
		caption.classList.add('img-caption');
		caption.innerText=library[i].name;
		listItem.appendChild(caption);
		var text=document.createElement('div');
		text.classList.add('item-text');
		text.innerHTML=library[i].text;
		listItem.appendChild(text);
		id('library').appendChild(listItem);
	}
	for(var i=0;i<pages.length;i++) {
		id(pages[i]).style.display='none';
	}
	id(page).style.display='none';
	pages=[];
	page='library';
	pages.push(page);
	// console.log(pages.length+' pages');
	id('library').style.display='block';
}

function openBook() {
	// console.log('OPEN BOOK '+libraryIndex);
	var url='library/'+library[libraryIndex].name+'.pdf';
	// console.log('URL: '+url);
	/* CODE TO VIEW IN WEBSITE
	id('view').type='application/pdf';
	id('view').data=url;
	id('view').height=sh+'px';
	id('library').style.display='none';
	id('header').style.display='none';
	id('viewer').style.display='block';
	page='viewer';
	pages.push(page);
	*/
	// CODE TO OPEN IN NEW TAB...
	window.location.href=url;
}

function listApps() {
	// console.log('LIST APPS');
	for(var i in apps) {
		var listItem = document.createElement('li');
		console.log('add app '+i+': '+apps[i].name);
		images[i]=document.createElement('img');
		images[i].classList.add('app-image');
		images[i].src='appIcons/'+apps[i].name+'.png';
		images[i].style.width='50px';
		console.log('code item: '+apps[i].name);
		listItem.appendChild(images[i]);
		var caption=document.createElement('div');
		caption.index=i;
		caption.classList.add('app-caption');
		caption.innerHTML='<b>'+apps[i].name+'</b>';
		caption.addEventListener('click', function() {
			codeIndex=this.index;
			console.log('show app '+codeIndex);
			openApp();
		});
		listItem.appendChild(caption);
		var text=document.createElement('div');
		text.classList.add('app-text');
		text.innerHTML=apps[i].text;
		listItem.appendChild(text);
		id('appList').appendChild(listItem);
	}
	for(var i=0;i<pages.length;i++) {
		id(pages[i]).style.display='none';
	}
	id(page).style.display='none';
	pages=[];
	page='code';
	pages.push(page);
	// console.log(pages.length+' pages');
	id('code').style.display='block';
}

function openApp() {
	// console.log('OPEN APP '+codeIndex);
	var url='https://elvinibbotson.github.io/'+apps[codeIndex].name+'/';
	window.location.href=url;
}


//UTILITY FUNCTIONS
function shuffle(array) {
  var currentIndex=array.length;
  var randomIndex;
  while(currentIndex!==0) { // While there remain elements to shuffle...
    // Pick a remaining element.
    randomIndex=Math.floor(Math.random()*currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex],array[randomIndex]]=[array[randomIndex], array[currentIndex]];
  }
  return array;
}

function previousSection() {
	// console.log('PREVIOUS SECTION');
	section=(section+2)%3;
	id('currentSection').innerText=sections[section];
	id('nextSection').innerText=sections[(section+1)%3];
	id('previousSection').innerText=sections[(section+2)%3];
	if(section<1) listSets();
	else if(section<2) openLibrary();
	else listApps();
}

function nextSection() {
	// console.log('NEXT SECTION');
	section=(section+1)%3;
	id('currentSection').innerText=sections[section];
	id('nextSection').innerText=sections[(section+1)%3];
	id('previousSection').innerText=sections[(section+2)%3];
	if(section<1) listSets();
	else if(section<2) openLibrary();
	else listApps();
}

function trim(text,len) {
	if(text.length>len) return(text.substr(0,len-2)+'..');
	else return text;
	
}

// START-UP CODE
if(sw<sh) maxSize=0.9*sw;
else maxSize=0.9*sh;
showSet=window.innerHeight;
sets=shuffle(sets); // at start, shuffle order of sets and of images in each set
for(var i in sets) sets[i].images=shuffle(sets[i].images); 
// console.log('shuffled first set: '+sets[0].name+'; first image: '+sets[0].images[0]);
shuffle(library);
// shuffle(apps);
listSets();

