
//returns a 3x3 identy Matrix
function identity3x3(){
	var idMtx = new Array(3);
	
	idMtx = [ 1, 0, 0,
			  0, 1, 0,
			  0, 0, 1 ];

	return idMtx;
}

function identity4x4(){
	var idMtx = new Array(3);
	
	idMtx = [ 1, 0, 0, 0,
			  0, 1, 0, 0,
			  0, 0, 1, 0,
			  0, 0, 0, 1 ];
	return idMtx;
}

//returns a 3x3 translation matrix with tx and ty as translation factors along X and Y
function transl3x3(tx, ty){
	var trans = new Array(9);
	
	trans = [ 1,  0, tx, 
			  0,  1, ty, 
			  0,  0, 1   ];
			 
	return trans;
}

function transl4x4(tx, ty, tz){
	trans = [ 1., 0., 0.,  0.,
			  0., 1., 0.,  0.,
			  0., 0., 1.,  0.,
			  tx, ty, tz,  1. ];
			  
	return trans;
}

//returns a 3x3 rotation matrix that rotates by 'angle' (note that if the angle is passed in degrees, 
//it needs to be converted into radians prior to applying trig functions (use the Javascript Math 
//package to use the trig functions)
function rotate3x3(angle){
	var retRot = [ ];
	
	var cosVar = Math.cos(angle * Math.PI/180);
	var sinVar = Math.sin(angle * Math.PI/180);
	
	retRot = [  cosVar, sinVar, 0.,
			   -sinVar, cosVar, 0.,
			         0.,      0., 1.  ];
	
	return retRot;
}

function rotate4x4(angle, axis){
		
	var c = Math.cos( radians(angle) );
    var s = Math.sin( radians(angle) );
	var selAxis;
	
	switch(axis){
		case 'z':
			selAxis = [ c, -s, 0., 0., 
						s,  c, 0., 0.,
						0.,  0., 1., 0., 
						0.,  0., 0., 1. ];
        break;

        case 'x':
			selAxis = [ 1., 0.,  0., 0.,
						0., c,  -s, 0., 
						0., s,   c, 0.,
						0., 0.,  0., 1. ];
        break;

        case 'y':
           	selAxis = [ c,  0., s,  0., 
						0., 1., 0., 0., 
					   -s,  0., c,  0.,
						0., 0., 0., 1. ];
		break;
			
		default:
			console.log("broken");
		break;
	}
	
	//console.log(selAxis);
    return selAxis;
}

//returns a 3x3 scale matrix for scaling by sx, sy along the X and Y axes.
function scale3x3(sx, sy){
	var retScale = [ sx,  0,  0,
					  0, sy,  0,
					  0,  0,  1 ];
					  
	return retScale;
}

function scale4x4(sx, sy, sz){
	
    var result = [];
	
	for(var i = 0; i < 16; i++){
		result[i] = 0.;
	
	}
	
    result[0] = sx;
    result[5] = sy;
    result[10] = sz;
	result[15] = 1.;

    return result;
}

//computes and returns the transformed vector V'= M*V,  where M is a 3x3 matrix and V is
//a 3 element vector
function matVecMult(M, V){
	var retV = [ 0,0,0,0];
	
	retV[0] = (V[0] * M[0]) + (V[1] * M[1]) + (V[2] * M[2]);
	retV[1] = (V[0] * M[3]) + (V[1] * M[4]) + (V[2] * M[5]);
	retV[2] = (V[0] * M[6]) + (V[1] * M[7]) + (V[2] * M[8]);
	retV[3] = (V[0] * M[9]) + (V[1] * M[10]) + (V[2] * M[11]);
	
	return retV;
}

//Do backwards
//computes the product of M1 and M2, which are both 3x3 matrices, resulting in M' = M1*M2
function matMult(M1, M2){
	var result = [];

    result[0] = (M1[0] * M2[0]) + (M1[1] * M2[4]) + (M1[2] * M2[8]) + (M1[3] * M2[12]); 
	result[1] = (M1[0] * M2[1]) + (M1[1] * M2[5]) + (M1[2] * M2[9]) + (M1[3] * M2[13]); 
	result[2] = (M1[0] * M2[2]) + (M1[1] * M2[6]) + (M1[2] * M2[10]) + (M1[3] * M2[14]); 
	result[3] = (M1[0] * M2[3]) + (M1[1] * M2[7]) + (M1[2] * M2[11]) + (M1[3] * M2[15]); 
	result[4] = (M1[4] * M2[0]) + (M1[5] * M2[4]) + (M1[6] * M2[8]) + (M1[7] * M2[12]); 
	result[5] = (M1[4] * M2[1]) + (M1[5] * M2[5]) + (M1[6] * M2[9]) + (M1[7] * M2[13]); 
	result[6] = (M1[4] * M2[2]) + (M1[5] * M2[6]) + (M1[6] * M2[10]) + (M1[7] * M2[14]); 
	result[7] = (M1[4] * M2[3]) + (M1[5] * M2[7]) + (M1[6] * M2[11]) + (M1[7] * M2[15]); 
	result[8] = (M1[8] * M2[0]) + (M1[9] * M2[4]) + (M1[10] * M2[8]) + (M1[11] * M2[12]); 
	result[9] = (M1[8] * M2[1]) + (M1[9] * M2[5]) + (M1[10] * M2[9]) + (M1[11] * M2[13]); 
	result[10] = (M1[8] * M2[2]) + (M1[9] * M2[6]) + (M1[10] * M2[10]) + (M1[11] * M2[14]); 
	result[11] = (M1[8] * M2[3]) + (M1[9] * M2[7]) + (M1[10] * M2[11]) + (M1[11] * M2[15]); 
	result[12] = (M1[12] * M2[0]) + (M1[13] * M2[4]) + (M1[14] * M2[8]) + (M1[15] * M2[12]); 
	result[13] = (M1[12] * M2[1]) + (M1[13] * M2[5]) + (M1[14] * M2[9]) + (M1[15] * M2[13]); 
	result[14] = (M1[12] * M2[2]) + (M1[13] * M2[6]) + (M1[14] * M2[10]) + (M1[15] * M2[14]); 
	result[15] = (M1[12] * M2[3]) + (M1[13] * M2[7]) + (M1[14] * M2[11]) + (M1[15] * M2[15]); 
	
	return result;
}

function subtractArr(m, n){
	var difference = [];
	
	for(var i = 0; i < m.length; i++){
		difference[i] = m[i] - n[i];
	}
	
	return difference;
}

function CrossProduct(m, n){
	var crossProd = [];
	
	crossProd[0] = m[1] * n[2] - m[2] * n[1];
	crossProd[1] = m[2] * n[0] - m[0] * n[2];
	crossProd[2] = m[0] * n[1] - m[1] * n[0];
	
	return crossProd;
}

function GetPosition(ui){
	var retPos;
	
	switch(ui){
		case '1':
			retPos = [0, .5, -1];
			break;
		case '2':
			retPos = [0, .5, 1];
			break;
		case '3':
			retPos = [-1, .5, 0];
			break;
		case '4':
			retPos = [1, .5, 0];
			break;
		default:
			console.log("GetPosition is messed up");
			break;
	}
	
	return retPos;
}

//transposed r = right u = up f = forward
/*
	
*/

function lookAt( eye, at, up )
{
    if ( !Array.isArray(eye) || eye.length != 3) {
        throw "lookAt(): first parameter [eye] must be an a vec3";
    }

    if ( !Array.isArray(at) || at.length != 3) {
        throw "lookAt(): first parameter [at] must be an a vec3";
    }

    if ( !Array.isArray(up) || up.length != 3) {
        throw "lookAt(): first parameter [up] must be an a vec3";
    }

    if ( equal(eye, at) ) {
        return mat4();
    }

    var v = normalize( subtract(at, eye) );  // view direction vector
    var n = normalize( cross(v, up) );       // perpendicular vector
    var u = normalize( cross(n, v) );        // "new" up vector

    v = negate( v );

    var result = mat4(
        vec4( n, -dot(n, eye) ),
        vec4( u, -dot(u, eye) ),
        vec4( v, -dot(v, eye) ),
        vec4()
    );

    return result;
}

function PerspectiveMatrix(r, l, t, b, f, n){
	
	var perM = mat4(vec4((2*n)/(r-l),   0,            0,            0),
				  vec4(0,           (2*n)/(t-b),   0,            0),
				  vec4(0,            0,          -(f+n)/(f-n), -(2*f*n)/(f-n)),
				  vec4(0,            0,           -1,            0)             );
			  
	return perM;
			  
	
}

