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

var player_reload = 0;
var player_reload_max = 6;

var bullets = [];

var bullet_speed = 12;


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
		mouse_x = e.clientX;
		mouse_y = e.clientY;
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
		mouse_x = e.changedTouches[0].clientX;
		mouse_y = e.changedTouches[0].clientY;
	}
)

addEventListener(
	'touchdown',
	function (e)
	{
		mouse_check = 1
	}
)

addEventListener(
	'touchup',
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
	player_y = 500;
	
	player_x = Math.max(
		16,
		Math.min(
			player_x,
			surface.width - 16
		)
	);
	
	if (mouse_check)
	{
		if (player_reload == 0)
		{
			player_reload = player_reload_max;
			
			bullets.push(
				new Bullet(
					player_x,
					player_y,
					0,
					-bullet_speed,
					0
				)
			);
			
			bullets.push(
				new Bullet(
					player_x,
					player_y,
					+Math.cos(Math.PI * 0.5 + Math.PI * 0.05) * bullet_speed,
					-Math.sin(Math.PI * 0.5 + Math.PI * 0.05) * bullet_speed,
					0
				)
			);
			
			bullets.push(
				new Bullet(
					player_x,
					player_y,
					+Math.cos(Math.PI * 0.5 - Math.PI * 0.05) * bullet_speed,
					-Math.sin(Math.PI * 0.5 - Math.PI * 0.05) * bullet_speed,
					0
				)
			);
		}
	}
	
	player_reload = Math.max(0, player_reload - 1);
	
	// Bullets
	bullets.forEach(
		function (item)
		{
			item.x += item.vec_x;
			item.y += item.vec_y;
			
			item.angle += Math.PI * 0.025;
			
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
	
	context.fillStyle = "000000";
	context.fillRect(0, 0, 288, 576);
	
	context.save();
	context.translate(player_x, player_y);
	context.drawImage(tex['player'], -16, -16);
	context.restore();
	
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
	
	requestAnimationFrame(paint);
}


// Start
textureLoad();


requestAnimationFrame(paint);