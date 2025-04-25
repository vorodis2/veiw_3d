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




export default function MPosition3d (_parent, _content2d, _div) {
	var self = this;

	this.parent = _parent;
	this.content2d = _content2d;
	this.drag = true;
	this.zdvigX = 0;
	this.sPixi = undefined;
	this.div=_div

	this.devas=_parent.devas;

	this.pause = false;
	this.minMaxX = new THREE.Vector2(0, 2.5);

	this.zume = new THREE.Vector3(1, 30, 10);

	this.point = new THREE.Vector2(0, 0);
	this.point1 = new THREE.Vector2(0, 0);
	this.b = 0;

	this.minZum = 0;
	this.maxZum = 5000;
	this.powerZum = 50;
	//setTimeout(function() {self.powerZum=0.2}, 1000);
	this.distMinMaxBox = 150000000;

	this.boolDrahXZ=true
	this.boolMouseRight=true

	this.isDragPan = _parent._isDragPan;
	this.isRotateScene = false;

	var sceneRotationY = 0;
	this.isIE=false
	if (navigator.userAgent.indexOf('MSIE') !== -1 ||navigator.appVersion.indexOf('Trident/') > 0) {
		this.isIE=true
	}


	this.getStage = function (c) {
		if (c.parent == undefined) return c;
		else return this.getStage(c.parent);
		return null;
	};
	this.pppW=0.2
	this.ppp=0.5
	this.pTime=500
	this.tween1 = new TWEEN.Tween(self.parent);
	this.tween1.onUpdate(function(){
        self.parent.intRend = 1;            
    })
    this.tween1.easing( TWEEN.Easing.Quintic.Out )

    this.tween2 = new TWEEN.Tween(self.parent);
	this.tween2.onUpdate(function(){
        self.parent.intRend = 1;            
    })
    this.tween2.easing( TWEEN.Easing.Quintic.Out )

    

	this.stageMoveNew = function (e) {
		
		
		if(self.boolDrag==false)return
		if (self.pause == true) return;
		if (self.drag == false) return;
		
		//if(self.boolMouseRight==false )
		if(e && e.buttons && e.buttons==2 && self.boolMouseRight==false)return
		

		if (e && self.isDragPan && isMovePan) {
			handleMouseMovePan(e);
			return;
		}
		if(e.touches==undefined){
			if (self.isRotateScene && e.data.originalEvent.shiftKey) {
				self.parent.scene.rotation.y = sceneRotationY + (e.clientX - self.point1.x) * 0.01;
				self.parent.intRend = 1;
				self.parent.num_drag = 1;
			} else {
				
				if(self.boolDrahXZ){
					
					
					//if (self.minMaxX.x > self.parent.rotationX) self.parent.rotationX = self.minMaxX.x;
					//if (self.minMaxX.y < self.parent.rotationX) self.parent.rotationX = self.minMaxX.y;
					
					var xx=self.point.y - (e.clientY - self.point1.y) * 0.01;
					var yy=self.point.x + (e.clientX - self.point1.x) * 0.01;

					if (self.minMaxX.x > xx) xx = self.minMaxX.x;
					if (self.minMaxX.y < xx) xx = self.minMaxX.y;

					
					//self.parent.rotationX=self.parent.rotationX+(xx-self.parent.rotationX)*self.ppp					
					//self.parent.rotationZ=self.parent.rotationZ+(yy-self.parent.rotationZ)*self.ppp
					
					//self.tween1.stop()
					//self.tween1.to({rotationX:xx,rotationZ:yy},self.pTime).start(); 
					self.parent.rotationX=xx;				
					self.parent.rotationZ=yy;
					self.parent.num_drag = 1;
				}				
			}
		}else{
			if(e.touches.length==1){

				if(self.boolDrahXZ){
					
					if (self.minMaxX.x > self.parent.rotationX) self.parent.rotationX = self.minMaxX.x;
					if (self.minMaxX.y < self.parent.rotationX) self.parent.rotationX = self.minMaxX.y;

					var xx=self.point.y - (e.touches[0].clientY - self.point1.y) * 0.01;
					var yy=self.point.x + (e.touches[0].clientX - self.point1.x) * 0.01;

					//self.parent.rotationX = self.point.y - (e.touches[0].clientY - self.point1.y) * 0.01;
					//self.parent.rotationZ = self.point.x + (e.touches[0].clientX - self.point1.x) * 0.01;

					//self.parent.rotationX=self.parent.rotationX+(xx-self.parent.rotationX)*self.ppp					
					//self.parent.rotationZ=self.parent.rotationZ+(yy-self.parent.rotationZ)*self.ppp
					//self.tween1.stop()
					if (self.minMaxX.x > xx) xx = self.minMaxX.x;
					if (self.minMaxX.y < xx) xx = self.minMaxX.y;
					self.parent.rotationX=xx;				
					self.parent.rotationZ=yy;
					//self.tween1.to({rotationX:xx,rotationZ:yy},self.pTime).start(); 
				} 
				
				
			}else{
				if(e.touches.length>=2){
					self.pT.x=e.touches[0].clientX
					self.pT.y=e.touches[0].clientY

					self.pT1.x=e.touches[1].clientX
					self.pT1.y=e.touches[1].clientY

					


					if(self.distTach==0){
						self.distTach=calc.getDistance(self.pT,self.pT1)
						sahDist=0;
						panStart.set(Math.round(self.pT.x*1), Math.round(self.pT.y*1));
						
					}else{
						nnnDist=calc.getDistance(self.pT, self.pT1)
						sahDist=nnnDist-self.distTach
						self.distTach=nnnDist
					}

					
					
					www = self.parent._zume - sahDist*(self.parent._zume/100);
					self.zumNEW(www)
					handleMouseMovePan(null, Math.round(self.pT.x*1), Math.round(self.pT.y*1))					

				}
			}


		}
			
			
		
		

		
	};
	this.pT = new THREE.Vector2(0, 0);
	this.pT1 = new THREE.Vector2(0, 0);
	var sahDist=0
	var nnnDist=0

	this.boolDrag=false
	this.stageUpNew = function (e) {
		self.boolDrag=false
	
		if (self.devas==false) {
			window.removeEventListener('mouseup', self.stageUpNew);				
		}else{
			self.distTach=0				
			window.removeEventListener('touchend', self.stageUpNew);			
		}
		
	};

	this.mouseUpp = function (e) {
		self.parent.intRend = 1;
	};



	var isMovePan = false;
	this.distTach=0
	this.mouseDown = function (e) {
		
		if (self.pause == true) return;
		if (self.drag == false) return;
		if(e && e.buttons && e.buttons==2 && self.boolMouseRight==false)return
		
		isMovePan = false;
		self.boolDrag=true

		//e.preventDefault();
		//e.stopPropagation();
		
		self.distTach=0;
		
		self.point.y = self.parent.rotationX;
		self.point.x = self.parent.rotationZ;
		if (self.isRotateScene) {
			sceneRotationY = self.parent.scene.rotation.y;
		}

	
			
		if (self.isDragPan && e && (e.button === 1 || e.button === 2)) {
			isMovePan = true;				
			handleMouseDownPan(e);
		}
		

		if (self.devas==false) {
			self.point1.x = e.clientX;
			self.point1.y = e.clientY;
			window.addEventListener('mouseup', self.stageUpNew);				
		}else{				
			self.point1.x = e.touches[0].clientX;
			self.point1.y = e.touches[0].clientY;
			window.addEventListener('touchend', self.stageUpNew);			
		}
		
	};

	// self.sPixi.on('mousedown', self.mouseDown);
	// main.contentCurs.addEventListener( 'mousedown', this.mouseDown); /// TODO убрал это
	// contentHTML.addEventListener('mousedown',    this.mouseDown, true);

	// self.parent.parent.parent.stage.addEventListener( 'mousedown', this.mouseDown);
	this.dragscrol=undefined;
	var www;
	this.mousewheel = function (e) {
	
		if (self.drag == false) return;	
		var delta=1;
		var p=e.delta
		if(e.wheelDelta==undefined){
			p=e.wheelDelta
		}

		if(e.delta)if(e.delta<0)delta=1;
		if(e.deltaY)if(e.deltaY<0)delta=1;
		if(e.detail)if(e.detail<0)delta=1;

		
		if(e.wheelDelta!=undefined){
			if(e.wheelDelta>0)delta=-1;
			else delta=1;
		}
		//delta*=-1

		www = self.parent._zume + (delta) * (self.powerZum/100)*self.parent._zume;
		self.zumNEW(www)
		
		if(self.dragscrol)self.dragscrol(e)

	};

	this.zumNEW = function (www) {
		if (www < self.minZum) www = self.minZum;
		if (www > self.maxZum) www = self.maxZum;

		var xx=www;

		
		self.parent.zume=self.parent.zume+(xx-self.parent.zume)*self.pppW					

		self.tween2.stop()
		self.tween2.to({zume:xx},self.pTime).start(); 


		//self.parent.zume = www;
		self.parent.intRend = 1;
		
	}


	
	
	if (self.devas==false) {
		_div.addEventListener('mousedown', this.mouseDown);	
		var v="mousewheel";
		//DOMMouseScroll
		//if()		
		_div.addEventListener("mousewheel", this.mousewheel,  { passive: true});
		_div.addEventListener("DOMMouseScroll", this.mousewheel,  { passive: true});
		
	} else {
		_div.addEventListener('touchstart', this.mouseDown, { passive: false, capture: true });						
	}



	


	var panOffset = new THREE.Vector3();
	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();

	function handleMouseDownPan (event) {
		
		panStart.set(event.clientX, event.clientY);
	}

	function handleMouseMovePan (event, _x, _y) {

		if(event!=null)panEnd.set(event.clientX, event.clientY);
		else panEnd.set(_x, _y);
		


		panDelta.subVectors(panEnd, panStart);
		self.moveCamXY(panDelta);
		panStart.copy(panEnd);
	}
	var panLeft = (function () {
		var v = new THREE.Vector3();
		return function panLeft (distance, objectMatrix) {
			v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
			v.multiplyScalar(-distance);
			panOffset.add(v);
		};
	}());

	var panUp = (function () {
		var v = new THREE.Vector3();
		return function panUp (distance, objectMatrix) {
			v.setFromMatrixColumn(objectMatrix, 1); // get Y column of objectMatrix
			v.multiplyScalar(distance);
			panOffset.add(v);
		};
	}());
	var pan = (function () {
		return function pan (deltaX, deltaY) {

			var element = self.parent.renderer.domElement;
			if (self.parent.camera.isPerspectiveCamera) {
				var targetDistance = Math.max(self.parent.zume, 1);
				targetDistance *= Math.tan((self.parent.camera.fov / 2) * Math.PI / 180.0);
				// we actually don't use screenWidth, since perspective camera is fixed to screen height
				panLeft(2 * deltaX * targetDistance / element.clientHeight, self.parent.camera.matrixWorld);
				panUp(2 * deltaY * targetDistance / element.clientHeight, self.parent.camera.matrixWorld);
			} else {
				console.warn('WARNING: camera neither perspective.');
			}
		};
	}());

	this.moveCamXY = function (v) {
		panOffset.set(0, 0, 0);
		self.parent.camera.updateMatrixWorld();
		self.parent.scene.updateMatrixWorld();
		if (arguments.length > 1) {
			v = {
				x: arguments[0],
				y: arguments[1]
			};
		}
		pan((v.x || 0), (v.y || 0));

		

		self.parent.xVerh += panOffset.x;
		self.parent.yVerh += -panOffset.y;
		self.parent.zVerh += panOffset.z;
		
		self.parent.xVerh = Math.max(Math.min(self.parent.xVerh, self.distMinMaxBox), -self.distMinMaxBox);
		self.parent.zVerh = Math.max(Math.min(self.parent.zVerh, self.distMinMaxBox), -self.distMinMaxBox);
		self.parent.yVerh = Math.max(Math.min(self.parent.yVerh, self.distMinMaxBox), -self.distMinMaxBox);
		panOffset.set(0, 0, 0);
	};

	

}
