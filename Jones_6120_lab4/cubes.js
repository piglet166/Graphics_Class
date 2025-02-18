var canvas;
var gl;

var program;
var vertexShader, fragmentShader;
var compiled;
var selection = 'x';

// count of vertices
var NumCubeVertices = 36;  //36?

// triangle vertices and colors
var tri_verts  = []; 
var tri_colors = [];

var vColor, vPosition

var M_Loc;

var angle = 0.;
var userInput = '1';

// all initializations
window.onload = function init() {
    // get canvas handle
    canvas = document.getElementById( "gl-canvas" );

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

	// TODO: create the tetrahedron above it
	// TODO : You will similarly create a tetrahedron  and call it here
	createColorPyramid();

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
			
		  default:
				console.log("default hit");
			break;
        }
    };

    render();
}

// all drawing is performed here
function render(){

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var rot, transl, M_cube, M_tetra, M;
	
	angle += .2;
	
	// x rotation : cube 
	// Your code to rotate the cube about any of the axes will go here
	var axis = userInput;
	
	rot = rotate4x4(angle, '1');
	//rot2 rotate4x4(angle, '3');
	
	//multiply rot by ro2
	
	//scale, rot, transien
	//mat = (trans, rot);
	//mat = (mat, scale);
		
	// make the tetra rotate about itself faster
	//M_cube = identity4();

	gl.uniformMatrix4fv(M_Loc, false, flatten(rot));
	gl.drawArrays(gl.TRIANGLES, 0, NumCubeVertices );
	
	//do same for next cube...
	//mat = identity4
	//mat

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

/*function createQuad (a, b, c, d) {
	var vertices  = getCubeVertices();
	var vertex_colors  = getCubeVertexColors();

	// Each quad is rendered as two triangles as WebGL cannot
	// directly render a quad

	var indices = [ a, b, c, a, c, d ];

	for ( var i = 0; i < indices.length; ++i ) {
		verts.push(vertices[indices[i]]);
		vert_colors.push(vertex_colors[indices[i]]);
	}
}*/

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

/*function getCubeVertices() {
	return [
        vec3( -0.25, -0.25,  0.25 ),
        vec3( -0.25,  0.25,  0.25 ),
        vec3(  0.25,  0.25,  0.25 ),
        vec3(  0.25, -0.25,  0.25 ),
        vec3( -0.25, -0.25,  -0.25 ),
        vec3( -0.25,  0.25,  -0.25 ),
        vec3(  0.25,  0.25,  -0.25 ),
        vec3(  0.25, -0.25,  -0.25 )
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
        [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];
}*/


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

//UserInput(){
	
//}