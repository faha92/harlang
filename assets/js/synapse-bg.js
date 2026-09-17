/*
	Synapse background — animated node network for Harlang.io
	Draws softly drifting, twinkling nodes connected by lines behind the intro/header.
*/
(function () {

	var canvas = document.getElementById('synapse-bg');
	if (!canvas || !canvas.getContext) return;

	var ctx = canvas.getContext('2d');
	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	var accent = 'rgb(103, 103, 207)';
	var linkDist = 150;
	var width, height, nodes, rafId;

	function resize() {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
	}

	function makeNodes() {
		var count = Math.round((width * height) / 16000);
		count = Math.max(45, Math.min(140, count));

		nodes = [];
		for (var i = 0; i < count; i++) {
			nodes.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * 0.35,
				vy: (Math.random() - 0.5) * 0.35,
				r: Math.random() * 1.3 + 1,
				phase: Math.random() * Math.PI * 2,
				twinkleSpeed: 0.012 + Math.random() * 0.022
			});
		}
	}

	function drawFrame() {
		ctx.clearRect(0, 0, width, height);

		var i, j, n, a, b, dx, dy, dist, twinkle;

		for (i = 0; i < nodes.length; i++) {
			n = nodes[i];
			n.x += n.vx;
			n.y += n.vy;
			if (n.x < 0 || n.x > width) n.vx *= -1;
			if (n.y < 0 || n.y > height) n.vy *= -1;
			n.phase += n.twinkleSpeed;
		}

		for (i = 0; i < nodes.length; i++) {
			for (j = i + 1; j < nodes.length; j++) {
				a = nodes[i];
				b = nodes[j];
				dx = a.x - b.x;
				dy = a.y - b.y;
				dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < linkDist) {
					ctx.strokeStyle = accent;
					ctx.globalAlpha = (1 - dist / linkDist) * 0.22;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.stroke();
				}
			}
		}

		for (i = 0; i < nodes.length; i++) {
			n = nodes[i];
			twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(n.phase));
			ctx.globalAlpha = twinkle;
			ctx.fillStyle = accent;
			ctx.shadowColor = accent;
			ctx.shadowBlur = 7 * twinkle;
			ctx.beginPath();
			ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.shadowBlur = 0;
		ctx.globalAlpha = 1;

		if (!reduceMotion) {
			rafId = requestAnimationFrame(drawFrame);
		}
	}

	function start() {
		resize();
		makeNodes();
		if (rafId) cancelAnimationFrame(rafId);
		drawFrame();
	}

	var resizeTimer;
	window.addEventListener('resize', function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(start, 150);
	});

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', start);
	} else {
		start();
	}

})();
