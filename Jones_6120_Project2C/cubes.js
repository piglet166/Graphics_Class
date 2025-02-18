var canvas;
var gl;

var program;
var vertexShader, fragmentShader;
var compiled;
var cameraPos;
var origin = [0, 0, 0];

// count of vertices
var NumCubeVertices = 36;  //36?

// triangle vertices and colors
var tri_verts  = []; 
var tri_colors = [];

var vColor, vPosition

var M_Loc;
var C_Loc;
var P_Loc;

var angle = 0.;
var userInput = '1';

var r = 0.25;
var l = -0.25;
var t = 0.25;
var b = -0.25;
var f = 10;
var n = 0.1;

var sliderWidth;
var sliderHeight;
var sliderNear;
var sliderFar;

// all initializations
window.onload = function init() {
    // get canvas handle
    canvas = document.getElementById( "gl-canvas" );
	
	sliderFar = document.getElementById("far");
	sliderNear = document.getElementById("near");
	sliderHeight = document.getElementById("height");
	sliderWidth = document.getElementById("width");

	// WebGL Initialization
    gl = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer: true} );
	if ( !gl ) {
		alert( "WebGL isn't available" );
	}
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.8, 0.8, 0.0, 1.0 );
	gl.clear( gl.COLOR_BUFFER_BIT );

	// create shaders, compile and link program
	program = createShaders();
    gl.useProgram(program);

	// create the colored cube
	createColorCube();
	
    // buffers to hold cube vertices and its colors
    vBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();

	// allocate space for points
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(tri_verts), gl.STATIC_DRAW);

    // variables through which shader receives vertex and other attributes
	vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );	

	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(tri_colors), gl.STATIC_DRAW );

	vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray(vColor );

	// a location for the matrix to be sent to share with the shader
	M_Loc = gl.getUniformLocation(program, "M_comp");
	C_Loc = gl.getUniformLocation(program, "C_comp");
	P_Loc = gl.getUniformLocation(program, "P_comp");

	gl.enable(gl.DEPTH_TEST);
	
	window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
		console.log(key);
        switch(key) {
          case '1':
				userInput = '1';
            break;

          case '2':
				userInput = '2';
            break;

          case '3':
            	userInput = '3';
			break;
			
		  case '4':
				userInput = '4';
			break;
			
		  default:
				console.log("default hit");
			break;
        }
    };
	
	sliderFar.oninput = function() {
	  var wf = this.value;
	  
	  wf = wf/100;
	  
	  f = wf;
	}
	sliderNear.oninput = function() {
	  var wn = this.value;
	  
	  wn = wn/100;
	  
	  n = wn;
	}
	sliderHeight.oninput = function() {
	  var wh = this.value;
	  
	  wh = wh/100;
	  
	  t = wh;
	  b = -wh;
	}
	sliderWidth.oninput = function() {
	  var wv = this.value;
	  
	  wv = wv/100;
	  
	  r = wv;
	  l = -wv;
	}
	
	console.log(tri_verts);
    render();
}

// all drawing is performed here
function render(){
	
	var ModelViewMatrix, d;

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var rot, transl, rot2, scal, M_cube, M, mat;
	
	mat = identity4x4();
	cameraPos = GetPosition(userInput);
	var camera = lookAt(cameraPos, origin, [0,1,0]);
	
	var rotAng = .2;
	
	var cosVar = Math.cos(rotAng * Math.PI/180);
	var sinVar = Math.sin(rotAng * Math.PI/180);
	
	var modelViewMatrix = translate(0, 0, -1);
	modelViewMatrix = matMult(modelViewMatrix, rotate4x4(35.26, 'x'));
	modelViewMatrix = matMult(modelViewMatrix, rotate4x4(45., 'y'));
	
	var perspective = PerspectiveMatrix(r, l, t, b, f, n);
	gl.uniformMatrix4fv(M_Loc, false, flatten(mat));
	gl.uniformMatrix4fv(C_Loc, false, flatten(camera));
	gl.uniformMatrix4fv(P_Loc, false, flatten(perspective));
	gl.drawArrays( gl.TRIANGLES, 0, NumCubeVertices );
	
	/*mat = identity4x4();
	
	scal = scale4x4(0.5, 0.5, 0.5);
	transl = transl4x4(0.5, 0.5, -0.2);
	
	mat = matMult(scal, transl);
	
	gl.uniformMatrix4fv(M_Loc, false, flatten(mat));
	gl.drawArrays(gl.TRIANGLES, 0, NumCubeVertices );
	
	mat = identity4x4();
	
	scal = scale4x4(0.5, 0.5, 0.5);
	transl = transl4x4(-0.5, -0.5, 0.2);
	
	mat = matMult(scal, transl);
	
	gl.uniformMatrix4fv(M_Loc, false, flatten(mat));
	gl.drawArrays(gl.TRIANGLES, 0, NumCubeVertices );*/

	requestAnimFrame( render );
}

// create a colored cube with 8 vertices and colors at
// at each vertex
function createColorCube () {
	createQuad( 1, 0, 3, 2 );
	createQuad( 2, 3, 7, 6 );
	createQuad( 3, 0, 4, 7 );
	createQuad( 6, 5, 1, 2 );
	createQuad( 4, 5, 6, 7 );
	createQuad( 5, 4, 0, 1 );
}

function createColorPyramid(){
	createQuad( 9, 10, 11, 12 );
	createTriangle(  9, 12, 8 );
	createTriangle(  9, 10, 8 );
	createTriangle( 10, 11, 8 );
	createTriangle( 11, 12, 8 );
}

function getCubeVertices() {
	return [
        vec3( -0.25, -0.25,   0.25 ),//0  Left, lower, deep 
        vec3( -0.25,  0.25,   0.25 ),//1  Left, top, deep
        vec3(  0.25,  0.25,   0.25 ),//2  Right, top, deep
        vec3(  0.25, -0.25,   0.25 ),//3  Right, lower, deep
        vec3( -0.25, -0.25,  -0.25 ),//4  Left, lower, shallow
        vec3( -0.25,  0.25,  -0.25 ),//5  Left, top, shallow
        vec3(  0.25,  0.25,  -0.25 ),//6  Right, top, shallow
        vec3(  0.25, -0.25,  -0.25 ),//7  Right, lower, shallow
		vec3(  0.0,   0.25,   0.0  ),//8  Top center point
		vec3( -0.25,  0.75,  -0.25 ),//9  base left shallow
		vec3( -0.25,  0.75,   0.25 ),//10 base left deep
		vec3(  0.25,  0.75,   0.25 ),//11 base right deep
		vec3(  0.25,  0.75,  -0.25 ) //12 base right shallow
    ];
}
function getCubeVertexColors() {
	return [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 1.0, 1.0, 1.0, 1.0 ],  // white
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
		[ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
    ];
}

function createQuad (a, b, c, d) {
	var vertices  = getCubeVertices();
	var vertex_colors  = getCubeVertexColors();

	// Each quad is rendered as two triangles as WebGL cannot
	// directly render a quad

	var indices = [ a, b, c, a, c, d ];

	for ( var i = 0; i < indices.length; ++i ) {
		tri_verts.push(vertices[indices[i]]);
		tri_colors.push(vertex_colors[indices[i]]);
	}
}

function createTriangle(a, b, c){
	var vertices = getCubeVertices();
	var vertex_colors = getCubeVertexColors();
	
	var indices = [ a, b, c ];
	
	for(var i = 0; i < indices.length; ++i){
		tri_verts.push(vertices[indices[i]]);
		tri_colors.push(vertex_colors[indices[i]]);
	}
}

// function that does all shader initializations and 
// returns the compiled shader program
function createShaders () {
    			// Create program object
    program = gl.createProgram();

    			//  Load vertex shader
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, myVertexShader);
    gl.compileShader(vertexShader);
    gl.attachShader(program, vertexShader);
    compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    if (!compiled) {
      console.error(gl.getShaderInfoLog(vertexShader));
    }

    			//  Load fragment shader
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, myFragmentShader);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);
    compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
    if (!compiled) {
      console.error(gl.getShaderInfoLog(fragmentShader));
    }

    			//  Link program
    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      console.error(gl.getProgramInfoLog(program));
    }
	return program;
}

function identity4() {
    var m = [];
    m = [
            [1.0, 0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
        ];

    return m;
}

function transpose( m )
{
    if ( !m.matrix ) {
        return "transpose(): trying to transpose a non-matrix";
    }

    var result = [];
    for ( var i = 0; i < m.length; ++i ) {
        result.push( [] );
        for ( var j = 0; j < m[i].length; ++j ) {
            result[i].push( m[j][i] );
        }
    }

    result.matrix = true;

    return result;
}