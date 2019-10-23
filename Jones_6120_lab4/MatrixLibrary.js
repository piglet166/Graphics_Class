

//returns a 3x3 identy Matrix
function identity3x3(){
	var idMtx = new Array(3);
	
	idMtx = [ 1, 0, 0,
			  0, 1, 0,
			  0, 0, 1 ];

	return idMtx;
}

//returns a 3x3 translation matrix with tx and ty as translation factors along X and Y
function transl3x3(tx, ty){
	var trans = new Array(9);
	
	trans = [ 1,  0, tx, 
			  0,  1, ty, 
			  0,  0, 1 ];
			 
	return trans;
}

function transl4x4(tx, ty, tz){
	trans = [ 1, 0, 0, tx,
			  0, 1, 0, ty,
			  0, 0, 1, tz,
			  0, 0, 0,  1 ];
			  
	return trans;
}

//returns a 3x3 rotation matrix that rotates by 'angle' (note that if the angle is passed in degrees, 
//it needs to be converted into radians prior to applying trig functions (use the Javascript Math 
//package to use the trig functions)
function rotate3x3(angle){
	var retRot = [ ];
	
	var cosVar = Math.cos(angle * Math.PI/180);
	var sinVar = Math.sin(angle * Math.PI/180);
	
	retRot = [  cosVar, sinVar, 0,
			   -sinVar, cosVar, 0,
			         0,      0, 1  ];
	
	return retRot;
}

function rotate4x4(angle, axis){
	
	var c = Math.cos( radians(angle) );
    var s = Math.sin( radians(angle) );
	var selAxis;
	
	switch(axis){
		case '1':
			selAxis = [ c, -s, 0, 0, 
						s,  c, 0, 0,
						0,  0, 0, 0,
						0,  0, 1, 0, 
						0,  0, 0, 1 ];
        break;

        case '2':
			selAxis = [ 1, 0,  0, 0,
						0, c, -s, 0, 
						0, s,  c, 0,
						0, 0,  0, 1 ];
        break;

        case '3':
           	selAxis = [  c, 0, s, 0, 
						 0, 1, 0, 0, 
						-s, 0, c, 0,
						 0, 0, 0, 1 ];
		break;
			
		default:
			console.log("broken");
		break;
	}
	

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
	if ( Array.isArray(x) && x.length == 3 ) {
        sz = x[2];
        sy = x[1];
        sx = x[0];
    }

    var result = mat4();
    result[0][0] = sx;
    result[1][1] = sy;
    result[2][2] = sz;

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

    if ( M1.matrix && M2.matrix ) {
        if ( M1.length != M2.length ) {
            throw "mult(): trying to add matrices of different dimensions";
        }

        for ( var i = 0; i < M1.length; ++i ) {
            if ( M1[i].length != M2[i].length ) {
                throw "mult(): trying to add matrices of different dimensions";
            }
        }

        for ( var i = 0; i < M1.length; ++i ) {
            result.push( [] );

            for ( var j = 0; j < M2.length; ++j ) {
                var sum = 0.0;
                for ( var k = 0; k < M1.length; ++k ) {
                    sum += M1[i][k] * M2[k][j];
                }
                result[i].push( sum );
            }
        }

        result.matrix = true;

        return result;
    }
    else {
        if ( M1.length != M2.length ) {
            throw "mult(): vectors are not the same dimension";
        }

        for ( var i = 0; i < M1.length; ++i ) {
            result.push( M1[i] * M2[i] );
        }

        return result;
    }
}

