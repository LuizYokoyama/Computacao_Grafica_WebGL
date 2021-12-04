// Precisa da biblioteca glMatrix

function Vertex_VNT(v)
{
	if ( v === undefined ) {
		this.vertice = vec3.create();	// [x, y, z]
		this.normal = vec3.create();	// [nx, ny, nz]
		this.texture = vec2.create();	// [tx, ty]
	} else if ( v instanceof Vertex_VNT ) {
		this.vertice = vec3.clone(v.vertice);
		this.normal = vec3.clone(v.normal);
		this.texture = vec2.clone(v.texture);
	} else {
		this.vertice = vec3.clone(v[0]);
		this.normal = vec3.clone(v[1]);
		this.texture = vec2.clone(v[2]);
	}
};

// Vertex.prototype.add_vertice = function(x, y, z)
// {
// 	if ( x instanceof Array)
// 		this.vertice.push(x);
// 	else
// 		this.vertice.push([x, y, z]);
// }
// 
// Vertex.prototype.add_normal = function(x, y, z)
// {
// 	if ( x instanceof Array)
// 		this.normal.push(x);
// 	else
// 		this.normal.push([x, y, z]);
// }
// 
// Vertex.prototype.add_texture = function(x, y)
// {
// 	if ( x instanceof Array)
// 		this.texture.push(x);
// 	else
// 		this.texture.push([x, y]);
// }

Vertex_VNT.prototype.set = function(v, n, t)
{
	vec3.copy(this.vertice, v);
	vec3.copy(this.normal, n);
	vec2.copy(this.texture, t);
}

Vertex_VNT.prototype.flatten_vertex = function()
{
	let v = [].concat.apply([], this.vertice);
	let n = [].concat.apply([], this.normal);
	let t = [].concat.apply([], this.texture);
	return [].concat.apply([], [v, n, t]);
}

Vertex_VNT.mid_point = function(v0, v1)
{
	let tmp = new Vertex_VNT();
	vec3.add(tmp.vertice, v0.vertice, v1.vertice);
	vec3.scale(tmp.vertice, tmp.vertice, 0.5);
	
	vec3.add(tmp.normal, v0.normal, v1.normal);
	vec3.scale(tmp.normal, tmp.normal, 0.5);
	vec3.normalize(tmp.normal, tmp.normal);
	
	vec2.add(tmp.texture, v0.texture, v1.texture);
	vec2.scale(tmp.texture, tmp.texture, 0.5);
	
	return tmp;
}

Vertex_VNT.transform = function(vertex, matrix)
{
	vec3.transformMat4(vertex.vertice, vertex.vertice, matrix);
	
	let m = mat3.create();
	mat3.fromMat4(m, matrix);
	mat3.transpose(m, mat3.invert(m, m));
	vec3.transformMat3(vertex.normal, vertex.normal, m);
	
	return vertex;
}

Vertex_VNT.prototype.update_radial_displacement = function(minimum_radius, radius)
{
	let distance = vec3.distance(this.vertice, [0, 0, 0]);

	if ( distance < 0.00000001 )
		return;
	
	let steps = Math.round(distance / minimum_radius);
	let k = steps * minimum_radius / distance;
	for (let i = 0; this.vertice.len; i++)
		if ( radius[i] )
			this.vertice[i] = this.vertice[i] * k;
}

// Vertex.prototype.flatten_array = function()
// {
// 	if ( this.normal.length > 0 )
// 		return this.vertice.reduce(function(arr, v, i) {
// 			return arr.concat(v, this.normal[i], this.texture[i]);
// 		}, []);
// 	else
// 		return [].concat.apply([], this.vertice);
// }


// Os objetos Geometry permite a especificação básica de pontos, faces
// e arestas

function Geometry(vertex_layout)
{
	this.layout = vertex_layout;
	this.vertex = [];
	this.faces = [];
	this.edges = [];
};

// Ficou meio tóxico a função, mas basicamente, encaminha qualquer número de
// parâmetros de função para o construtor definido em layout
Geometry.prototype.add_vertex = function()
{
	this.vertex.push(new (
		Function.prototype.bind.apply(this.layout, [].concat( null, [].slice.call(arguments) ))
	));
}
	
Geometry.prototype.add_face = function(v0, v1, v2)
{
	this.faces.push([v0, v1, v2]);
}
	
Geometry.prototype.add_edge = function(v0, v1)
{
	this.edges.push([Math.min(v0, v1), Math.max(v0, v1)]);
}

Geometry.prototype.add_edges_from_face = function(f)
{
	var face = this.faces[f];
	this.add_edge(face[0], face[1]);
	this.add_edge(face[1], face[2]);
	this.add_edge(face[2], face[0]);
}

Geometry.prototype.remove_duplicated_edges = function()
{
	let tmp = this.edges.reduce(function(arr, v) {
		for (let i = 0; i < arr.length; i++)
			if (arr[i][0] === v[0] && arr[i][1] === v[1])
				return arr;
		arr.push(v);
		return arr;
	}, []);
	this.edges = tmp;
}

Geometry.prototype.shift_indices_by = function(amount)
{
	for(var i = 0; i < this.faces.length; i++) {
		var face = this.faces[i];
		for (var j = 0; j < 3; j++)
			face[j] += amount;
	}
	for (var i = 0; i < this.edges.length; i++) {
		this.edges[i][0] += amount;
		this.edges[i][1] += amount;
	}
}

Geometry.prototype.flatten_array = function(type)
{
	if ( type === this.vertex )
		return this.vertex.reduce(function(arr, v, i) {
			return arr.concat(v.flatten_vertex());
		}, []);
	else if ( type === this.faces )
		return [].concat.apply([], this.faces);
	else
		return [].concat.apply([], this.edges);
}

Geometry.prototype.radial_displace = function(minimum_radius, radius)
{
	for (var i = 0; i < this.vertex.length; i++) {
		this.vertex[i].update_radial_displacement(minimum_radius, radius);
	}
}

// Um dos motivos para se usar o gl.UNSIGNED_SHORT é que na variável
// dictionary, a chave é de 32 bits, composta de dois UNSIGNED_SHORT
// para se ter mais índices, é preciso altera a forma de construir
// este dictionary
Geometry.prototype.subdivide = function()
{
	let dic = []; 	// {key:[v_max, v_min], index: value}
	let g = new Geometry(this.layout);
	let count = 0;
	
	let insert_vertex = function(obj, v0, v1)
	{
		let results = [];
		let keys = [ [0, v0], [Math.max(v0,v1), Math.min(v0, v1)], [0, v1] ];
		
		for (let i = 0; i < keys.length; i++) {
			let k = keys[i];
			
			let found = false;
			for (let j = 0; j < dic.length; j++) {
				if (dic[j].key[0] === k[0] && dic[j].key[1] === k[1]) {
					results.push(dic[j].index);
					found = true;
					break;
				}
			}
			
			if ( !found ) {
				dic.push({key: k, index: count});
				results.push(count);
				count++;
				if ( k[0] === 0 )
					g.add_vertex(obj.vertex[k[1]]);
				else
					g.add_vertex(obj.layout.mid_point(obj.vertex[k[0]], obj.vertex[k[1]]));
			}
		}
		return results;
	}
	
	for (let i = 0; i < this.faces.length; i++) {
		let f = this.faces[i];
		
		let i0 = insert_vertex(this, f[0], f[1]);
		let i1 = insert_vertex(this, f[1], f[2]);
		let i2 = insert_vertex(this, f[2], f[0]);
		
		g.add_face(i0[0], i0[1], i2[1]);
		g.add_face(i0[1], i0[2], i1[1]);
		g.add_face(i1[1], i1[2], i2[1]);
		g.add_face(i0[1], i1[1], i2[1]);
		
		let k = i * 4;
		g.add_edges_from_face(k + 0);
		g.add_edges_from_face(k + 1);
		g.add_edges_from_face(k + 2);
		g.add_edges_from_face(k + 3);
	}
	
	this.vertex = g.vertex;
	this.faces = g.faces;
	this.edges = g.edges;
	this.remove_duplicated_edges();
	
// 	var insert_vertex = function(object, v0, v1)
// 	{
// 		var index = 0;
// 		if ( v1 == undefined ) {
// 			index = v0;
// 		} else {
// 			index = Math.max(v0,v1) << 16 | Math.min(v0, v1);
// 		}
// 		for (var i = 0; i < dictionary.length; i++) {
// 			if ( dictionary[i].index == index )
// 				return dictionary[i].value;
// 		}
// 		if ( v1 == undefined ) {
// 			o.add_vertex(object.vertex[v0]);
// 		} else {
// 			o.add_vertex(object.mid_point(v0, v1));
// 		}
// 		dictionary.push({index: index, value: count});
// 		return count++;
// 	}
// 
// 	for(var i = 0; i < this.faces.length; i++) {
// 		var face = this.faces[i];
// 		
// 		node = [];
// 		node[0] = insert_vertex(this, face[0]);
// 		node[1] = insert_vertex(this, face[0], face[1]);
// 		node[2] = insert_vertex(this, face[1]);
// 		node[3] = insert_vertex(this, face[2], face[0]);
// 		node[4] = insert_vertex(this, face[1], face[2]);
// 		node[5] = insert_vertex(this, face[2]);
// 		
// 		o.add_face(node[0], node[1], node[3]);
// 		o.add_face(node[3], node[1], node[4]);
// 		o.add_face(node[1], node[2], node[4]);
// 		o.add_face(node[3], node[4], node[5]);
// 		
// 		k = i * 4;
// 		o.add_face_to_edge(k + 0);
// 		o.add_face_to_edge(k + 1);
// 		o.add_face_to_edge(k + 2);
// 		o.add_face_to_edge(k + 3);
// 	}
// 	this.vertex = o.vertex;
// 	this.faces = o.faces;
// 	this.edges = o.edges
}

////////////////////////////////////////////////////////
// Função auxiliar para adicionar uma geometria à atual
// from: geometry
// to: geometry
// matrix: Mat4
// amount: int para deslocar os índices
Geometry.prototype.add = function(geometry, matrix, amount)
{
	for(var i = 0; i < geometry.vertex.length; i++) {
		geometry.layout.transform(geometry.vertex[i], matrix);
	}
	geometry.shift_indices_by(amount);
	this.vertex = this.vertex.concat(geometry.vertex);
	this.faces = this.faces.concat(geometry.faces);
	this.edges = this.edges.concat(geometry.edges);
}


// Os objetos Shape permite a construção de formas simples, individuais

function Shape()
{
	this.geometry = new Geometry(Vertex_VNT);
}

Shape.prototype.vertex = function()
{
	return this.geometry.flatten_array(this.geometry.vertex);
}

Shape.prototype.triangles = function()
{
	return this.geometry.flatten_array(this.geometry.faces);
}
	
Shape.prototype.lines = function()
{
	return this.geometry.flatten_array(this.geometry.edges);
}

Shape.prototype.divide = function(subdivisions)
{
	if ( subdivisions == undefined )
		subdivisions = 0;
	for (let i = 0; i < subdivisions; i++) {
		this.geometry.subdivide();
	}
}

var inherit = function(child, parent)
{
	child.prototype = Object.create(parent.prototype);
	child.prototype.constructor = child;
}

function Plane(subdivisions, z)
{
	Shape.call(this);
	
	if ( z === undefined )
		z = 0;
	
	let step = 2/(subdivisions + 1);
	for (let j = 0; j < subdivisions + 2 ; j++) {
		for (let i = 0; i < subdivisions + 2; i++) {
			this.geometry.add_vertex([ [-1 + i*step, -1 + j*step, z], [0, 0, 1], [i*step/2, j*step/2] ]);
		}
	}
	
	for (let j = 0; j < subdivisions + 1; j++) {
		for (let i = 0; i < subdivisions + 1; i++) {
			let x = (subdivisions + 2);
			this.geometry.add_face(j*x+i, j*x+i+1, (j+1)*x+i+1);
			this.geometry.add_face((j+1)*x+i+1, (j+1)*x+i, j*x+i);
			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 0);
			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 1);
		}
	}
	
	
// 	this.geometry.add_vertex([ [0, 0, z], [0, 0, 1], [0.5, 0.5] ]);
// 	this.geometry.add_vertex([ [-1, -1, z], [0, 0, 1], [0, 0] ]);
// 	this.geometry.add_vertex([ [1, -1, z], [0, 0, 1], [1, 0] ]);
// 	this.geometry.add_vertex([ [-1, 1, z], [0, 0, 1], [0, 1] ]);
// 	this.geometry.add_vertex([ [1, 1, z], [0, 0, 1], [1, 1] ]);
// 
// 	this.geometry.add_face(0, 1, 2);
// 	this.geometry.add_face(0, 2, 4);
// 	this.geometry.add_face(0, 4, 3);
// 	this.geometry.add_face(0, 3, 1);
// 	
// 	this.geometry.add_edges_from_face(0);
// 	this.geometry.add_edges_from_face(1);
// 	this.geometry.add_edges_from_face(2);
// 	this.geometry.add_edges_from_face(3);

	this.geometry.remove_duplicated_edges();
// 	this.divide(subdivisions);
}
inherit(Plane, Shape);

function Triangle(subdivisions, texture_face)
{
	Shape.call(this);
	
	let aux = 1/Math.sqrt(5);
	let step = 2/(subdivisions + 1);

	// face south
	let inner = subdivisions + 2;
	for (let j = 0; j < subdivisions + 2; j++) {
		for (let i = 0; i < inner; i++) {
			let face = [];
			switch (texture_face) {
				case 0: //south
					face = [i*step/2 + j*step/4, j*step/4];
					break;
				case 1: // east
					face = [1 - j*step/4, i*step/2 + j*step/4];
					break;
				case 2:
					face = [1 - (i*step/2 + j*step/4), 1-j*step/4];
					break;
				case 3:
					face = [j*step/4, 1-(i*step/2 +  j*step/4)];
					break;
				default:
					break;
			}
			this.geometry.add_vertex([ 
				[-1 + i*step + j*step/2, -1 + j*step/2, -1 + j*step], 
				[0, aux, 2*aux], 
				face
//				[i*step/2 + j*step/4, j*step/4] 
// 				[j*step/4, 1 - (i*step/2 + j*step/4)] 
// 				[1 - (i*step/2 + j*step/4), j*step/4] 
// 				[j*step/4, i*step/2 +  j*step/4] 
			]);
		}
		inner--;
	}
	
	let x = subdivisions + 2;
 	aux = 0;
	for (let j = 0; j < subdivisions + 1; j++) {
		let max = aux + subdivisions - j
		for (let i = aux; i < max; i++) {
			this.geometry.add_face(i, i+1, x+i);
			this.geometry.add_face(x+i, i+1, x+i+1);
		}
		this.geometry.add_face(max, max + 1, max + x);
 		aux += x;
 		x--;
	}
	
	for (let i = 0; i < this.geometry.faces.length; i++)
		this.geometry.add_edges_from_face(i);


	this.geometry.remove_duplicated_edges();
}
inherit(Triangle, Shape);

function Hollow_Pyramid(subdivisions)
{
	Shape.call(this);
	
	let rot = mat4.create();
	
	this.geometry.add((new Triangle(subdivisions, 0)).geometry, rot, 0);
	let amount = this.geometry.vertex.length;

	// east
	mat4.rotateZ(rot, rot, glMatrix.toRadian(90));
	this.geometry.add((new Triangle(subdivisions, 1)).geometry, rot, amount);

	// north
	mat4.rotateZ(rot, rot, glMatrix.toRadian(90));
	this.geometry.add((new Triangle(subdivisions, 2)).geometry, rot, 2 * amount);

	// west
	mat4.rotateZ(rot, rot, glMatrix.toRadian(90));
	this.geometry.add((new Triangle(subdivisions, 3)).geometry, rot, 3 * amount);

	this.geometry.remove_duplicated_edges();
	
// 	// face west
// 	this.geometry.add_vertex([ [-1, -1, 1], [0, aux, 2*aux], [0, 1] ]);
// 	this.geometry.add_vertex([ [1, -1, 1], [0, aux, 2*aux], [0, 0] ]);
// 	this.geometry.add_vertex([ [0, 1, 0], [0, aux, 2*aux], [0.5, 0.5] ]);
// 	this.geometry.add_face(0, 1, 2);
// 	this.geometry.add_edges_from_face(0);
// 
// 	// face south
// 	this.geometry.add_vertex([ [1, -1, 1], [2*aux, aux, 0], [0, 0] ]);
// 	this.geometry.add_vertex([ [1, -1, -1], [2*aux, aux, 0], [1, 0] ]);
// 	this.geometry.add_vertex([ [0, 1, 0], [2*aux, aux, 0], [0.5, 0.5] ]);
// 	this.geometry.add_face(3, 4, 5);
// 	this.geometry.add_edges_from_face(1);
// 	
// 	// face east
// 	this.geometry.add_vertex([ [1, -1, -1], [0, aux, -2*aux], [1, 0] ]);
// 	this.geometry.add_vertex([ [-1, -1, -1], [0, aux, -2*aux], [1, 1] ]);
// 	this.geometry.add_vertex([ [0, 1, 0], [0, aux, -2*aux], [0.5, 0.5] ]);
// 	this.geometry.add_face(6, 7, 8);
// 	this.geometry.add_edges_from_face(2);
// 
// 	// face north
// 	this.geometry.add_vertex([ [-1, -1, -1], [-2*aux, aux, 0], [1, 1] ]);
// 	this.geometry.add_vertex([ [-1, -1, 1], [-2*aux, aux, 0], [0, 1] ]);
// 	this.geometry.add_vertex([ [0, 1, 0], [-2*aux, aux, 0], [0.5, 0.5] ]);
// 	this.geometry.add_face(9, 10, 11);
// 	this.geometry.add_edges_from_face(3);


	
// 	let trans = mat4.create();
// 	mat4.translate(trans, trans, [0, 0, 0.5]);
// 	mat4.rotateX(trans, trans, -Math.atan2(1, 2));
// 	mat4.scale(trans, trans, [1, Math.sqrt(5)/2, 1]);
// 
// 	for (let i = 0; i < this.geometry.vertex.length; i++) {
// 		this.geometry.layout.transform(this.geometry.vertex[i], trans);
// 	}
	
// 	this.divide(subdivisions)
}
inherit(Hollow_Pyramid, Shape);

function Cube(subdivisions)
{
// 	var add = function(from, to, matrix, amount)
// 	{
// 		for(var i = 0; i < from.geometry.vertex.length; i++) {
// 			from.geometry.layout.transform(from.geometry.vertex[i], matrix);
// 		}
// 		from.geometry.shift_indices_by(amount);
// 		to.geometry.vertex = to.geometry.vertex.concat(from.geometry.vertex);
// 		to.geometry.faces = to.geometry.faces.concat(from.geometry.faces);
// 		to.geometry.edges = to.geometry.edges.concat(from.geometry.edges);
// 	}
	
	
	Plane.call(this, subdivisions, 1);

	var amount = this.geometry.vertex.length;
	
	var rot = mat4.create();

	// right
	mat4.rotateY(rot, rot, glMatrix.toRadian(90));
	this.geometry.add(new Plane(subdivisions, 1).geometry, rot, amount);
// 	add(new Plane(subdivisions, 1), this, rot, amount);

 	// back
	mat4.rotateY(rot, rot, glMatrix.toRadian(90));
	this.geometry.add(new Plane(subdivisions, 1).geometry, rot, 2 * amount);

	// left
	mat4.rotateY(rot, rot, glMatrix.toRadian(90));
	this.geometry.add(new Plane(subdivisions, 1).geometry, rot, 3 * amount);
	
	// botton
	mat4.identity(rot);
	mat4.rotateX(rot, rot, glMatrix.toRadian(90));
	this.geometry.add(new Plane(subdivisions, 1).geometry, rot, 4 * amount);

	// top
	mat4.rotateX(rot, rot, glMatrix.toRadian(180));
	this.geometry.add(new Plane(subdivisions, 1).geometry, rot, 5 * amount);
}
inherit(Cube, Plane);

function Disk(subdivisions, z)
{
	Shape.call(this, 0);
		
	if ( z === undefined )
		z = 0;

	// Provem do código que gera um cone
	let step = 2/(subdivisions + 1);
	let k = 2*Math.PI/(subdivisions + 1);
	for (let j = 0; j < subdivisions + 2 ; j++) {
		for (let i = 0; i < subdivisions + 2; i++) {
// 			let r = Math.sin(-(j*step - 2)*Math.PI/4);
			let zx = -1 + j*step;
			let factor = (1 - zx)/2;
			let x = Math.cos(i*k + Math.PI);
			let y = Math.sin(i*k + Math.PI);
			this.geometry.add_vertex([ 
					[x*factor, y*factor, z], 
					[0, 0, 1], 
					[i*step/2, j*step/2] 
			]);
		}
	}
	
	for (let j = 0; j < subdivisions + 1; j++) {
		for (let i = 0; i < subdivisions + 1; i++) {
			let x = (subdivisions + 2);
			this.geometry.add_face(j*x+i, j*x+i+1, (j+1)*x+i+1);
			this.geometry.add_face((j+1)*x+i+1, (j+1)*x+i, j*x+i);
			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 0);
			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 1);
		}
	}
	
	this.geometry.remove_duplicated_edges();




// Código antigo, mas funcional
//	
// 	let step = 2/(subdivisions + 1);
// 	for (let j = 0; j < subdivisions + 2 ; j++) {
// 		let angle = Math.asin(-1 + j*step);
// 		for (let i = 0; i < subdivisions + 2; i++) {
// 			this.geometry.add_vertex([ [Math.cos(angle)*(-1 + i*step), -1 + j*step, z], [0, 0, 1], [i*step/2, j*step/2] ]);
// 		}
// 	}
// 	
// 	for (let j = 0; j < subdivisions + 1; j++) {
// 		for (let i = 0; i < subdivisions + 1; i++) {
// 			let x = (subdivisions + 2);
// 			this.geometry.add_face(j*x+i, j*x+i+1, (j+1)*x+i+1);
// 			this.geometry.add_face((j+1)*x+i+1, (j+1)*x+i, j*x+i);
// 			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 0);
// 			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 1);
// 		}
// 	}
// 	
// 	this.geometry.remove_duplicated_edges();
	
}
inherit(Disk, Shape);

// Disk.prototype.divide = function(subdivisions)
// {
// 	this.geometry.radial_displace(1, [1, 1, 0]);
// 	if ( subdivisions == undefined )
// 		subdivisions = 0;
// 	for (var i = 0; i < subdivisions; i++) {
// 		this.geometry.subdivide();
// 		this.geometry.radial_displace(1/Math.pow(2, i + 1), [1, 1, 0]);
// 	}
// }

function Hollow_Cylinder(subdivisions)
{
	Shape.call(this);
	
	let step = 2/(subdivisions + 1);
	let k = 2*Math.PI/(subdivisions + 1);
	for (let j = 0; j < subdivisions + 2 ; j++) {
		for (let i = 0; i < subdivisions + 2; i++) {
			let x = Math.cos(i*k + Math.PI);
			let y = Math.sin(i*k + Math.PI);
			this.geometry.add_vertex([ 
					[x, y, -1 + j*step], 
					[x, y, 0], 
					[i*step/2, j*step/2] 
			]);
		}
	}
	
	for (let j = 0; j < subdivisions + 1; j++) {
		for (let i = 0; i < subdivisions + 1; i++) {
			let x = (subdivisions + 2);
			this.geometry.add_face(j*x+i, j*x+i+1, (j+1)*x+i+1);
			this.geometry.add_face((j+1)*x+i+1, (j+1)*x+i, j*x+i);
			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 0);
			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 1);
		}
	}
	
	this.geometry.remove_duplicated_edges();
}
inherit(Hollow_Cylinder, Shape);

function Hollow_Cone(subdivisions)
{
	Shape.call(this);
	
	let step = 2/(subdivisions + 1);
	let k = 2*Math.PI/(subdivisions + 1);
	for (let j = 0; j < subdivisions + 2 ; j++) {
		for (let i = 0; i < subdivisions + 2; i++) {
// 			let r = Math.sin(-(j*step - 2)*Math.PI/4);
			let z = -1 + j*step;
			let factor = (1 - z)/2;
			let x = Math.cos(i*k + Math.PI);
			let y = Math.sin(i*k + Math.PI);
			this.geometry.add_vertex([ 
					[x*factor, y*factor, z], 
					vec3.normalize([0, 0, 0], [x, y, 0.5]), 
					[i*step/2, j*step/2] 
			]);
		}
	}
	
	for (let j = 0; j < subdivisions + 1; j++) {
		for (let i = 0; i < subdivisions + 1; i++) {
			let x = (subdivisions + 2);
			this.geometry.add_face(j*x+i, j*x+i+1, (j+1)*x+i+1);
			this.geometry.add_face((j+1)*x+i+1, (j+1)*x+i, j*x+i);
			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 0);
			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 1);
		}
	}
	
	this.geometry.remove_duplicated_edges();


// 	let l = 1/Math.sqrt(6);
// 	let k = 1/Math.sqrt(5);
// 	this.geometry.add_vertex([ [ 0, 0, 1], [-l, -l, 2*l], [0.5, 0.5] ]);
// 	this.geometry.add_vertex([ [ 0, 0, 1], [l, -l, 2*l], [0.5, 0.5] ]);
// 	this.geometry.add_vertex([ [ 0, 0, 1], [l, l, 2*l], [0.5, 0.5] ]);
// 	this.geometry.add_vertex([ [ 0, 0, 1], [-l, l, 2*l], [0.5, 0.5] ]);
// 	this.geometry.add_vertex([ [-1, 0,-1], [-2*k, 0, k], [0, 0] ]);
// 	this.geometry.add_vertex([ [ 0,-1,-1], [0, -2*k, k], [1, 0] ]);
// 	this.geometry.add_vertex([ [ 1, 0,-1], [2*k, 0, k], [1, 1] ]);
// 	this.geometry.add_vertex([ [ 0, 1,-1], [0, 2*k, k], [1, 0] ]);
// 	
// // 	this.geometry.add_vertex([ [ 0, 0, 1], [-2*k, 0, k], [0, 1] ]);
// // 	this.geometry.add_vertex([ [ 0, 0, 1], [0, -2*k, k], [0.25, 1] ]);
// // 	this.geometry.add_vertex([ [ 0, 0, 1], [2*k, 0, k], [0.5, 1] ]);
// // 	this.geometry.add_vertex([ [ 0, 0, 1], [0, 2*k, k], [0.75, 1] ]);
// // 	this.geometry.add_vertex([ [-1, 0,-1], [-2*k, 0, k], [0, 0] ]);
// // 	this.geometry.add_vertex([ [ 0,-1,-1], [0, -2*k, k], [0.25, 0] ]);
// // 	this.geometry.add_vertex([ [ 1, 0,-1], [2*k, 0, k], [0.5, 0] ]);
// // 	this.geometry.add_vertex([ [ 0, 1,-1], [0, 2*k, k], [0.75, 0] ]);
// // 	
// 	this.geometry.add_face(0, 4, 5);
// 	this.geometry.add_face(1, 5, 6);
// 	this.geometry.add_face(2, 6, 7);
// 	this.geometry.add_face(3, 7, 0);
// 
// 	this.geometry.add_edges_from_face(0);
// 	this.geometry.add_edges_from_face(1);
// 	this.geometry.add_edges_from_face(2);
// 	this.geometry.add_edges_from_face(3);
// 	
// 	this.geometry.remove_duplicated_edges();
// 	if ( subdivisions == undefined )
// 		subdivisions = 0;
// 	for (let i = 0; i < subdivisions; i++) {
// 		this.geometry.subdivide();
// 		this.geometry.radial_displace(1, [1, 1, 0]);
// 	}
// 	
// /*	
// 	Disk.call(this, 0, -1);
// 	this.geometry.vertex[0] = [0, 0, 1];
// 	
// 	this.divide(subdivisions)*/
}
inherit(Hollow_Cone, Shape);

function Sphere(subdivisions)
{
	Shape.call(this);
	
	let step = 2/(subdivisions + 1);
	let k = 2*Math.PI/(subdivisions + 1);
	for (let j = 0; j < subdivisions + 2 ; j++) {
		for (let i = 0; i < subdivisions + 2; i++) {
 			let z = Math.sin((j*step - 1)*Math.PI/2);
			let r = Math.cos((j*step - 1)*Math.PI/2);
			let x = Math.cos(i*k + Math.PI) * r;
			let y = Math.sin(i*k + Math.PI) * r;
			this.geometry.add_vertex([ 
					[x, y, z], 
					[x, y, z], 
					[i*step/2, j*step/2] 
			]);
		}
	}
	
	for (let j = 0; j < subdivisions + 1; j++) {
		for (let i = 0; i < subdivisions + 1; i++) {
			let x = (subdivisions + 2);
			this.geometry.add_face(j*x+i, j*x+i+1, (j+1)*x+i+1);
			this.geometry.add_face((j+1)*x+i+1, (j+1)*x+i, j*x+i);
			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 0);
			this.geometry.add_edges_from_face(2*(j * (subdivisions + 1) + i) + 1);
		}
	}
	
	this.geometry.remove_duplicated_edges();
	
// 	this.geometry.add_vertex([ [ 0, 0, 1], [0, 0, 1], [, ] ]);
// 	this.geometry.add_vertex([ [-1, 0, 0], [-1, 0, 0], [, ] ]);
// 	this.geometry.add_vertex([ [ 0,-1, 0], [0, -1, 0], [, ] ]);
// 	this.geometry.add_vertex([ [ 1, 0, 0], [1, 0, 0], [, ] ]);
// 	this.geometry.add_vertex([ [ 0, 1, 0], [0, 1, 0], [, ] ]);
// 	this.geometry.add_vertex([ [ 0, 0,-1], [0, 0, -1], [, ] ]);
// 	
// 	this.geometry.add_face(0, 1, 2);
// 	this.geometry.add_face(0, 2, 3);
// 	this.geometry.add_face(0, 3, 4);
// 	this.geometry.add_face(0, 4, 1);
// 	this.geometry.add_face(5, 1, 4);
// 	this.geometry.add_face(5, 4, 3);
// 	this.geometry.add_face(5, 3, 2);
// 	this.geometry.add_face(5, 2, 1);
// 
// 	this.geometry.add_edges_from_face(0);
// 	this.geometry.add_edges_from_face(1);
// 	this.geometry.add_edges_from_face(2);
// 	this.geometry.add_edges_from_face(3);
// 	this.geometry.add_edges_from_face(4);
// 	this.geometry.add_edges_from_face(5);
// 	this.geometry.add_edges_from_face(6);
// 	this.geometry.add_edges_from_face(7);
// 
// 	this.geometry.remove_duplicated_edges();
// 	for (var i = 0; i < subdivisions; i++) {
// 		this.geometry.subdivide();
// 		for (var j = 0; j < this.geometry.vertex.length; j++) {
// 			var v = this.geometry.vertex[j];
// 			var modulus = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
// 			v[0] /= modulus;
// 			v[1] /= modulus;
// 			v[2] /= modulus;
// 		}
// 	}
}
inherit(Sphere, Shape);

function Draw_Properties()
{
	return {
		triangles: {
			offset: 0,
			length: 0
		},
		lines: {
			offset: 0,
			length: 0
		}
	};
}


// O objeto primitive permite a agregação da formas anteriores em um único buffer
// Lida diretamente com a capacidade de desenhar formas sólidas ou em wireframe

var primitive = {
	gl: null,
	vbo : null,
	triangles: null,
	lines: null,
	
	plane: null,
	hollow_pyramid: null,
	cube: null,
	disk: null,
	hollow_cone: null,
	hollow_cylinder: null,
	sphere: null
};

primitive.init = function(gl, subdivisions)
{
	this.gl = gl;
	var geometry = {
		vertex: [],
		triangles: [],
		lines: []
	};
	var v = [], t = [], l = [];
	var objects = {
		plane : [Plane, "plane"], 
		hollow_pyramid: [Hollow_Pyramid, "hollow_pyramid"],
		cube: [Cube, "cube"],
 		disk: [Disk, "disk"],
		hollow_cone: [Hollow_Cone, "hollow_cone"],
		hollow_cylinder: [Hollow_Cylinder, "hollow_cylinder"],
 		sphere: [Sphere, "sphere"]
	}; 
	
	var ver_offset = 0, tri_offset = 0, len_offset = 0;
	for (var i in objects) {
		var shape = new objects[i][0](subdivisions);
		shape.geometry.shift_indices_by(ver_offset)
		v = shape.vertex();
		t = shape.triangles();
		l = shape.lines();
	
		this[objects[i][1]] = new Draw_Properties();
		this[objects[i][1]].triangles.offset = tri_offset;
		this[objects[i][1]].triangles.length = t.length;
		this[objects[i][1]].lines.offset = len_offset;
		this[objects[i][1]].lines.length = l.length;
	
		geometry.vertex = geometry.vertex.concat(v);
		geometry.triangles = geometry.triangles.concat(t);
		geometry.lines = geometry.lines.concat(l);
		
 		ver_offset += shape.geometry.vertex.length;
//		ver_offset += v.length;
		tri_offset += t.length;
		len_offset += l.length;
	}

	this.vbo = new Array_Buffer(gl, geometry.vertex);
	this.vbo.stride = 8*4;
 	this.vbo.attribute_qualifier = [ [3, 0], [3, 3*4], [2, 6*4] ]; // 0 vertice, 12 normal, 24 tex
	
	this.triangles = new Element_Buffer(gl, geometry.triangles);
	this.lines = new Element_Buffer(gl, geometry.lines);
}

primitive.bind = function(program)
{
	this.vbo.bind(program);
}

primitive.solid = function(draw_properties)
{
	this.triangles.bind();
	this.gl.drawElements(gl.TRIANGLES, draw_properties.triangles.length, gl.UNSIGNED_SHORT, draw_properties.triangles.offset * 2);
}

primitive.wireframe = function(draw_properties)
{
	this.lines.bind();
	this.gl.drawElements(gl.LINES, draw_properties.lines.length, gl.UNSIGNED_SHORT, draw_properties.lines.offset * 2);
}
