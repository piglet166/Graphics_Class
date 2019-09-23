
var gl;

var delay = 100;

window.onload = function init() {

    var canvas = document.getElementById( "gl-canvas" );
	
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = [
        
		vec2(  0,  1 ),
        vec2(  1,  0 ),
        vec2( -1,  0 ),
        vec2(  0, -1 ),
		//added additional verticies for additional shapes
		vec2(  1,  0 ),
		vec2( -1,  0 ),
		vec2(  0,  0 ),
		vec2(  0,  1 ),
        vec2(  1,  0 ),
        vec2(  0, -1 ),
        vec2( -1,  0 )
    ];
	
	//added enough colors for all the different verticies
	var colors = [
		vec4(1.0, 0.0, 0.0, 1.0),
		vec4(0.0, 1.0, 0.0, 1.0),
		vec4(0.0, 0.0, 1.0, 1.0),
		vec4(1.0, 0.0, 1.0, 1.0),
		vec4(1.0, 1.0, 0.0, 1.0),
		vec4(0.0, 1.0, 1.0, 1.0),
		vec4(1.0, 1.0, 1.0, 1.0),
		vec4(1.0, 0.0, 0.0, 1.0),
		vec4(0.0, 1.0, 0.0, 1.0),
		vec4(0.0, 0.0, 1.0, 1.0),
		vec4(1.0, 0.0, 1.0, 1.0)
	];

    // Create a buffer to hold the  vertices
    var vBuffer = gl.createBuffer();

	// bind it to make it active
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

	// send the data as an array to GL
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    				// Associate out shader variables with our data buffer
	
	// get a location to the vertex position's shader variable ('vPosition')
    var vPosition = gl.getAttribLocation( program, "vPosition");
	
	// specifies the vertex attribute information (in an array), used
	// for rendering 
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

	// enable this attribute, with the given attribute name
    gl.enableVertexAttribArray(vPosition);
	
	//create color buffer the same way as the vertex buffer above
    var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
    
    // Initialize event handlers
	
	//added user input.  Use the number 1 - 4 to change shapes.
    
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch(key) {
          case '1':
				// do something
				gl.clear( gl.COLOR_BUFFER_BIT );
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            break;

          case '2':
				// do something else
				gl.clear( gl.COLOR_BUFFER_BIT );
				gl.drawArrays(gl.TRIANGLES, 0, 6);
            break;

          case '3':
            	// do a third thing
				gl.clear( gl.COLOR_BUFFER_BIT );
				gl.drawArrays(gl.LINE_LOOP, 7, 4);
            break;
			
		case '4':
				// do a fourth thing
				gl.clear( gl.COLOR_BUFFER_BIT );
				gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
			break;
        }
    };
    var flag;
	
	//window.addEventListener("mousedown", getMouseLoc);
	//window.addEventListener("mouseup", mouseDone);

	window.addEventListener("mousedown", function setInitCoords(e){
		flag = true;
		var canvas = document.getElementById( "gl-canvas" );
		var txt = document.getElementById('txtArea');
		var x = e.clientX;
		var y = e.clientY;
		
		var ndc_x = -1.0 + 2.0 * x/canvas.width;
		var ndc_y =   1.0 - 2.0 * y/canvas.height;
	
		txt.value = 'Device Coords: ' + x + ' , ' + y + '\n' +
		'NDC Coords: ' + ndc_x + ' , ' + ndc_y;
	});
	window.addEventListener("mouseup", function setFlagFalse(){
		flag = false;
	});
	
	window.addEventListener("mousemove", function displayMouseLoc(e){
		if(flag == true){
			var canvas = document.getElementById( "gl-canvas" );
			var txt = document.getElementById('txtArea');
			var x = e.clientX;
			var y = e.clientY;
			
			var ndc_x = -1.0 + 2.0 * x/canvas.width;
			var ndc_y =   1.0 - 2.0 * y/canvas.height;
	
			txt.value = 'Device Coords: ' + x + ' , ' + y + '\n' +
			'NDC Coords: ' + ndc_x + ' , ' + ndc_y;
		}
	});
	
	//commented out the render function so it wouldn't interfere with the user input 
	//render();
};

function getMouseLoc(e){
	var canvas = document.getElementById( "gl-canvas" );
	var txt = document.getElementById('txtArea');
		
	var x = e.clientX;
	var y = e.clientY;
			
	var ndc_x = -1.0 + 2.0 * x/canvas.width;
	var ndc_y =   1.0 - 2.0 * y/canvas.height;
	
	txt.value = 'Device Coords: ' + x + ' , ' + y + '\n' +
	'NDC Coords: ' + ndc_x + ' , ' + ndc_y;
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	

    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );
}
