function Button( string , size , touchers , body , bufferDistance ){


  this.body = body;

	this.title = textCreator.createMesh( string );
  this.title.scale.multiplyScalar( .001 );
  this.title.material.opacity = .5;


  console.log( this.title )

  this.body.add( this.title );
  this.title.position.z = -bufferDistance * 1.1;

  var x = this.title.scaledWidth  * this.title.scale.x;
  var y = this.title.scaledHeight * this.title.scale.y;



  var scale = new THREE.Vector2( x , y );
  scale.multiplyScalar( 1 / y );
  console.log( scale );

  var touchers = touchPlane.touchers;
  this.uniforms =  {

    touchers:{ type:"v3v" , value: touchers },
    touching:{ type: "f" , value: 0 },
    bufferDistance: { type:"f" , value: bufferDistance },
    scale: { type:"v2" , value: scale }

  }

  var vs = shaders.setValue( shaders.vs.button , 'SIZE' , touchers.length );
  var fs = shaders.setValue( shaders.fs.button , 'SIZE' , touchers.length );

	var geo = new THREE.PlaneBufferGeometry( x , y , 30 , 30 );
	var mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
		vertexShader: vs,
    fragmentShader: fs,
    transparent: true
	});

	this.topPlane = new THREE.Mesh( geo , mat );
  this.body.add( this.topPlane );

	var xy = [ x , y ];

	this.touchPlane = new TouchPlane( touchers , body , xy , bufferDistance );


  this.touchPlane.addTouchDownEvent( function( e ){ this._touchDown( e ); }.bind( this ));
  this.touchPlane.addTouchDownEvent( function( e ){ this._touchUp( e ); }.bind( this ));

  this.touchPlane.addHoverDownEvent( function( e ){ this._hoverDown( e ); }.bind( this ));
  this.touchPlane.addHoverUpEvent( function( e ){ this._hoverUp( e ); }.bind( this ));

  this.touchPlane.addHoveringEvent( function( e ){ this._hovering( e ); }.bind( this ));

  this.currentlyTouched = true;

}

Button.prototype.update = function(){

	this.touchPlane.update();

}

Button.prototype._touchDown = function( e ){


  console.log( 'yup' )
}

Button.prototype._touchUp = function( e ){

  console.log( 'up' )
}
Button.prototype._hoverDown = function( e ){

  this.title.material.opacity = 1.;

}

Button.prototype._hoverUp = function( e ){
  this.title.material.opacity = .5;
}

Button.prototype._hovering = function( e ){

}


