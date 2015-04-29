function TouchPlane( touchers , position , normal , x , y , bufferDistance ){
	
  this.touchers = touchers;
	this.body = new THREE.Object3D();

  var vs = shaders.setValue( shaders.vs.topPlane , 'SIZE' , touchers.length )
  var fs = shaders.setValue( shaders.fs.topPlane , 'SIZE' , touchers.length )
	var geo = new THREE.PlaneBufferGeometry( x , y , x * 1000 , y * 1000 );
	var mat = new THREE.ShaderMaterial({
    uniforms:{
      touchers:{ type:"v3v" , value: touchers }
    },
		vertexShader: vs,
    fragmentShader: fs,
    transparent: true
	});

	this.topPlane = new THREE.Mesh( geo , mat )

  this.topPlane.rotation.x = -Math.PI / 2;
  //this.topPlane.position.y = bufferDistance;

	var geo = new THREE.PlaneBufferGeometry( x , y , 1 , 1 );
	var mat = new THREE.MeshBasicMaterial({
		color: 0xffaa66
	});
	
	this.basePlane = new THREE.Mesh( geo , mat );

  this.basePlane.rotation.x = -Math.PI / 2;
  this.basePlane.position.y = -bufferDistance;

  this.body.add( this.basePlane );
  this.body.add( this.topPlane );

  this.basePoint = new THREE.Vector3( 0 , -bufferDistance , 0 );

  this.normal = new THREE.Vector3( 0 , 1 , 0 );
  this.normal.applyQuaternion( this.body.quaternion );

  this.oldTouchPoint = new THREE.Vector3();
  this.touchPoint = new THREE.Vector3();

  this.velocity = new THREE.Vector3();
  this.position = this.body.position;


  this.v1 = new THREE.Vector3();
  this.v2 = new THREE.Vector3();
  this.v3 = new THREE.Vector3();

  this.dist = 1000000;
  this.closestID = 100000;

}

TouchPlane.prototype.update = function(){

  // Make sure our normal is facing the correct direction
  this.normal.applyQuaternion( this.body.quaternion );

  this.oDist = this.dist;
  this.oClosestID = this.closestID;
  this.dist = 10000;
  this.closestID = 0;
  for( var i = 0; i < this.touchers.length; i++ ){

    var d = this.checkDistanceToPlane( this.touchers[i]);
    if( d < this.dist ){
      this.dist = d;
      this.closestID = i;
    }

  }

  this.oldTouchPoint.copy( this.touchPoint );
  this.touchPoint.copy( this.touchers[ this.closestID ] );
  // WE ARE TOUCHING
  if( this.dist < 0 && this.oDist < 0 && this.oClosestID == this.closestID ){

    this.v1.copy( this.touchPoint );
    this.v1.sub( this.oldTouchPoint );

    this.v3.copy( this.v1  );



    this.velocity.add( this.getPerpComponent( this.v3 ).multiplyScalar( .1 ) );

    this.basePlane.material.color.setRGB( 1 , 1 , 1 )

  }else{
    this.basePlane.material.color.setRGB( 1 , .5 , 0 )
  }


  this.position.add( this.velocity );
  this.velocity.multiplyScalar( .95 );


}

TouchPlane.prototype.checkDistanceToPlane = function( point ){

  this.v1.copy( point );
  this.v1.sub( this.basePoint );

  var d = this.v1.dot( this.normal );

  return d;

}

TouchPlane.prototype.getPerpComponent = function( vec ){

  this.v1.copy( vec );

  var d = this.v1.dot( this.normal );

  this.v2.copy( this.normal );
  this.v2.multiplyScalar( d );
  this.v1.sub( this.v2 );

  return this.v1;

}