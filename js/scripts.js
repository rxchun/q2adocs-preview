
// Days until next fetch for Github repository links
const daysUntilNextFetch = 7;

class githubList {
    constructor() {
        this.pluginList = [];
		this.themeList = [];
    }

	addListLink(listType, index, linkInfo, dateInfo, q2aVersion) {
        // Push object to array, that later will be saved locally
		if(listType === 'plugins') {
			this.pluginList.push({
				id: index.toString(), 
				link: linkInfo.toString(), 
				date: dateInfo.toString(), 
				max_q2a: q2aVersion.toString()
			});
		} else {
			this.themeList.push({
				id: index.toString(), 
				link: linkInfo.toString(), 
				date: dateInfo.toString(), 
				max_q2a: q2aVersion.toString()
			});
		}
    }
	
	// Store Repositories locally
	savePluginsList() {
		localStorage.setItem('q2adocs_gitHub_plugins', JSON.stringify(this.pluginList));
	}
	
	saveThemesList() {
		localStorage.setItem('q2adocs_gitHub_themes', JSON.stringify(this.themeList));
	}
}

// --------------------------------
// Common functions, Reusable STUFF
// --------------------------------

// Check for Parents
const hasParent = (element, ...parents) => parents.some((parent) => parent.includes(element));

// Loop add class
const loopAddClass = (targetClass, addClass) => {
	document.querySelectorAll(targetClass).forEach(element => {
		element.classList.add(addClass);
	});
}

// Loop remove class
const loopRemoveClass = (targetClass, removeClass) => {
	document.querySelectorAll(targetClass).forEach(element => {
		element.classList.remove(removeClass);
	});
}

// Scroll to Elements
scrollToElement = (element) => {
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.offsetTop - 90
    });
}

// ----

// Add current page "selected-nav" class, for the Mega Menu "Documentation" Link item
if (document.querySelectorAll('.nav-main .selected-nav').length > 0) {
	document.querySelector('.mega-menu-trigger .nav-item').classList.add('selected-nav');
}
// Add selected nav to the top level parent (second nav)
if (
	document.querySelectorAll('.nav-main-second .selected-nav').length > 0 && 
	!document.body.classList.contains('template-contribute') && 
	!document.body.classList.contains('template-addons')) {
	document.querySelector('.nav-main-second .selected-nav').closest('.sub-nav').previousElementSibling.classList.add('selected-nav');
}

// toggle menu children
let opened = null;
const toggleVisibility = e => e.classList.toggle('display-none');

const handleDropdown = e => {
	const clickedItem = e.parentElement.lastChild.previousSibling;

	toggleVisibility(clickedItem);

	if (!opened) {
		opened = clickedItem;
	} else if (opened == clickedItem) {
		opened = null;
	} else {
		toggleVisibility(opened);
		opened = clickedItem;
	}
}

const navContainer = document.querySelector('.nav-container');
const backgroundSheet = document.querySelector('.darkPane');
const navMain = document.querySelector('.nav-main');
const noticeContainer = document.querySelector('.notice-container');

// Handle Click
const handleClick = e => {
	
	// Menu Trigger
	if (e.target.id === 'main-nav-trigger') {
		if (navContainer.classList.contains('active')) {
			navContainer.classList.remove('active');
			backgroundSheet.classList.remove('active');
		} else {
			navContainer.classList.add('active');
			backgroundSheet.classList.add('active');
		}
	}
	
	// Mega Menu
	if (e.target.parentElement.className.includes('mega-menu-trigger')) {
		navMain.classList.toggle('display-none');
	} else if (!hasParent(e.target, '.nav-main')) {
		navMain.classList.add('display-none');
	}
	
	// Nav Menu Children
	if (e.target.className.includes('toggleChildren')) {
		handleDropdown(e.target);
	} else if (opened) {
		toggleVisibility(opened);
		opened = null;
	}
	
	// Scroll to section on Sidebar navigation click
	if (e.target.className.includes('docs-nav-item')) {
		const targetDataId = e.target.getAttribute('data-attr-scroll');
		scrollToElement(document.getElementById(targetDataId));
	}
	
	// Go Top
	if (e.target.className.includes('jump-top')) {
		window.scrollTo({top: 0, behavior: 'smooth'});
	}
	
	// Close dark sheet
	if (e.target.className.includes('darkPane')) {
		if (backgroundSheet.classList.contains('active')) {
			navContainer.classList.remove('active');
			backgroundSheet.classList.remove('active');
		}
	}
	
	// Needs Page refresh after fetching
	if (e.target.className.includes('close-page-status')) {
		location.reload();
	}
	
	// Notice
	if (e.target.className.includes('close-notice') || e.target.className.includes('close-sheet')) {
		noticeContainer.classList.add('display-none');
		// set Notice localStorage
		localStorage.q2adocs_notice = 'closed';
	}
	
} // End handleClick()
document.addEventListener('click', handleClick);

// Show / Hide Notice on the front page
if (localStorage.getItem('q2adocs_notice') === null && noticeContainer != null) {
	noticeContainer.classList.remove('display-none'); 
}

// Quick fix to close Mega Menu, when clicking secondary nav items
document.querySelectorAll('.nav-main-second .toggleChildren').forEach(element => {
	element.addEventListener('click', (e) => {
		navMain.classList.add('display-none');
	});
});


// On Scroll
const header = document.querySelector('header.header');
const stickyPos = header ? header.offsetTop : 0;

const jumpTopContainer = document.querySelector('.jump-top-container');
const jumpTop = document.getElementById('jump-top');

// Handle Scroll
const handleScroll = (e) => {
	
	// Sticky Topbar
	if (window.scrollY > stickyPos) {
		header.classList.add('sticky');
	} else {
		header.classList.remove('sticky');
	}
	
	if(window.screen.width > 900) {
		// Get the offset position of the scroll-to-top button
		const stickyJumpPos = 700;

		const jtRect = jumpTopContainer.getBoundingClientRect().top;
		const jtOH = ( window.pageYOffset || jumpTopContainer.scrollTop ) - ( jumpTopContainer.clientTop || 0 );
		const winHeight = window.innerHeight - jumpTopContainer.offsetHeight;
		const stopStickyJump = (jtRect + jtOH - winHeight);
		
		if (window.scrollY > stickyJumpPos && window.scrollY < stopStickyJump) {
			jumpTop.classList.add ('active');
		} else if (window.scrollY > stopStickyJump) {
			jumpTop.classList.remove('active');
		} else {
			jumpTop.classList.remove('active');
		}
	}
	
}
handleScroll();
window.addEventListener('scroll', handleScroll);


// ----------------------------
// Single page ----------------
// ----------------------------

// Docs Navigation
const articleHeaders = document.querySelectorAll('\
	.page-content h1, .page-content h2, .page-content h3, .page-content h4, .page-content h5, .page-content h6\
');
const docsNav = document.querySelector('.docs-nav');

articleHeaders.forEach(element => {
	element.classList.add('sectionTitle');
	let dataId = element.getAttribute('id');
	const html = '<li class="docs-nav-item" data-attr-scroll="'+ dataId +'">' + element.innerHTML +'</li>';
	docsNav.insertAdjacentHTML('beforeend', html);
});


const sidebarDocslinks = document.querySelectorAll('.docs-nav-item');
const docsSection = document.querySelectorAll('.sectionTitle');

function sidebarLinkNav() {
    if(!document.body.classList.contains('template-homepage') && sidebarDocslinks != null && docsSection != null) {
		let index = docsSection.length;

		while (--index && window.scrollY + 200 < docsSection[index].offsetTop) {}

		// add the active class if within visible height of the element
		if (scrollY - docsSection[index].offsetHeight < docsSection[index].offsetTop) {
			sidebarDocslinks.forEach((link) => link.classList.remove('active'));
			sidebarDocslinks[index].classList.add('active');
		}
	}
}
sidebarLinkNav();
window.addEventListener('scroll', sidebarLinkNav);

const currentDate = () => {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = today.getMonth() + 1; // Months start at 0!
	const dd = today.getDate();
	
	return new Array(yyyy, mm, dd);
}

// Takes one date parameter, calculates and returns the amount of days between present day
const calcDays = param => {
	const todayDate = currentDate(); 
	const currentYear = new Date(`${todayDate[0]}/${todayDate[1]}/${todayDate[2]}`);
	
	let convertDate = param;
	if (convertDate.indexOf('-') > -1) {
		const arr = convertDate.split('-');
		convertDate = `${arr[0]}/${arr[1]}/${arr[2]}`;
	}
	
	const repositoryYear = new Date(convertDate);
	
	const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	const diffDays = Math.round(Math.abs((currentYear - repositoryYear) / oneDay));
	
	return diffDays;
}

// Calculate year gap for Github repositories
const calcYears = param => {
	const diffYears = calcDays(param);
	let yearGap = 0;
	
	if ( diffYears <= 365) {
		yearGap = 1;
	} else if ( diffYears > 365 && diffYears <= 730) {
		yearGap = 2;
	} else if ( diffYears > 730 && diffYears <= 1095) {
		yearGap = 3;
	} else if ( diffYears > 1095 && diffYears <= 1460) {
		yearGap = 4;
	} else if ( diffYears > 1460) {
		yearGap = 5;
	}
	return yearGap;
}

// Checks for Github repository links, and prepends a tag with their date "year-month-day". (fetched from their metadata.js files)
const gitLinks = document.querySelectorAll('\
	.template-addons-plugins .page-content li a[href*="https://github.com/"],\
	.template-addons-themes .page-content li a[href*="https://github.com/"]\
');

const pluginLinks = document.querySelectorAll('.template-addons-plugins .page-content li a[href*="https://github.com/"]');
const themeLinks = document.querySelectorAll('.template-addons-themes .page-content li a[href*="https://github.com/"]');

if(gitLinks != null && gitLinks.length) {
	
	const pluginsList = new githubList();
	const themesList = new githubList();
	const isPluginsPage = (document.querySelector('.template-addons-plugins') != null ? true : false);
	const isThemesPage = (document.querySelector('.template-addons-themes') != null ? true : false);
	
	// Set outside Fetch, because it will be reused for other functions
	const githubDomain = 'https://github.com/';
	
	// Fetch Links
	const fetchLinks = () => {
		
		// Get Q2A version
		let q2aVersion;
		const getQ2aVersion = 'https://raw.githubusercontent.com/q2a/question2answer/master/VERSION.txt';
		let rawFile = new XMLHttpRequest();
		rawFile.open('GET', getQ2aVersion, false);
		rawFile.onreadystatechange = function ()
		{
			if(rawFile.readyState === 4)
			{
				if(rawFile.status === 200 || rawFile.status == 0)
				{
					q2aVersion = rawFile.responseText;
					console.log(allText);
				}
			}
		}
		rawFile.send(null);
		
		// Set list headers
		if(isPluginsPage) {
			pluginsList.addListLink('plugins', '1000', 'List_length', pluginLinks.length, q2aVersion);
			pluginsList.addListLink('plugins', '1001', 'updated', new Date(), q2aVersion);
		} else if (isThemesPage) {
			themesList.addListLink('themes', '1000', 'List_length', themeLinks.length, q2aVersion);
			themesList.addListLink('themes', '1001', 'updated', new Date(), q2aVersion);
		}
		
		// Create list
		for(let i=0; i<gitLinks.length; i++) {
			
			const getGithubHref = gitLinks[i].getAttribute('href');
			const githubRepository = getGithubHref.slice(getGithubHref.indexOf(githubDomain) + githubDomain.length);
			const githubJSON = 'https://raw.githubusercontent.com/' + githubRepository + '/master/metadata.json';
			
			// Checks if the Link has more than 4 'forward slashes', AKA a repository, to escape Github user profiles
			let isRepository = (getGithubHref.match(/\//g) || []).length >= 4;
			
			fetch(githubJSON)
			.then(res => res.json())
			.then(jsonResponse => {
				if(isRepository) {
					// Add link to list
					const getQ2aVersion = (jsonResponse.max_q2a != null) ? jsonResponse.max_q2a : '0'; 
					
					if(isPluginsPage) {
						pluginsList.addListLink('plugins', [i], gitLinks[i], jsonResponse.date, getQ2aVersion);
					} else if (isThemesPage) {
						themesList.addListLink('themes', [i], gitLinks[i], jsonResponse.date, getQ2aVersion);
					}
				}
			})
			.catch(error => {
				console.log(error)
				// Save Unknowns as well. Prevents null Objects.
				// We can remove the display tag in the createPluginTags() functions instead, by removing the "else" statement.
				if(isRepository) {
					if(isPluginsPage) {
						pluginsList.addListLink('plugins', [i], gitLinks[i], 'unknown', '0');
					} else if (isThemesPage) {
						themesList.addListLink('themes', [i], gitLinks[i], 'unknown', '0');
					}
				}
			})
			.finally(result => {
				if(isPluginsPage) {
					pluginsList.savePluginsList();
				} else {
					themesList.saveThemesList();
				}
			});
			
		} // End of for loop
		
		setTimeout(function(){
			document.querySelector('.page-status-container').innerHTML = '\
				<div class="page-status">\
					<div>\
						<span class="twbb">There has been an update to this page.</span>\
						<span class="twbb">Please reload.</span>\
					</div>\
					<span class="close-page-status material-icons noSelect" title="Reload this page">refresh</span>\
				</div>\
			';
		}, 1500);
	}
	
	// Get saved data from LocalStorage
	const retrievedPlugins = JSON.parse(localStorage.getItem('q2adocs_gitHub_plugins'));
	const retrievedThemes = JSON.parse(localStorage.getItem('q2adocs_gitHub_themes'));
	
	// Retrieve single data
	const singleKey = (storage)  => {
		return Object.keys(storage);
	}
	const singleValue = (storage)  => {
		return Object.values(storage);
	}
	
	// Create tags for both - Plugins and Themes
	const createTags = (param) => {
		
		// get stored current Q2A version
		const currentQ2aVersion = Object.values(param[0] || {} )[3];
		
		// Change Emoji colors for actual color element
		const colorLegends = document.querySelector('.template-addons-plugins blockquote, .template-addons-themes blockquote');
		const colorLegendsUpdated = colorLegends.innerHTML.replace(
			'🟢','<span class="rep-date rep-date-1"></span>'
		).replace(
			'🔵','<span class="rep-date  rep-date-2"></span>'
		).replace(
			'🟡','<span class="rep-date rep-date-3"></span>'
		).replace(
			'🔴','<span class="rep-date rep-date-5"></span>'
		).replace(
			'🔘','<span class="rep-date"></span>'
		);
		colorLegends.innerHTML = colorLegendsUpdated;
		
		param.forEach((item, index) => {

				const list = param.slice(2); // Remove list header (metadata) indexes
				const id = Object.values(list[index] || {} )[0];
				const link = Object.values(list[index] || {} )[1];
				const date = Object.values(list[index] || {} )[2];
				const max_q2a = Object.values(list[index] || {} )[3];
				
				// console.log(`${id} === ${link} === ${date}`);
				
				if(gitLinks[id].parentElement != null && gitLinks[id].parentElement.innerHTML.includes('➔')){
					gitLinks[id].closest('li').classList.add('child-repository');
				}
				
				if(id != null && link != null && date != null && max_q2a != null) {
					// Preppend based on stored id/index, because DOM link order may not be accurate when looping
					// index order will be updated when information is fetched again
					
					const yearGapClass = 'rep-date-' + calcYears(date);
					
					if (date != 'unknown') {
						// if 'max_q2a' key is available
						if(max_q2a != '0') {
							gitLinks[id].parentElement.insertAdjacentHTML(
								'beforeend',
								`<span class="repository-footer">
									<span class="rf-item">
										Last updated: 
										<span class="rep-date ${yearGapClass}"></span> 
										<span class="rep-date-true">${date}</span>
									</span>
									<span class="rf-item">
										<svg class="docs-svg" width="35" height="17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0, 0, 400,192"><g class="svgg"><path class="path0" d="M199.125 9.516 C 157.924 16.977,134.439 51.317,168.872 53.754 C 181.220 54.628,188.021 51.060,192.647 41.282 C 197.761 30.471,224.848 24.605,228.566 33.503 C 235.849 50.934,223.140 74.064,185.833 111.278 C 162.762 134.291,162.293 134.990,166.932 139.435 C 176.110 148.227,213.452 144.113,257.500 129.455 C 281.012 121.632,280.387 121.599,229.400 128.000 C 207.495 130.750,189.417 133.000,189.227 133.000 C 187.964 133.000,191.981 129.471,204.841 119.286 C 272.717 65.523,284.935 17.240,232.651 9.388 C 221.409 7.700,208.889 7.748,199.125 9.516 M57.500 12.567 C 28.001 18.377,4.566 47.191,1.035 81.992 C -4.867 140.148,40.328 177.218,99.178 162.493 C 100.830 162.080,103.375 163.080,108.000 165.962 C 134.665 182.575,148.253 184.328,154.518 171.964 C 158.852 163.412,158.189 161.412,150.584 160.088 C 141.590 158.522,124.000 151.861,124.000 150.021 C 124.000 149.633,127.220 145.082,131.156 139.908 C 152.719 111.561,157.130 72.222,141.804 44.946 C 127.036 18.663,92.972 5.580,57.500 12.567 M321.487 17.250 C 320.166 20.138,310.030 47.700,298.963 78.500 C 278.086 136.602,272.539 150.841,268.428 156.891 C 264.249 163.040,265.591 164.954,274.102 164.986 C 283.797 165.023,287.251 159.239,297.487 125.826 L 301.064 114.152 307.282 113.603 C 310.702 113.301,322.284 112.778,333.021 112.441 L 352.542 111.828 358.820 132.664 C 367.820 162.534,370.516 165.616,386.933 164.802 C 397.061 164.300,400.975 162.758,398.693 160.170 C 393.332 154.090,379.411 118.445,362.502 67.500 C 348.093 24.090,345.722 19.590,334.500 14.353 C 326.414 10.580,324.327 11.044,321.487 17.250 M89.935 25.454 C 123.357 37.420,134.797 103.497,109.073 136.000 L 107.095 138.500 101.450 133.000 C 98.346 129.975,93.198 124.125,90.010 120.000 C 75.287 100.951,67.974 100.113,74.058 118.171 C 76.692 125.992,82.184 136.897,87.239 144.347 C 91.911 151.233,91.671 151.699,82.682 153.188 C 52.430 158.201,28.930 129.564,28.777 87.500 C 28.605 40.143,55.304 13.056,89.935 25.454 M330.320 48.634 C 335.148 61.022,348.000 98.810,348.000 100.617 C 348.000 101.751,344.135 102.000,326.500 102.000 C 314.675 102.000,305.001 101.662,305.003 101.250 C 305.017 97.985,324.878 39.000,325.963 39.000 C 326.295 39.000,328.256 43.335,330.320 48.634 M202.692 158.910 C 190.855 163.688,187.995 169.154,194.392 174.771 C 203.405 182.684,223.211 180.534,230.074 170.897 C 236.287 162.171,216.295 153.420,202.692 158.910 " stroke="none" fill="#000000" fill-rule="evenodd"></path></g></svg>
										<span>Tested with ${max_q2a}</span>
									</span>
								</span>`,
							);
						} else {
							gitLinks[id].parentElement.insertAdjacentHTML(
								'beforeend',
								`<span class="repository-footer">
									<span class="rf-item">
										Last updated: 
										<span class="rep-date rep-date-true ${yearGapClass}"></span> 
										<span>${date}</span>
									</span>
								</span>`,
							);
						}
					} else if (date == 'unknown') {
						// If response is 'bad request' or '404', show "unknown" tag
						gitLinks[id].parentElement.insertAdjacentHTML(
							'beforeend',
							`<span class="repository-footer">
								<span class="rf-item">
									Last updated: 
									<span class="rep-date rep-date-bad"></span> <span>Unknown</span>
								</span>
							</span>`,
						);
					}
					
				}
		});
		// console.log(JSON.parse(localStorage.getItem('q2adocs_gitHub_plugins')));
	}
	
	// Start at zero, in case not fetched yet
	let pluginsListUpdated = currentDate();
	let pluginListLength = 0;
	
	let themesListUpdated = currentDate();
	let themeListLength = 0;
	
	if(localStorage.q2adocs_gitHub_plugins) {
		// Get saved list length for Plugins
		pluginsListUpdated = singleValue(retrievedPlugins[1])[2];
		pluginsListUpdated = new Date(pluginsListUpdated).toISOString().split('T')[0];
		pluginListLength = singleValue(retrievedPlugins[0])[2];
	}
	if(localStorage.q2adocs_gitHub_themes) {
		// Get saved list length for Themes
		themesListUpdated = singleValue(retrievedThemes[1])[2];
		themesListUpdated = new Date(themesListUpdated).toISOString().split('T')[0];
		themeListLength = singleValue(retrievedThemes[0])[2];
	}
	
	// ----------------------------
	// Create the tags / badges ---
	// ----------------------------
	
	// Test remaining days
	// console.log('Days passed since Plugins list updated: ' + calcDays(pluginsListUpdated));
	// console.log('Days passed since Themes list updated: ' + calcDays(themesListUpdated));
	const generateTags = () => {
		if(isPluginsPage) {
			// Calculate number of days until next fetch
			// if "N" days have passed, or the number of links no longer matches the number of saved links, request Fetch 
			if(retrievedPlugins === null || calcDays(pluginsListUpdated) >= daysUntilNextFetch || pluginLinks.length != pluginListLength) {
				fetchLinks();
			}
			createTags(retrievedPlugins);
			// console.log('retrieved Plugins Object: ', retrievedPlugins);
			// console.log('github plugin links length: '+ pluginLinks.length +'; saved: ' + pluginListLength);
		} else if (isThemesPage) {
			if(retrievedThemes === null || calcDays(themesListUpdated) >= daysUntilNextFetch || themeLinks.length != themeListLength) {
				fetchLinks();
			}
			createTags(retrievedThemes);
			// console.log('retrieved Themes Object: ', retrievedThemes);
			// console.log('github theme links length: '+ themeLinks.length +'; saved: ' + themeListLength);
		}
	}
	
	generateTags();
	
} // End of if gitLinks.length



