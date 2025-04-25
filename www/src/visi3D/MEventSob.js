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


// 'евент диспатча'

export default function MEventSob () {

	this.event = undefined;

	this.arrSobName = ['up', 'down', 	'move',	'out', 	'over', 'wheel'];
	this.arrSob = [[], [], [], [], [], []];

	this.pozSob = undefined;

	this.dispatcherEvent = function (tipSob, event) {		
		for (var i = 0; i < this.arrSobName.length; i++) {
			if (this.arrSobName[i] == tipSob) {

				if (event) event.type = tipSob;
				for (var j = 0; j < this.arrSob[i].length; j++) {
					this.arrSob[i][j](event);
				}
			}
		}
	};

	this.removeEvent = function (str, fun) {
		for (var i = 0; i < this.arrSobName.length; i++) {
			if (this.arrSobName[i] == str) {
				for (var j = 0; j < this.arrSob[i].length; j++) {
					if (this.arrSob[i][j] == fun) {
						this.arrSob[i].splice(j, 1);
					}
				}
			}
		}
	};

	this.addEvent = function (str, fun) {

		for (var i = 0; i < this.arrSobName.length; i++) {
			if (this.arrSobName[i] == str) {
				this.arrSob[i].push(fun);
			}
		}
	};
}
