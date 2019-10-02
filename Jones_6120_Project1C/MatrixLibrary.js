

//returns a 3x3 identy Matrix
function identity3x3(){
	var idMtx = new Array(3);
	
	for (var i = 0; i < 9; i++){
		idMtx[i] = new Array(3);
		
		for (var j = 0; j < 9; j++){
			
			if(i == j){
				idMtx[i][j] = 1;
			}else{
				idMtx[i][j] = 0;
			}
	}

	return idMtx;
}

//returns a 3x3 translation matrix with tx and ty as translation factors along X and Y
function transl3x3(tx, ty){
	var trans = new Array(9);
	
	trans = [ 1,  0, 0, 
			  0,  1, 0, 
			 tx, ty, 1 ];
			 
	return trans;
}

//returns a 3x3 rotation matrix that rotates by 'angle' (note that if the angle is passed in degrees, 
//it needs to be converted into radians prior to applying trig functions (use the Javascript Math 
//package to use the trig functions)
function rotate3x3(angle){
	
}

//returns a 3x3 scale matrix for scaling by sx, sy along the X and Y axes.
function scale3x3(sx, sy){
	
}

//computes and returns the transformed vector    V'= M*V,  where M is a 3x3 matrix and V is
//a 3 element vector
function matVecMult(M, V){
	
}

//computes the product of M1 and M2, which are both 3x3 matrices, resulting in M' = M1*M2
function matMult(M1, M2){
	
}

