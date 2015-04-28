function TouchPlane( position , normal , x , y , bufferDistance ){
	
	this.body = new THREE.Object3D();

	var geo = new THREE.PlaneBufferGeometry( x , y , x * 20 , y * 20 );
	var mat = new THREE.MeshBasicMaterial({
		color: 0xc0ffee,
		wireframe: true
	});

	this.topPlane = new THREE.Mesh( geo , mat )

  this.topPlane.rotation.x = -Math.PI / 2;
  this.topPlane.position.y = bufferDistance;

	var geo = new THREE.PlaneBufferGeometry( x , y , x * 20 , y * 20 );
	var mat = new THREE.MeshBasicMaterial({
		color: 0xffaa66
	});
	
	this.basePlane = new THREE.Mesh( geo , mat );

  this.basePlane.rotation.x = -Math.PI / 2;

  this.body.add( basePlane );
  this.body.add( topPlane );


}

TouchPlane.prototype.update = function( fingers ){


}

TouchPlane.prototype.checkDistanceToPlane = function( point ){


}