/*globals document, window*/

(function (document, window) {
	'use strict';

	var Scraper = {
		images: [],
		dedupe: true,
		vars: {
			timer: 0
		},
		setup: function () {
			this.images = [];

			return this;
		},
		getImg: function () {
			var img = document.images,
				i = 0,
				l = 0;

			for (i = 0, l = img.length; i < l; i += 1) {
				this.images.push(img[i].getAttribute('src'));
			}

			return this;
		},
		getBackgroundImg: function () {
			var el = document.body.getElementsByTagName('*'),
				img = '',
				i = 0,
				l = 0;

			for (i = 0, l = el.length; i < l; i += 1) {
				img = el[i].style.backgroundImage;

				if (img) {
					img = this.cleanImg(img);
					this.images.push(img);
				}
			}

			return this;
		},
		cleanImg: function (src) {
			return src.replace(/(^url\()|(\))|(")/g, '');
		},
		canonicalizeImg: function () {
			var loc = window.location,
				host = loc.hostname,
				http = loc.protocol,
				href = loc.href,
				img = this.images,
				url = [],
				i = 0,
				l = 0;

			for (i = 0, l = img.length; i < l; i += 1) {
				if (img[i].search(/^http/) === -1) {
					if (img[i][0] === '/') {
						img[i] = [http, '//', host, img[i]].join('');
					} else {
						url = href.split('/');
						url = url.splice(0, url.length - 1);
						url.push(img[i]);
						img[i] = url.join('/');
					}
				}
			}

			return this;
		},
		dedupeImg: function () {
			var orig = this.images,
				unique = [],
				i = 0,
				l = 0;

			for (i = 0, l = orig.length; i < l; i += 1) {
				if (unique.indexOf(orig[i]) === -1) {
					unique.push(orig[i]);
				}
			}

			this.images = unique;

			return this;
		},
		init: function () {
			this.setup().getImg().getBackgroundImg().canonicalizeImg();

			if (this.dedupe === true) {
				this.dedupeImg();
			}

			return this;
		}
	};

	window.Scraper = Scraper;
}(document, window));