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


import MSky from './MSky.js';
import MSmc from './MSmc.js';
import MFocus from './MFocus.js';

export default function MUtility (_parent) {
	var self = this;
	this.par =_parent
	this.parent = _parent;

	this._debug = false;

	this.debugInit = false;
	this.shadowHelper = undefined;
	this.spotLightHelper = undefined;
	this.gridHelper = undefined;

	this.FIXATION = false;
	this.ROTATION_X = 0;
	this.ROTATION_Z = 0;
	this.DISTANCE = this.parent.DISTANCE;
	this.CUB_HEIGHT = this.parent.CUB_HEIGHT;
	this.CUB_WIDTH = this.parent.CUB_WIDTH;
	this.SKY_X = 0;
	this.SKY_Y = 0;
	this.SKY_Z = 0;

	this._fixation = this.FIXATION;
	this._rotationX = this.ROTATION_X;
	this._rotationZ = this.ROTATION_Z;
	this._distance = this.DISTANCE;
	this._cubHeight = this.CUB_HEIGHT;
	this._cubWidth = this.CUB_WIDTH;

	// задний фон
	this.sky = new MSky(this);
	this.smc = new MSmc(this);
	this.focus = new MFocus(this.parent);

	this.funDebug = function () {

		if (this.debugInit != true) {
			this.debugInit = true;
			this.plane = new THREE.Mesh(
				new THREE.PlaneGeometry(1000, 1000).rotateX(-Math.PI), 
				new THREE.MeshPhongMaterial({color: 0xacacac,transparent:true,opacity:0.5})
			);
			this.plane.castShadow = this.plane.receiveShadow = true;
			this.plane.position.z=2
			this.plane.renderOrder=1;

			
		
			this.gridHelper = new THREE.GridHelper(100, 10);
			this.gridHelper.rotation.x = -Math.PI / 2;

			let ax=new THREE.AxesHelper(50)
			ax.position.y=0.0051
			this.gridHelper.add(ax)


			this.shadowHelper = new THREE.CameraHelper(this.parent.sunLight.shadow.camera);
			if (this.parent.sunLight) this.spotLightHelper = new THREE.DirectionalLightHelper(this.parent.sunLight);
		}

		if (this._debug == true) {

			if (this.gridHelper.parent == null) this.parent.groupObject.add(this.gridHelper);
			if (this.plane.parent == null) this.parent.groupObject.add(this.plane);
			if (this.shadowHelper.parent == null) this.parent.scene.add(this.shadowHelper);


			if (this.parent.sunLight) {
				if (this.parent.sunLight.parent != null) {

				} else {
					if (this.spotLightHelper.parent != null) this.parent.scene.remove(this.spotLightHelper);
					if (this.shadowHelper.parent != null) this.parent.scene.remove(this.shadowHelper);
				}
			}
		} else {

			if (this.gridHelper.parent != null) this.parent.groupObject.remove(this.gridHelper);
			if (this.plane.parent != null) this.parent.groupObject.remove(this.plane);
			if (this.shadowHelper.parent != null) this.parent.scene.remove(this.shadowHelper);
			if (this.parent.sunLight) {
				if (this.spotLightHelper.parent != null) this.parent.scene.remove(this.spotLightHelper);
			}
		}

	};

	this.render = function () {
		if (this._debug == true) {
			if (this.spotLightHelper != undefined) this.spotLightHelper.update();
		}
		this.smc.render();
		this.sky.render();
		this.focus.upDate();
		this.dragSunLight();
	};


	var d = 0;
	this.dragSunLight = function () {
		if (this.parent.sunLight == undefined) return;
		if (this.parent.sunLight.parent == null) return;

		if (self._fixation === true) {
			d = this._distance + this._cubHeight * 2;
			self.parent.sunLight.position.set(0, d, 0);// занулили
			self.parent.sunLight.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), self._rotationX);
			self.parent.sunLight.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), self._rotationZ - self.parent._rotationZ);
		} else {
			d = this._distance + this._cubHeight;
			this.parent.sunLight.position.set(0, d, 0);// занулили
			this.parent.sunLight.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), this._rotationX);
			this.parent.sunLight.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), this._rotationZ);

			if (this.parent.staticShadow) {
				moveSunToCam();
			}
		}
	};

	var shadowPrintPos = new THREE.Vector3();
	this.distanceUpdateShadow = 500; // на каком растоянии будет постоянно обновляться тень
	function moveSunToCam () {

		var camPos = new THREE.Vector3(self.parent.xVerh, self.parent.yVerh, self.parent.zVerh);
		self.parent.sunLight.position.add(camPos);
		self.parent.sunLight.target.position.copy(camPos);

		if (shadowPrintPos.distanceTo(camPos) > self.distanceUpdateShadow) {
			shadowPrintPos.copy(camPos);
			self.parent.shadowNeedsUpdate = true;
		}
	}

	this.dragSunLight2 = function () {
		if (this.parent.sunLight == undefined) return;
		if (this.parent.sunLight.parent == null) return;
		if (this._fixation === true) {
		} else {
			d = this._distance + this._cubHeight * 2;
			this.parent.sunLight.position.set(0, d, 0);// занулили
			this.parent.sunLight.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), this._rotationX);
			this.parent.sunLight.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), this._rotationZ);
		}
	};

	this.dragSunLight3 = function () {
		if (this.parent.sunLight) {
			this.parent.sunLight.shadow.camera.near	= 0 + this._cubHeight;// this._distance;
			this.parent.sunLight.shadow.camera.far = this._cubHeight * 2 + this._cubHeight; // +this._distance ;
			this.parent.sunLight.shadow.camera.updateProjectionMatrix();
			if (this.shadowHelper) this.shadowHelper.update();

		}
	};

	this.sunActiv=function(value){
		this.parent.objShadow(this.parent.group, value);
		if (value == true) {
			if (this.parent.sunLight.parent == undefined){
				this.parent.scene.add(this.parent.sunLight);
				this.parent.scene.add(self.parent.sunLight.target)
			}
		} else {
			if (this.parent.sunLight.parent != undefined){
				this.parent.scene.remove(this.parent.sunLight);
				this.parent.scene.remove(self.parent.sunLight.target)
			}
		}
		this.funDebug();
	}
	this.ambientActiv=function(value){
		if (value == true) {
			if (this.parent.ambientLight.parent == undefined)this.parent.scene.add(this.parent.ambientLight);
		} else {
			if (this.parent.ambientLight.parent != undefined)this.parent.scene.remove(this.parent.ambientLight);
		}
	}



	var zz,zz1,zz2,zz3,zz4,zz3_, zz4_, zz5
	var pont={x:0,y:0}
	this.korektZ=function(value){
		zz=this.parent._rotationZ%(Math.PI*2)+(Math.PI*2)*2;//поворот камеры вставленый в границы
		zz1=value%(Math.PI*2)+(Math.PI*2)*2;
		if(Math.abs(zz1-zz)>Math.PI){			
			zz1+=(Math.PI*2)
			if(Math.abs(zz1-zz)>Math.PI){				
				zz1-=(Math.PI*2)
				zz+=(Math.PI*2)
			}

		}
		

	
		pont.x=zz;
		pont.y=zz1;
		return pont
	}


	/**/


	/*var zz,zz1,zz2,zz3,zz4,zz3_, zz4_, zz5
	var pont={x:0,y:0}
	var d,d1,is

	var ap=[]
	this.korektZ=function(value){
		d=99999
		is=0
		zz=0
		ap[0]=this.parent._rotationZ%(Math.PI*2);//поворот камеры вставленый в границы
		ap[1]=zz-(Math.PI*2);
		ap[2]=zz+(Math.PI*2);
		ap[1]=zz-(Math.PI*2)*2;
		ap[2]=zz+(Math.PI*2)*2;


		zz1=value%(Math.PI*2);//то куда нужно	
		for (var i = 0; i < ap.length; i++) {
			d1=Math.abs(ap[i]-zz1)
			if(d<d1){
				d=d1
				is=i
			}
		}
		zz=ap[is]

		pont.x=zz;
		pont.y=zz1;


		return pont
	}*/

	function hh(a){
		return Math.round(180/Math.PI*a)
	}
		
	


}

MUtility.prototype = {
	set debug (v) {

		if (this._debug === v) return;
		console.warn("vvvvvvvvvvvvvvvvvv",v)
		this._debug = v;
		this.funDebug();
	},
	get debug () {
		return this._debug;
	},

	set rotationX (v) {
		if (this._rotationX === v) return;
		this._rotationX = v;
		if (this.spotLightHelper != undefined) {
			this.parent.sunLight.shadow.camera.updateProjectionMatrix();
			this.spotLightHelper.update();
		}
		this.dragSunLight2();
	},
	get rotationX () {
		return this._rotationX;
	},

	set rotationZ (v) {
		if (this._rotationZ === v) return;
		this._rotationZ = v;
		this.sky.shadRotZ = v;
		if (this.spotLightHelper != undefined) this.spotLightHelper.update();
		this.dragSunLight2();
	},
	get rotationZ () {
		return this._rotationZ;
	},

	set fixation (v) {
		if (this._fixation === v) return;
		this._fixation = v;
		this.dragSunLight2();
	},
	get fixation () {
		return this._fixation;
	},

	set distance (v) {
		if (this._distance === v) return;
		this._distance = v;
		this.dragSunLight3();
		this.dragSunLight2();
	},
	get distance () {
		return this._distance;
	},

	set cubHeight (v) {
		if (this._cubHeight === v) return;
		this._cubHeight = v;

		this.dragSunLight3();
		this.dragSunLight2();
	},
	get cubHeight () {
		return this._cubHeight;
	},


	set cubWidth (v) {
		if (this._cubWidth === v) return;
		this._cubWidth = v;

		if (this.parent.sunLight) {
			this.parent.sunLight.shadow.camera.right = this._cubWidth;
			this.parent.sunLight.shadow.camera.left = -this._cubWidth;
			this.parent.sunLight.shadow.camera.top	= this._cubWidth;
			this.parent.sunLight.shadow.camera.bottom = -this._cubWidth;
			this.parent.sunLight.shadow.camera.updateProjectionMatrix();
			if (this.shadowHelper) this.shadowHelper.update();
		}
	},
	get cubWidth () {
		return this._cubWidth;
	}
};
