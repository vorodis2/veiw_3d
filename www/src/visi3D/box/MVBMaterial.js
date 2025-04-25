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





export class  MVBMaterial{
    constructor(par) {
        this.type = "MVBMaterial";
        var self = this;
        this.wh = 512;
        this.par = par;
    	this._lineSize=par._lineSize;
    	this._lineSize1=par._lineSize1;
    	this._colorLine=par._colorLine;//"#00ff00"
    	this._color=par._color;//"#ffffff"
        this._fontFamily=par._fontFamily
        this._colorText=par._colorText
        this._aText=par._aText

    	this._fontSize=par._fontSize;

        this.bmp

        this.init = function(){



	        this.canvas = document.createElement("canvas")
	        this.canvas.width = this.wh;
	        this.canvas.height = this.wh;

	        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true }); // контекст картинки        	


	      
        	this.texture = new THREE.CanvasTexture(this.canvas,THREE.UVMapping,THREE.RepeatWrapping,THREE.RepeatWrapping);


        	this.korektObjTex(this.baseParam, this.texture)

        	this.dragCanvas()

			this.material = new THREE.MeshPhongMaterial({			
				map:this.texture,
				//side:THREE.DoubleSide
			})


           /* let bm=new THREE.Mesh(new THREE.BoxGeometry(),this.material )
            let rr=1;
            bm.position.z=-rr/2
            bm.scale.set(rr,rr,rr)
            this.par.content3d.add(bm)  */

        }




        this.dragCanvas=function(){
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        	
			this.ctx.fillStyle = this._color;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			/*if(this.bmp){
				this.ctx.drawImage(this.bmp.image, 0, 0, this.canvas.width, this.canvas.height);
			}*/

			let ww=this._lineSize+this._lineSize1
			let a=this.hexDec(this._colorLine)


			var gradient = this.ctx.createLinearGradient(0, 0, ww, 0);	
			gradient.addColorStop(0, 					"rgba("+a[0]+", "+a[1]+", "+a[2]+", 1.0)");
			gradient.addColorStop(this._lineSize/ww, 	"rgba("+a[0]+", "+a[1]+", "+a[2]+", 1.0)");
			gradient.addColorStop(1, 					"rgba("+a[0]+", "+a[1]+", "+a[2]+", 0.0)");
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, ww, this.wh*sahUV);


			var gradient = this.ctx.createLinearGradient(0, 0, 0, ww);	
			gradient.addColorStop(0, 					"rgba("+a[0]+", "+a[1]+", "+a[2]+", 1.0)");
			gradient.addColorStop(this._lineSize/ww, 	"rgba("+a[0]+", "+a[1]+", "+a[2]+", 1.0)");
			gradient.addColorStop(1, 					"rgba("+a[0]+", "+a[1]+", "+a[2]+", 0.0)");
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, this.wh*sahUV, ww);
			let ii=1;
			let jj=0;
			for (var i = 0; i < this._aText.length; i++) {
				this.dragCText(ii, jj, this._aText[i])
				ii++;
				if(ii>=3){
					ii=1;
					jj++
				}
				
			}

			this.texture.needsUpdate=true
			if(this.material)this.material.needsUpdate=true
        }
        var sahUV = 0.3

        this.dragCText=function(i,j,text){
        	let wwhh=this.wh*sahUV;
        	let ww=this._fontScale*text.length*this._fontSize;
			let x=i*wwhh//+(this.wh/10*2-ww)/2;
			let y=j*wwhh+wwhh/2//-this._fontSize/2//+(this.wh/10*2-this._fontSize)/2;


        	this.ctx.fillStyle = this._colorText;
        	this.ctx.font = "bold "+Math.round(this._fontSize)+"px "+this._fontFamily;
			let rect=this.getTextWidth(text,this.ctx.font)

			x+=(wwhh-rect.width)/2
			y+=(rect.fontBoundingBoxDescent)*1.5

			
  			this.ctx.fillText(text, x, y);
        }

        this.hexDec = function (h) {
	        var m = h.slice(1).match(/.{2}/g);
	        m[0] = parseInt(m[0], 16);
	        m[1] = parseInt(m[1], 16);
	        m[2] = parseInt(m[2], 16);
	        return m;
	    };




        this.metrics
        var dCt2=undefined;
        this.getTextWidth = function(_text, _font) {
            let strBold = this.bold == true ? 'bold ' : 'normal '
            let strSize = this.fontSize+'px '
            let strFamily = this.fontFamily+''

            let text = _text || this.text
            let font = _font || strBold+strSize+strFamily+''
            if(dCt2==undefined)dCt2 = document.createElement("canvas")
            var canvas = dCt2// getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));    
            var context = canvas.getContext("2d", { willReadFrequently: true });
            context.font = font;
            this.metrics = context.measureText(text);
            
            return this.metrics;
        }



        this.korektObjTex = function(obj, textur) {
            
            for (var s in obj) {
                  
                if(textur[s]!=undefined){
                    if(obj[s].x!=undefined && textur[s].x){
                        textur[s].x=obj[s].x
                        textur[s].y=obj[s].y
                    }else{
                        if(textur[s]!=undefined){
                          
                            textur[s]=obj[s]
                        }
                        
                    }
                }
            }
           
        }


        var oInfo
        this.baseParam = oInfo ={
            // скрытые параметры, устанавливаются при создании Map
            flipY: false,
            colorSpace: THREE.SRGBColorSpace,
            center: new THREE.Vector2(0.5, 0.5),
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,
            minFilter: THREE.NearestMipmapLinearFilter,
            magFilter: THREE.LinearFilter,
            anisotropy: 8,
            generateMipmaps: true,
            // следующие параметры видны в загрузчике в панели настроек текстурных слотов
            channel: 0, // два значения: 0 и 1, указано значение по умолчанию
            offset: new THREE.Vector2(0, 0), //  0-1, шаг 0,01
            repeat:  new THREE.Vector2(1, 1), // 0-999, шаг 0,01
            rotation: 0 // value - значение от 0 до 360 (дефолт value = 0)
        }



    }


}
