
var gl;

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
var program;
var pointSw = false;
var lineSw = false;
var triSw = false;
var pickSw = false;
var clearSw = false;

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
	
	var index = [
		
		
	];
	
	//added enough colors for all the different verticies
	pColors = [
		vec4(1.0, 0.0, 0.0, 1.0),
	];
	
	lColors = [
		vec4(0.0, 1.0, 0.0, 1.0),
	];
	
	tColors = [
		vec4(0.0, 0.0, 1.0, 1.0),
		vec4(1.0, 0.0, 1.0, 1.0),
		vec4(1.0, 1.0, 0.0, 1.0),
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
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			break;
		case '1':
			pointSw = true;
			lineSw = false;
			triSw = false;
			pickSw = false;
			clearSw = false;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			break;
		case '2':
			pointSw = false;
			lineSw = false;
			triSw = false;
			pickSw = false;
			clearSw = true;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			break;
		case '3':
			pointSw = false;
			lineSw = true;
			triSw = false;
			pickSw = false;
			clearSw = false;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
			break;
		case '4':
			pointSw = false;
			lineSw = false;
			triSw = true;
			pickSw = false;
			clearSw = false;
			mousePick();
			setPoints();
			clearModel();
			setLines();
			setTriangles();
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
			
			var pntString = "";
			
			var txt = document.getElementById('txtArea');
			
			for(var i = 0; i < points.length; i++){
				var pntX = points[i][0];
				var pntY = points[i][1];
				
				var distance = Math.sqrt(Math.pow((wx - pntX), 2) + Math.pow((wy - pntY), 2));
				
				if(distance < 15){
					pntString = (i + 1) + " ";
					console.log(pntString);
					
					txt.value = "Picked Point: " + pntString;
					
				}
			}
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
				console.log("Point switched on.");
				var x = event.clientX - 8;
				var y = event.clientY - 8;
				var wx;
				var wy;
	
				wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
				wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
				console.log(wx, wy);
	
				if(wx < WX_max && wx > WX_min){
					if(wy < WY_max && wy > WY_min){
						var point = vec2(wx, wy);
						points.push(point);
					}
				}
				gl.uniform4fv(u_wc, [WX_min, WY_min, WX_max, WY_max]);
	
				render();
		};
		
	}else{
		console.log("points switched off");
	}
}

function setLines(){
	
	var uiCount = 0;
	
	if(pointSw){
		var canvas = document.getElementById( "gl-canvas" );
		canvas.onclick = function(event){
				console.log("Point switched on.");
				var x = event.clientX - 8;
				var y = event.clientY - 8;
				var wx;
				var wy;
	
				wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
				wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
				console.log(wx, wy);
	
				if(wx < WX_max && wx > WX_min){
					if(wy < WY_max && wy > WY_min){
						var line = vec2(wx, wy);
						lines.push(line);
					}
				}
				gl.uniform4fv(u_wc, [WX_min, WY_min, WX_max, WY_max]);
	
				render();
		};
		
	}else{
		console.log("points switched off");
	}
}

function setTriangles(){
	
	var uiCount = 0;
	
	if(pointSw){
		var canvas = document.getElementById( "gl-canvas" );
		canvas.onclick = function(event){
				console.log("Point switched on.");
				var x = event.clientX - 8;
				var y = event.clientY - 8;
				var wx;
				var wy;
	
				wx = WX_min + ((x-0)/(512)) * (WX_max - WX_min);
				wy = WY_min + ((y-0)/(512)) * (WY_max - WY_min);
				console.log(wx, wy);
	
				if(wx < WX_max && wx > WX_min){
					if(wy < WY_max && wy > WY_min){
						var triangle = vec2(wx, wy);
						triangles.push(triangle);
					}
				}
				gl.uniform4fv(u_wc, [WX_min, WY_min, WX_max, WY_max]);
	
				render();
		};
		
	}else{
		console.log("points switched off");
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
	
//ask about timeout function!!!
    /*setTimeout(
        function (){requestAnimFrame(render);}, delay
    );*/
	
}
