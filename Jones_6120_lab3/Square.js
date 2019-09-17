
var gl;

var delay = 100;

var WX_min;
var WY_min;
var WX_max;
var WY_max;

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
        vec2(  0, -1 )
		
    ];
	
	var index = [
		
		0, 1, 3, 2,
		0, 1, 2, 3, 
		1, 2
	];
	
	var points = [];
	
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
	
	var iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
	
	//create color buffer the same way as the vertex buffer above
    var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
    
    // Initialize event handlers
	
	//added user input.  Use the number 1 - 4 to change shapes.
	
	//added submit button's functionality to the init method
	getWorldCintervals();
    
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch(key) {
          case '1':
				// do something
				gl.clear( gl.COLOR_BUFFER_BIT );
				gl.drawElements(gl.TRIANGLE_STRIP, 8, gl.UNSIGNED_SHORT, 0);
            break;

          case '2':
				// do something else
				gl.clear( gl.COLOR_BUFFER_BIT );
				gl.drawElements(gl.TRIANGLES, 10, gl.UNSIGNED_SHORT, 0);
				//gl.drawArrays(gl.TRIANGLES, 0, 6);
            break;

          case '3':
            	// do a third thing
				gl.clear( gl.COLOR_BUFFER_BIT );
				gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_SHORT, 0);
				//gl.drawArrays(gl.LINE_LOOP, 7, 4);
			break;
			
		case '4':
				// do a fourth thing
				gl.clear( gl.COLOR_BUFFER_BIT );
				gl.drawElements(gl.TRIANGLE_FAN, 6, gl.UNSIGNED_SHORT, 0);
				//gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
			break;
        }
    };
    var flag;
	var acceptFlag = true;
	
	window.addEventListener("mousedown", function setInitCoords(e){
		flag = true;
		
		displayToWorld(e);
		
		
	});
	window.addEventListener("mouseup", function setFlagFalse(){
		flag = false;
	});
	
	window.addEventListener("mousemove", function displayMouseLoc(e){
		if(flag == true){
			
			displayToWorld(e);
		}
	});
	
	//commented out the render function so it wouldn't interfere with the user input 
	//render();
};

//activated by clicking on the submit button
function getWorldCintervals(){
	WX_min = document.getElementById( "Xmin" ).value;
	WY_min = document.getElementById( "Ymin" ).value;
	WX_max = document.getElementById( "Xmax" ).value;
	WY_max = document.getElementById( "Ymax" ).value;
	
	setPointArr(WX_min, WY_min, WX_max, WY_max);
}

function setPointArr(WX_min, WY_min, WX_max, WY_max){
	var points;
}

//calculates the user inputed canvas min and max coords
function displayToWorld(e){
	var canvas = document.getElementById( "gl-canvas" );
	
	// slide 17 calculations create two new world variables
	// pass into parameters
	var x = e.clientX;
	var y = e.clientY;
	var wx;
	var wy;
	
	wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
	wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
	
	worldToNDC(e, wx, wy);
	
	var acceptFlag = false;
};

//calculates and ultimately displays the coords in the textarea
function worldToNDC(e, wx, wy){
	
	var canvas = document.getElementById( "gl-canvas" );
	var txt = document.getElementById('txtArea');
	var x = e.clientX;
	var y = e.clientY;
	var ndc_x = -1.0 + 2.0 * (wx - (WX_min))/(WX_max - WX_min);
	var ndc_y = -1.0 + 2.0 * (wy - (WY_min))/(WY_max - WY_min);
	
	//X to WX is page 17, WX to NDC is 
	//-1 + 2 * wx - Range / () to find NDC X
	//-1 + 2 * wy - range / () to find NDC y (don't need to flip signs
	
	txt.value = 'Device Coords: ' + x + ' , ' + y + '\n' +
	'World Coords: ' + wx + " " + wy +'\n' +
	'NDC Coords: ' + ndc_x + ' , ' + ndc_y;
};

function drawUIButtons(switchInt){
	switch(switchInt){
		case '0':
			mouseDrag(true);
			setPoints(false);
			break;
		case '1':
			mouseDrag(false);
			setPoints(true);
			break;
		default:
			console.log('Something is wrong with the GUI');
	}
}

function mouseDrag(switchFlag){
	if(switchFlag){
		console.log("mg switched on");
	}else{
		console.log("mg switched off");
	}
}

function setPoints(switchFlag){
	if(switchFlag){
		console.log("dp switched on");
		window.addEventListener("mousedown", drawPoints(e));
	}else{
		console.log("dp switched off");
	}
}

function drawPoints(e){
	var x = e.clientX;
	var y = e.clientY;
	var wx;
	var wy;
	
	wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
	wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
	
	var point = vec2(wx, wy);
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	

    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );
}
