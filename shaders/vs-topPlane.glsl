
const int size = @SIZE;
uniform vec3 touchers[ size ];

varying vec2 vUv;
varying vec4 vDist; // .w is which toucher
varying float vDistToPlane;

varying vec3 vPerp;
varying vec3 vPara;

vec4 getDistance( vec3 position ){
	
	float lowestLength = 1000.;
	vec4 toReturn = vec4( lowestLength );

	for( int i = 0; i < size; i++ ){
		vec3 dif = position - touchers[ i ];
		if( length( dif ) < lowestLength ){
			lowestLength = length( dif );
			toReturn = vec4( dif , float( i ));
		}
	}

	return toReturn;

}

float distanceToPlane( vec3 n , vec3 p1 , vec3 p2 , out vec3 perp , out vec3 para ){
	
	vec3 dif = p2 - p1;

	float d = dot( n , dif );

	perp = n * d;

	para = dif - perp;

	return d;

}

void main(){
	


	vec3 mNorm = normalMatrix *normal;
	vec3 mPos = (modelMatrix * vec4( position , 1. )).xyz;
	vDist = getDistance( mPos );

	int lu = int( vDist.w );

	vec3 para  = vec3( 0. );
	vec3 perp  = vec3( 0. );

	vDistToPlane = distanceToPlane( mNorm , mPos , touchers[lu] , perp , para);
	vPara = para;
	vPara = perp;

	vec3 pos = position;

	float len = length( para );

	float push = 0.;

	float cutoff = .05;

	if( len < cutoff ){
		push = pow( ( cutoff - len ) / cutoff , 2. );
	}
	if( vDistToPlane < 0. ){
		pos += normal * vDistToPlane * push ;
	}

	vUv = uv;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );

}