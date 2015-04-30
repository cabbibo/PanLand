function TouchPlane( touchers , body , xy , bufferDistance ){
	
  this.touchers = touchers;

  this.touchPoints      = [];
  this.oTouchPoints     = [];
  this.touchInfo        = [];

  this.touchDownEvents  = [];
  this.touchUpEvents    = [];
  this.touchingEvents   = [];

  this.hoverDownEvents  = [];
  this.hoverUpEvents    = [];
  this.hoveringEvents   = [];


  for( var i = 0; i < this.touchers.length; i++ ){

    this.touchPoints.push( this.touchers[i].clone() );
    this.oTouchPoints.push( this.touchers[i].clone() );
    this.touchInfo.push({
      hovered: false,
      touching: false,
      touchStartTime: 0
    })

  }
	

  this.body = body;

  this.x = xy[0];
  this.y = xy[1];
  this.bufferDistance = bufferDistance;

  this.body.updateMatrix();

  this.basePoint = new THREE.Vector3( 0 , 0 , -this.bufferDistance );

  this.normal = new THREE.Vector3( 0 , 0 , 1 );
  this.xVec = new THREE.Vector3( 1 , 0 , 0 );
  this.yVec = new THREE.Vector3( 0 , 1 , 0 );

  this.v1 = new THREE.Vector3();
  this.v2 = new THREE.Vector3();
  this.v3 = new THREE.Vector3();


}

TouchPlane.prototype.update = function(){

  this.normal.set( 0 , 0 , 1 )
  this.xVec.set( 1 , 0 , 0 )
  this.yVec.set( 0 , 1 , 0 )
  this.basePoint.set( 0 , 0 , -this.bufferDistance );

  
  this.v1.set( 0 , 0, 0);
  // Make sure our Vectors are facing the right directions

  this.body.updateMatrixWorld();
  this.basePoint.applyMatrix4( this.body.matrixWorld );

  this.normal.applyMatrix4( this.body.matrixWorld );
  this.xVec.applyMatrix4( this.body.matrixWorld );
  this.yVec.applyMatrix4( this.body.matrixWorld );

  this.v1.applyMatrix4( this.body.matrixWorld );

  this.normal.sub( this.v1 );
  this.xVec.sub( this.v1 );
  this.yVec.sub( this.v1 );


 // this.basePoint.applyQuaternion( this.body.quaternion );
 // this.basePoint.add( this.body.position );


  for( var  i = 0; i < this.touchers.length; i++ ){

    this.oTouchPoints[i].copy( this.touchPoints[i] );
    this.touchPoints[i].copy( this.touchers[i] );

    var oD = this.checkDistanceToPlane( this.oTouchPoints[i]);
    var d  = this.checkDistanceToPlane( this.touchPoints[i]);

    var dD = oD - d;

    var inBounds = this.checkInBounds( this.touchPoints[i] );

    if( inBounds ){

      if( oD > this.bufferDistance && d <= this.bufferDistance ){
        this._hoverDown( this.touchPoints[i] , i )
      }

      if( oD < this.bufferDistance && d >= this.bufferDistance ){
        this._hoverUp( this.touchPoints[i] , i )
      }

      if( oD < this.bufferDistance && d < this.bufferDistance  && d > 0 ){
        this._hovering( this.touchPoints[i] , i , d , dD )
      }

      if( oD > 0 && d <= 0 ){
        this._touchDown( this.touchPoints[i] , i )
      }

      if( oD < 0 && d >= 0 ){
        this._touchUp( this.touchPoints[i] , i )
      }

      if( oD < 0  && d < 0 ){

        this.v3.copy( this.touchPoints[i] );
        this.v3.sub( this.oTouchPoints[i] )

        var dXY = this.getXY( this.v3 );

        this._touching( this.touchPoints[i] , i , this.v3 , dXY , dD );

      }

    // Make sure that if we are out of bounds
    // we trigger all the neccesary out events
    }else{

      if( this.touchInfo[i].hovering == true ){
        this._hoverUp( this.touchPoints[i] , i );
      }

      if( this.touchInfo[i].touching == true ){
        this._touchUp( this.touchPoints[i] , i );
      }

    }

  }

 

}



TouchPlane.prototype._touchDown = function( pos , id ){

  this.touchInfo[id].touching = true;
  this.touchInfo[id].touchStartTime = Date.now();
 // console.log( this.touchInfo[id].touchStartTime );

  for( var i = 0; i < this.touchDownEvents.length; i++ ){

    this.touchDownEvents[i]({
      position: pos,
      id: id
    });

  }

}

TouchPlane.prototype._touchUp = function( pos , id ){

  this.touchInfo[id].touching = false;
  //this.touchInfo[id].touchStartTime = Date.now();
  
  for( var i = 0; i < this.touchUpEvents.length; i++ ){

    this.touchUpEvents[i]({
      position: pos,
      id: id
    });

  }

}



TouchPlane.prototype._touching = function( pos , id , dPos , dXY , dD ){

  var timeTouching = Date.now() - this.touchInfo[id].touchStartTime;

  for( var i = 0; i < this.touchingEvents.length; i++ ){

    this.touchingEvents[i]({

      position  : pos, 
      id        : id,
      dPosition : dPos,
      dXY       : dXY,
      dX        : dXY[0],
      dY        : dXY[1],
      dDistance : dD,
      timeTouching: timeTouching

    });

  }

}

TouchPlane.prototype._hoverDown = function( pos , id  ){

  this.touchInfo[id].hovering = true;

  for( var i = 0; i < this.hoverDownEvents.length; i++ ){

    this.hoverDownEvents[i]({
      position: pos,
      id: id
    });

  }

}

TouchPlane.prototype._hoverUp = function( pos ,  id   ){

  this.touchInfo[id].hovering = false;

  for( var i = 0; i < this.hoverUpEvents.length; i++ ){

    this.hoverUpEvents[i]({
      position: pos,
      id: id
    });

  }

}

TouchPlane.prototype._hovering = function( pos , id , distance , dD ){

  for( var i = 0; i < this.hoveringEvents.length; i++ ){

    this.hoveringEvents[i]({
      position: pos,
      id: id,
      distance: distance,
      dDistance : dD
    });

  }

}

TouchPlane.prototype.addTouchDownEvent = function( e ){ 
  this.touchDownEvents.push( e );
}

TouchPlane.prototype.addTouchUpEvent = function( e ){ 
  this.touchUpEvents.push( e );
}

TouchPlane.prototype.addTouchingEvent = function( e ){ 
  this.touchingEvents.push( e );
}

TouchPlane.prototype.addHoverDownEvent = function( e ){ 
  this.hoverDownEvents.push( e );
}

TouchPlane.prototype.addHoverUpEvent = function( e ){ 
  this.hoverUpEvents.push( e );
}

TouchPlane.prototype.addHoveringEvent = function( e ){ 
  this.hoveringEvents.push( e );
}

TouchPlane.prototype.removeEvent = function( array , e ){
  
  console.log( this[array] );
  
  for( var i = 0; i < this[ array ].length; i++ ){
    if( this[ array ][i] === e ){
      this[array].splice( i , 1 );
    }
  }
  
  console.log( this[array] );

}



TouchPlane.prototype.assignTouchInfo = function(){


}


TouchPlane.prototype.checkDistanceToPlane = function( point ){

  this.v1.copy( point );
  this.v1.sub( this.basePoint );

  var d = this.v1.dot( this.normal );

  return d;

}


// Gets the component of the vector that is in the plane
// BE CAREFUL! it returns v1, so set it out immediatly
TouchPlane.prototype.getPerpComponent = function( vec ){

  this.v1.copy( vec );

  var d = this.v1.dot( this.normal );

  this.v2.copy( this.normal );
  this.v2.multiplyScalar( d );
  this.v1.sub( this.v2 );

  return this.v1;

}

// Checks to make sure that where we are touching is
// in the bounds of the plane
TouchPlane.prototype.checkInBounds = function( point ){

  this.v3.copy( point )
  this.v3.sub( this.basePoint );
  var xy = this.getXY( this.v3 );
  
  //xy[0] = abs( xy[0] );
  //xy[1] = abs( xy[1] );
  
  if( xy[0] > this.x / 2 || xy[0] < -this.x / 2  ){
    return false
  }

  if( xy[1] > this.y / 2 || xy[1] < -this.y / 2  ){
    return false
  }

  return true
  // this.v1 is now perpComponent

}

TouchPlane.prototype.getXY = function( vec ){
   
  this.v1.copy( vec );

  var d = this.v1.dot( this.normal );

  this.v2.copy( this.normal );
  this.v2.multiplyScalar( d );
  this.v1.sub( this.v2 );

  this.v2.copy( this.v1 );
  this.v2.projectOnVector( this.xVec );

  var dot = this.v2.dot( this.xVec );
  var sign = dot > 0 ? 1 : -1
  var X = this.v2.length() * sign;

  this.v1.copy( vec );

  var d = this.v1.dot( this.normal );

  this.v2.copy( this.normal );
  this.v2.multiplyScalar( d );
  this.v1.sub( this.v2 );

  this.v2.copy( this.v1 );
  this.v2.projectOnVector( this.yVec );

  var dot = this.v2.dot( this.yVec );
  var sign = dot > 0 ? 1 : -1
  var Y = this.v2.length() * sign;

  return[ X , Y ];

}


