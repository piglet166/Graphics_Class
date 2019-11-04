var myVertexShader = `
	attribute vec4 vPosition;
	attribute vec4 vColor;
	varying vec4 color;

	uniform mat4 M_comp;
	uniform mat4 C_comp;

	void main() {
		gl_Position = C_comp * M_comp*vPosition;
		color = vColor;
	}
`;

