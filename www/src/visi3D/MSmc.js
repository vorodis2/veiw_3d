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


import MShadowMeshContainer from './MShadowMeshContainer.js';

export default function MSmc (_parent) {
	this.parent = _parent;
	var self = this;
	this._active = false;
	this._visible = true;

	this.WH = 512;

	this._wn = this.WH;
	this._obj3d = undefined;

	this.smc = undefined;


	this.init = function () {
		if (this.smc != undefined) return;
		this.smc = new MShadowMeshContainer();
		this.smc.fotoPosition.set(-this._wn / 2, -this._wn / 2);
		this.smc.fotoWH = this._wn;
		this.smc.content3d.rotation.x = -Math.PI / 2;
		this.smc.content3d.position.y = -1;
		this.smc.content3d.visible = this._visible;
		this.dergObj();
	};
	this.dergActiv = function () {

		if (this._active == true) {
			if (this.smc.content3d.parent == null) this.parent.parent.groupObject.add(this.smc.content3d);
		} else {
			if (this.smc.content3d.parent != null) this.parent.parent.groupObject.remove(this.smc.content3d);
		}

	};


	this.render = function () {

		if (this.smc == undefined) return;
		if (this.smc.content3d.parent != null) {
			this.smc.upDate();
		}
	};


	this.dergObj = function () {
		if (this.smc == undefined)	return;
		if (this._obj3d != undefined) {
			if (this.smc.arrObj[0] == this._obj3d) {

			} else {
				this.smc.clear();
				this.smc.addObj(this._obj3d);
			}

		} else {
			this.smc.clear();
		}
	};


}
MSmc.prototype = {
	set active (v) {
		if (this._active === v) return;
		this._active = v;
		this.init();
		this.dergActiv();
	},
	get active () {
		return this._active;
	},
	set visible (v) {
		if (this._visible === v) return;
		this._visible = v;
		if (this.smc == undefined) return;
		this.smc.content3d.visible = v;

	},
	get visible () {
		return this._visible;
	},
	set obj3d (v) {
		if (this._obj3d === v) return;
		this._obj3d = v;
		this.dergObj();

	},
	get obj3d () {
		return this._obj3d;
	},
	set wh (v) {
		if (this._wh === v) return;
		this._wh = v;
		if (this.smc == undefined) return;

		this.smc.fotoPosition.set(-this._wn / 2, -this._wn / 2);
		this.smc.fotoWH = this._wn;
	},
	get wh () {
		return this._wh;
	}
};
