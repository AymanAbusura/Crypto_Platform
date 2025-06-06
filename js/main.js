window.onload = function() {;
	// var toggleLink = document.getElementById('toggle')
	// var submenu = toggleLink.nextElementSibling
	// toggleLink.addEventListener('click', function(e) {
	// 	e.stopPropagation()
	// 	if (submenu.style.display === 'block') {
	// 		submenu.style.display = 'none'
	// 	} else {
	// 		submenu.style.display = 'block'
	// 	}
	// })
	// document.addEventListener('click', function(e) {
	// 	if (submenu.style.display === 'block' && e.target !== toggleLink && !submenu.contains(e.target)) {
	// 		submenu.style.display = 'none'
	// 	}
	// })
	// submenu.addEventListener('click', function(e) {
	// 	if (e.target.tagName === 'A') {
	// 		submenu.style.display = 'none'
	// 	}
	// })

	// var toggleLink1 = document.getElementById('toggle-1')
	// var submenu1 = toggleLink1.nextElementSibling
	// toggleLink1.addEventListener('click', function(e) {
	// 	e.stopPropagation()
	// 	if (submenu1.style.display === 'block') {
	// 		submenu1.style.display = 'none'
	// 	} else {
	// 		submenu1.style.display = 'block'
	// 	}
	// })
	// document.addEventListener('click', function(e) {
	// 	if (submenu1.style.display === 'block' && e.target !== toggleLink1 && !submenu1.contains(e.target)) {
	// 		submenu1.style.display = 'none'
	// 	}
	// })
	// submenu1.addEventListener('click', function(e) {
	// 	if (e.target.tagName === 'A') {
	// 		submenu1.style.display = 'none'
	// 	}
	// })

// More Efficient than the upper
	function setupToggle(toggleId) {
        var toggleLink = document.getElementById(toggleId);
        if (!toggleLink) return;

        var submenu = toggleLink.nextElementSibling;
        toggleLink.addEventListener('click', function(e) {
            e.stopPropagation();
            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function(e) {
            if (submenu.style.display === 'block' && e.target !== toggleLink && !submenu.contains(e.target)) {
                submenu.style.display = 'none';
            }
        });

        submenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                submenu.style.display = 'none';
            }
        });

        submenu.style.maxHeight = "300px";
        submenu.style.overflowY = "auto";
    }
    setupToggle('toggle');
    setupToggle('toggle-1');

	var buttons = document.querySelectorAll(".btn-cta");
	var form = document.getElementById("form");
	if (buttons.length > 0) {
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener("click", function() {
				form.scrollIntoView({
					behavior: "smooth"
				});
			});
		}
	}
	var domainName = window.location.hostname;
	var replaceableTextElements = document.querySelectorAll(".domain");
	if (replaceableTextElements.length > 0) {
		replaceableTextElements.forEach(function(element) {
			element.textContent = domainName;
		});
	}
	var emailLinks = document.querySelectorAll(".mail-link");
	emailLinks.forEach(function(emailLink) {
		emailLink.href = "mailto:support@" + domainName;
	});;
	const spoilersArray = document.querySelectorAll("[data-spoilers]");
	if (spoilersArray.length > 0) {
		const spoilersRegulars = Array.from(spoilersArray).filter(function(item, index, self) {
			return !item.dataset.spoilers.split(",")[0];
		});
		if (spoilersRegulars.length > 0) {
			initSpoilers(spoilersRegulars);
		}
		const spoilersMedia = Array.from(spoilersArray).filter(function(item, index, self) {
			return item.dataset.spoilers.split(",")[0];
		});
		if (spoilersMedia.length > 0) {
			const breakpointsArray = [];
			spoilersMedia.forEach((item) => {
				const params = item.dataset.spoilers;
				const breakpoint = {};
				const paramsArray = params.split(",");
				breakpoint.value = paramsArray[0];
				breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item = item;
				breakpointsArray.push(breakpoint);
			});
			let mediaQueries = breakpointsArray.map(function(item) {
				return ("(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type);
			});
			mediaQueries = mediaQueries.filter(function(item, index, self) {
				return self.indexOf(item) === index;
			});
			mediaQueries.forEach((breakpoint) => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				const spoilersArray = breakpointsArray.filter(function(item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				matchMedia.addListener(function() {
					initSpoilers(spoilersArray, matchMedia);
				});
				initSpoilers(spoilersArray, matchMedia);
			});
		}

		function initSpoilers(spoilersArray, matchMedia = false) {
			spoilersArray.forEach((spoilersBlock) => {
				spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
				if (matchMedia.matches || !matchMedia) {
					spoilersBlock.classList.add("_is-init");
					initSpoilerBody(spoilersBlock);
					spoilersBlock.addEventListener("click", setSpoilerAction);
				} else {
					spoilersBlock.classList.remove("_is-init");
					initSpoilerBody(spoilersBlock, false);
					spoilersBlock.removeEventListener("click", setSpoilerAction);
				}
			});
		}

		function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
			const spoilerButtons = spoilersBlock.querySelectorAll("[data-spoiler]");
			if (spoilerButtons.length > 0) {
				spoilerButtons.forEach((spoilerButton) => {
					if (hideSpoilerBody) {
						spoilerButton.removeAttribute("tabindex");
						if (!spoilerButton.classList.contains("_active")) {
							spoilerButton.nextElementSibling.hidden = true;
						}
					} else {
						spoilerButton.removeAttribute("tabindex", "-1");
						spoilerButton.nextElementSibling.hidden = false;
					}
				});
			}
		}

		function setSpoilerAction(e) {
			const el = e.target;
			if (el.hasAttribute("data-spoiler") || el.closest("[data-spoiler]")) {
				const spoilerButton = el.hasAttribute("data-spoiler") ? el : el.closest("[data-spoiler]");
				const spoilersBlock = spoilerButton.closest("[data-spoilers]");
				const oneSpoiler = spoilersBlock.hasAttribute("data-one-spoiler") ? true : false;
				if (!spoilersBlock.querySelectorAll("._slide").lenght) {
					if (oneSpoiler && !spoilerButton.classList.contains("_active")) {
						hideSpoilerBody(spoilersBlock);
					}
					spoilerButton.classList.toggle("_active");
					_slideToggle(spoilerButton.nextElementSibling, 500);
				}
				e.preventDefault();
			}
		}

		function hideSpoilerBody(spoilersBlock) {
			const spoilerActiveButton = spoilersBlock.querySelector("[data-spoiler]._active");
			console.log(spoilerActiveButton);
			if (spoilerActiveButton) {
				spoilerActiveButton.classList.remove("_active");
				_slideUp(spoilerActiveButton.nextElementSibling, 500);
			}
		}
	}
	let _slideUp = (target, duration = 500) => {
		if (!target.classList.contains("_slide")) {
			target.classList.add("_slide");
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + "ms";
			target.style.height = target.offsetHeight + "px";
			target.offsetHeight;
			target.style.overflow = "hidden";
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.hidden = true;
				target.style.removeProperty("height");
				target.style.removeProperty("padding-top");
				target.style.removeProperty("padding-bottom");
				target.style.removeProperty("margin-top");
				target.style.removeProperty("margin-bottom");
				target.style.removeProperty("height");
				target.style.removeProperty("overflow");
				target.style.removeProperty("transition-duration");
				target.style.removeProperty("transition-property");
				target.classList.remove("_slide");
			}, duration);
		}
	};
	let _slideDown = (target, duration = 500) => {
		if (!target.classList.contains("_slide")) {
			target.classList.add("_slide");
			if (target.hidden) {
				target.hidden = false;
			}
			let height = target.offsetHeight;
			target.style.overflow = "hidden";
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + "ms";
			target.style.height = height + "px";
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			window.setTimeout(() => {
				target.style.removeProperty("height");
				target.style.removeProperty("overflow");
				target.style.removeProperty("transition-duration");
				target.style.removeProperty("transition-property");
				target.classList.remove("_slide");
			}, duration);
		}
	};
	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	};;
};