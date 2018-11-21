var redirectUrl;

function search(url){

	google_reg = /www.google.com\/(?:search|webhp|)(?:[\w\d.&\?=#+\-]*)\b#?q=((?:[\w%.\-]+\+?)+)/gi;
	bing_reg = /www.bing.com\/search(?:[\w\d.&\?=#+\-]*)\?q=((?:[\w%.\-]+\+?)+)/gi;
	yahoo_reg = /search.yahoo.com\/search;?(?:[\w\d.&\?=#+\-]*)(?:\?|&)p=((?:[\w%.\-]+\+?)+)/gi;
	duck_reg = /duckduckgo.com\/(?:[\w\d.&\?=#+\-]*)?q=((?:[\w%.\-]+\+?)+)/gi;
	aol_reg = /search.aol.com\/aol\/search(?:[\w\d.&\?=#+\-]*)(?:\?|&)q=((?:[\w%.\-]+\+?)+)/gi;
	if (url.includes("google.com")){
		reg = google_reg;
	} else if (url.includes("bing.com")){
		reg = bing_reg;
	} else if (url.includes("duckduckgo.com")){
		reg = duck_reg;
	} else if (url.includes("yahoo.com")){
		reg = yahoo_reg;
	} else if (url.includes("aol.com")){
		reg = aol_reg;
	} else {
		return;
	}

	m = reg.exec(url);
	if (m){
		search_string = m[1].replace("%20","+");
		redirectUrl = "http://www.goodsearch.com/search-web?utf8=%E2%9C%93&keywords="+search_string;
		tabs = chrome.tabs.query({url: '*://search.yahoo.com/yhs/search?*'}, updateTabs);
	}


}

function cookieChecker(cookie){
	//User is not logged in
	if (!cookie){
		chrome.tabs.create({url: "https://www.goodsearch.com/login", active: true});
	}
}

function updateTabs(array){


	if (array.length > 0){
		if (array[0].url != redirectUrl){
			chrome.tabs.update(array[0].id,{url: redirectUrl});
		}
	} else {
		chrome.windows.getCurrent(function(window) {
			if (window.state == "fullscreen") {
				chrome.tabs.create({url: redirectUrl, active: false});
			} else {
				chrome.windows.create({url: redirectUrl, state: "minimized"});

			}
		});
	}
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url){
		search(changeInfo.url);

	}
});

chrome.tabs.onCreated.addListener(function(tab) {
   search(tab.url);
});

chrome.runtime.onInstalled.addListener(function(details){
    chrome.cookies.get({url: "https://www.goodsearch.com/", name: "member_cause_id"}, cookieChecker);

});

chrome.runtime.onStartup.addListener(function(details){
    chrome.cookies.get({url: "https://www.goodsearch.com/", name: "member_cause_id"}, cookieChecker);
});
