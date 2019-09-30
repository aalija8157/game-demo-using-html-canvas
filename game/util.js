Context = 
{
	canvas : null,
	context : null,
	create : function(canvas_tag_id)
	{
		this.canvas = document.getElementById(canvas_tag_id);
		this.context = this.canvas.getContext("2d");
		return this.context;
	}
};
Sprite = function(filename)
{
	this.image = null;
	this.pattern = null;
	if (filename != undefined && filename != "" && filename != null)
	{
		this.image = new Image();
		this.image.src = filename;
	}
	else
		console.log("unable to load sprite.");
						
	this.draw = function(x, y, w, h)
	{
		if (w != undefined && h != undefined)
		{
			//image
			Context.context.drawImage(this.image, x, y, w, h);
		}
		else
		{
			//stretched
			Context.context.drawImage(this.image, x, y, this.image.width, this.image.height);
		}
	}
};

function getRandomInteger(lower, upper)
{
	//R = parseInt(rnd * (upper - (lower - 1)) + lower
	multiplier = upper - (lower - 1);
	rnd = parseInt(Math.random() * multiplier) + lower;
	
	return rnd;
}