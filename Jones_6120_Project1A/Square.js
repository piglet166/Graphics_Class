
var gl;

var delay = 100;

var WX_min;
var WY_min;
var WX_max;
var WY_max;
var u_wc;

var points = [];
var vBuffer;
var program;

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
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = [
        
		
    ];
	
	var index = [
		
		
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
	
	u_wc = gl.getUniformLocation(program, "uniHolder");

    // Create a buffer to hold the  vertices
    vBuffer = gl.createBuffer();

	// bind it to make it active
    
	
	var iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
	
	
    
    // Initialize event handlers
	
	//added user input.  Use the number 1 - 4 to change shapes.
	
	//added submit button's functionality to the init method
	getWorldCintervals();
    
    
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
	WX_min = parseFloat(document.getElementById( "Xmin" ).value);
	WY_min = parseFloat(document.getElementById( "Ymin" ).value);
	WX_max = parseFloat(document.getElementById( "Xmax" ).value);
	WY_max = parseFloat(document.getElementById( "Ymax" ).value);
	
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
	
	txt.value = 'Device Coords: ' + x + ' , ' + y + '\n' +
	'World Coords: ' + wx + " " + wy +'\n' +
	'NDC Coords: ' + ndc_x + ' , ' + ndc_y;
};

//"drawUIButtons('1')">Points
//"drawUIButtons('2')">Clear Model
//"drawUIButtons('0')">Pick
function drawUIButtons(switchInt){
	switch(switchInt){
		case '0':
			mousePick(true);
			setPoints(false);
			clearModel(false);
			break;
		case '1':
			mousePick(false);
			setPoints(true);
			clearModel(false);
			break;
		case '2':
			mousePick(false);
			setPoints(false);
			clearModel(true);
			break;
		default:
			console.log('Something is wrong with the Switch');
	}
}

function mousePick(switchFlag){
	while(switchFlag){
		console.log("pick switched on");
		var x = event.clientX;
		var y = event.clientY;
		var wx;
		var wy;
	
		wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
		wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
		
		var pntString = "";
		
		for(var i = 0; i < points.length; i++){
			var pntX = points[i][0];
			var pntY = points[i][1];
			
			var distance = Math.sqrt(Math.pow((wx - pntX), 2) + Math.pow((wy - y), 2));
			
			if(distance < 2){
				pntString = (i + 1) + " ";
				console.log(pntString);
			}
		}

		switchFlag = false;
	}/*else{
		console.log("pick switched off");
	}*/
}

function setPoints(switchFlag){
	while(switchFlag){
		//window.onclick = createPoints(event);
		window.addEventListener("mousedown", function(event){
				
				console.log(switchFlag);
				var x = event.clientX;
				var y = event.clientY;
				var wx;
				var wy;
	
				wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
				wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
				console.log(wx, wy);
	
				var point = vec2(wx, wy);
				points.push(point);
				gl.uniform4fv(u_wc, [WX_min, WY_min, WX_max, WY_max]);
	
				render();
		});
		
		window.addEventListener("mouseup", function(e){});
		switchFlag = false;
		
	}/*else{
		console.log("points switched off");
	}*/
}

function clearModel(switchFlag){
	while(switchFlag){
		console.log("cm switched on");
		while(points.length > 0){ points.pop();}
		switchFlag = false;
	}/*else{
		console.log("cm switched off");
	}*/
}

function createPoints(event){
	var x = event.clientX;
	var y = event.clientY;
	var wx;
	var wy;
	
	wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
	wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
	console.log(wx, wy);
	var point = vec2(wx, wy);
	points.push(point);
	gl.uniform4fv(u_wc, [WX_min, WY_min, WX_max, WY_max]);
	render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

	// send the data as an array to GL
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    				// Associate out shader variables with our data buffer
	
	// get a location to the vertex position's shader variable ('vPosition')
    var vPosition = gl.getAttribLocation( program, "vPosition");
	
	// specifies the vertex attribute information (in an array), used
	// for rendering 
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

	// enable this attribute, with the given attribute name
    gl.enableVertexAttribArray(vPosition);
    gl.drawArrays(gl.POINTS, 0, points.length);
	

    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );
}
