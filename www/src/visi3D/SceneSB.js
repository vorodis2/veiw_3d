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



export function SceneSB (_visi3D) {
	this.type = 'SceneSB';
	this.visi3D=_visi3D
	
	var self = this;
	this.array = [];
	this.object = undefined;	
	this.array.push(new SceneBox2('ambient',_visi3D));
	this.array.push(new SceneBox1('shadow',_visi3D));
	////this.array.push(new SceneBox4('smcShadow',_visi3D));
	//this.array.push(new SceneBox3('sky',_visi3D));
	//this.array.push(new SceneBox5('mirror',_visi3D));
	this.array.push(new SceneBox6('visi3D',_visi3D));


	this.array.push(new SceneBox10('positBox',_visi3D));	
	//this.array.push(new SceneBox7('effect',_visi3D));
	//this.array.push(new SceneBox8('paramVR',_visi3D));

	this.array.push(new SceneBox9('fog',_visi3D));



	this.setObj = function (_o) {
		this.object = _o;
		
		for (var i = 0; i < this.array.length; i++) {
			if (this.object[this.array[i].name] === undefined) {
				this.object[this.array[i].name] = {};
			}
			this.array[i].setBasa(this.object[this.array[i].name]);
		}
		visi3D.shadowNeedsUpdate = true;
	};
}


function SceneBox (_name,visi3D) {
	this.type = 'SceneBox';
	var self = this;
	this.name = _name;
	this.array = [];
	this.object = null;
	this.objArray = {};

	this.plus = function (_obj, param) {
		this.array.push(new SceneGron(_obj, param));
		this.objArray[_obj.param] = this.array[this.array.length - 1];
	};

	this.setValue = function (_key, _param, _drag) {
		if (_drag == undefined) this.object[_key] = _param;
		else {
			this.drahKeyParam(_key, _param);
		}
	};

	this.drahKey = function (_key) {
		

		if (this.objArray['works'] != undefined) {
			if (this.object['works'] == false) {
				if(_key=="active")if(this.objArray["active"].param){
					this.objArray["active"].param(this.object["active"]);
					visi3D.intRend = 1;
				} 

				return;
			}
		}

		if (this.objArray[_key] != undefined) {
			if (this.objArray[_key].tipP == 1) { // се=тер гетер
				if (typeof this.objArray[_key].param[_key] === 'object') { // Бля это обьект хер разбереш каой он)))
					this.objArray[_key].param[_key] = this.object[_key];
				} else {
					if (this.objArray[_key].param[_key] != this.object[_key]) { // заглуха на одиновый числа
						this.objArray[_key].param[_key] = this.object[_key];
					}
				}
			}
			if (this.objArray[_key].tipP == 2) { // тута функция в нее переменую
				this.objArray[_key].param(this.object[_key]);
			}
		}
		visi3D.intRend = 1;
	};

	this.drahKeyParam = function (_key, _param) {
		if (this.objArray[_key] != undefined) {
			if (this.objArray[_key].tipP == 1) { // се=тер гетер
				if (typeof this.objArray[_key].param[_key] === 'object') { // Бля это обьект хер разбереш каой он)))
					this.objArray[_key].param[_key] = _param;
				} else {
					if (this.objArray[_key].param[_key] != _param) { // заглуха на одиновый числа
						this.objArray[_key].param[_key] = _param;
					}
				}
			}
			if (this.objArray[_key].tipP == 2) { // тута функция в нее переменую
				this.objArray[_key].param(_param);
			}
		}
		visi3D.intRend = 1;
	};

	// парсим и если что добовляем
	this.setBasa = function (_obj) {
		this.object = _obj;

		for (var i = 0; i < this.array.length; i++) {
			if (_obj[this.array[i].object.param] == undefined) {
				_obj[this.array[i].object.param] = this.array[i].object.valueStart;
			}
		}
		this.drahKeys();
	};

	this.drahKeys = function () {
		for (var i = 0; i < this.array.length; i++) {
			this.drahKey(this.array[i].object.param);
		}
	};
	this.plus({name: 'check10', typeParam: 'DCheckBox', param: 'works', title: 'works//false не работает', valueStart: true});// есть у всех
}

function SceneGron (_obj, _param) {
	this.type = 'SceneGron';
	var self = this;
	this.object = _obj;
	this.param = _param;
	this.tipP = 0;// нет параметра

	if (_param != undefined) {
		if (typeof _param === 'object')	this.tipP = 1;// се=тер гетер
		if (typeof _param === 'function') this.tipP = 2;// функция
	}
}

function SceneBox1 (_name,visi3D) {
	SceneBox.call(this, _name,visi3D);
	this.type = 'SceneBox1';
	var self = this;

	this.plus({name: 'check', typeParam: 'DCheckBox', param: 'active', title: 'active', valueStart: false},
		function (value) {
			visi3D.utility.sunActiv(value)

		});



	this.plus({name: 'slider10', typeParam: 'DSliderBig', param: 'mapSize', title: 'mapSize', min: 64, max: 8192, value: 2048, okrug: 1, valueStart: visi3D.SHADOW_WH},
		function (value) {
			value = value || visi3D.SHADOW_WH;
			if (visi3D.sunLight.shadow.mapSize.width != value) {
				visi3D.sunLight.shadow.mapSize.width = value;
				visi3D.sunLight.shadow.mapSize.height = value;
			}
		}
	);

	this.plus({name: 'color', typeParam: 'DColor', param: 'color', title: 'color', valueStart: visi3D.LIGHT_COLOR},
		function (value) {
			var c = value;
			if (typeof c === 'string') {
				if (c.indexOf('x') != -1) {
					var a = c.split('x');
					c = '#' + a[1];
				}
			}

			visi3D.sunLight.color = new THREE.Color(c);
		});

	this.plus({name: 'slider', typeParam: 'DSliderBig', param: 'bias', title: 'bias', min: -0.05, max: 0.05, value: 0, okrug: 10000, valueStart: visi3D.LIGHT_BIAS},
		visi3D.sunLight.shadow
	);

	this.plus({name: 'slider1', typeParam: 'DSliderBig', param: 'intensity', title: 'intensity', min: 0, max: 5, value: 1, okrug: 100, valueStart: visi3D.SHADOW_INTENSITY},
		visi3D.sunLight);

	this.plus({name: 'slider2', typeParam: 'DSliderBig', param: 'radius', title: 'radius', min: 0, max: 50, value: 1, valueStart: visi3D.SHADOW_RADIUS},
		visi3D.sunLight.shadow);

	this.plus({name: 'check2', typeParam: 'DCheckBox', param: 'bAlphaForCoating', title: 'SAMPLE_ALPHA..', value: true, valueStart: false},
		function (value) {
			var gl = visi3D.renderer.getContext();
			if (value) gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
			else gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
		});

	this.plus({name: 'check3', typeParam: 'DCheckBox', param: 'fixation', title: 'fixation', value: false, valueStart: visi3D.utility.FIXATION},
		visi3D.utility);

	this.plus({name: 'slider4', typeParam: 'DSliderBig', param: 'rotationX', title: 'rotationX', min: -Math.PI, max: Math.PI, okrug: 100, value: 0, valueStart: visi3D.utility.ROTATION_X},
		visi3D.utility);
	this.plus({name: 'slider5', typeParam: 'DSliderBig', param: 'rotationZ', title: 'rotationZ', min: -Math.PI, max: Math.PI,okrug: 100, value: 0, valueStart: visi3D.utility.ROTATION_Z},
		visi3D.utility);

	this.plus({name: 'slider6', typeParam: 'DSliderBig', param: 'distance', title: 'distance', min: 0, max: 10000, value: 0, valueStart: visi3D.utility.DISTANCE},
		visi3D.utility);

	this.plus({name: 'slider7', typeParam: 'DSliderBig', param: 'cubWidth', title: 'cubWidth', min: 10, max: 10000, value: 0, valueStart: visi3D.utility.CUB_WIDTH},
		visi3D.utility);

	this.plus({name: 'slider8', typeParam: 'DSliderBig', param: 'cubHeight', title: 'cubHeight', min: 10, max: 10000, value: 0, valueStart: visi3D.utility.CUB_HEIGHT},
		visi3D.utility);

	this.plus({name: 'slider9', typeParam: 'DSliderBig', param: 'distanceUpdateShadow', title: 'distUpdateShadow ', min: -1, max: 500, value: 0, valueStart: visi3D.utility.distanceUpdateShadow},
		visi3D.utility);
}

function SceneBox2 (_name,visi3D) { // 'ambient'
	SceneBox.call(this, _name,visi3D);
	var self = this;
	this.type = 'SceneBox2';
	this.plus({name: 'check', typeParam: 'DCheckBox', param: 'active', title: 'active', valueStart: true},
		function (value) {
		
			visi3D.utility.ambientActiv(value)
		});
	
	this.plus({name: 'color', typeParam: 'DColor', param: 'color', title: 'color', tipParam: 2, valueStart: visi3D.AMBIEN_COLOR},
		function (value) {
			var c = value;


			if (typeof c === 'string') {
				if (c.indexOf('x') != -1) {
					var a = c.split('x');
					c = '#' + a[1];
				}
			}

			self.setValue(this.object.param, c);
			
			visi3D.ambientLight.color = new THREE.Color(c);
		});

	this.plus({name: 'slider', typeParam: 'DSliderBig', param: 'intensity', title: 'intensity', min: 0, max: 5, okrug: 100, valueStart: visi3D.AMBIEN_INTENSITY},
		visi3D.ambientLight);
}

function SceneBox3 (_name,visi3D) {
	SceneBox.call(this, _name,visi3D);
	this.type = 'SceneBox3';
	var self = this;

	this.plus({name: 'check', typeParam: 'DCheckBox', param: 'active', title: 'active', valueStart: false},
		function (value) {
			visi3D.utility.sky.active = value;
		});

	this.plus({name: 'color', typeParam: 'DColor', param: 'color', title: 'color', valueStart: visi3D.utility.sky.COLOR},
		visi3D.utility.sky);

	this.plus({name: 'contLoader', typeParam: 'DVisualLoader', param: 'link', title: 'LoadPic', valueStart: visi3D.utility.sky.LINK},
		visi3D.utility.sky);




	this.plus({name: 'slider', typeParam: 'DSliderBig', param: 'radius', title: 'radius', min: 10, max: 15000, okrug: 1, valueStart: visi3D.utility.sky.RADIUS},
		visi3D.utility.sky);



}

function SceneBox4 (_name,visi3D) {
	SceneBox.call(this, _name,visi3D);
	this.type = 'SceneBox4';
	var self = this;
	this.plus({name: 'check', typeParam: 'DCheckBox', param: 'active', title: 'active', valueStart: false},
		function (value) {
			visi3D.utility.smc.active = value;
		});
	this.plus({name: 'slider', typeParam: 'DSliderBig', param: 'wh', title: 'whFIXI в либе хз', min: 10, max: 15000, okrug: 1, valueStart: visi3D.utility.smc.WH},
		visi3D.utility.smc);

}

function SceneBox5 (_name,visi3D) { // mirror
	SceneBox.call(this, _name,visi3D);
	this.type = 'SceneBox5';
	var self = this;

	this.plus({name: 'text1', typeParam: 'DLabel', param: 'xz', title: 'Load', valueStart: 'reflect'})

	this.plus({name: 'contLoader', typeParam: 'DVisualLoader', param: 'link', title: 'Load', valueStart: 'null'},
		function (value) {
			visi3D.cubeMap.link = value;			
		});

	this.plus({name: 'sliderExp', typeParam: 'DSliderBig', param: 'exposure', title: 'exposure', min: -10, max: 10, okrug: 100, valueStart: -1},
		function (value) {
			visi3D.cubeMap.exposure = value;
		});

	this.plus({name: 'slider1', typeParam: 'DSliderBig', param: 'gamma', title: 'gamma//в хдр', min: -10, max: 10, okrug: 100, valueStart: -1},
		function (value) {
			visi3D.cubeMap.gamma = value;//managerProduct
		});



	this.plus({name: 'text1', typeParam: 'DLabel', param: 'xz', title: 'Load', valueStart: 'refract'})

	this.plus({name: 'contLoader1', typeParam: 'DVisualLoader', param: 'link1', title: 'Load', valueStart: 'null'},
		function (value) {
			visi3D.cubeMap1.link = value;			
		});

	this.plus({name: 'sliderExp1', typeParam: 'DSliderBig', param: 'exposure1', title: 'exposure', min: -10, max: 10, okrug: 100, valueStart: -1},
		function (value) {
			visi3D.cubeMap1.exposure = value;
		});

	this.plus({name: 'slider2', typeParam: 'DSliderBig', param: 'gamma1', title: 'gamma//в хдр', min: -10, max: 10, okrug: 100, valueStart: -1},
		function (value) {
			visi3D.cubeMap1.gamma = value;//managerProduct
		});

}

function SceneBox6 (_name,visi3D) { // visi3D
	SceneBox.call(this, _name,visi3D);
	this.type = 'SceneBox6';
	var self = this;

	this.plus({name: 'check0', typeParam: 'DCheckBox', param: 'alwaysRender', title: 'autoRender', valueStart: false},
		function (value) {
			if (visi3D.alwaysRender !== value) {
				visi3D.alwaysRender = value;
			}
		});

	this.plus({name: 'slider', typeParam: 'DSliderBig', param: 'fov', title: 'fov', min: 0, max: 90, okrug: 1, valueStart: visi3D.FOV});

	this.plus({name: 'slider1', typeParam: 'DSliderBig', param: 'far', title: 'far', min: 100, max: 100000, okrug: 1, valueStart: visi3D.FAR},
		function (value) {
			if (visi3D.camera.far != value) {
				visi3D.camera.far = value;
				visi3D.camera.updateProjectionMatrix();
			}
		});




	this.plus({name: 'slider2', typeParam: 'DSliderBig', param: 'minZum', title: 'minZum', min: 0, max: 20000, okrug: 1, valueStart: 0},
		function (value) {
			visi3D.minZum = value;

			if (visi3D.minZum > visi3D.maxZum) {
				visi3D.maxZum = visi3D.minZum;
				self.setValue('maxZum', value);
			}
		});
	this.plus({name: 'slider3', typeParam: 'DSliderBig', param: 'maxZum', title: 'maxZum', min: 0, max: 20000, okrug: 1, valueStart: 20000},
		function (value) {
			visi3D.maxZum = value;
			if (visi3D.maxZum < visi3D.minZum) {
				visi3D.minZum = visi3D.maxZum;
				self.setValue('minZum', value);
			}

		});
	this.plus({name: 'slider4', typeParam: 'DSliderBig', param: 'zume', title: 'powerZum', min: 1, max: 20000, okrug: 1, valueStart: 250}
		);

	this.plus({name: 'slider11', typeParam: 'DSliderBig', param: 'powerZum', title: 'zoom', min: 1, max: 100, okrug: 1, valueStart: 50},
		function (value) {
			
			if (visi3D.position3d.powerZum !== value) {
				visi3D.position3d.powerZum = value;
				
			}
		});

	this.plus({name: 'slider5', typeParam: 'DSliderBig', param: 'minRotationX', title: 'minAngel', min: 0, max: 3, okrug: 100, valueStart: 2.5},
		function (value) {
			if (visi3D.minRotationX !== value) {
				visi3D.minRotationX = value;
			}
		});

	this.plus({name: 'slider6', typeParam: 'DSliderBig', param: 'maxRotationX', title: 'maxAngel', min: 0, max: 3, okrug: 100, valueStart: 0},
		function (value) {
			if (visi3D.maxRotationX !== value) {
				visi3D.maxRotationX = value;
			}
		});

	/*this.plus({name: 'check1', typeParam: 'DCheckBox', param: 'debug', title: 'debug', valueStart: true},
		function (value) {
			if (visi3D.utility.debug !== value) {
				visi3D.utility.debug = value;
			}
		});*/

	this.plus({name: 'check2', typeParam: 'DCheckBox', param: 'isDragPan', title: 'isDragPan', valueStart: true},
		function (value) {
			if (visi3D.position3d.isDragPan !== value) {
				visi3D.position3d.isDragPan = value;
			}
		});	

	this.plus({name: 'check3', typeParam: 'DCheckBox', param: 'alphaAd', title: 'alpha Админ для фотки', valueStart: false});		


	this.plus({name: 'slider7', typeParam: 'DSliderBig', param: 'zume', title: 'zoom', min: 5, max: 2000, okrug: 100, valueStart: 250},
		function (value) {
			visi3D.zume=value
		});

	this.plus({name: 'slider8', typeParam: 'DSliderBig', param: 'rotationX', title: 'rotationX', min: -Math.PI, max: Math.PI, okrug: 100, valueStart: 0},
		function (value) {
			visi3D.rotationX=value
		});
	this.plus({name: 'slider9', typeParam: 'DSliderBig', param: 'rotationZ', title: 'rotationZ', min: -Math.PI, max: Math.PI, okrug: 100, valueStart: 0},
		function (value) {
			visi3D.rotationZ=value
		});
	this.plus({name: 'slider10', typeParam: 'DSliderBig', param: 'globZ', title: 'globZ', min: -1000, max: 1000, okrug: 100, valueStart: 0},
		function (value) {
			visi3D.yVerh=value			
		});

}

function SceneBox7 (_name,visi3D) { // effect
	SceneBox.call(this, _name,visi3D);
	this.type = 'SceneBox7';
	var self = this;

	this.plus({name: 'check', typeParam: 'DCheckBox', param: 'active', title: 'active', valueStart: false},visi3D.efect);
	this.plus({name: 'slider', typeParam: 'DSliderBig', param: 'edgeStrength', title: 'edgeStrength', min: 0, max: 10, okrug: 100, valueStart: visi3D.efect.edgeStrength},
		visi3D.efect);
	this.plus({name: 'slider1', typeParam: 'DSliderBig', param: 'edgeGlow', title: 'edgeGlow', min: 0, max: 1, okrug: 100, valueStart: visi3D.efect.edgeGlow},
		visi3D.efect);
	this.plus({name: 'slider2', typeParam: 'DSliderBig', param: 'edgeThickness', title: 'edgeThickness', min: 0, max: 5, okrug: 100, valueStart: visi3D.efect.edgeThickness},
		visi3D.efect);
	this.plus({name: 'slider3', typeParam: 'DSliderBig', param: 'pulsePeriod', title: 'pulsePeriod', min: 0, max: 5, okrug: 100, valueStart: visi3D.efect.pulsePeriod},
		visi3D.efect);


	this.plus({name: 'contLoader', typeParam: 'DVisualLoader', param: 'linkTextur', title: 'linkTextur', valueStart: visi3D.efect.linkTextur},
		visi3D.efect);



	this.plus({name: 'color', typeParam: 'DColor', param: 'visibleEdgeColor', title: 'vEdgeColor', valueStart: visi3D.efect.visibleEdgeColor},visi3D.efect);

	this.plus({name: 'color1', typeParam: 'DColor', param: 'hiddenEdgeColor', title: 'hEdgeColor', valueStart: visi3D.efect.hiddenEdgeColor},visi3D.efect);



}

function SceneBox8 (_name,visi3D) { // paramVR
	SceneBox.call(this, _name,visi3D);
	this.type = 'SceneBox8';
	var self = this;

	this.plus({	name: 'check', typeParam: 'DCheckBox', param: 'startAnimat', title: 'startAnimat', valueStart: false});

	this.plus({name: 'slider1', typeParam: 'DSliderBig', param: 'kolLength', title: 'kolLength//500', min: 1, max: 1000, okrug: 1, valueStart: 1000});

	this.plus({name: 'slider2', typeParam: 'DSliderBig', param: 'kolCount', title: 'kolCount//0', min: 0, max: 20000, okrug: 1, valueStart: 0});
}


function SceneBox9 (_name,visi3D) { //fog
	SceneBox.call(this, _name,visi3D);
	this.type = 'SceneBox9';
	var self = this;
	visi3D.sbfog=new SBFog(visi3D)


	this.plus({name: 'check', typeParam: 'DCheckBox', param: 'active', title: 'active', valueStart: false},
	function (value) {
		visi3D.sbfog.active=value


	});

	this.plus({name: 'color1', typeParam: 'DColor', param: 'color', title: 'outlineColor1', valueStart: visi3D.sbfog._color},
		function (value) {
			var c = value;

			visi3D.sbfog.color = c;			
		});



	this.plus({name: 'slider1', typeParam: 'DSliderBig', param: 'near', title: 'near', min: 0, max: 10000, okrug: 1, valueStart: 50},visi3D.sbfog);

	this.plus({name: 'slider2', typeParam: 'DSliderBig', param: 'far', title: 'far', min: 0, max: 20000, okrug: 1, valueStart: 100},visi3D.sbfog);

}


function SceneBox10 (_name,visi3D) { //fog
	SceneBox.call(this, _name,visi3D);
	this.type = 'SceneBox10';
	var self = this;
	


	this.plus({name: 'check', typeParam: 'DCheckBox', param: 'active', title: 'active', valueStart: false},
	function (value) {
		//visi3D.sbfog.active=value


	});
	this.plus({name: 'slider1', typeParam: 'DSliderBig', param: 'distMinMaxBox', title: 'distMinMaxBox', min: 0, max: 10000000, okrug: 1, valueStart: 1000000},visi3D.position3d);
	
	this.plus({name: 'check1', typeParam: 'DCheckBox', param: 'activeAround', title: 'activeAround', valueStart: false},
	function (value) {
		//visi3D.sbfog.active=value
		visi3D.position3d.pScane.active=value;
	});
	
	this.plus({name: 'check2', typeParam: 'DCheckBox', param: 'visiRaund', title: 'visiRaund', valueStart: false},
	function (value) {
	
		visi3D.position3d.pScane.visiRaund=value;
	});


	this.setBasa = function (_obj) {
		this.object = _obj;
		
		for (var i = 0; i < this.array.length; i++) {
			
			if (_obj[this.array[i].object.param] == undefined) {
				_obj[this.array[i].object.param] = this.array[i].object.valueStart;
			}
		}
		this.drahKeys();
	};

	this.drahKeys = function () {
		for (var i = 0; i < this.array.length; i++) {
			this.drahKey(this.array[i].object.param);
		}
	};

	//distMinMaxBox
/*
	this.plus({name: 'color1', typeParam: 'DColor', param: 'color', title: 'outlineColor1', valueStart: visi3D.sbfog._color},
		function (value) {
			var c = value;

			visi3D.sbfog.color = c;			
		});



	this.plus({name: 'slider1', typeParam: 'DSliderBig', param: 'near', title: 'near', min: 0, max: 10000, okrug: 1, valueStart: 50},visi3D.sbfog);

	this.plus({name: 'slider2', typeParam: 'DSliderBig', param: 'far', title: 'far', min: 0, max: 20000, okrug: 1, valueStart: 100},visi3D.sbfog);
*/
}


function SBFog (_visi) { //fog
	this._active=false
	this._color="#ffffff"
	this._near=50
	this._far=1000
	this.visi=_visi


	this.fog = new THREE.Fog(this._color, this._near, this._far);


}
SBFog.prototype = {
	set active (v) {
		if(this._active!=v)	{
			this._active = v;
			
			if(this._active==true){

				this.visi.scene.fog=this.fog
			}else{
				this.visi.scene.fog=null
			}
			
		}	
		
	},
	get active () {
		return this._active;
	},

	set color (v) {
		if(this._color!=v)	{
			this._color = v;

			this.fog.color =   new THREE.Color(v);		
		}	
		
	},
	get color () {
		return this._color;
	},


	set near (v) {
		if(this._near!=v)	{
			this._near = v;
			this.fog.near = v;		
		}	
		
	},
	get near () {
		return this._near;
	},

	set far (v) {
		if(this._far!=v)	{
			this._far = v;
			this.fog.far = v;		
		}	
		
	},
	get far () {
		return this._far;
	},
}




