
import { MVisi3D } from './visi3D/MVisi3D.js';     //вьювер3д
import { SceneSB } from './visi3D/SceneSB.js'      //для в3д

import { MVBox } from './visi3D/box/MVBox.js'          //для в3д


///Ночало))
export class Main{
 	constructor(fun, keyUser) {
		this.type="Main";		 	

	 	window.mainBig=this
	    var self=this;
	    this.fun=fun
	  	this.contentHTML= document.createElement(
			'div'
		);// dsds
	 	this.contentHTML.style.position = 'fixed';
		this.contentHTML.style.top = '0px';			
		this.contentHTML.style.left = '0px';
		document.body.appendChild(this.contentHTML);  
		
	

  		window.dcmParam = new DCM();
  		this.dCont = new DCont(this.contentHTML);

  		
 		//порезаный от пикси вювер        
        this.visi3D = new MVisi3D(this.contentHTML, null, dcmParam.mobile, true, true, true, false);
        this.visi3D.yes3d = true;
        this.content3d = new THREE.Object3D();
        this.visi3D.groupObject.add(this.content3d);
        window.visi3D = this.visi3D
        visi3D.position3d.boolMouseRight = false;

        this.content3d.rotation.x=-Math.PI/2;


        let ss='{"xVerh":0,"yVerh":0,"zVerh":0,"rotationX":1.0,"rotationZ":-0.85,"zume":930,"fov":45}'
        this.visi3D.setObj(JSON.parse(ss))/**/

        //debag
        let r=800;
        let r1=300;
        let mat = new THREE.MeshPhongMaterial({color:dcmParam.color})
        let geom = new THREE.BoxGeometry(1,1,1)
        for (var i = 0; i < 22; i++) {
        	let m=new THREE.Mesh(geom,mat)
        	m.position.set(Math.random()*r-r/2,Math.random()*r/4-r/8,Math.random()*r-r/2 )
        	m.scale.set(Math.random()*r1-r1/2,Math.random()*r1/4-r1/8 ,Math.random()*r1-r1/2)
        	visi3D.addChildMouse(m)
        	this.content3d.add(m)
        }


        this.mBoxS = new MBoxS(this, function(s,p,p1){

        })






        var sWH=400 
		//Маштабим окна 		
  		this.sizeWindow = function(w,h){			 			
  			let s=w/sWH
  			if(w>h)s=h/sWH
  			if(s>1)s=1  		
            this.visi3D.sizeWindow(0,0,w, h);
        	self.mBoxS.sizeWindow(w,h,s)
  		}
  		this.tick = function () {
  		
  			self.mBoxS.upDate()		
  			self.visi3D.upDate();
  			//self.mvBox.upDate()
			requestAnimationFrame( self.tick );	
		}
  		this.tick()


  	}
}



export class MBoxS{
 	constructor(par, fun) {
		this.type="MBoxS";
	    var self=this;
	    this.par=par;	
	    this.fun=fun;
	    this.array=[]
	    this.dCont = new DCont(this.par.dCont);	




	    this.plus = function (wh, pW, pH, color) {
	    	let box= new MVBox();
	    	box.setVisi3D(this.par.visi3D); 
	        box.wh=wh
	        box._color=color 
	        //box._color1=color       
	        box.init();
	        box.dCont=new DCont(this.dCont);
	        box.pW=pW;
	        box.pH=pH;	       
	        box.dCont.div.appendChild(box.contHTML)
			this.array.push(box);

	    }
	    //this.plus(100, 1, 0, dcmParam.color1)	
	    this.plus(200, 0, 1, dcmParam.color)

/*

self.dContB.y=h-this.mvBox._wh//*s-25/s;

            this.mvBox.pz.y=self.dContB.y*s//-this.mvBox._wh/2
            this.mvBox.pz.x=self.dContB.x*s

            this.mvBox.pz.s=s


            rect=self.dContB.div.getBoundingClientRect();

            this.mvBox.pointZdvig.x=-this.mvBox._wh/2*(1-s);
            this.mvBox.pointZdvig.y=-this.mvBox._wh/2*(1-s); 



*/

	    //Маштабим окна 		
  		this.sizeWindow = function(w,h,s){			 			
  			for (var i = 0; i < this.array.length; i++) {
  				let box=this.array[i]
  				box.dCont.x=(w-box._wh)*box.pW;
	    		box.dCont.y=(h-box._wh)*box.pH;

	    		box.pz.y=box.dCont.y*s//-box._wh/2
            	box.pz.x=box.dCont.x*s
				
	    		box.pz.s=s;	

	    		box.pointZdvig.x=-box._wh/2*(1-s);
            	box.pointZdvig.y=-box._wh/2*(1-s); 

	    	}                    	
  		}



	    this.upDate = function () {
	    	for (var i = 0; i < this.array.length; i++) {
	    		this.array[i].upDate()	
	    	} 
		}
	}
}