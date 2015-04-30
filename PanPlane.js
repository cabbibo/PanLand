function PanPlane( plane , touchPlane ){

  this.body = touchPlane.body;

  this.panPlane   = plane;
  this.position   = plane.position;
	this.velocity   = new THREE.Vector3();
  this.force      = new THREE.Vector3();


  this.body.add( plane );

  this.x = 0;
  this.y = 0; 

  this.dX = 0;
  this.dY = 0;

  this.maxX  = 5;
  this.maxY  = 5;


  touchPlane.addTouchingEvent( function( e ){

    //console.log( tou)
    this.dX = e.dX;
    this.dY = e.dY;

  }.bind( this ))

  touchPlane.addTouchUpEvent( function( e ){

    this.dX = 0;
    this.dY = 0;

  }.bind( this ))

  touchPlane.addTouchDownEvent( function( e ){


  }.bind( this ))

}

PanPlane.prototype.update = function(){

  this.force.set( 0 , 0 , 0 );

  this.force.x = this.dX * .5;
  this.force.y = this.dY * .5;


  this.velocity.add( this.force );
  this.position.add( this.velocity );


  // Keep it in bounds
  if( this.position.x > this.maxX ){
    this.position.x = this.maxX;
  }

  if( this.position.x < -this.maxX ){
    this.position.x = -this.maxX;
  }

  if( this.position.y > this.maxY ){
    this.position.y = this.maxY;
  }

  if( this.position.y < -this.maxY ){
    this.position.y = -this.maxY;
  }


  //console.log( this.position)
  this.velocity.multiplyScalar( .95 );


}