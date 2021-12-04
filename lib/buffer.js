function Array_Buffer(gl, points)
{
	this.stride = 0;
	
	// attribute_offset especifica os offsets de cada atributo, se existir
	this.attribute_qualifier = [ [3, 0] ]; // [n.vertex, offset]
	
	this.vbo = (function() 
	{
		var vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
		return vbo;
	})();
	
	this.bind = function(program)
	{
		if ( !program )
			throw Error("A função bind necessita do argumento programa");
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		
		var i, j = 0;
		for (i in program.attributes)
		{
			if (j >= this.attribute_qualifier.length) break;
			gl.enableVertexAttribArray(program.attributes[i]);
			gl.vertexAttribPointer(program.attributes[i], this.attribute_qualifier[j][0], gl.FLOAT, false, this.stride, this.attribute_qualifier[j][1]);
			j++;
		}
	};
}

function Element_Buffer(gl, points)
{
	this.length = points.length;
	this.ibo = (function()
	{
		var ibo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(points), gl.STATIC_DRAW);
		return ibo;
	})();
	
	this.bind = function()
	{
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
	};
}
