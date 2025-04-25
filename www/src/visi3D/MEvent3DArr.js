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



import MEventSob from './MEventSob.js';
import MEvent3D from './MEvent3D.js';

export default function MEvent3DArr (par, camera, contentHTML, stage) {
	this.parent = par;
	var self = this;
	this.camera = camera;
	this.raycaster = new THREE.Raycaster();
	this.raycaster.layers.enableAll();
	this.intersects;

	this.devas=par.devas;

	this.point = new THREE.Vector2(0, 0);
	this.pointWH = new THREE.Vector2(0, 0);
	this.arrChild = [];

	this.uuid = 'nullMy';
	this.obj3d;

	this.eventSob = new MEventSob();
	this.event3D = new MEvent3D();

	this.xzNull = 'xzNull';
	this.poiskName = 'xzPoisk';
	this.tokoName = 'null';

	this._activ = true;

	this.rect = {x: 0, y: 0, width: 100, height: 100};
	this.cont=undefined;
	this.div=undefined;

	this.setRect = function (x, y, w, h) {
		this.rect.x = x;
		this.rect.y = y;
		this.rect.width = w;
		this.rect.height = h;
	};

	var rez
	this.removeChild = function (child) {
		rez=null
		for (var i = 0; i < this.arrChild.length; i++) {
			if (child.uuid == this.arrChild[i].uuid) {
				rez=this.arrChild.splice(i, 1);
				i = i - 1;
				if (i < 0)i = 0;
			}
		}
		return rez;
	};

	this.addChild = function (child) {
		
		this.removeChild(child)
		this.arrChild.push(child);
	};

	var cameraPosition;
	this.boolNum = -1;
	this.boolNumOld = -1;
	this.event;

	

	this.mouseRay = function () {

		if (this._activ == false) return;
	
		this.rayPusk();
	
		this.boolNum = this.getGoodParam();
		
		if (this.boolNum == -1) {
			if (this.uuid != 'nullMy') {
				this.eventSob.dispatcherEvent('out', this.event3D);
				this.uuid = 'nullMy';
			}
		} else {

			if (this.uuid != 'nullMy') { // обьект есть


				if (this.uuid != this.intersects[this.boolNum].object.uuid) { // это новый обьект					
					this.eventSob.dispatcherEvent('out', this.event3D);
					this.uuid = this.intersects[this.boolNum].object.uuid;
					this.event3D.target = this.intersects[this.boolNum].object;
					this.event3D.face = this.intersects[this.boolNum].face;
					this.event3D.point = this.intersects[this.boolNum].point;
					this.event3D.faceIndex = this.intersects[this.boolNum].faceIndex;
					this.event3D.uv = this.intersects[this.boolNum].uv;
					this.event3D.originalEvent = self.event;
					this.event3D.objIntersects=this.intersects[this.boolNum]
					this.eventSob.dispatcherEvent('over', this.event3D);

					//return
				} else {
					
					this.event3D.face = this.intersects[this.boolNum].face;
					this.event3D.point = this.intersects[this.boolNum].point;
					this.event3D.faceIndex = this.intersects[this.boolNum].faceIndex;
					this.event3D.uv = this.intersects[this.boolNum].uv;
					this.event3D.originalEvent = self.event;
					this.event3D.objIntersects=this.intersects[this.boolNum]
					this.eventSob.dispatcherEvent('move', this.event3D);
					//return
				}
			} else {
			
				this.uuid = this.intersects[this.boolNum].object.uuid;
				
				this.event3D.target = this.intersects[this.boolNum].object;
				this.event3D.face = this.intersects[this.boolNum].face;
				this.event3D.point = this.intersects[this.boolNum].point;
				this.event3D.faceIndex = this.intersects[this.boolNum].faceIndex;
				this.event3D.uv = this.intersects[this.boolNum].uv;
				this.event3D.originalEvent = self.event;
				this.event3D.objIntersects=this.intersects[this.boolNum]
				this.eventSob.dispatcherEvent('over', this.event3D);
				//return
			}
		}
		//this.eventSob.dispatcherEvent('move', null);
		this.boolNumOld = this.boolNum;

	};

	this.getPosition = function (s) {
		var str = this.poiskName;

		if (s != undefined) {
			this.poiskName = s;
		} else {
			this.poiskName = 'xzPoisk';
		}

		this.restartPoint();

		this.rayPusk();


		this.poiskName = str;
		if (this.intersects.length != 0) {
			// var t =this.getGoodParam()
			var t = this.intersects.length - 1;
			if (t == -1)t = 0;
			return this.intersects[t];
		}

		return null;
	};

	var e3D = new MEvent3D();
	// Относительно имени возврощает евент
	this.getNameEvent = function (str) {
		this.restartPoint();
		this.rayPusk();

		if (this.intersects.length != 0) {
			for (var i = 0; i < this.intersects.length; i++) {
				if (this.intersects[i].object.parent != undefined) {
					if (this.intersects[i].object.name == str) {
						e3D.target = this.intersects[this.boolNum].object;
						e3D.face = this.intersects[this.boolNum].face;
						e3D.point = this.intersects[this.boolNum].point;
						e3D.faceIndex = this.intersects[this.boolNum].faceIndex;
						e3D.uv = this.intersects[this.boolNum].uv;
						e3D.originalEvent = self.event;
						return e3D;
					}
				}
			}
		}
		return null;
	};


	this.testVisiParam = function (_obj3d) {
		if (_obj3d.visible == false) return false;
		if(_obj3d.notEvent) return false;
		if (_obj3d.parent != undefined) {
			return this.testVisiParam(_obj3d.parent);
		} else {
			if (_obj3d.type == 'Scene') return true;
			else return false;
		}
		return true;
	};

	this.getGoodParam = function () {

		if (this.intersects.length != 0) {
			var i;

			for (i = 0; i < this.intersects.length; i++) {
				if (this.testVisiParam(this.intersects[i].object) != false) {
					if (this.intersects[i].object.notActiv != undefined) {
						this.intersects.splice(i, 1);
						i = 0;

					}
				}
			}

			if (this.intersects.length == 0) return -1;

			for (i = 0; i < this.intersects.length; i++) {
				if (this.testVisiParam(this.intersects[i].object) != false) {
					if (this.intersects[i].object.name == this.poiskName) {
						return i;
					}
				}
			}
			for (i = 0; i < this.intersects.length; i++) {
				if (this.testVisiParam(this.intersects[i].object) != false) {
					if (this.intersects[i].object.name != this.xzNull) {

						return i;
					}
				}
			}
		}
		return -1;
	};
	// пускаем лучь
	this.rayPusk = function () {
		
		cameraPosition = new THREE.Vector3();		
		cameraPosition.setFromMatrixPosition(this.camera.matrixWorld); // world position
		this.raycaster.ray.origin.copy(cameraPosition);
				
		this.raycaster.ray.direction.set(this.point.x, this.point.y, 0.5).unproject(this.camera).sub(cameraPosition).normalize();
		this.intersects = this.raycaster.intersectObjects(this.arrChild, true);
		
	
	};

	this.naCont = false;
	this.eMouseFunal
	this.mousemove = function (e, pV) {
		
		self.eMouseFunal=e
		if (self.devas==false)if (self.naCont == false) return;

		if (e.data != undefined)self.event = e.data.originalEvent;
		else self.event = e;
		
		if (self._activ == false) return;
			
		// self.event.preventDefault();

		self.restartPoint(e, pV);
		if(self.isFunNa("move", e)==true)return;
		self.mouseRay();
		
		if (self.intersects.length) {			
			if (self.devas==false)self.event.preventDefault();
		}
	};

	this.zdvigX = 0;
	this.scale = 1;
	this.pV = new THREE.Vector2(0, 0);
	var rect = {x:0,y:0}//e.target.getBoundingClientRect();
		


	this.restartPoint = function (e,pV) {
		if(e && e.target){
			rect = e.target.getBoundingClientRect();
		}

		
			
		if (self.devas==false) {
			self.pV.x = e.clientX;
			self.pV.y = e.clientY;
		}else{				
			self.pV.x = e.touches[0].clientX;
			self.pV.y = e.touches[0].clientY;
		}


		self.pV.x-=rect.x;
		self.pV.y-=rect.y;
		
		if(pV!=undefined){
			self.pV.x=pV.x;
			self.pV.y=pV.y;

			
		}




			
		
		this.korectPoint()
		
		
	};

	this.korectPoint = function () {
		if (self.isRect(self.pV) == true) {
			self.point.x = -((this.rect.x - self.pV.x) / this.rect.width) * 2 - 1;
			self.point.y = -(-((this.rect.y - self.pV.y) / this.rect.height) * 2 - 1);
		} else {
			if (self.point.x != 99999) {
				self.point.x = 99999;
			}
		}
	}

	this.isRect = function (point) {
		if ((point.x >= this.rect.x) && (point.x <= this.rect.x + this.rect.width)) {
			if ((point.y >= this.rect.y) && (point.y <= this.rect.y + this.rect.height)) {
				return true;
			}
		}
		return false;
	};

	this.mouseup = function (e) {
		if (e.data != undefined)self.event = e.data.originalEvent;		
		else self.event = e;

		
		if (!self.intersects)return

		if (self._activ == false) return;



		if (self.devas==false){	
			if (self.boolNumOld == -1) {
				self.event3D.target = null;
				self.event3D.originalEvent = self.event;
				self.eventSob.dispatcherEvent('up', self.event3D);
			} else {
				self.event3D.originalEvent = self.event;
				self.eventSob.dispatcherEvent('up', self.event3D);
			}
			if (self.intersects.length) {
				self.event.preventDefault();
			}
		}else{
			//self.restartPoint(e);
			self.mouseRay()
			if (self.boolNumOld == -1) {
				self.event3D.target = null;
				self.event3D.originalEvent = self.event;
				self.eventSob.dispatcherEvent('up', self.event3D);
			}else{
				self.event3D.originalEvent = self.event;			
				self.eventSob.dispatcherEvent('up', self.event3D);
				self.uuid = 'nullMy'
			}	
			
		}
		
		
	};

	this.mousedown = function (e,pV) {
		
		if (e.data != undefined)self.event = e.data.originalEvent;
		else self.event = e;
		
		self.restartPoint(e,pV);


		if(self.isFunNa("down", e)==true)return

	

		if (self._activ == false) return;
		
		if (self.devas==false){	
			if (self.boolNumOld == -1) {


				self.event3D.target = null;
				self.event3D.originalEvent = self.event;
				self.eventSob.dispatcherEvent('down', self.event3D);

			} else {
				self.event3D.originalEvent = self.event;
				self.eventSob.dispatcherEvent('down', self.event3D);
			}
			if (self.intersects.length) {
				self.event.preventDefault();
			}

		}else{
			self.mouseRay()	
			if (self.boolNumOld == -1) {
				self.event3D.target = null;
				self.event3D.originalEvent = self.event;

				self.eventSob.dispatcherEvent('down', self.event3D);
			}else{
					
				self.event3D.originalEvent = self.event;
				self.eventSob.dispatcherEvent('down', self.event3D);
			}			
		}

		
		
	};

	this.mouseout = function (e) {
		self.naCont = false;

		self.restartPoint(e);
		self.point.x = 99999;
		self.mouseRay();
	};
	this.mouseover = function (e) {
		self.naCont = true;
		self.restartPoint(e);
		self.mouseRay();
	};

	this.touchend = function (e) {
		
	}


	this.mousewheel = function (e) {
		if (e.data != undefined)self.event = e.data.originalEvent;
		else self.event = e;

		self.restartPoint(e);
		if (self._activ == false) return;
		if (self.boolNumOld == -1) {
			self.eventSob.dispatcherEvent('down', null);
		} else {
			self.event3D.originalEvent = self.event;
			self.eventSob.dispatcherEvent('wheel', e);
		}
	};


	this.addDragEvent = function (cont, div) {
		this.cont=cont;
		this.div=div;

		if (self.devas==false){
			
			window.addEventListener('mouseup', self.mouseup);
			div.addEventListener('mousedown', self.mousedown);
			div.addEventListener('mouseout', self.mouseout);
			div.addEventListener('mouseover', self.mouseover);
		}else{
			
			window.addEventListener('touchend', self.mouseup);
			div.addEventListener('touchstart', self.mousedown);					
		}
	};




	this.sizeWindow = function (_width, _height) {
		this.pointWH.x = _width;
		this.pointWH.y = _height;
	};

	//////////////////////////////

	this._aBool=false

	this.aFun=[]
	this.addFun= function (f) {
		this.removeFun(f)
		this.aFun.push(f)
	}

	this.removeFun= function (f) {
		for (var i = this.aFun.length - 1; i >= 0; i--) {
			if(this.aFun[i]===f){
				this.aFun.splice(i,1)
			}
		}
	}


	let iii, naBool
	this.isFunNa= function (s,e) {		
		naBool=false;
		if(this.aFun.length!==0){
			for (iii = 0; iii < this.aFun.length; iii++) {
				if(this.aFun[iii](s,e,self.pV)==true){					
					naBool= true;
					//break;
				}
			}
		}



	}


}

MEvent3DArr.prototype = {
	set activ (v) {
		if (this._activ == v) return;
		this._activ = v;
	},
	get activ () {
		return this._activ;
	},


/*	set aBool (v) {
		if (this._aBool == v) return;
		this._aBool = v;
		
		if(this._aBool){
			this.mouseout(this.eMouseFunal)
		}else{
			this.mouseover(this.eMouseFunal)

		}

		


	},
	get aBool () {
		return this._aBool;
	}*/

};


