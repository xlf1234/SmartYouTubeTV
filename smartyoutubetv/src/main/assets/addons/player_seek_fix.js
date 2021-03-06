/*
Description: Imitate press on OK button after seek
*/

function Utils() {
	this.playerContainerSelector = '#watch'; // div that receives keys events for player (note: some events don't reach upper levels)
	this.appContainerSelector = '#leanback'; // div that receives keys events for app
	this.listeners = {};

	function isSelector(el) {
        return typeof el === 'string' || el instanceof String;
    }

	this.triggerEvent = function(element, type, keyCode) {
        var el = element;
        if (isSelector(element)) {
            el = this.$(element);
        }

        console.log("ExoUtils.triggerEvent: " + element + " " + type + " " + keyCode);

        if (!el) {
            console.warn("ExoUtils.triggerEvent: unable to find " + element);
            return;
        }

        if ('createEvent' in document) {
            // modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            e.keyCode = keyCode;
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        } else {
            // IE 8
            var e = document.createEventObject();
            e.keyCode = keyCode;
            e.eventType = type;
            el.fireEvent('on'+e.eventType, e);
        }
    };

    this.triggerEnter = function(selector) {
        // simulate mouse/enter key press
        var enter = 13;
        this.triggerEvent(selector, 'keyup', enter);
    };

    this.hasClass = function(elem, klass) {
        if (!elem) {
            return null;
        }
        return (" " + elem.className + " ").indexOf(" " + klass + " ") > -1;
    };

    this.$ = function(selector) {
        if (!isSelector(selector))
            return selector;
        return document.querySelectorAll(selector)[0];
    };

    this.getCurrentTimeMs = function() {
    	var d = new Date();
		return d.getTime();
    };

    this.addListener = function(listener, root) {
        if (this.listeners[listener]) {
        	console.log("This listener already added... do nothing");
            return;
        }

        this.listeners[listener] = true;

        var container = document.querySelector(root);
        var $this = this;
        console.log('Utils::addListener:keyup... ');
        container.addEventListener('keyup', function(event) {
            listener.onKeyEvent(event);
        });
    };

    this.addPlayerListener = function(listener) {
    	this.addListener(listener, this.playerContainerSelector);
    };

    this.addAppListener = function(listener) {
    	this.addListener(listener, this.appContainerSelector);
    };
}

var utils = new Utils();

function PlayerSeekAddon() {
	this.activeWatchClass = "transport-showing";
	this.progressBarSelector = "#transport-controls";
	this.timeoutTimeMS = 1000;
	this.myTimeout = null;

    this.run = function() {
    	utils.addPlayerListener(this);
    };

    this.onKeyEvent = function(e) {
	    var up = 38;
	    var down = 40;
	    var left = 37;
	    var right = 39;
	    var enter = 13;
	    var esc = 27;

    	console.log("PlayerSeekAddon::onKeyEvent:" + e.keyCode);

    	var notLeftOrRight = e.keyCode != left && e.keyCode != right;

    	if (notLeftOrRight) {
    		return;
    	}

    	if (this.myTimeout) {
    		console.log('PlayerSeekAddon::Clear unneeded timeout');
    		clearTimeout(this.myTimeout);
    	}

    	var $this = this;
    	this.myTimeout = setTimeout(function() {
    		$this.doPressOnOKButton();
    	}, this.timeoutTimeMS);
    };

    this.doPressOnOKButton = function() {
    	console.log('PlayerSeekAddon::Imitate press on OK button');
    	utils.triggerEnter(this.progressBarSelector);
    };
}

var addon = new PlayerSeekAddon().run();