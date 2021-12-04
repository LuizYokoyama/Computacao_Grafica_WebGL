var colors = {
	white: [1., 1., 1],
	black: [0., 0., 0.],
	red: [1., 0., 0.],
	blue: [0., 0., 1.],
	green: [0., 1., 0.],
	yellow: [1., 1., 0.],
	cyan: [0., 1., 1.],
	grey: [.3, .3, .2]
};

let material = function(kad, ks, shineness, emission)
{
	gl.uniform3fv(prog["mat.kad"], kad);
	gl.uniform3fv(prog["mat.ks"], ks);
	gl.uniform1f(prog["mat.shineness"], shineness);
	gl.uniform3fv(prog["mat.emission"], emission);
}

function cena(prog, stack, state, primitive, esc)
{
	
	// LUZ 1
	gl.uniform3fv(prog["luz1.ia"], [0.15, 0.15, 0.15]);
	gl.uniform3fv(prog["luz1.id"], [0.7, 0.7, 0.7]);
	gl.uniform3fv(prog["luz1.is"], [1, 1, 1]);	
	gl.uniform3fv(prog["luz1.pos"], [4., 1.11, 9]);

	// LUZ 2
	gl.uniform3fv(prog["luz2.ia"], [0.0, 0., 1]);//ia= vetor direção do spot light
	gl.uniform3fv(prog["luz2.id"], [0.6, 0.6, 0.6]);
	gl.uniform3fv(prog["luz2.is"], [1, 1, 1]);	
	gl.uniform3fv(prog["luz2.pos"], [0, 1.11, 0]);


	
	let top = [];


	
		// chegada
	top = stack.push();
	mat4.translate(top, top, [0* esc, 1.8* esc, 5* esc]);
	mat4.scale(top, top, [.6* esc, .3* esc, 2.3* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.green, colors.white, 70, [0., 0., 0.]);	
	primitive.solid(primitive.cube);
	stack.pop(); // chegada
	
	
	// coluna 2
	top = stack.push();
	mat4.translate(top, top, [0* esc, 0.3* esc, 3* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.6* esc, .3* esc, 1.2* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.cyan, colors.white, 70, [0., 0., 0.]);
	primitive.solid(primitive.hollow_cylinder);
	stack.pop(); // coluna 2
	
	// coluna 1
	top = stack.push();
	mat4.translate(top, top, [0* esc, 0.3* esc, 7* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.6* esc, .3* esc, 1.2* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.cyan, colors.white, 70, [0., 0., 0.]);
	primitive.solid(primitive.hollow_cylinder);
	stack.pop(); // coluna 1
	
	// cone 6
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(-140));
	mat4.translate(top, top, [7* esc, 0* esc, 0* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.3* esc, .3* esc, .9* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.red, colors.white, 80, [0., 0., 0.]);
	primitive.solid(primitive.hollow_cone);
	stack.pop(); // cone 6
	
	
	// cone 5(topo coluninha)
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(120));
	mat4.translate(top, top, [7* esc, .9* esc, 0* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.3* esc, .3* esc, .3* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.green, colors.white, 80, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	stack.pop(); // cone 5	(topo coluninha)
			// cone 5 (coluninha)
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(120));
	mat4.translate(top, top, [7* esc, 0* esc, 0* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.3* esc, .3* esc, .9* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.green, colors.white, 80, [0., 0., 0.]);
	primitive.solid(primitive.hollow_cylinder);
	stack.pop(); // cone 5 (coluninha)
	
	// cone 4(topo coluninha)
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(60));
	mat4.translate(top, top, [7* esc, .9* esc, 0* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.3* esc, .3* esc, .3* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.yellow, colors.white, 80, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	stack.pop(); // cone 4	(topo coluninha)
			// cone 4 (coluninha)
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(60));
	mat4.translate(top, top, [7* esc, 0* esc, 0* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.3* esc, .3* esc, .9* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.yellow, colors.white, 80, [0., 0., 0.]);
	primitive.solid(primitive.hollow_cylinder);
	stack.pop(); // cone 4 (coluninha)

	
	// cone 3
	top = stack.push();
	mat4.translate(top, top, [-7* esc, 0* esc, 0* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.3* esc, .3* esc, .9* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.green, colors.white, 80, [0., 0., 0.]);
	primitive.solid(primitive.hollow_cone);
	stack.pop(); // cone 3

	// cone 2
	top = stack.push();
	mat4.translate(top, top, [7* esc, 0* esc, 0* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.3* esc, .3* esc, .9* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.red, colors.white, 80, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	stack.pop(); // cone 2
	
	// cone 1(topo coluninha)
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(-40));
	mat4.translate(top, top, [7* esc, .9* esc, 0* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.3* esc, .3* esc, .3* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.red, colors.white, 80, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	stack.pop(); // cone 1	(topo coluninha)
			// cone 1 (coluninha)
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(-40));
	mat4.translate(top, top, [7* esc, 0* esc, 0* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.3* esc, .3* esc, .9* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.red, colors.white, 80, [0., 0., 0.]);
	primitive.solid(primitive.hollow_cylinder);
	stack.pop(); // cone 1 (coluninha)
	
	// coluna LATERAL / luz omnidirecional
	top = stack.push();
	mat4.translate(top, top, [4.* esc, 1.1* esc, 9* esc]);
	mat4.scale(top, top, [.3* esc, .3* esc, .3* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.yellow, colors.white, 50, [1., 1., 1.]);
	primitive.solid(primitive.sphere);
	stack.pop(); 
	top = stack.push();
	mat4.translate(top, top, [4.* esc, 0.2* esc, 9* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.2* esc, .2* esc, 1.* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.red, colors.white, 50, [0., 0., 0.]);
	primitive.solid(primitive.hollow_cylinder);
	stack.pop(); // coluna lateral
	
	
	// coluna centro / LUZ SPOT LIGHT
	top = stack.push();
	mat4.translate(top, top, [0* esc, 0.5* esc, 0.3* esc]);
	mat4.scale(top, top, [.2* esc, .2* esc, .1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.yellow, colors.white, 50, [1., 1., 1.]);
	primitive.solid(primitive.sphere);
	stack.pop(); 
	top = stack.push();
	mat4.translate(top, top, [0* esc, 0.5* esc, 0.6* esc]);
	mat4.scale(top, top, [.3* esc, .3* esc, .3* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.red, colors.white, 50, [0., 0., 0.]);
	primitive.solid(primitive.cube);
	stack.pop(); 
	top = stack.push();
	mat4.translate(top, top, [0.* esc, 0.* esc, 0.6* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [.3* esc, .3* esc, .7* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.red, colors.white, 50, [0., 0., 0.]);
	primitive.solid(primitive.hollow_cylinder);
	stack.pop(); // coluna centro / LUZ SPOT LIGHT

	// chão
	top = stack.push();
	mat4.translate(top, top, [0* esc, -.85* esc, 0* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-90));
	mat4.scale(top, top, [10* esc, 10* esc, 1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material([.1, .2, .3], colors.white, 40, [0., 0., 0.]);
	primitive.solid(primitive.plane);
	stack.pop(); // chão
	
	
//>>>>>RODAS INICIO<<<<<

	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		//ROTAÇÃO DA RODA		
	top = stack.push();
			// rodas-4 calota
	mat4.translate(top, top, [-1.11* esc, -0.5* esc, 1.4* esc]);
	mat4.rotateY(top, top, glMatrix.toRadian(-10)); //esterça a direção
	mat4.rotateX(top, top, glMatrix.toRadian(state.rot_roda));
	mat4.scale(top, top, [.03* esc, 0.25* esc, .25* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material([.6, .7, .7], colors.white, 30, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	material([.2, .2, .3], colors.white, 30, [0., 0., 0.]);
	primitive.wireframe(primitive.sphere);
	stack.pop(); // rodas-4 calota
	// rodas-4
	top = stack.top();
	mat4.translate(top, top, [-1* esc, -0.5* esc, 1.4* esc]);
	mat4.rotateY(top, top, glMatrix.toRadian(-10)); //esterça a direção
	mat4.rotateX(top, top, glMatrix.toRadian(state.rot_roda));
	mat4.scale(top, top, [.13* esc, 0.35* esc, .35* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.black, colors.white, 30, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	material(colors.grey, colors.white, 110, [0., 0., 0.]);
	primitive.wireframe(primitive.sphere);
	stack.pop(); // rodas-4
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		//ROTAÇÃO DA RODA		
	top = stack.push();
			// rodas-3 calota
	mat4.translate(top, top, [1.11* esc, -0.5* esc, 1.4* esc]);
	mat4.rotateY(top, top, glMatrix.toRadian(-10)); //esterça a direção
	mat4.rotateX(top, top, glMatrix.toRadian(state.rot_roda));
	mat4.scale(top, top, [.03* esc, 0.25* esc, .25* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material([.6, .7, .7], colors.white, 30, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	material([.2, .2, .3], colors.white, 30, [0., 0., 0.]);
	primitive.wireframe(primitive.sphere);
	stack.pop(); // rodas-3 calota
	// rodas-3
	top = stack.top();
	mat4.translate(top, top, [1* esc, -0.5* esc, 1.4* esc]);
	mat4.rotateY(top, top, glMatrix.toRadian(-10)); //esterça a direção
	mat4.rotateX(top, top, glMatrix.toRadian(state.rot_roda));
	mat4.scale(top, top, [.13* esc, 0.35* esc, .35* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.black, colors.white, 30, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	material(colors.grey, colors.white, 110, [0., 0., 0.]);
	primitive.wireframe(primitive.sphere);
	stack.pop(); // rodas-3
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);	
		//ROTAÇÃO DA RODA		
	top = stack.push();
		// rodas-2 calota
	mat4.translate(top, top, [1.11* esc, -0.5* esc, -1.3* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(state.rot_roda))
	mat4.scale(top, top, [.03* esc, 0.25* esc, .25* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material([.6, .7, .7], colors.white, 30, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	material([.2, .2, .3], colors.white, 30, [0., 0., 0.]);
	primitive.wireframe(primitive.sphere);
	stack.pop(); // rodas-2 calota
	// rodas-2
	top = stack.top();
	mat4.translate(top, top, [1* esc, -0.5* esc, -1.3* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(state.rot_roda))
	mat4.scale(top, top, [.13* esc, 0.35* esc, .35* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.black, colors.white, 30, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	material(colors.grey, colors.white, 110, [0., 0., 0.]);
	primitive.wireframe(primitive.sphere);
	stack.pop(); // rodas-2
		
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		//ROTAÇÃO DA RODA		
	top = stack.push();
	// rodas-1 calota
	mat4.translate(top, top, [-1.11* esc, -0.5* esc, -1.3* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(state.rot_roda))
	mat4.scale(top, top, [.03* esc, 0.25* esc, .25* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material([.6, .7, .7], colors.white, 30, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	material([.2, .2, .3], colors.white, 30, [0., 0., 0.]);
	primitive.wireframe(primitive.sphere);
	stack.pop(); // rodas-1 calota
	// rodas-1
	top = stack.top();
	mat4.translate(top, top, [-1* esc, -0.5* esc, -1.3* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(state.rot_roda))
	mat4.scale(top, top, [.13* esc, 0.35* esc, .35* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.black, colors.white, 30, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	material(colors.grey, colors.white, 110, [0., 0., 0.]);
	primitive.wireframe(primitive.sphere);
	stack.pop(); // rodas-1
	
// RODAS FIM <<<<<<<	
	
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
	// lanternas-2
	mat4.translate(top, top, [-.85* esc, 0.2* esc, -1.98* esc]);
	mat4.scale(top, top, [.1* esc, 0.3* esc, .1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.red, colors.white, 80, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	stack.pop(); // lanternas-2
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		// lanternas-1
	mat4.translate(top, top, [.85* esc, 0.2* esc, -1.98* esc]);
	mat4.scale(top, top, [.1* esc, 0.3* esc, .1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.red, colors.white, 80, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	stack.pop(); // lanternas-1
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
	// faróis-2
	mat4.translate(top, top, [-.7* esc, 0.2* esc, 1.98* esc]);
	mat4.scale(top, top, [.2* esc, 0.2* esc, .1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.yellow, colors.white, 70, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	stack.pop(); // faróis-2
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
	// faróis-1
	mat4.translate(top, top, [.7* esc, 0.2* esc, 1.98* esc]);
	mat4.scale(top, top, [.2* esc, 0.2* esc, .1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.yellow, colors.white, 70, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	stack.pop(); // faróis-1
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		// parachoque - traseiro
	mat4.translate(top, top, [0* esc, -.36* esc, -2.13* esc]);
	mat4.scale(top, top, [1.17* esc, 0.2* esc, 0.15* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.blue, colors.white, 20, [0., 0., 0.]);
	primitive.solid(primitive.cube);
	stack.pop(); // parachoque - traseiro
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		// parachoque - frente
	mat4.translate(top, top, [0* esc, -.36* esc, 2.13* esc]);
	mat4.scale(top, top, [1.17* esc, 0.2* esc, 0.15* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.blue, colors.white, 20, [0., 0., 0.]);
	primitive.solid(primitive.cube);
	stack.pop(); // parachoque - frente

	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		// vidro 5
	mat4.translate(top, top, [0* esc, .75* esc, -1.304* esc]);
	mat4.rotateY(top, top, glMatrix.toRadian(180));
	mat4.scale(top, top, [0.9* esc, 0.25* esc, 1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.grey, colors.white, 100, [0., 0., 0.]);
	primitive.solid(primitive.plane);
	stack.pop(); // vidro 5
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		// vidro 4
	mat4.translate(top, top, [1.004* esc, .75* esc, -0.65* esc]);
	mat4.rotateY(top, top, glMatrix.toRadian(90));
	mat4.scale(top, top, [0.45* esc, 0.25* esc, 1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.grey, colors.white, 100, [0., 0., 0.]);
	primitive.solid(primitive.plane);
	stack.pop(); // vidro 4
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		// vidro 3
	mat4.translate(top, top, [-1.004* esc, .75* esc, -0.65* esc]);
	mat4.rotateY(top, top, glMatrix.toRadian(270));
	mat4.scale(top, top, [0.45* esc, 0.25* esc, 1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.grey, colors.white, 100, [0., 0., 0.]);
	primitive.solid(primitive.plane);
	stack.pop(); // vidro 3
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		// vidro 2
	mat4.translate(top, top, [-1.004* esc, .75* esc, 0.35* esc]);
	mat4.rotateY(top, top, glMatrix.toRadian(270));
	mat4.scale(top, top, [0.45* esc, 0.25* esc, 1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.grey, colors.white, 100, [0., 0., 0.]);
	primitive.solid(primitive.plane);
	stack.pop(); // vidro 2
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		// vidro 1
	mat4.translate(top, top, [1.004* esc, .75* esc, 0.35* esc]);
	mat4.rotateY(top, top, glMatrix.toRadian(90));
	mat4.scale(top, top, [0.45* esc, 0.25* esc, 1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.grey, colors.white, 100, [0., 0., 0.]);
	primitive.solid(primitive.plane);
	stack.pop(); // vidro 1
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
		// parabrisa
	mat4.translate(top, top, [0* esc, .65* esc, 0.9* esc]);
	mat4.rotateX(top, top, glMatrix.toRadian(-25));
	mat4.scale(top, top, [0.98* esc, 0.4* esc, 0.2* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.grey, colors.white, 100, [0., 0., 0.]);
	primitive.solid(primitive.cube);
	stack.pop(); // parabrisa
	
		//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
	// luz da sirene
	mat4.translate(top, top, [0.4* esc, 1.2* esc, .4* esc]);
	mat4.scale(top, top, [0.2* esc, 0.2* esc, 0.2* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.red, colors.white, 55, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	stack.pop(); // luz da sirene
	
		//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
	// chassi-2
	mat4.translate(top, top, [0* esc, 1.1* esc, -.2* esc]);
	mat4.scale(top, top, [1* esc, 0.2* esc, 1.1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.blue, colors.white, 40, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	stack.pop(); // chassi-2
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
	// chassi-2
	mat4.translate(top, top, [0* esc, .8* esc, -.2* esc]);
	mat4.scale(top, top, [1* esc, 0.3* esc, 1.1* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.blue, colors.white, 40, [0., 0., 0.]);
	primitive.solid(primitive.cube);
	stack.pop(); // chassi-2
	
		//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0.1* esc, 0* esc]);
	// chassi-1	
	mat4.scale(top, top, [1.2* esc, 0.6* esc, 2.2* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.blue, colors.white, 40, [0., 0., 0.]);
	primitive.solid(primitive.sphere);
	stack.pop(); // chassi-1
	
	//ROTAÇÃO NO PISO
	top = stack.push();
	mat4.rotateY(top, top, glMatrix.toRadian(state.rot_piso));
	mat4.translate(top, top, [5* esc, 0* esc, 0* esc]);
	// chassi-1	
	mat4.scale(top, top, [1* esc, 0.5* esc, 2* esc]);
	gl.uniformMatrix4fv(prog.model, false, top);
	material(colors.blue, colors.white, 40, [0., 0., 0.]);
	primitive.solid(primitive.cube);
	stack.pop(); // chassi-1
	

	
	

	
}

