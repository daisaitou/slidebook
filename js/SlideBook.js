function SlideBook(markerID, pageClassName, name){

	var FILTER_PREFIX = function(){
		if(!!navigator.userAgent.match(/msie/i)){
			return "Ms";
		}
		else if(!!navigator.userAgent.match(/firefox/i)){
			return "Moz";
		}
		else if(!!navigator.userAgent.match(/opera/i)){
			return "O";
		}
		else{
			return "Webkit";
		}
	}();
	
	var isIE = (function(){
		if(!!navigator.userAgent.match(/msie ([\d\.]+)/i)){
			if(RegExp.$1 - 0 > 9){
				return false;
			}
			return true;
		}
		return false;
	})();
	
	var isIPad = !!navigator.userAgent.match(/ipad|iphone/i);
	
	// ---------------  util initialize ---------------------------------------------
	
	HtmlNode();
	Shape();
	
	// ---------------  private vars ---------------------------------------------
	
	// default metaValues
	var props = {
		pageWidth : 250,
		pageHeight : 300,
		gradationSize : 3,
		baseColor :   { r : 255, g : 255, b : 255 },
		shadowColor : { r : 200, g : 200, b : 200 },
		footColor :   { r : 240, g : 240, b : 240 },
		footHeight : 20,
		interval : 15,
		blurRate : 5,
		scrollSize : 15,
		nextLabelText : "next page ->",
		prevLabelText : "<- prev page",
		headLabelText : "<< to top page"
	};
	
	var ignoreClassName, remakedPages, shadow, targetUL, targetUR, targetLL, scrollTimer;
	var fullScreen = false;
	var openingPage = 0;
	var baseZindex = 100;
	var pageNumber = 0;
	var scrollRad = 0;
	var marker = document.getElementById(markerID);
	var resizedFunctions = new Array();
	var classNameSeparator = "_";
	var pos = absolutePosition(marker);
	var bookParentNode = HtmlNode.create("div", [ HtmlNode.style("position", "absolute"), HtmlNode.style("left", pos.left + "px"), HtmlNode.style("top", pos.top + "px") ]);

	// ---------------  public functions ---------------------------------------------
	
	this.properties = props;
	this.turn = turnPage;
	this.build = build;
	this.setIgnoreClassName = setIgnoreClassName;
	this.setOpeningPage = setOpeningPage;
	this.setPageWidth = setPageWidth;
	this.setPageHeight = setPageHeight;
	this.setGradationSize = setGradationSize;
	this.setBaseColor = setBaseColor;
	this.setShadowColor = setShadowColor;
	this.setScrollSize = setScrollSize;
	this.setBlurRate = setBlurRate;
	this.setIntervalLength = setIntervalLength;
	this.setFootHeight = setFootHeight;
	this.setIgnoreClassName = setIgnoreClassName;
	this.setOpeningPage = setOpeningPage;
	this.setFullScreen = setFullScreen;
	this.setNextLabel = setNextLabel;
	this.setPrevLabel = setPrevLabel;
	this.setHeadLabel = setHeadLabel;
	
	// ---------------  private functions ---------------------------------------------
	
	function setPageWidth(num){
		props.pageWidth = isNaN(num) ? 0 : num - 0;
	}
	
	function setPageHeight(num){
		props.pageHeight = isNaN(num) ? 0 : num - 0;
	}
	
	function setGradationSize(num){
		props.gradationSize = isNaN(num) ? 0 : num - 0;
	}
	
	function setBaseColor(r, g, b){
		props.baseColor.r = isNaN(r) ? 0 : r - 0;
		props.baseColor.g = isNaN(g) ? 0 : g - 0;
		props.baseColor.b = isNaN(b) ? 0 : b - 0;
	}
	
	function setShadowColor(r, g, b){
		props.shadowColor.r = isNaN(r) ? 0 : r - 0;
		props.shadowColor.g = isNaN(g) ? 0 : g - 0;
		props.shadowColor.b = isNaN(b) ? 0 : b - 0;
	}
	
	function setScrollSize(num){
		props.scrollSize = isNaN(num) ? 0 : num - 0;
	}
	
	function setBlurRate(num){
		props.blurRate = isNaN(num) ? 0 : num - 0;
	}
	
	function setIntervalLength(num){
		props.interval = isNaN(num) ? 0 : num - 0;
	}
	
	function setFootHeight(num){
		props.footHeight = isNaN(num) ? 0 : num - 0;
	}
	
	function setIgnoreClassName(className){
		ignoreClassName = className;
	}
	
	function setOpeningPage(num){
		openingPage = num;
	}

	function setFullScreen(flag){
		fullScreen = flag;
	}
	
	function setNextLabel(text){
		props.nextLabelText = text;
	}
	
	function setPrevLabel(text){
		props.prevLabelText = text;
	}
	
	function setHeadLabel(text){
		props.headLabelText = text;
	}
	
	
	function setShadow(){
		
		
		var GLOW_STRENGTH = 3;
		var BASE_LEFT_SHADOW_STYLE  = "-2px 2px 5px #000";
		var BASE_RIGHT_SHADOW_STYLE = "5px 2px 5px #000";
		var SHADOW_OFFSET_RATE_X_RIGHT = 0.015;
		var SHADOW_OFFSET_RATE_X_LEFT  = 0.03;
		var SHADOW_OFFSET_RATE_Y = 0.02;
		
		var baseleft = HtmlNode.create("div", [ HtmlNode.style("width", props.pageWidth + "px"), HtmlNode.style("borderRadius", "10px 4px 2px 0px"), HtmlNode.style("height", props.pageHeight + "px"), HtmlNode.style("position", "absolute"), HtmlNode.style("left", 0 - (isIE ? GLOW_STRENGTH * 2/3 : 0) + "px"), HtmlNode.style("top", 0 - (isIE ? GLOW_STRENGTH * 2/3 : 0) + "px"), HtmlNode.style("zIndex", 0) ]);
		var baseright = HtmlNode.create("div", [ HtmlNode.style("width", props.pageWidth + "px"), HtmlNode.style("borderRadius", "4px 10px 0px 2px"), HtmlNode.style("height", props.pageHeight + "px"), HtmlNode.style("position", "absolute"), HtmlNode.style("left", props.pageWidth - (isIE ? GLOW_STRENGTH * 2/3 : 0) + "px"), HtmlNode.style("top", 0 - (isIE ? GLOW_STRENGTH * 2/3 : 0) + "px"), HtmlNode.style("zIndex", 0) ]);
		var pageRight = HtmlNode.set(Shape.path([ { x : 0, y : 0 }, { x : 0, y : props.pageHeight }, { x : Math.round(props.pageWidth * (1 - SHADOW_OFFSET_RATE_X_RIGHT)), y : Math.round(props.pageHeight * (1 - SHADOW_OFFSET_RATE_Y)) }, { x : Math.round(props.pageWidth * (1 - SHADOW_OFFSET_RATE_X_RIGHT)), y : 0 } ], null, { r : 0, g : 0, b : 0 }, { width : props.pageWidth, height : props.pageHeight } ), [ HtmlNode.style("display", "none"), HtmlNode.style("position", "absolute"), HtmlNode.style("top", 0 + "px"), HtmlNode.style("left", props.pageWidth), HtmlNode.style("width", props.pageWidth), HtmlNode.style("height", props.pageHeight) ]);
		var pageLeft = HtmlNode.set(Shape.path([ { x : 0, y : 0 }, { x : Math.round(props.pageWidth * SHADOW_OFFSET_RATE_X_LEFT), y : Math.round(props.pageHeight * (1 - SHADOW_OFFSET_RATE_Y)) }, { x : props.pageWidth, y : props.pageHeight }, { x : props.pageWidth, y : 0 } ], null, { r : 0, g : 0, b : 0 }, { width : props.pageWidth, height : props.pageHeight }), [ HtmlNode.style("display", "none"), HtmlNode.style("position", "absolute"), HtmlNode.style("top", 0 + "px"), HtmlNode.style("left", props.pageWidth), HtmlNode.style("width", props.pageWidth), HtmlNode.style("height", props.pageHeight) ]);
		
	
		if(isIE){
			HtmlNode.set(pageRight, HtmlNode.style("filter", "Alpha(opacity=50) Blur(strength=5,direction=150)"));
			HtmlNode.set(pageLeft, HtmlNode.style("filter", "Alpha(opacity=50) Blur(strength=5,direction=240)"));
			HtmlNode.set(baseleft, [ HtmlNode.style("backgroundColor", "#000000"), HtmlNode.style("filter", "progid:DXImageTransform.Microsoft.glow(color=#000000,strength=" + GLOW_STRENGTH + ") Blur(strength=5,direction=240)") ]);
			HtmlNode.set(baseright, [ HtmlNode.style("backgroundColor", "#000000"), HtmlNode.style("filter", "progid:DXImageTransform.Microsoft.glow(color=#000000,strength=" + GLOW_STRENGTH + ") Blur(strength=5,direction=150)") ]);
		}
		else{
			HtmlNode.set(baseleft, HtmlNode.style("boxShadow", BASE_LEFT_SHADOW_STYLE));
			HtmlNode.set(baseleft, HtmlNode.style(FILTER_PREFIX + "BoxShadow", BASE_LEFT_SHADOW_STYLE));
			HtmlNode.set(baseright, HtmlNode.style("boxShadow", BASE_RIGHT_SHADOW_STYLE));
			HtmlNode.set(baseright, HtmlNode.style(FILTER_PREFIX + "BoxShadow", BASE_RIGHT_SHADOW_STYLE));
		}
		
		bookParentNode.appendChild(baseleft);
		bookParentNode.appendChild(baseright);
		bookParentNode.appendChild(pageRight);
		bookParentNode.appendChild(pageLeft);
		
		var setLeftShadow = function(page){
			HtmlNode.setOpacity(baseleft, ((page + 1) / (remakedPages.length / 2) * 0.25 + 0.2));
		}
		var setRightShadow = function(page){
			HtmlNode.setOpacity(baseright, ((remakedPages.length / 2 - page + 1) / (remakedPages.length / 2) * 0.25 + 0.2));
		}
		
		shadow = { setLeftShadow : setLeftShadow, setRightShadow : setRightShadow, pageleft : pageLeft, pageright : pageRight };
	}
	
	
	function build(){
		
		if(fullScreen){
			HtmlNode.set(
				document.body,
				[ HtmlNode.attribute("scroll", "no"), HtmlNode.style("margin", "0px"), HtmlNode.style("padding", "0px"), HtmlNode.style("overflow", "hidden") ]
			);
			bookParentNode.style.top  = "0px";
			bookParentNode.style.left = "0px";
			props.pageWidth = Math.floor(window.innerWidth / 2);
			props.pageHeight = Math.floor(window.innerHeight) - 1;
		}
		
		var onresize = function(){
			var pos = fullScreen ? {left:0,top:0} : absolutePosition(marker);
			bookParentNode.style.left = pos.left + "px";
			bookParentNode.style.top  = pos.top + "px";
			
			for(var i=0; i<resizedFunctions.length; i++){
				resizedFunctions[i]();
			}
		}
	
		HtmlNode.attachEvent("resize",onresize);
		
		remakePages(extractPages(pageClassName));
		setShadow();
		
		
		for(var i=0; i<remakedPages.length; i++){
			(
				function(index){
					remakedPages[index].style.top = 0;
					remakedPages[index].zIndex = baseZindex - index - 2;
					remakedPages[index].style.zIndex = baseZindex - index - 2;
					
					document.body.appendChild(remakedPages[index]);
					
					remakedPages[index].scrollPanel.style.direction = index%2 == 0 ? "rtl" : "ltr";
					remakedPages[index].scrollPanel.style.unicodeBidi = index%2 == 0 ? "bidi-override" : "embed";
					
					remakedPages[index].foot.appendChild(
						(
							function(){
								var table = document.createElement("table");
								var row = table.insertRow(0);
								var leftCell   = row.insertCell(0);
								var centerCell = row.insertCell(1);
								var rightCell  = row.insertCell(2);
								
								table.style.width = "100%";
								table.style.height = "100%";
								table.style.cursor = index == 0 ? "default" : "pointer";
								table.title = index == remakedPages.length - 1 ? props.headLabelText : index == 0 ? "" : index % 2 == 0 ? props.prevLabelText : props.nextLabelText;
								
								leftCell.style.width = "30px";
								leftCell.style.textAlign = "left";
								leftCell.className = name + classNameSeparator + "turninfo";
								
								rightCell.style.width = "30px";
								rightCell.style.textAlign = "right";
								rightCell.className = name + classNameSeparator + "turninfo";
								
								centerCell.style.textAlign = "center";
								centerCell.className = name + classNameSeparator + "pagenumber";
								
								centerCell.appendChild(document.createTextNode("-" + (index+1) + "-"));
								table.onclick = function(){
									turnPage(index % 2 == 0 ? "prev" : "next");
								};

								
								var pager = document.createElement("div");
								pager.style.position = "absolute";
								pager.style.display = "block";
								pager.style.width = "150px";
								pager.style.bottom = "3px";
								
								if(index % 2 == 0){
									leftCell.style.position = "relative";
									pager.appendChild(document.createTextNode(index==0 ? "" : props.prevLabelText));
									pager.style.left = "5px";
									pager.style.textAlign = "left";
									leftCell.appendChild(pager);
								}
								else if(index==remakedPages.length-1){
									rightCell.style.position = "relative";
									pager.appendChild(document.createTextNode(props.headLabelText));
									pager.style.right = "5px";
									pager.style.textAlign = "right";
									leftCell.appendChild(pager);
								}
								else{
									rightCell.style.position = "relative";
									pager.appendChild(document.createTextNode(props.nextLabelText));
									pager.style.right = "5px";
									pager.style.textAlign = "right";
									rightCell.appendChild(pager);
								}
								
								return table;
							}
						)()
					);
					remakedPages[index].style.display = "none";
					
					bookParentNode.appendChild(remakedPages[index]);
					
					
					var panelPositionSet = function(){
						remakedPages[index].style.left = index%2 * props.pageWidth  + "px";
						remakedPages[index].scrollPanel.style.height = props.pageHeight - props.footHeight - 2  + "px";
					};
					panelPositionSet();
					resizedFunctions.push(panelPositionSet);
					
					
					
					if(isIPad){
						
						(
							function(){
								remakedPages[index].addEventListener("touchstart", touched, false);
								remakedPages[index].addEventListener("touchmove", touched, false);
								remakedPages[index].addEventListener("touchend", touchend, false);
								
								
								var events = new Object();
								
								function touched(event){
									
									for(var j=0; j<event.touches.length; j++){
										if(!events[event.touches[j].identifier]){
												events[event.touches[j].identifier] = { begin : { x : event.touches[j].pageX, y : event.touches[j].pageY, time : new Date().getTime() } };
										}
										else{
											events[event.touches[j].identifier]["end"] = { x : event.touches[j].pageX, y : event.touches[j].pageY, time : new Date().getTime() };
										}
									}
									event.preventDefault(); 
								}
								
								function touchend(event){
									
									for(var prop in events){
										
										if(!events[prop].end){
											continue;
										}
										
										var def = events[prop].end.x - events[prop].begin.x;
										var dx_dt = def / (events[prop].end.time - events[prop].begin.time);
										
										if(index % 2){
											if(dx_dt < -0.8 && def < 200){
												turnPage("next");
												return;
											}
										}
										else{
											if(dx_dt > 0.8 && def > 200){
												turnPage("prev");
												return;
											}
										}
									}
									event.preventDefault();
								}
							}
						)();
					}
				}
			)(i);
		}
		
		var openingPageNumber = (openingPage - openingPage % 2) / 2;
		remakedPages[openingPageNumber * 2].style.display = isIE ? "block" : "table";
		remakedPages[openingPageNumber * 2 + 1].style.display = isIE ? "block" : "table";
		pageNumber = openingPageNumber;
		
		if(!!ignoreClassName){
			for(var els=document.getElementsByTagName("*"),i=0; i<els.length; i++){
				if(classNames(els[i].className)[ignoreClassName]){
					els[i].style.display = "none";
				}
			}
		}
		document.body.appendChild(bookParentNode);
		
		shadow.setLeftShadow(pageNumber);
		shadow.setRightShadow(pageNumber);
		
	}
	
	
	function turnPage(type){

		if(scrollRad != 0) return;
		

		if(type == "next"){
			if(pageNumber >= remakedPages.length / 2 - 1){
				type = 0;
			}
			else{
				type = (pageNumber + 1) * 2;
			}
		}
		else if(type == "prev"){
			if(pageNumber == 0){
				type = -1;
			}
			else{
				type = (pageNumber - 1) * 2;
			}
		}
		(function(page){
			if(isNaN(page) || page < 0){
				return;
			}
			var targetPageNumber = (page - page % 2) / 2;
			
			if(targetPageNumber > pageNumber){
				turnLeft(pageNumber, targetPageNumber);
			}
			else if(targetPageNumber < pageNumber){
				turnRight(pageNumber, targetPageNumber);
			}
			pageNumber = targetPageNumber;
		})(type);
		
	}


	function switchDisplayStyle(displaySet){
		for(var i=0; i<remakedPages.length; i++){
			remakedPages[i].style.display = !!displaySet[i] ? isIE ? "block" : "table" : "none";
		}
	}

	function turnRight(oldNum, newNum){
		
		var width = new Object();
		
		var panelSwitched = false;
		
		if(scrollRad == 0){
			switchDisplayStyle(
				(function(){
					var set = new Object();
					set[oldNum * 2] = true;
					set[oldNum * 2 + 1] = true;
					set[newNum * 2] = true;
					set[newNum * 2 + 1] = true;
					return set;
				})()
			);
			targetUL  = remakedPages[newNum * 2];
			targetUR = remakedPages[newNum * 2 + 1];
			targetLL  = remakedPages[oldNum * 2];
			
			width["LowerLeft"] = targetLL.clientWidth;
			width["UpperRight"] = targetUR.clientWidth;
			
			targetLL.style.zIndex = baseZindex;
			targetUR.style.display = "none";
			
			if(isIE){
				targetLL.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=1,M12=0,M21=0,M22=1,Dx=0,Dy=1, FilterType='nearest neighbor',sizingMethod='auto expand')";
				targetUR.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=1,M12=0,M21=0,M22=1,Dx=0,Dy=1, FilterType='nearest neighbor',sizingMethod='auto expand')";

				scrollTimer = setInterval(turnIE, props.interval);
			}
			else{
				targetLL.style.transformOrigin = targetUR.style["-ms-transform-origin"] = targetUR.style[FILTER_PREFIX + "TransformOrigin"] = "100% 100%";
				targetUR.style.transformOrigin = targetUR.style["-ms-transform-origin"] = targetUR.style[FILTER_PREFIX + "TransformOrigin"] = "0 100%";
				targetUR.style.transform = targetUR.style["-ms-transform"] = targetUR.style[FILTER_PREFIX + "Transform"] = "skewY(-90deg) scaleX(" + Math.cos((-90)  / 180 * Math.PI) + ")";
				
				scrollTimer = setInterval(turn, props.interval);
			}
			
			shadow.pageleft.style.zIndex = targetLL.style.zIndex - 1;
			shadow.pageleft.style.display = "block";
			shadow.setLeftShadow(newNum);
		}
		
		
		
		
		function turnIE(){
			if(scrollRad <= 90){

				var tan = Math.sin((180 + scrollRad)  / 180 * Math.PI);
				
				targetLL.filters["DXImageTransform.Microsoft.Matrix"].M11 = - Math.cos((180 + scrollRad)  / 180 * Math.PI);
				targetLL.filters["DXImageTransform.Microsoft.Matrix"].M21 = - tan;
				
				targetLL.style.top  = tan * width["LowerLeft"];
				targetLL.style.left = width["LowerLeft"] * (1 + Math.cos((180 + scrollRad)  / 180 * Math.PI));
				
				
				shadow.pageleft.style.width = (scrollRad == 90 ? 1 : Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth) + "px";
				shadow.pageleft.style.height = props.pageHeight + "px";
				shadow.pageleft.style.left = - Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth + props.pageWidth + "px";
				shadow.pageleft.filters["alpha"].opacity = Math.cos(scrollRad  / 180 * Math.PI) * 0.3 * 100;
				
				scrollRad += props.scrollSize;
			}
			else if(scrollRad <= 180){
				if(!panelSwitched){
					panelSwitched = true;
					targetLL.style.display = "none";
					targetLL.filters["DXImageTransform.Microsoft.Matrix"].M11 = 1;
					targetLL.filters["DXImageTransform.Microsoft.Matrix"].M21 = 0;
					targetLL.style.top  = 0;
					
					shadow.pageleft.style.display = "none";
					shadow.pageright.style.display = "block";
					shadow.pageright.style.zIndex = targetUR.style.zIndex - 1;
					
					targetUR.style.display = "block";
				}
				
				var tan = Math.sin(( - scrollRad)  / 180 * Math.PI);
				targetUR.style.top =  tan * width["UpperRight"];
				targetUR.filters["DXImageTransform.Microsoft.Matrix"].M11 = - Math.cos(scrollRad  / 180 * Math.PI);
				targetUR.filters["DXImageTransform.Microsoft.Matrix"].M21 = tan;
				
				shadow.pageright.filters["alpha"].opacity = - Math.cos(scrollRad  / 180 * Math.PI) * 0.3 * 100;
				shadow.pageright.style.width = - Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth + "px";
				shadow.pageright.style.height = props.pageHeight + "px";
				
				scrollRad += props.scrollSize;
				
			}
			else{
				clearInterval(scrollTimer);
				scrollRad = 0;
				shadow.pageright.style.display = "none";
				shadow.setRightShadow(newNum);
			}
			
			
		}
		
		function turn(){

			if(scrollRad <= 90){
				targetLL.style.transform = targetLL.style["-ms-transform"] = targetLL.style[FILTER_PREFIX + "Transform"] = "skewY(" + scrollRad + "deg) scaleX(" + Math.cos(scrollRad  / 180 * Math.PI) + ")";
				
				shadow.pageleft.style.width = (scrollRad == 90 ? 1 : Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth) + "px";
				shadow.pageleft.style.height = props.pageHeight + "px";
				shadow.pageleft.style.left = - Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth + props.pageWidth + "px";
				shadow.pageleft.style.opacity = Math.cos(scrollRad  / 180 * Math.PI) * 0.3;
				
				scrollRad += props.scrollSize;
			}
			else if(scrollRad <= 180){
				if(!panelSwitched){
					panelSwitched = true;
					targetLL.style.display = "none";
					targetLL.style.transform = targetLL.style["-ms-transform"] = targetLL.style[FILTER_PREFIX + "Transform"] = "skewY(0deg) scaleX(1)";
					targetUR.style.display = "table";
					
					shadow.pageleft.style.display = "none";
					shadow.pageright.style.display = "block";
					shadow.pageright.style.zIndex = targetUR.style.zIndex - 1;
				}
				
				
				shadow.pageright.style.opacity = - Math.cos(scrollRad  / 180 * Math.PI) * 0.3;
				shadow.pageright.style.width = - Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth + "px";
				shadow.pageright.style.height = props.pageHeight + "px";
				
				targetUR.style.transform = targetUR.style["-ms-transform"] = targetUR.style[FILTER_PREFIX + "Transform"] = "skewY(" + (scrollRad - 180) + "deg) scaleX(" + Math.cos((scrollRad - 180)  / 180 * Math.PI) + ")";
				scrollRad += props.scrollSize;
				
			}
			else{
				clearInterval(scrollTimer);
				scrollRad = 0;
				shadow.pageright.style.display = "none";
				shadow.setRightShadow(newNum);
			}
			
			
		}

	}

	function turnLeft(oldNum, newNum){
		
		var width = new Object();
		
		var panelSwitched = false;
		
		if(scrollRad == 0){
			switchDisplayStyle(
				(function(){
					var set = new Object();
					set[oldNum * 2] = true;
					set[oldNum * 2 + 1] = true;
					set[newNum * 2] = true;
					set[newNum * 2 + 1] = true;
					return set;
				})()
			);
			targetUL  = remakedPages[oldNum * 2];
			targetUR = remakedPages[oldNum * 2 + 1];
			targetLL  = remakedPages[newNum * 2];
			
			
			width["UpperRight"] = targetUR.clientWidth;
			width["LowerLeft"] = targetLL.clientWidth;
			
			targetLL.style.display = "none";
			
			targetLL.style.left = "0px";
			
			if(isIE){
				shadow.pageright.filters["alpha"].opacity = 0.3 * 100;
				targetUR.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=1,M12=0,M21=0,M22=1,Dx=0,Dy=1, FilterType='nearest neighbor',sizingMethod='auto expand')";
				targetLL.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=1,M12=0,M21=0,M22=1,Dx=0,Dy=1, FilterType='nearest neighbor',sizingMethod='auto expand')";
				scrollTimer = setInterval(turnIE, props.interval);
				
			}
			else{
				
				shadow.pageright.style.opacity = 0.3;
				targetUR.style.transformOrigin = targetUR.style["-ms-transform-origin"] = targetUR.style[FILTER_PREFIX + "TransformOrigin"] = "0 100%";
				targetLL.style.transformOrigin = targetLL.style["-ms-transform-origin"] = targetLL.style[FILTER_PREFIX + "TransformOrigin"] = "100% 100%";
				scrollTimer = setInterval(turn, props.interval);
			}
			shadow.pageright.style.zIndex = targetUR.style.zIndex - 1;
			shadow.pageright.style.display = "block";
			shadow.pageright.style.left = props.pageWidth + "px";
			shadow.setRightShadow(newNum);
			
		}
		
		function turnIE(){
			

			if(scrollRad <= 90){
				var tan = Math.pow(1 - Math.pow(Math.cos(scrollRad  / 180 * Math.PI), 2), 0.5);
				targetUR.style.top =  - tan * width["UpperRight"];
				targetUR.filters["DXImageTransform.Microsoft.Matrix"].M11 = Math.cos(scrollRad  / 180 * Math.PI);
				targetUR.filters["DXImageTransform.Microsoft.Matrix"].M21 = - tan;
				shadow.pageright.style.opacity = Math.cos(scrollRad  / 180 * Math.PI) * 0.3 * 100;
				shadow.pageright.style.width = (scrollRad == 90 ? 1 : Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth) + "px";
				shadow.pageright.style.height = props.pageHeight + "px";
				scrollRad += props.scrollSize;
			}
			else if(scrollRad <= 180){
				
				if(!panelSwitched){
					panelSwitched = true;
					targetUR.style.display = "none";
					targetUR.filters["DXImageTransform.Microsoft.Matrix"].M11 = 1;
					targetUR.filters["DXImageTransform.Microsoft.Matrix"].M21 = 0;
					targetUR.style.top =  0;
					
					targetLL.style.zIndex = baseZindex;
					targetLL.style.display = "block";
					
					shadow.pageright.style.display = "none";
					shadow.pageleft.style.zIndex = targetLL.style.zIndex - 1;
					shadow.pageleft.style.display = "block";
				}
				
				var tan = Math.sin((180 - scrollRad)  / 180 * Math.PI);
				
				
				targetLL.filters["DXImageTransform.Microsoft.Matrix"].M11 = Math.cos((180 - scrollRad)  / 180 * Math.PI);
				targetLL.filters["DXImageTransform.Microsoft.Matrix"].M21 =  tan;
				
				targetLL.style.top  = - tan * width["LowerLeft"];
				targetLL.style.left = width["LowerLeft"] * (1- Math.cos((180 - scrollRad)  / 180 * Math.PI));
				
				shadow.pageleft.style.width = - Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth + "px";
				shadow.pageleft.style.height = props.pageHeight + "px";
				shadow.pageleft.style.left = Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth + props.pageWidth + "px";
				shadow.pageleft.filters["alpha"].opacity = - Math.cos(scrollRad  / 180 * Math.PI) * 0.3 * 100;
				
				scrollRad += props.scrollSize;
				
			}
			else{
				clearInterval(scrollTimer);
				targetUL.style.display = "none";
				targetLL.style.zIndex = targetLL.zIndex;
				shadow.pageleft.style.display = "none";
				scrollRad = 0;
				shadow.setLeftShadow(newNum);
			}

		}
		
		function turn(){
			

			if(scrollRad <= 90){

				targetUR.style.transform = targetUR.style["-ms-transform"] = targetUR.style[FILTER_PREFIX + "Transform"] = "skewY(" + (0 - scrollRad) + "deg) scaleX(" + Math.cos(scrollRad  / 180 * Math.PI) + ")";
				
				shadow.pageright.style.opacity = Math.cos(scrollRad  / 180 * Math.PI) * 0.3;
				shadow.pageright.style.width = (scrollRad == 90 ? 1 : Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth) + "px";
				shadow.pageright.style.height = props.pageHeight + "px";
				scrollRad += props.scrollSize;
				
			}
			else if(scrollRad <= 180){
				if(!panelSwitched){
					panelSwitched = true;
					targetUR.style.display = "none";
					
					targetUR.style.transform = targetUR.style["-ms-transform"] = targetUR.style[FILTER_PREFIX + "Transform"] = "skewY(0deg) scaleX(1)";
					targetLL.style.transform = targetLL.style["-ms-transform"] = targetLL.style[FILTER_PREFIX + "Transform"] = "skewY(90deg) scaleX(" + Math.cos((180 - 90)  / 180 * Math.PI) + ")";
					targetLL.style.display = "table";
					targetLL.style.zIndex = baseZindex;
					
					shadow.pageright.style.display = "none";
					shadow.pageleft.style.zIndex = targetLL.style.zIndex - 1;
					shadow.pageleft.style.display = "block";
				}
				
				shadow.pageleft.style.width = - Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth + "px";
				shadow.pageleft.style.height = props.pageHeight + "px";
				shadow.pageleft.style.left = Math.cos(scrollRad  / 180 * Math.PI) * props.pageWidth + props.pageWidth + "px";
				shadow.pageleft.style.opacity = - Math.cos(scrollRad  / 180 * Math.PI) * 0.3;
				
				targetLL.style.transform = targetLL.style["-ms-transform"] = targetLL.style[FILTER_PREFIX + "Transform"] = "skewY(" + (180 - scrollRad) + "deg) scaleX(" + Math.cos((180 - scrollRad)  / 180 * Math.PI) + ")";
				scrollRad += props.scrollSize;
				
			}
			else{
				clearInterval(scrollTimer);
				targetUL.style.display = "none";
				targetLL.style.zIndex = targetLL.zIndex;
				shadow.pageleft.style.display = "none";
				scrollRad = 0;
				shadow.setLeftShadow(newNum);
			}

		}
	}
	

	
	function remakePages(originalContents){
		remakedPages = new Array(originalContents.length);
		
		var innerColor = "#" + hexValue(props.baseColor.r) + hexValue(props.baseColor.g) + hexValue(props.baseColor.b);
		var outerColor = "#" + hexValue(props.shadowColor.r) + hexValue(props.shadowColor.g) + hexValue(props.shadowColor.b);
		
		
		for(var i=originalContents.length-1; i>=0; i--){
			(function(index){
				var outerTable = document.createElement("table");
				var outerRow = outerTable.insertRow(0);
				var outerContentCell;
				
				outerTable.cellSpacing = 0;
				outerTable.cellPadding = 0;
				outerTable.style.position = "absolute";
				outerTable.style.borderStyle = "solid";
				outerTable.style.borderWidth = 1 + "px";
				outerTable.style.borderColor = "rgb(" + props.shadowColor.r + "," + props.shadowColor.g + "," + props.shadowColor.b + ")";
				outerTable.style.backgroundColor = "rgb(" + props.baseColor.r + "," + props.baseColor.g + "," + props.baseColor.b + ")";
				outerTable.style.borderRadius = index % 2 == 0 ? "11px 5px 3px 0px" : "5px 11px 0px 3px";
				
				if(index % 2 == 0){
					outerContentCell = outerRow.insertCell(0);
					
					var gradationCell = outerRow.insertCell(1);
					gradationCell.width = props.gradationSize;
					
					if(!isIE){
						try{
							gradationCell.style.background = FILTER_PREFIX == "Webkit" ? "-webkit-linear-gradient(left, " + innerColor + ", " + outerColor + ")" : FILTER_PREFIX == "Moz" ? "-moz-linear-gradient(left, " + innerColor + ", " + outerColor + ")" : "linear-gradient(to right, " + innerColor + ", " + outerColor + ")";
						}
						catch(e){}
					}
					gradationCell.style.filter = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + innerColor + "', endColorstr='" + outerColor + "', GradientType=1)";
					
					
					gradationCell.style.borderRadius = "0px 4px 2px 0px";
				}
				else{
					var gradationCell = outerRow.insertCell(0);
					gradationCell.width = props.gradationSize;
					if(!isIE){
						try{
							gradationCell.style.background = FILTER_PREFIX == "Webkit" ? "-webkit-linear-gradient(left, " + outerColor + ", " + innerColor + ")" : FILTER_PREFIX == "Moz" ? "-moz-linear-gradient(left, " + outerColor + ", " + innerColor + ")" : "linear-gradient(to right, " + outerColor + ", " + innerColor + ")";
						}
						catch(e){}
					}
					gradationCell.style.filter = "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + outerColor + "', endColorstr='" + innerColor + "', GradientType=1)";
					
					gradationCell.style.borderRadius = "4px 0px 0px 2px"
					
					outerContentCell = outerRow.insertCell(1);
				}
				
			
				var originalContent = originalContents[index];
				var innerTable = document.createElement("table");
				
				
				var innerContentCell = innerTable.insertRow(0).insertCell(0);
				var bottomCell = innerTable.insertRow(1).insertCell(0);

				var outerScrollDiv = document.createElement("div");
				outerScrollDiv.style.overflow = "auto";
				outerScrollDiv.style.borderRadius = index % 2 == 0 ? "11px 4px 2px 0px" : "4px 11px 0px 2px";
				outerScrollDiv.className = name + classNameSeparator + "pageframe";

				var innerScrollDiv = document.createElement("div");
				innerScrollDiv.style.direction = "ltr";
				innerScrollDiv.style.unicodeBidi = "embed";
				innerScrollDiv.style.borderRadius = index % 2 == 0 ? "11px 4px 2px 0px" : "4px 11px 0px 2px";

				outerScrollDiv.appendChild(innerScrollDiv);
				innerScrollDiv.appendChild(originalContent);
				
				bottomCell.style.height = props.footHeight + "px";
				bottomCell.className = name + classNameSeparator + "foot";
				
				innerTable.style.borderRadius = index % 2 == 0 ? "11px 4px 4px 0px" : "4px 11px 0px 4px";
				innerTable.cellSpacing = 0;
				innerTable.cellPadding = 0;
				innerTable.style.width  = "100%";
				innerTable.style.height = "100%";
				
				innerContentCell.vAlign = "top";
				innerContentCell.appendChild(outerScrollDiv);
				
				innerContentCell.vAlign = "top";
				outerContentCell.appendChild(innerTable);
				
				outerTable.scrollPanel = outerScrollDiv;
				outerTable.foot = bottomCell;
				
				remakedPages[index] = outerTable;
				
				
				var panelSizeSet = function(){
					if(fullScreen){
						props.pageWidth = Math.floor(window.innerWidth / 2);
						props.pageHeight = Math.floor(window.innerHeight) - 1;
					}
					outerTable.style.width = props.pageWidth + "px";
					outerTable.style.height = props.pageHeight + 1 + "px";
					outerScrollDiv.style.width = (props.pageWidth - props.gradationSize) + "px";
				};
				
				panelSizeSet();
				resizedFunctions.push(panelSizeSet);
			})(i);
		}
	}
	
	function extractPages(className){
		var tags = document.getElementsByTagName("div");
		for(var i=0,pages=new Array(); i<tags.length; i++){
			if(!!classNames(tags[i].className)[className]){
				pages.push(tags[i]);
			}
		}
		if(pages.length % 2 == 1){
			var div = document.createElement("div");
			div.className = className;
			pages.push(div);
		}
		return pages;
	}
	
	function classNames(classNameString){
		var dividedNames = !classNameString ? [] : classNameString.indexOf(" ") < 0 ? [classNameString] : classNameString.split(" ");
		for(var i=0,nameSet={}; i<dividedNames.length; i++){
			nameSet[dividedNames[i]] = true;
		}
		return nameSet;
	}
	
	
	function absolutePosition(el){
		var pos = { top : 0, left : 0 };
		var pointer = el;
		while(true){
			pos.top  += pointer.offsetTop;
			pos.left += pointer.offsetLeft;
			
			pointer = pointer.offsetParent;
			if(!pointer || pointer.tagName == "body"){
				break;
			}
		}
		return pos;
	}
	
	function hexValue(int){
		var value = (int-0).toString(16);
		if(value.length < 2){
			return "0" + value;
		}
		return value;
	}
		
	// ---------------------------------------
		
	function HtmlNode(){
		
		var TYPE_ATTR  = "a";
		var TYPE_STYLE = "s";
		
		HtmlNode.attribute = function(name, value){
			return { type : TYPE_ATTR, name : name, value : value }
		}
		
		HtmlNode.style = function(name, value){
			return { type : TYPE_STYLE, name : name, value : value }
		}
		
		
		HtmlNode.set = function(tag, attrs, children){
			
			attrs = !!attrs ? (attrs instanceof Array ? attrs : [attrs]) : [];
			children = !!children ? (children instanceof Array ? children : [children]) : [];
			
			for(var i=0; i<attrs.length; i++){
				switch(attrs[i].type){
					
					case TYPE_ATTR:
						tag.setAttribute(attrs[i].name, attrs[i].value);
					break;
					
					case TYPE_STYLE:
						tag.style[attrs[i].name] = attrs[i].value;
					break;
				}
			}
			
			for(var i=0; i<children.length; i++){
				tag.appendChild(children[i]);
			}
			
			return tag;
		}
		
		HtmlNode.create = function(tagName, attrs, children){
			return HtmlNode.set(document.createElement(tagName), attrs, children);
		}
		
		HtmlNode.attachEvent = function(evname, func){
			if(!!navigator.userAgent.match(/msie/i)){
				window.attachEvent("on" + evname, func);
			}
			else{
				window.addEventListener(evname, func, false);
			}
		}
		
		HtmlNode.setOpacity = function(target, opacity){
		
			if(isIE){
				if(!target.filters.alpha){
					target.style.filter = target.style.filter + " Alpha(opacity=100)";
				}
				target.filters["alpha"].opacity =  opacity * 100;
			}
			else{
				target.style.opacity = opacity;
			}
			return target;
		}
	}
	
	// ---------------------------------------
	
	function Shape(){
		

		if(isIE && !document.namespaces["v"]){
			try{
				document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
				document.createStyleSheet().addRule("v\\:*", "behavior:url(#default#VML);");
			}
			catch(e){
				alert(e)
				isIE = false;
			}
		}
		
		Shape.path = function(pathes, stroke, fill, size, offset){
			for(var i=0,maxx=0,maxy=0,minx=Number.POSITIVE_INFINITY,miny=Number.POSITIVE_INFINITY; i<pathes.length; i++){
				maxx = Math.max(maxx, pathes[i].x);
				maxy = Math.max(maxy, pathes[i].y);
				minx = Math.min(minx, pathes[i].x);
				miny = Math.min(miny, pathes[i].y);
			}
			for(var i=0; i<pathes.length; i++){
				pathes[i].x -= minx;
				pathes[i].y -= miny;
			}
			
			var width  = maxx - minx;
			var height = maxy - miny;
		
			var el;
			
			if(isIE){
				el = document.createElement("div");
				el.style.width  = !!size ? size.width : width;
				el.style.height = !!size ? size.height : height;
				
				var s = document.createElement("v:shape");
				for(var i=1,path=[]; i<pathes.length; i++){
					path.push(pathes[i].x + "," + pathes[i].y);
				}
				s.coordOrigin = "0,0";
				s.coordSize = width + "," + height;
				s.path = "m " + pathes[0].x + "," + pathes[0].y + " l " + path.join(" ") + " x e";
				
				if(!!stroke){
					s.strokeColor = "rgb(" + stroke.r + ", " + stroke.g + ", " + stroke.b + ")";
					s.strokeWeight = stroke.width;
				}
				else{
					s.strokeColor = "none";
				}
				
				s.style.width = width;
				s.style.height = height;
				
				if(!!fill){
					var f = document.createElement("v:fill");
					f.color = "rgb(" + fill.r + ", " + fill.g + ", " + fill.b  + ")";
					if(fill.a != null){
						f.opacity = fill.a;
					}
					s.appendChild(f);
				}
				
				if(!!offset){
					s.style.position = "absolute";
					s.style.top = offset.y;
					s.style.left = offset.x;
				}
				
				el = s;
			}
			else{

				el = document.createElement("canvas");
				el.width = (!!size ? size.width : width);
				el.height = !!size ? size.height : height;
				
				var con = el.getContext("2d");
				
				con.beginPath();
				con.moveTo(pathes[0].x, pathes[0].y);
				for(var i=1; i<pathes.length; i++){
					con.lineTo(pathes[i].x, pathes[i].y);
				}
				con.closePath();
				
				if(!!fill){
					con.fillStyle = "rgba(" + fill.r + ", " + fill.g + ", " + fill.b + ", " + (fill.a != null ? fill.a : 1) + ")";
					con.fill();
				}
				
				if(!!stroke){
					con.lineWidth = stroke.width;
					con.strokeStyle = "rgb(" + stroke.r + ", " + stroke.g + ", " + stroke.b + ")";
					con.stroke();
				}
				el.style.width = (!!size ? size.width : width);
				el.style.height = (!!size ? size.height : height);
			}
			
			return el;
		}
	}
	
	
	
}
