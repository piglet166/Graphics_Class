
var gl;
var canvas;

var delay = 100;


var WX_min;
var WY_min;
var WX_max;
var WY_max;
var u_wc;

var points = [];
var pColors = [];
var lines = [];
var lColors = [];
var triangles = [];
var tColors = [];

var vBuffer;
var pBuffer;
var lBuffer;
var tBuffer;
var cpBuffer;
var clBuffer;
var ctBuffer;

var program;
var pointSw = false;
var lineSw = false;
var triSw = false;
var pickSw = false;
var clearSw = false;

var transFlag = false;
var rotFlag = false;
var scaleFlag = false;

var pickedArr = [ ];
var transSw = false;
var rotSw = false;
var scaleSw = false;

window.onload = function init() {
	
	canvas = document.getElementById( "gl-canvas" );
	
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	var index = [
		
		
	];
	
	//added enough colors for all the different verticies
	
	
	u_wc = gl.getUniformLocation(program, "uniHolder");

    // Create a buffer to hold the  vertices
    pBuffer = gl.createBuffer();
	lBuffer = gl.createBuffer();
	tBuffer = gl.createBuffer();
	cpBuffer = gl.createBuffer();
	clBuffer = gl.createBuffer();
	ctBuffer = gl.createBuffer();

	// bind it to make it active
    
	
	var iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
	
	
    
    // Initialize event handlers
	
	//added user input.  Use the number 1 - 4 to change shapes.
	
	//added submit button's functionality to the init method
	getWorldCintervals();
	
	//commented out the render function so it wouldn't interfere with the user input 
	//render();
};

//activated by clicking on the submit button
function getWorldCintervals(){
	WX_min = parseFloat(document.getElementById( "Xmin" ).value);
	WY_min = parseFloat(document.getElementById( "Ymin" ).value);
	WX_max = parseFloat(document.getElementById( "Xmax" ).value);
	WY_max = parseFloat(document.getElementById( "Ymax" ).value);
}

/*
<button onclick = "getWorldCintervals()">Submit</button>
<button onclick = "drawUIButtons('1')">Points</button>
<button onclick = "drawUIButtons('3')">Lines</button>
<button onclick = "drawUIButtons('4')">Triangles</button>
<button onclick = "drawUIButtons('2')">Clear Model</button>
<button onclick = "drawUIButtons('0')">Pick</button>
*/
function drawUIButtons(switchInt){
	
	switch(switchInt){
		case '0':
			pointSw = false;
			lineSw = false;
			triSw = false;
			pickSw = true;
			clearSw = false;
			transSw = false;
			rotSw = false;
			scaleSw = false;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			translate();
			rotate();
			scale();
			break;
		case '1':
			pointSw = true;
			lineSw = false;
			triSw = false;
			pickSw = false;
			clearSw = false;
			transSw = false;
			rotSw = false;
			scaleSw = false;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			translate();
			rotate();
			scale();
			break;
		case '2':
			pointSw = false;
			lineSw = false;
			triSw = false;
			pickSw = false;
			clearSw = true;
			transSw = false;
			rotSw = false;
			scaleSw = false;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			translate();
			rotate();
			scale();
			break;
		case '3':
			pointSw = false;
			lineSw = true;
			triSw = false;
			pickSw = false;
			clearSw = false;
			transSw = false;
			rotSw = false;
			scaleSw = false;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			translate();
			rotate();
			scale();
			break;
		case '4':
			pointSw = false;
			lineSw = false;
			triSw = true;
			pickSw = false;
			clearSw = false;
			transSw = false;
			rotSw = false;
			scaleSw = false;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			translate();
			rotate();
			scale();
			break;
		case '5':
			pointSw = false;
			lineSw = false;
			triSw = false;
			pickSw = false;
			clearSw = false;
			transSw = true;
			rotSw = false;
			scaleSw = false;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			translate();
			rotate();
			scale();
			break;
		case '6':
			pointSw = false;
			lineSw = false;
			triSw = false;
			pickSw = false;
			clearSw = false;
			transSw = false;
			rotSw = true;
			scaleSw = false;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			translate();
			rotate();
			scale();
			break;
		case '7':
			pointSw = false;
			lineSw = false;
			triSw = false;
			pickSw = false;
			clearSw = false;
			transSw = false;
			rotSw = false;
			scaleSw = true;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			translate();
			rotate();
			scale();
			break;
		default:
			console.log('Something is wrong with the Switch');
	}
}

function mousePick(){
	if(pickSw){
		var canvas = document.getElementById( "gl-canvas" );
		canvas.onclick = function(event){
			console.log("pick switched on");
			var x = event.clientX - 8;
			var y = event.clientY - 8;
			var wx;
			var wy;
		
			wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
			wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
			
			var pntString = ""; //txt.value = "Mouse Coords: x: " + wx + ", y: " + wy;
			
			var txt = document.getElementById('txtArea');
			
			for(var i = 0; i < points.length; i++){
				var pntX = points[i][0];
				var pntY = points[i][1];
				
				var distance = Math.sqrt(Math.pow((wx - pntX), 2) + Math.pow((wy - pntY), 2));
				
				if(distance < 15){
					pntString = (i + 1) + " ";
					console.log(pntString);
					
					txt.value = "Picked Point: " + pntString;
					
					pickedArr = [1, points[i], i];
					return pickedArr;
				}
			}
			for(var i = 0; i < lines.length; i++){
				var pntX = lines[i][0];
				var pntY = lines[i][1];
				
				var distance = Math.sqrt(Math.pow((wx - pntX), 2) + Math.pow((wy - pntY), 2));
				
				if(distance < 15){
					pntString = Math.floor((i/2) + 1) + " ";
					console.log(pntString);
					
					txt.value = "Picked Line: " + pntString;
					
					pickedArr = [2, lines[i], i];
				}
			}
			for(var i = 0; i < triangles.length; i++){
				var pntX = triangles[i][0];
				var pntY = triangles[i][1];
				
				var distance = Math.sqrt(Math.pow((wx - pntX), 2) + Math.pow((wy - pntY), 2));
				
				if(distance < 15){
					pntString = Math.floor((i/3) + 1) + " ";
					console.log(pntString);
					
					txt.value = "Picked Triangle: " + pntString;
					
					pickedArr = [3, triangles[i], i];
				}
			}
			//console.log("Mouse Pick",pickedArr);
			render();
		}

	}else{
		console.log("pick switched off");
	}
}

function setPoints(){
	if(pointSw){
		var canvas = document.getElementById( "gl-canvas" );
		canvas.onclick = function(event){
				console.log("Set Points.");
				var x = event.clientX - 8;
				var y = event.clientY - 8;
				var wx;
				var wy;
	
				wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
				wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
				//console.log(wx, wy);
	
				if(wx < WX_max && wx > WX_min){
					if(wy < WY_max && wy > WY_min){
						var point = vec2(wx, wy);
						points.push(point);
						pColors.push(vec4(1.0, 0.0, 0.0, 1.0));
					}
				}
				console.log(points);
				gl.uniform4fv(u_wc, [WX_min, WY_min, WX_max, WY_max]);
	
				render();
				
		};
		
	}else{
		console.log("points switched off");
	}
}

function setLines(){
	
	var uiCount = 0;
	
	if(lineSw){
		var canvas = document.getElementById( "gl-canvas" );
		canvas.onclick = function(event){
				console.log("Set Lines.");
				var x = event.clientX - 8;
				var y = event.clientY - 8;
				var wx;
				var wy;
	
				wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
				wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
				//console.log(wx, wy);
	
				if(wx < WX_max && wx > WX_min){
					if(wy < WY_max && wy > WY_min){
						var line = vec2(wx, wy);
						lines.push(line);
						lColors.push(vec4(0.0, 1.0, 0.0, 1.0));
					}
				}
				gl.uniform4fv(u_wc, [WX_min, WY_min, WX_max, WY_max]);
	
				render();
				
		};
		
	}else{
		console.log("liness switched off");
	}
}

function setTriangles(){
	
	var uiCount = 0;
	
	if(triSw){
		var canvas = document.getElementById( "gl-canvas" );
		canvas.onclick = function(event){
				console.log("Set Triangles.");
				var x = event.clientX - 8;
				var y = event.clientY - 8;
				var wx;
				var wy;
	
				wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
				wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
				//console.log(wx, wy);
	
				if(wx < WX_max && wx > WX_min){
					if(wy < WY_max && wy > WY_min){
						var triangle = vec2(wx, wy);
						triangles.push(triangle);
						tColors.push(vec4(1.0, 0.0, 1.0, 1.0));
					}
				}
				gl.uniform4fv(u_wc, [WX_min, WY_min, WX_max, WY_max]);
	
				render();
				
		};
		
	}else{
		console.log("tri switched off");
	}
}

function clearModel(){
	if(clearSw){
		console.log("cm switched on");
		while(points.length > 0){ points.pop();}
		while(lines.length > 0){ lines.pop();}
		while(triangles.length > 0){ triangles.pop();}
		render();
	}else{
		console.log("cm switched off");
	}
}

function translate(){
	
	if(transSw){
		var pickedPoint;
		var p = pickedArr;
		
		canvas.onmousedown = function(){
			if(transSw){transFlag = true;}
			console.log("worked");
		}
		
		canvas.onmousemove = function(){
			
			if(transFlag){
				pickedPoint = p[1];
				
				var x = event.clientX - 8;
				var y = event.clientY - 8;
				var wx;
				var wy;
		
				wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
				wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
				
				
				
				switch(p[0]){
					case 1:
						var tx = wx - points[p[2]][0];
						var ty = wy - points[p[2]][1];
						var trans = transl3x3(tx, ty);
						
				
						var newPoint = matVecMult(trans, [points[p[2]][0], 
											points[p[2]][1], 1]);
						points[p[2]] = [newPoint[0], newPoint[1]];
						render();
						break;
					case 2:
						var ind = p[2];
						ind = (Math.floor(ind/2)) * 2;
						
						console.log(ind);
					
						var tx = wx - lines[p[2]][0];
						var ty = wy - lines[p[2]][1];
						var trans = transl3x3(tx, ty);
						
						var newPoint = matVecMult(trans, [lines[ind][0], 
											lines[ind][1], 1]);
						lines[ind] = [newPoint[0], newPoint[1]];
						
						var newPoint2 = matVecMult(trans, [lines[ind + 1][0],
											lines[ind + 1][1], 1]);
						lines[ind + 1] = [newPoint2[0], newPoint2[1]];
						
						render();
						break;
					case 3:
					
						var ind = p[2];
						ind = (Math.floor(ind/3)) * 3;
						
						console.log(ind);
					
						var tx = wx - triangles[p[2]][0];
						var ty = wy - triangles[p[2]][1];
						var trans = transl3x3(tx, ty);
						
						var newPoint = matVecMult(trans, [triangles[ind][0], 
											triangles[ind][1], 1]);
						triangles[ind] = [newPoint[0], newPoint[1]];
						
						var newPoint2 = matVecMult(trans, [triangles[ind + 1][0],
											triangles[ind + 1][1], 1]);
						triangles[ind + 1] = [newPoint2[0], newPoint2[1]];
						
						var newPoint3 = matVecMult(trans, [triangles[ind + 2][0],
											triangles[ind + 2][1], 1]);
						triangles[ind + 2] = [newPoint3[0], newPoint3[1]];
						render();
						break;
					default:
						break;
				}
			}
		}
		
		canvas.onmouseup = function(){
			transFlag = false;
			console.log("worked 2");
		}
		
	}else{
		console.log("trans off");
	}
}

function rotate(){
	if(rotSw){
		var pickedPoint;
		var p = pickedArr;
		var clickX;
		var ClickY;
		
		canvas.onmousedown = function(){
			if(rotSw){rotFlag = true;}
			console.log("worked");
			
			var x = event.clientX - 8;
			var y = event.clientY - 8;
					
			clickX = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
			clickY = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
			
			
		}
		
		canvas.onmousemove = function(){
			
			if(rotFlag){
				pickedPoint = p[1];
				
				var x = event.clientX - 8;
				var y = event.clientY - 8;
				var wx;
				var wy;
		
				wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
				wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
				
				var angle = 1. + (wx - clickX) * 0.1;
				
				switch(p[0]){
					case 1:
						var centerPointX = 512/2;
						var centerPointY = 512/2;
						
						var ind = p[2];
						
						var trans = transl3x3(-centerPointX, -centerPointY);
						var rotation = rotate3x3(angle);
						var trans1 = transl3x3(centerPointX, centerPointY);
						
						var newPoint = matVecMult(trans, [points[ind][0],
														points[ind][1], 1]);
						newPoint = matVecMult(rotation, [newPoint[0], 
												newPoint[1], 1]);
						newPoint = matVecMult(trans1, [newPoint[0],
												newPoint[1], 1]);
						
						points[ind] = [newPoint[0], newPoint[1]];
						
						render();
						break;
					case 2:
						var ind = p[2];
						ind = (Math.floor(ind/2)) * 2;		
						
						var midPointX = (lines[ind][0] + lines[ind + 1][0]) / 2;
						var midPointY = (lines[ind][1] + lines[ind + 1][1]) / 2;
						
						var tx = wx - lines[p[2]][0];
						var ty = wy - lines[p[2]][1];
						
						
						var trans = transl3x3(-midPointX, -midPointY);
						
						var rotation = rotate3x3(angle);
						
						var trans1 = transl3x3(midPointX, midPointY);
						
						var newPoint = matVecMult(trans, [lines[ind][0], 
											lines[ind][1], 1]);
						newPoint = matVecMult(rotation, [newPoint[0], 
											newPoint[1], 1]);
						newPoint = matVecMult(trans1, [newPoint[0], 
											newPoint[1], 1]);
						
						
						var newPoint2 = matVecMult(trans, [lines[ind + 1][0],
											lines[ind + 1][1], 1]);
						newPoint2 = matVecMult(rotation, [newPoint2[0], 
											newPoint2[1], 1]);
						newPoint2 = matVecMult(trans1, [newPoint2[0], 
											newPoint2[1], 1]);					
											
						
						lines[ind] = [newPoint[0], newPoint[1]];
						lines[ind + 1] = [newPoint2[0], newPoint2[1]];
						
						render();
						break;
					case 3:
						var ind = p[2];
						ind = (Math.floor(ind/3)) * 3;
						
						var midPointX = (triangles[ind][0] + triangles[ind + 1][0] +
											triangles[ind + 2][0]) / 3;
						var midPointY = (triangles[ind][1] + triangles[ind + 1][1] +
											triangles[ind + 2][1]) / 3;
						
						
						var trans = transl3x3(-midPointX, -midPointY);
						console.log("Midpoint " + midPointX + " " + midPointY);
						
						var rotation = rotate3x3(angle);
						
						var trans1 = transl3x3(midPointX, midPointY);
						
						var newPoint = matVecMult(trans, [triangles[ind][0], 
											triangles[ind][1], 1]);
						newPoint = matVecMult(rotation, [newPoint[0], 
											newPoint[1], 1]);
						newPoint = matVecMult(trans1, [newPoint[0], 
											newPoint[1], 1]);
						
						
						var newPoint2 = matVecMult(trans, [triangles[ind + 1][0],
											triangles[ind + 1][1], 1]);
						newPoint2 = matVecMult(rotation, [newPoint2[0], 
											newPoint2[1], 1]);
						newPoint2 = matVecMult(trans1, [newPoint2[0], 
											newPoint2[1], 1]);					
						
						var newPoint3 = matVecMult(trans, [triangles[ind + 2][0],
											triangles[ind + 2][1], 1]);
						newPoint3 = matVecMult(rotation, [newPoint3[0], 
											newPoint3[1], 1]);
						newPoint3 = matVecMult(trans1, [newPoint3[0], 
											newPoint3[1], 1]);							
						
						triangles[ind] = [newPoint[0], newPoint[1]];
						triangles[ind + 1] = [newPoint2[0], newPoint2[1]];
						triangles[ind + 2] = [newPoint3[0], newPoint3[1]];
						
						render();
						break;
					default:
						break;
				}
			}
		}
		
		canvas.onmouseup = function(){
			rotFlag = false;
			console.log("worked 2");
		}
		
	}else{
		console.log("trans off");
	}
	
}

function scale(){
	if(scaleSw){
		var pickedPoint;
		var p = pickedArr;
		var clickX;
		var clickY;
		
		canvas.onmousedown = function(){
			if(scaleSw){scaleFlag = true;}
			console.log("worked");
			
			var x = event.clientX - 8;
			var y = event.clientY - 8;
					
			clickX = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
			clickY = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
		}
		
		canvas.onmousemove = function(){
			
			if(scaleFlag){
				pickedPoint = p[1];
				
				var x = event.clientX - 8;
				var y = event.clientY - 8;
				var wx;
				var wy;
		
				wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
				wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
								
				var magnify = 1. + (wx - clickX) * 0.001;
				
				switch(p[0]){
					case 1:
						
						break;
					case 2:
						var ind = p[2];
						ind = (Math.floor(ind/2)) * 2;
												
						var midPointX = (lines[ind][0] + lines[ind + 1][0]) / 2;
						var midPointY = (lines[ind][1] + lines[ind + 1][1]) / 2;
					
						var tx = wx - lines[p[2]][0];
						var ty = wy - lines[p[2]][1];
						var trans = transl3x3(-midPointX, -midPointY);
						var scale = scale3x3(magnify, magnify);
						var trans1 = transl3x3(midPointX, midPointY);
						
						
						var newPoint = matVecMult(trans, [lines[ind][0], 
											lines[ind][1], 1]);
						newPoint = matVecMult(scale, [newPoint[0], 
											newPoint[1], 1]);
						newPoint = matVecMult(trans1, [newPoint[0], 
											newPoint[1], 1]);
						
						
						var newPoint2 = matVecMult(trans, [lines[ind + 1][0],
											lines[ind + 1][1], 1]);
						newPoint2 = matVecMult(scale, [newPoint2[0], 
											newPoint2[1], 1]);
						newPoint2 = matVecMult(trans1, [newPoint2[0], 
											newPoint2[1], 1]);					
						console.log("NewPoint1: " + newPoint + " Newpoint2 " + newPoint2);			
						
						lines[ind] = [newPoint[0], newPoint[1]];
						lines[ind + 1] = [newPoint2[0], newPoint2[1]];
						
						render();
						break;
					case 3:
					
						var ind = p[2];
						ind = (Math.floor(ind/3)) * 3;
												
						var midPointX = (triangles[ind][0] + triangles[ind + 1][0] +
											triangles[ind + 2][0]) / 3;
						var midPointY = (triangles[ind][1] + triangles[ind + 1][1] +
											triangles[ind + 2][1]) / 3;
					
						var tx = wx - triangles[p[2]][0];
						var ty = wy - triangles[p[2]][1];
						
						var trans = transl3x3(-midPointX, -midPointY);
						var scale = scale3x3(magnify, magnify);
						var trans1 = transl3x3(midPointX, midPointY);
						
						
						var newPoint = matVecMult(trans, [triangles[ind][0], 
											triangles[ind][1], 1]);
						newPoint = matVecMult(scale, [newPoint[0], 
											newPoint[1], 1]);
						newPoint = matVecMult(trans1, [newPoint[0], 
											newPoint[1], 1]);
						
						
						var newPoint2 = matVecMult(trans, [triangles[ind + 1][0],
											triangles[ind + 1][1], 1]);
						newPoint2 = matVecMult(scale, [newPoint2[0], 
											newPoint2[1], 1]);
						newPoint2 = matVecMult(trans1, [newPoint2[0], 
											newPoint2[1], 1]);	

						var newPoint3 = matVecMult(trans, [triangles[ind + 2][0],
											triangles[ind + 2][1], 1]);
						newPoint3 = matVecMult(scale, [newPoint3[0], 
											newPoint3[1], 1]);
						newPoint3 = matVecMult(trans1, [newPoint3[0], 
											newPoint3[1], 1]);	
											
						
						triangles[ind] = [newPoint[0], newPoint[1]];
						triangles[ind + 1] = [newPoint2[0], newPoint2[1]];
						triangles[ind + 2] = [newPoint3[0], newPoint3[1]];
						
						render();
						break;
					default:
						break;
				}
			}
		}
		
		canvas.onmouseup = function(){
			scaleFlag = false;
			console.log("worked 2");
		}
		
	}else{
		console.log("trans off");
	}
	
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);

				// send the data as an array to GL
				gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
				

								// Associate out shader variables with our data buffer
				
				// get a location to the vertex position's shader variable ('vPosition')
				var pPosition = gl.getAttribLocation( program, "vPosition");
				
				// specifies the vertex attribute information (in an array), used
				// for rendering 
				gl.vertexAttribPointer(pPosition, 2, gl.FLOAT, false, 0, 0);

				// enable this attribute, with the given attribute name
				gl.enableVertexAttribArray(pPosition);
				//color buffer
				gl.bindBuffer(gl.ARRAY_BUFFER, cpBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, flatten(pColors), gl.STATIC_DRAW);
				
				var vpColor = gl.getAttribLocation( program, "vColor");
				gl.vertexAttribPointer(vpColor, 4, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(vpColor);
				
				gl.drawArrays(gl.POINTS, 0, points.length);
	
	//lines
	
	gl.bindBuffer(gl.ARRAY_BUFFER, lBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, flatten(lines), gl.STATIC_DRAW);
				var lPosition = gl.getAttribLocation(program, "vPosition");
				gl.vertexAttribPointer(lPosition, 2, gl.FLOAT, false, 0, 0);
				
				gl.enableVertexAttribArray(lPosition);
				
				gl.bindBuffer(gl.ARRAY_BUFFER, clBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, flatten(lColors), gl.STATIC_DRAW);
				
				var vlColor = gl.getAttribLocation( program, "vColor");
				gl.vertexAttribPointer(vlColor, 4, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(vlColor);
				
				gl.drawArrays(gl.LINES, 0, lines.length);
	
	//triangles
	
	gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, flatten(triangles), gl.STATIC_DRAW);
				var tPosition = gl.getAttribLocation(program, "vPosition");
				gl.vertexAttribPointer(tPosition, 2, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(tPosition);
				
				gl.bindBuffer(gl.ARRAY_BUFFER, ctBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, flatten(tColors), gl.STATIC_DRAW);
				
				var vtColor = gl.getAttribLocation( program, "vColor");
				gl.vertexAttribPointer(vtColor, 4, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(vtColor);
				
				gl.drawArrays(gl.TRIANGLES, 0, triangles.length);
	
	
//ask about timeout function!!!
    /*setTimeout(
        function (){requestAnimFrame(render);}, delay
    );*/
	
}
