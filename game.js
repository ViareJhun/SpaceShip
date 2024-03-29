// Graphics
var surface = document.getElementById('surface');
var context = surface.getContext('2d');

var tex_paths = [];
var tex = [];

// Mouse
var mouse_x = 0;
var mouse_y = 0;

var mouse_check = 0;

// Game
var player_x = 0;
var player_y = 0;

var player_prev_x = 0;
var player_prev_y = 0;

var player_reload = 0;
var player_reload_max = 4;

var player_angle = 0;
var player_dir = 0;

var bullets = [];

var bullet_speed = 8;

var bullet_number = 8;
var bullet_aos = Math.PI * 0.25;

var asp = window.innerHeight / surface.height;
var vw = surface.width * asp;
var vh = surface.height * asp;
var yoffset = 0;

if (vw > window.innerWidth)
{
	asp = window.innerWidth / surface.width;
	vw = surface.width * asp;
	vh = surface.height * asp;
	
	yoffset = (window.innerHeight - vh) / 2;
}

surface.style.width = vw + 'px';
surface.style.height = vh + 'px';

surface.style.top = yoffset;
surface.style.position = 'fixed';

var wd = 0;

document.getElementsByTagName('body')[0].style.margin = '0px';
surface.style.marginLeft = '0px';
surface.style.marginTop = '0px';


// Textures
function textureLoad()
{
	tex_paths['player'] = 'img/test.png';
	tex_paths['bullet'] = 'img/bullet.png';
	
	Object.keys(tex_paths).forEach(
		function(item)
		{
			tex[item] = new Image();
			tex[item].src = tex_paths[item];
		}
	);
}

// Mouse input
addEventListener(
	'mousemove',
	function (e)
	{
		mouse_x = e.pageX / asp - wd;
		mouse_y = e.pageY / asp;
	}
)

addEventListener(
	'mousedown',
	function (e)
	{
		if (e.which == 1)
		{
			mouse_check = 1
		}
	}
)

addEventListener(
	'mouseup',
	function (e)
	{
		if (e.which == 1)
		{
			mouse_check = 0
		}
	}
)

// Touches
addEventListener(
	'touchmove',
	function (e)
	{
		mouse_x = e.changedTouches[0].clientX / asp - wd;
		mouse_y = e.changedTouches[0].clientY / asp;
	}
)

addEventListener(
	'touchstart',
	function (e)
	{
		mouse_check = 1
		
		mouse_x = e.changedTouches[0].clientX / asp - wd;
		mouse_y = e.changedTouches[0].clientY / asp;
	}
)

addEventListener(
	'touchend',
	function (e)
	{
		mouse_check = 0
	}
)


// Game objects
function Bullet(x, y, vecx, vecy, angle)
{
	this.x = x;
	this.y = y;
	this.vec_x = vecx;
	this.vec_y = vecy;
	this.angle = angle;
}

// Update
function update()
{
	// Player
	player_x += (
		mouse_x - player_x
	) * 0.6;
	player_y = surface.height - 64;
	
	player_x = Math.max(
		16,
		Math.min(
			player_x,
			surface.width - 16
		)
	);
	
	if (Math.abs(player_prev_x - player_x) > 2)
	{
		player_dir = -Math.PI * 0.15 * Math.sign(player_prev_x - player_x); 
	}
	else
	{
		player_dir = 0
	}
	player_angle += (
		player_dir - player_angle
	) * 0.1
	
	if (mouse_check)
	{
		if (player_reload == 0)
		{
			player_reload = player_reload_max;
			
			for (var i = 0; i < bullet_number; i ++)
			{
				var _delta = bullet_aos / bullet_number;
				var _angle = (_delta * 0.5 - bullet_aos * 0.5) + i * _delta;
				
				bullets.push(
					new Bullet(
						player_x,
						player_y,
						Math.cos(Math.PI * 0.5 + _angle) * bullet_speed,
						-Math.sin(Math.PI * 0.5 + _angle) * bullet_speed,
						Math.PI * 0.5 - _angle
					)
				);
			}
		}
	}
	
	player_prev_x = player_x
	player_prev_y = player_y
	
	player_reload = Math.max(0, player_reload - 1);
	
	// Bullets
	bullets.forEach(
		function (item)
		{
			item.x += item.vec_x;
			item.y += item.vec_y;
			
			// item.angle += Math.PI * 0.025;
			
			var _x = item.x;
			var _y = item.y;
			
			if (
				(_x < 0) ||
				(_y < 0) ||
				(_x > surface.width) ||
				(_y > surface.height)
			)
			{
				var num = bullets.indexOf(item);
				delete bullets[num];
				bullets.splice(num, 1);
			}
		}
	)
}


// Drawing
function paint()
{
	update();
	
	context.fillStyle = "#000000";
	context.fillRect(0, 0, surface.width, surface.height);
	
	bullets.forEach(
		function (item)
		{
			context.save();
			context.translate(item.x, item.y);
			context.rotate(item.angle);
			context.drawImage(tex['bullet'], -8, -8);
			context.restore();
		}
	)
	
	context.save();
	context.translate(player_x, player_y);
	context.rotate(player_angle);
	context.drawImage(tex['player'], -16, -16);
	context.restore();
	
	context.font = '10px monospace';
	context.fillStyle = '#FFFFFF';
	context.fillText(
		'SW=' + surface.style.width +
		' SH=' + surface.style.height +
		' W=' + surface.width + 
		' H=' + surface.height + 
		' IW=' + window.innerWidth + 
		' IH=' + window.innerHeight, 
		10, 
		20
	);
	context.fillText(
		'wd=' + wd +
		' X=' + mouse_x + 
		' Y=' + mouse_y,
		10, 
		30
	);
	
	requestAnimationFrame(paint);
}


// Start
textureLoad();


requestAnimationFrame(paint);