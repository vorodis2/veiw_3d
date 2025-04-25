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

// то что возврощаеться от событий
export default function MEvent3D () {
	this.target = undefined;
	this.face = undefined;
	this.point = undefined;
	this.faceIndex = undefined;
	this.type = undefined;
	this.uv = undefined;
	this.originalEvent = undefined;
	this.copy = function () {
		var r = new MEvent3D();
		r.target = this.target;
		r.face = this.face;
		r.point = this.point;
		r.faceIndex = this.faceIndex;
		r.type = this.type;
		r.uv = this.uv;
		r.originalEvent = this.originalEvent;
		return r;
	};
}
