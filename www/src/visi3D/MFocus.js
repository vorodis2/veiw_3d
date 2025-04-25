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

export default function MFocus (visi3D) {
	var self = this;

	this.visi3D = visi3D;

	this.box3 = new THREE.Box3();	// 3d bound
	this.rectScreen = new Rectangle();

	this.world = new Rectangle(0, 0, 1, 1); //

	this.targetObject = null; // если нужно по обекту подстраиватся THREE.Object3D || null тогда по arrPoint
	this.arrPoint = []; // точки 3d для расчета

	this.isMoveCam = false;
	this.isFromGeometry = false;// подстраивать по геометрии или по bounds

	this._offset = 0; // отступ границ
	this._active = true;
	this._debug = false;


	var offsetVector = new THREE.Vector2();
	var vec = new THREE.Vector2();
	var center3 = new THREE.Vector3();

	this.upDate = function () {
		if (!self.active) {
			return;
		}
		this.updateBound3d();
		if (self.box3.isEmpty()) return;
		// console.time('zumeVisi3D');
		this.visi3D.xVerh = center3.x;
		this.visi3D.zVerh = center3.z;
		this.visi3D.yVerh = -center3.y;
		self.zumeVisi3D();

		if (self.isMoveCam) {
			doZoom();
			var maxCountStep = 10;
			var countStep = 0;
			while ((offsetVector.length() > 2) && (++countStep < maxCountStep)) {
				this.visi3D.position3d.moveCamXY(offsetVector);
				doZoom();
			}
		}
		// console.timeEnd('zumeVisi3D');
		if (self.debugFocus) self.debugFocus.upDate();
	};
	function doZoom () {
		self.zumeVisi3D();
		offsetVector.set(self.world.x + self.world.width / 2, self.world.y + self.world.height / 2);
		vec.set(self.rectScreen.x + self.rectScreen.width / 2, self.rectScreen.y + self.rectScreen.height / 2);
		offsetVector.sub(vec).divideScalar(2);
	}

	this.zumeVisi3D = function () {
		var eps = 0.01;
		var low = 0;
		var high = 60000;

		var mid;
		var val;

		var maxCountStep = 20;
		var countStep = 0;

		while (low < high) { // ищем бинарным поиском

			if (++countStep > maxCountStep) break;

			mid = (low + high) / 2;
			val = mid;

			self.visi3D.zume = val;

			if (Math.abs(low - mid) < eps || Math.abs(high - mid) < eps || mid < eps) {
				break;
			} else {
				self.updateRectScreen();
				if (self.isZoomIn()) {
					high = mid;
				} else {
					low = mid + 1;
				}
			}
		}
	};

	// пересчет 3д бокса
	this.updateBound3d = function () {
		self.box3.makeEmpty();
		if (self.targetObject) {
			// console.time('bound')
			self.box3.copy(self.getCompoundBoundingBox(self.targetObject));
			// console.timeEnd('bound')
			// console.time('from')
			// self.box3.setFromObject(self.targetObject);
			// console.timeEnd('from')
		} else {
			for (var i = 0; i < self.arrPoint.length; i++) {
				self.box3.expandByPoint(self.arrPoint[i]);
			}
		}
		self.box3.getCenter(center3);
	};

	this.updateRectScreen = function () {

		this.visi3D.camera.updateMatrixWorld();
		this.visi3D.scene.updateMatrixWorld();

		if (self.targetObject && self.isFromGeometry) {
			var boxs = self.getBoxObject(self.targetObject);
			self.box3.copy(boxs.box3);
			self.box3.getCenter(center3);
			self.setRectFromBox(self.rectScreen, boxs.box2);
		} else {
			self.setRectFromBox(self.rectScreen, self.boxToScreen(self.box3));
		}
		self.updateWorldSize();
	};

	this.setRectFromBox = function (r, b2) {
		r.x = b2.min.x;
		r.y = b2.min.y;
		r.width = (b2.max.x - b2.min.x);
		r.height = (b2.max.y - b2.min.y);
	};

	this.getCompoundBoundingBox = (function () {
		var box3 = new THREE.Box3();
		var boundingBox = new THREE.Box3();
		function traverseBound (node) {
		
			var geometry = node.geometry;
			if (geometry === undefined) return;
			if (!geometry.boundingBox) geometry.computeBoundingBox();
			boundingBox.copy(geometry.boundingBox);
			boundingBox.applyMatrix4(node.matrixWorld);
			box3.union(boundingBox);
		}
		return function (object) {
			object.updateMatrixWorld(true);
			box3.makeEmpty();
			object.traverseVisible(traverseBound);
			return box3;
		};
	}());

	this.boxToScreen = (function () {
		var b2 = new THREE.Box2();
		var arrP = []; // крайние точки
		for (var i = 0; i < 8; i++) {
			arrP[i] = new THREE.Vector3();
		}
		return function boxToScreen (b3) {
			b2.makeEmpty();
			arrP[0].set(b3.min.x, b3.min.y, b3.min.z);
			arrP[1].set(b3.min.x, b3.max.y, b3.min.z);
			arrP[2].set(b3.max.x, b3.min.y, b3.min.z);
			arrP[3].set(b3.max.x, b3.max.y, b3.min.z);
			arrP[4].set(b3.min.x, b3.min.y, b3.max.z);
			arrP[5].set(b3.min.x, b3.max.y, b3.max.z);
			arrP[6].set(b3.max.x, b3.min.y, b3.max.z);
			arrP[7].set(b3.max.x, b3.max.y, b3.max.z);
			for (var i = 0; i < arrP.length; i++) {
				b2.expandByPoint(self.toScreenXY(arrP[i]));
			}
			return b2;
		};
	}());

	this.getBoxObject = (function () {
		var box2 = new THREE.Box2();
		var box3 = new THREE.Box3();
		var res = {box2: box2, box3: box3};
		var i, l;
		var v1 = new THREE.Vector3();
		function traverseGeom (node) {
			var geometry = node.geometry;
			if (geometry !== undefined) {
		
				if (geometry.isGeometry) {
					var vertices = geometry.vertices;
					for (i = 0, l = vertices.length; i < l; i++) {
						v1.copy(vertices[ i ]).applyMatrix4(node.matrixWorld);
						box3.expandByPoint(v1);
						box2.expandByPoint(self.toScreenXY(v1));
					}
				} else if (geometry.isBufferGeometry) {
					var attribute = geometry.attributes.position;
					if (attribute !== undefined) {
					
						for (i = 0, l = attribute.count; i < l; i++) {
							v1.fromBufferAttribute(attribute, i).applyMatrix4(node.matrixWorld);
							box3.expandByPoint(v1);
							box2.expandByPoint(self.toScreenXY(v1));
						}
					}
				}
			}
		}
		return function getBoxObject (object) {
			object.updateMatrixWorld(true);
			box2.makeEmpty();
			box3.makeEmpty();
			object.traverseVisible(traverseGeom);
		
			return res;
		};
	}());

	var vectorScreen = new THREE.Vector2();
	var vector3 = new THREE.Vector3();
	this.toScreenXY = function (v3) { // 3d world vector to screen
		vector3.copy(v3);
		vector3.project(self.visi3D.camera);
		vectorScreen.x = Math.round((vector3.x + 1) * self.visi3D._width / 2*1000)/1000;
		vectorScreen.y = Math.round((-vector3.y + 1) * self.visi3D._height / 2*1000)/1000;

		return vectorScreen;
	};

	this.updateWorldSize = function () {
		self.world.x = self.offset;
		self.world.y = self.offset;
		self.world.width = this.visi3D._width - self.offset * 2;
		self.world.height = this.visi3D._height - self.offset * 2;
	};

	this.isZoomIn = function () {
		return (self.rectScreen.x > self.world.x && self.rectScreen.x + self.rectScreen.width < self.world.x + self.world.width &&
			self.rectScreen.y > self.world.y && self.rectScreen.y + self.rectScreen.height < self.world.y + self.world.height);
	};

}

MFocus.prototype = {
	set offset (v) {
		this._offset = v || 0;
	},
	get offset () {
		return this._offset;
	},

	set debug (v) {
		this._debug = v;
		if (v && !this.debugFocus) {
			this.debugFocus = new MFocusDebug(this);
		}
		if (this.debugFocus) this.debugFocus.active = v;
	},
	get debug () {
		return this._debug;
	},

	set active (v) {
		this._active = v;
		if (!v) this.debug = false;
	},
	get active () {
		return this._active;
	}
};

function MFocusDebug (mFocus) {
	var self = this;
	this.mFocus = mFocus;
	var content3d = visi3D.scene;
	var content2d = main.stage;

	var boxHelper = new BoxHelper(1, materialAlphaRed);
	content3d.add(boxHelper);

	var graphics = new PIXI.Graphics();
	graphics.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
	content2d.addChild(graphics);
	self.active = false;
	boxHelper.visible = graphics.visible = self.active;
	this.upDate = function () {
		boxHelper.visible = graphics.visible = self.active;
		if (!self.active) return;
		graphics.clear();
		graphics.position.set(visi3D._x, visi3D._y);
		graphics.lineStyle(1, 0, 1);
		graphics.drawRect(mFocus.world.x, mFocus.world.y, mFocus.world.width, mFocus.world.height);
		graphics.lineStyle(1, 0xff0000, 1);
		graphics.drawRect(mFocus.rectScreen.x, mFocus.rectScreen.y, mFocus.rectScreen.width, mFocus.rectScreen.height);

		boxHelper.width = mFocus.box3.max.x - mFocus.box3.min.x;
		boxHelper.depth = mFocus.box3.max.y - mFocus.box3.min.y;
		boxHelper.height = mFocus.box3.max.z - mFocus.box3.min.z;
		mFocus.box3.getCenter(boxHelper.position);
	};

}



export function Rectangle (_x, _y, _width, _height, fun) {
	this._x = _x || 0;
	this._y = _y || 0;

	this._width = _width !== undefined ? _width : 100;
	this._height = _height !== undefined ? _height : 100;

	this.angel = 0;
	this.p = new Position();
	this.fun;


	this.set = function (_x, _y, _width, _height) {
		this._x = _x || 0;
		this._y = _y || 0;

		this._width = _width !== undefined ? _width : 100;
		this._height = _height !== undefined ? _height : 100;

		// if( this.fun) this.fun();
	};

	this.setRect = function (_r) {
		this._x = _r.x;
		this._y = _r.y;

		this._width = _r.width;
		this._height = _r.height;

		this.p.setPoint(_r.p);
		this.angel = _r.angel;
		// if( this.fun) this.fun();
	};
}
Rectangle.prototype = {
	set x (v) {
		if (this._x === v) return;
		this._x = v;
		// if( this.fun) this.fun();
	},
	get x () {
		return this._x;
	},

	set y (v) {
		if (this._y === v) return;
		this._y = v;
		// if( this.fun) this.fun();
	},
	get y () {
		return this._y;
	},

	set width (v) {
		if (this._width === v) return;
		this._width = v;
		// if( this.fun) this.fun();
	},
	get width () {
		return this._width;
	},

	set height (v) {
		if (this._height === v) return;
		this._height = v;
		// if( this.fun) this.fun();
	},
	get height () {
		return this._height;
	}


};

/**
 * Описывает точку.
 * @class
 * @param [_x=0] {number} кордината
 * @param [_y=0] {number} кордината
 * @param [_z=0] {number} кордината
 */
export  function Position (_x, _y, _z) {
	/** {number} кордината */
	this._x = _x || 0;
	/** {number} кордината */
	this._y = _y || 0;
	/** {number} кордината */
	this._z = _z || 0;

	this.xx=0;
	this.yy=0;	
	this.zz=0;
	/** Установка значений.
     * @param [_z=0] {number} _x - Центр первой окружности.
     * @param [_z=0] {number} _y - Центр первой окружности.
     * @param {number} _z - Центр первой окружности.
     */
	this.set = function (_x, _y, _z) {
		this._x = _x || 0;
		this._y = _y || 0;
		if (_z !== undefined) this._z = _z;
	};
	this.setPoint = function (p) {
		this._x = p.x;
		this._y = p.y;
		if (p.z !== undefined) this._z = p.z;
	};

	this.getObj = function () {
		var o = {};
		o.x = this._x;
		o.y = this._y;
		o.z = this._z;
		return o;
	};
	this.copy = function () {
		return new Position(this._x, this._y, this._z);
	};
}
Position.prototype = {
	set x (v) {
		// if(this._x==v)return;
		this._x = v;
	},
	get x () {
		return this._x;
	},

	set y (v) {
		// if(this._y==v)return;
		this._y = v;
	},
	get y () {
		return this._y;
	},
	set z (v) {
		// if(this._z==v)return;
		this._z = v;
	},
	get z () {
		return this._z;
	}
};