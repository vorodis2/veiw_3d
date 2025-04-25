/***
Код свободный, и может быть использован в разных проектах как разработчиком так и другими программистами. Если юзаете диписуйте себя в шапку и мои контакты не удоляйте)))
Разработчик и владелец данного кода Сидоров Евгений vorodis2.
The code is free and can be used in different projects by both the developer and other programmers. If you use write yourself in a hat and do not delete my contacts)))
Developer and owner of this code Sidorov Evgeniy vorodis2.
contacts:
site: vorodis2
mail: vorodis2@gmail.com
skype: vorodis2
phone: +380951026557 
website: vorodis2.com
*/


export class MPositionScane {
	constructor(par) {
		this.type="MPositionScane";
		var self=this
		this.par = par;
		this._active=false;
		this._visiRaund = true;
		this.content3d=new THREE.Object3D()
		this.c3In = new THREE.Object3D();
		this.debag=true
		this.meshSphere=undefined
		this.init=function(){

			if(this.meshSphere!=undefined)return
			
			this.c3In0 = new THREE.Object3D();

			this.c3In.add(this.c3In0)	
			this.c3In1 = new THREE.Object3D();
			this.c3In0.add(this.c3In1)


			this.c3Norm = new THREE.Object3D();	
			this.content3d.add(this.c3Norm);

			this.c3Norm1 = new THREE.Object3D();	
			

			//this.c3Norm1.add(new THREE.AxesHelper(130));
			this.material=new THREE.MeshBasicMaterial( { color: 0xffffff , transparent:true, opacity:0.15} ); 
			this.meshSphere=new THREE.Mesh(new THREE.SphereGeometry(1,16,8),this.material)

			if(this._visiRaund)this.c3Norm1.add(this.meshSphere)


			this.c3Drag = new THREE.Object3D();
			this.c3In1.add(this.c3Drag)	


			this.c3Null = new THREE.Object3D();	
			this.c3Drag.add(this.c3Null)

			
			/*if(this.debag){				
				this.c3Norm.add(new THREE.AxesHelper(30));
				this.c3Drag.add(new THREE.AxesHelper(50));

				this.c3Null.add(new THREE.AxesHelper(100));



				this.par.par.gCGG.add(new THREE.AxesHelper(500));
				//this.gCGG.add(new THREE.AxesHelper(530));
			}*/
			this.doRender()
		}

		var point0=new THREE.Vector3()
		var point1=new THREE.Vector3()
		var point2=new THREE.Vector3()
		var point3=new THREE.Vector3()
		var point4=new THREE.Vector3()
		var point5=new THREE.Vector3()
		var pointNull=new THREE.Vector3()
		this.setV3d = function (rx, rz, s) {
			if(this._active==false)return
			//return			
			if(this.m3d){
				this.c3In0.rotation.z=this.par.par._rotationZ-rz
				this.c3In1.rotation.x=this.par.par._rotationX-rx
				point0.copy(this.m3d.point)
				this.c3Norm.getWorldPosition(point0)
				this.c3Drag.getWorldPosition(point1)
				point2.x=point0.x-point1.x;
				point2.y=point0.y-point1.y;
				point2.z=point0.z-point1.z;

				this.par.par.xVerh+=point2.x;
				this.par.par.yVerh-=point2.y;
				this.par.par.zVerh+=point2.z;			
			}			
		}



		this.arrPlusEvent=[]
		let intersects 
		var o3event={
			point:null,
			target:null,
			distance:0
		}
		this.dragRay = function (e) {
			if(this._active==false)return
			this.m3d=null	

			if(e){
				this.par.par.event3DArr.restartPoint(e)
			}
			this.par.par.event3DArr.rayPusk()
			this.boolNum=0
			this.boolNum = this.par.par.event3DArr.getGoodParam();	
			
			

			if(this.par.par.event3DArr.intersects[this.boolNum]){
				if(this.par.par.event3DArr.intersects[this.boolNum].object){
					this.dragRayE3d(this.par.par.event3DArr.intersects[this.boolNum])
					return
				}
			}

			if(this.arrPlusEvent.length!=0){
				intersects = this.par.par.event3DArr.raycaster.intersectObjects(this.arrPlusEvent, true);				
				if(intersects[0]){
					this.dragRayE3d(intersects[0])
				}
			}
		}

		var poz0=new THREE.Vector3()	
		var qwant0=new THREE.Quaternion()		
		this.m3d
		this.dragRayE3d = function (m3d) {			
			
			this.m3d=m3d;

			if(!this.m3d){
				return
			}
	
			this.c3Norm.position.copy(this.m3d.point)
			this.c3Norm1.position.copy(this.m3d.point)
			scale=this.m3d.distance/this.skalP
			self.meshSphere.scale.set(scale,scale,scale)					
			this.dee()

		}
		this.dee = function (m3d) {
			poz0.set(
				this.m3d.point.x-this.par.par.xVerh,
				this.m3d.point.z-this.par.par.zVerh,
				-this.m3d.point.y-this.par.par.yVerh
			)
			qwant0.copy(this.c3In0.quaternion);
			qwant0.invert();
			poz0.applyQuaternion(qwant0);
			qwant0.copy(this.c3In1.quaternion);
			qwant0.invert();
			poz0.applyQuaternion(qwant0);
			this.c3Drag.position.copy(poz0)
		}


		this.setZoom = function (na) {

			if(this._active==false)return false;
			
			this.dragRay()
			if(!this.m3d)return false;

			
			//this.m3d.distance

			


			this.dee1();
			this.dragRay();

			this.zumNEW(na)

			this.startMause();

			//trace("=================",this.par.par.zume,this.m3d.distance,this.m3d )
			return true;
		}

		this.skalP=300
		var dist, pros,scale
		this.dee1 = function (m3d) {

			dist = this.m3d.distance - this.par.par.zume
			scale=this.m3d.distance/this.skalP
			this.meshSphere.scale.set(scale,scale,scale)
		
			
			this.zumP(dist)


		}

		this.zumP = function (p) {

			this.par.par.ggCam.getWorldPosition(point0)
			this.par.par.zume+=p
			this.par.par.ggCam.getWorldPosition(point1)		
			point2.x=point0.x-point1.x;
			point2.y=point0.y-point1.y;
			point2.z=point0.z-point1.z;	

			self.par.par.xVerh+=point2.x;
			self.par.par.yVerh-=point2.y;
			self.par.par.zVerh+=point2.z;
		}

		var oT={nnn:0, zumeOld:0, zume:0}
		this.tween2 = new TWEEN.Tween(oT);
		this.tween2.onUpdate(function(){
	        self.par.par.xVerh = point5.x*(1-oT.nnn) + point4.x*(oT.nnn)
	        self.par.par.yVerh = point5.y*(1-oT.nnn) + point4.y*(oT.nnn)	
	        self.par.par.zVerh = point5.z*(1-oT.nnn) + point4.z*(oT.nnn)	
	        self.par.par.zume =	oT.zumeOld * (1-oT.nnn)+  oT.zume * (oT.nnn)

	        scale=self.par.par.zume/200
			self.meshSphere.scale.set(scale,scale,scale)
	    })
	    this.tween2.onComplete(function(){
	    	self.stopMause();
	    })
	    this.tween2.easing( TWEEN.Easing.Quintic.Out )

		this.zumNEW = function (delta) {
			var www = self.par.par._zume + (delta) * (self.par.powerZum/100)*self.par.par._zume;
			if (www < self.par.minZum) www = self.par.minZum;
			if (www > self.par.maxZum) www = self.par.maxZum;

		
			oT.zumeOld=self.par.par.zume;
			this.c3Norm.getWorldPosition(point0)


			let oZ=self.par.par.zume/www;

			this.c3Norm.position.x/=oZ;
			this.c3Norm.position.y/=oZ;
			this.c3Norm.position.z/=oZ;

			self.par.par.zume=www;
			oT.zume=www;
			this.c3Norm.getWorldPosition(point1)
		
			point2.x=point0.x-point1.x;
			point2.y=point0.y-point1.y;
			point2.z=point0.z-point1.z;
			self.par.par.zume=oT.zumeOld;
			/*self.par.par.xVerh=self.par.par.xVerh/oZ+point2.x;
			self.par.par.yVerh=self.par.par.yVerh/oZ-point2.y;
			self.par.par.zVerh=self.par.par.zVerh/oZ+point2.z;*/

			point4.x=self.par.par.xVerh/oZ+point2.x;
			point4.y=self.par.par.yVerh/oZ-point2.y;
			point4.z=self.par.par.zVerh/oZ+point2.z;

			/*self.par.par.xVerh = point4.x
	        self.par.par.yVerh = point4.y
	        self.par.par.zVerh = point4.z*/

	       
			point5.set(
				self.par.par.xVerh,
				self.par.par.yVerh,
				self.par.par.zVerh
				)





			self.tween2.stop()
			oT.nnn=0
			self.tween2.to({nnn:1},self.par.pTime).start();/**/
		}

		this.stopAmimat = function () {
			if(this._active==false)return;
			self.tween2.stop();

		}

		this.stopMause = function () {
			if(this._active==false)return;	
			if(this.c3Norm1.parent!==undefined)this.content3d.remove(this.c3Norm1);
		}

		this.startMause = function () {
			if(this._active==false)return;		
			if(this.c3Norm1.parent==undefined)this.content3d.add(this.c3Norm1);
		}





		this.doRender = function () {
			if(this._active==false)return;
			this.c3In0.rotation.z=this.par.par._rotationZ
			this.c3In1.rotation.x=this.par.par._rotationX
		}


	}	


    set active(v) {        
        if(this._active!==v){ 
            this._active=v; 

           	if(this._active==true){
           		this.par.par.scene.add(this.content3d)
           		this.par.par.gCGG.add(this.c3In)
           		this.init()
           	}else{
           		this.par.par.scene.remove(this.content3d)
           		this.par.par.gCGG.remove(this.c3In)
           	}
        }       
    }   
    get active() { return  this._active;}


    set visiRaund(v) {        
        if(this._visiRaund!==v){ 
            this._visiRaund=v;           
           	if(this.meshSphere==undefined)return           	
            if(this._visiRaund==true){
            	this.c3Norm1.add(this.meshSphere)
            }else{
            	this.c3Norm1.remove(this.meshSphere)
            }

           	
        }       
    }   
    get visiRaund() { return  this._visiRaund;}




}
