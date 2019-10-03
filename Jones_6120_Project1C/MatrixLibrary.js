

//returns a 3x3 identy Matrix
function identity3x3(){
	var idMtx = new Array(3);
	
	/*for (var i = 0; i < 9; i++){
		idMtx[i] = new Array(3);
		
		for (var j = 0; j < 9; j++){
			
			if(i == j){
				idMtx[i][j] = 1;
			}else{
				idMtx[i][j] = 0;
			}
	}*/
	
	idMtx = [ 1, 0, 0,
			  0, 1, 0,
			  0, 0, 1 ];

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

//computes and returns the transformed vector V'= M*V,  where M is a 3x3 matrix and V is
//a 3 element vector
function matVecMult(M, V){
	var retV = [ ];
	
	trans = transl3x3(); //I need tx and ty
	retV[0] = (M[0] * trans[0]) + (M[1] * trans[3]) + (M[2] * trans[6]);
	retV[1] = (M[0] * trans[1]) + (M[1] * trans[4]) + (M[2] * trans[7]);
	retV[2] = (M[0] * trans[2]) + (M[1] * trans[5]) + (M[2] * trans[8]);
	retV[3] = (M[3] * trans[0]) + (M[4] * trans[3]) + (M[5] * trans[6]);
	retV[4] = (M[3] * trans[1]) + (M[4] * trans[4]) + (M[5] * trans[7]);
	retV[5] = (M[3] * trans[2]) + (M[4] * trans[5]) + (M[5] * trans[8]);
	retV[6] = (M[6] * trans[0]) + (M[7] * trans[3]) + (M[8] * trans[6]);
	retV[7] = (M[6] * trans[1]) + (M[7] * trans[4]) + (M[8] * trans[7]);
	retV[8] = (M[6] * trans[2]) + (M[7] * trans[5]) + (M[8] * trans[8]);
	
	return retV;
}

//computes the product of M1 and M2, which are both 3x3 matrices, resulting in M' = M1*M2
function matMult(M1, M2){
	var retM;
	
	retM[0] = (M1[0] * M2[0]) + (M1[1] * M2[3]) + (M1[2] * M2[6]);
	retM[1] = (M1[0] * M2[1]) + (M1[1] * M2[4]) + (M1[2] * M2[7]);
	retM[2] = (M1[0] * M2[2]) + (M1[1] * M2[5]) + (M1[2] * M2[8]);
	retM[3] = (M1[3] * M2[0]) + (M1[4] * M2[3]) + (M1[5] * M2[6]);
	retM[4] = (M1[3] * M2[1]) + (M1[4] * M2[4]) + (M1[5] * M2[7]);
	retM[5] = (M1[3] * M2[2]) + (M1[4] * M2[5]) + (M1[5] * M2[8]);
	retM[6] = (M1[6] * M2[0]) + (M1[7] * M2[3]) + (M1[8] * M2[6]);
	retM[7] = (M1[6] * M2[1]) + (M1[7] * M2[4]) + (M1[8] * M2[7]);
	retM[8] = (M1[6] * M2[2]) + (M1[7] * M2[5]) + (M1[8] * M2[8]);
	
	return retM;
}

