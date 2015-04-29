const int size = @SIZE;

uniform vec3 touchers[ size ];
varying vec4 vDist; // .w is which toucher
varying float vDistToPlane;
varying vec3 vPerp;
varying vec3 vPara;

const float bandSize = .95;
varying vec2 vUv;

void main(){

	vec4 col = vec4( vec3( 0. ) , .5);
	
	float x = sin( vUv.x * 300.);
	float y = sin( vUv.y * 300.);

	if( x > bandSize || y > bandSize ){ col = vec4( .6 , .8 , 1. ,1. ); }

	//if( length( vPara ) < .03 && vDistToPlane < 0. ){ col = vec4( .6 , .8 , 1. ,1. ); }

	//col *= 1.- vDistToPlane;

	//if( vDistToPlane < 0. ){ col = vec4( 1. ); }
	gl_FragColor = col;


}