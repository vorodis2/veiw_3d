
/*
import { EffectComposer } from '../shaders/EffectComposer.js';
import { RenderPass } from '../shaders/RenderPass.js';
import { OutlinePass } from '../shaders/OutlinePass.js';

import { ShaderPass } from '../shaders/ShaderPass.js';
import { FXAAShader } from '../shaders/FXAAShader.js';*/


			import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
			import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
			import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
			import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
			import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
			import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

export class MEffectMouse  {
  	constructor(_visi3D) {  		
  		this.type="MEffectMouse";
  		var self=this;

  		this.visi3D=_visi3D
  		this._active = false;

  		var renderer=_visi3D.renderer;
  		var camera=_visi3D.camera;
  		var scene=_visi3D.scene;
  		let composer, effectFXAA, outlinePass;



  		var width=200
  		var height=200

  		this.init=function(){
  			if(composer)return
			composer = new EffectComposer( renderer );

			const renderPass = new RenderPass( scene, camera );
			composer.addPass( renderPass );

			outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
			composer.addPass( outlinePass );

			/*const textureLoader = new THREE.TextureLoader();
			textureLoader.load( 'textures/tri_pattern.jpg', function ( texture ) {

				outlinePass.patternTexture = texture;
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;

			} );*/

			const outputPass = new OutputPass();
			composer.addPass( outputPass );

			effectFXAA = new ShaderPass( FXAAShader );
			effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
			composer.addPass( effectFXAA );


			this.sizeWindow() 
			this.setValue(oldA)
  		}




  		this.sizeWindow = function(w, h){
  			if(w){
				width=w
  				height=h
  			}

  			if(!composer)return
  			composer.setSize( width, height );
			effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );
  			
  		}
		this.setRect = function(x,y,w, h){

		}




		this.render = function(){
			if(this._active==false)return this._active;

			composer.render();
  			return true

			
		}
		var oldA=[]
		this.setValue= function(_param){  
			oldA=_param	

			if(!composer)return		
  			if(Array.isArray(_param)==true){
				outlinePass.selectedObjects = _param;
				return;
			}
			if(_param==null&&_param==undefined){
				outlinePass.selectedObjects = [];
				return;
			}
			outlinePass.selectedObjects = [_param];  		
  		}
			
  		if(this._active)this.init()
  	}

  	set active(value) {
        if(this._active!=value){
            this._active= value;
            if(value)this.init()
            this.visi3D.intRend=1;
        }
    }    
    get active() { return  this._active;} 
}
