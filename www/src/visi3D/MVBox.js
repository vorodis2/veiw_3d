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


import { MVisi3D } from './MVisi3D.js';     //вьювер3д


export class  MVBox{
    constructor(par) {
        this.type = "MVBox";
        var self = this;

        this._wh=128;

        this._rotationX=0
        this._rotationZ=0

        this._lineSize=50
        this._lineSize1=0
        this._fontSize=74;

        this._sah01=0.1;

        this._fontFamily='Arial'//dcmParam._fontFamily;
        this._colorText="#ff0000"//dcmParam._colorText; 

        this._aText=['X1','-X3','Y4','-Y5','Z2','-Z0'];
       // this._aText=['X','-X','Y','-Y','Z','-Z'];
        //this._aText=['СПРАВА','СЛЕВА','СПЕРЕДИ','СЗАДИ','СНИЗУ','СВЕРХУ'];


        this._colorLine="#00ff00"
    	this._color="#ffffff"



        this.contHTML = document.createElement('div');
        this.contHTML.style.position = 'fixed';
        this.contHTML.style.top = '0px';
        this.contHTML.style.left = '0px';


        this.visi3D = new MVisi3D(this.contHTML, null, false, true, true, true, true);
        this.visi3D.yes3d = true;

        this.content3d = new THREE.Object3D();

      /*  let c3 = new THREE.Object3D();	
        let r=222;
        let r1=22;	
        for (var i = 0; i < 33; i++) {
        	let mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1,2,2,2),new THREE.MeshPhongMaterial({color:0xffffff*Math.random(), wireframe:true}))
	       	mesh.position.set(Math.random()*r-r/2,Math.random()*r-r/2,Math.random()*r-r/2)
        	mesh.scale.set(Math.random()*r1+r1/2,Math.random()*r1+r1/2,Math.random()*r1+r1/2)
        	//c3.add(mesh);
        }

        


        
        

        c3.add(this.mvbMeshs.c3)
        r1=422;
        c3.scale.set(r1,r1,r1)
        r=2;
        r1=422;
        let mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1,2,2,2),this.mvbMaterial.material)
       	mesh.position.set(Math.random()*r-r/2,Math.random()*r-r/2,Math.random()*r-r/2)
    	mesh.scale.set(r1,r1,r1)
    	c3.add(mesh);*/

        let r1=200;
        this.content3d.scale.set(r1,r1,r1)
    	this.visi3D.groupObject.add(this.content3d)
        this.visi3D.sizeWindow(0,0,this._wh,this._wh)	
        this.visi3D.render()
        setTimeout(function() {
        	self.visi3D.render()
        }, 1000);

        this.visi3D.fun_rotationX=function(){            
            localS11.object["dragVisi3d1"]=self.visi3D.getObj();
           
            //let str=JSON.stringify(localS11.object["dragVisi3d1"])
  
            localS11.save()          
        }
   

        var localS11=new LocalS(function(){},"localS1111_");

		if(localS11.object["dragVisi3d1"]){
            this.visi3D.setObj(localS11.object["dragVisi3d1"])            
        }  /**/
        this.drag = function(){
        	//if(wDeb){

        		this.visi3D.sizeWindow(0,0,this._wh,this._wh)
				/*wDeb.height=this._wh+dcmParam.wh;
				wDeb.width=this._wh;
				wDeb.title = "wh="+this._wh*/
        	//}			
		}

		
		this.init = function(){
			if(this.mvbMaterial)return
			this.mvbMaterial = new MVBMaterial(this) 
        	this.mvbMeshs = new MVBMeshs(this)
			this.mvbMaterial.init();
			this.mvbMeshs.drag();

			this.content3d.add(this.mvbMeshs.c3);
			this.drag()
		}


		this.drag1 = function(){
			this.mvbMaterial._colorLine=this._colorLine;
    		this.mvbMaterial._color=this._color;
        	this.mvbMaterial._fontFamily=this._fontFamily
        	this.mvbMaterial._colorText=this._colorText
        	this.mvbMaterial._aText=this._aText

        	this.mvbMaterial._lineSize=this._lineSize;
        	this.mvbMaterial._lineSize1=this._lineSize1;

        	this.mvbMaterial._fontSize=this._fontSize;

        	this.mvbMaterial.dragCanvas();	
        	this.visi3D.intRend=1		
		}

		this.drag2 = function(){
        	this.mvbMeshs._sah01=this._sah01;
        	this.mvbMeshs.drag();
        	this.visi3D.intRend=1		
		}

		this.drag3 = function(){        	
        	this.visi3D.rotationZ=	this._rotationZ
        	this.visi3D.rotationX=	this._rotationX
		}
		

		this.upDate = function() {
        
            this.visi3D.upDate(); 

        }


		var wDeb
        this.debagS=function(){


			/*wDeb=new DWindow(menuBig.dCont,400,50,"100x100")
			wDeb.width=100;
			wDeb.height=100;*/
			//wDeb.content.add(new DPanel())
			
			//wDeb.content.div.appendChild(this.contHTML)

		///	wDeb.content.div.appendChild(self.contHTML); 
			


        	var dPO = new DParamObject(menuBig.dCont,200,50,function(){

			})
			dPO.window.title='info::MVBox';

			//dPO.window.scale = 0.8
			dPO.okrug=1000
			dPO.addObject(self)

			
			//this.drag();

        }
		
        setTimeout(function() {
			self.debagS()
			//self.init()
		}, 200); /**/ 
	}	

	set wh(value) {
        if(this._wh!==value){
            this._wh=value
            this.drag();
        }       
    }
    get wh() {
        return this._wh;
    }

	set lineSize(value) {
        if(this._lineSize!==value){
            this._lineSize=value
            this.drag1();
        }       
    }
    get lineSize() {
        return this._lineSize;
    }
	set lineSize1(value) {
        if(this._lineSize1!==value){
            this._lineSize1=value
            this.drag1();
        }       
    }
    get lineSize1() {
        return this._lineSize1;
    }

	set fontSize(value) {
        if(this._fontSize!==value){
            this._fontSize=value
            this.drag1();
        }       
    }
    get fontSize() {
        return this._fontSize;
    }

	set sah01(value) {
        if(this._sah01!==value){
            this._sah01=value
            this.drag2();
        }       
    }
    get sah01() {
        return this._sah01;
    }

	set rotationX(value) {
        if(this._rotationX!==value){
            this._rotationX=value
            this.drag3();
        }       
    }
    get rotationX() {
        return this._rotationX;
    }

	set rotationZ(value) {
        if(this._rotationZ!==value){
            this._rotationZ=value
            this.drag3();
        }       
    }
    get rotationZ() {
        return this._rotationZ;
    }
           

}



export class  MVBMaterial{
    constructor(par) {
        this.type = "MVBMaterial";
        var self = this;
        this.wh = 512;
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


	      /*  this.bmp=new DImage(null, 0, 0,null,function(){
	        	trace("pppthisp",this)
	        	self.dragCanvas()
	        })

	        this.bmp.link='./resources/imageHlam/1.png';*/
	        //this.bmp.link='./resources/imageHlam/load2.png'
        	/*this.canvas = document.createElement("canvas")
        	this.canvas.width = this.wh;
        	this.canvas.height = this.wh;


        	let bmp=new DBitmapData(this.wh, this.wh)
        	bmp.dragRendom();*/
        	this.texture = new THREE.CanvasTexture(this.canvas,THREE.UVMapping,THREE.RepeatWrapping,THREE.RepeatWrapping);


        	pm.tex.korektObjTex(pm.tex.baseParam, this.texture)

        	this.dragCanvas()

			this.material = new THREE.MeshPhongMaterial({			
				map:this.texture,
				//side:THREE.DoubleSide
			})

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
			this.ctx.fillRect(0, 0, ww, this.wh/10*2);


			var gradient = this.ctx.createLinearGradient(0, 0, 0, ww);	
			gradient.addColorStop(0, 					"rgba("+a[0]+", "+a[1]+", "+a[2]+", 1.0)");
			gradient.addColorStop(this._lineSize/ww, 	"rgba("+a[0]+", "+a[1]+", "+a[2]+", 1.0)");
			gradient.addColorStop(1, 					"rgba("+a[0]+", "+a[1]+", "+a[2]+", 0.0)");
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, this.wh/10*2, ww);
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


        this.dragCText=function(i,j,text){
        	let wwhh=this.wh/10*2;
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


    }


}


export class  MVBMeshs{
    constructor(par) {
        this.type = "MVBMeshs";
        var self = this;
        this.wh=256;
        this.par=par;

        this._sah01=this.par._sah01;


        this.c3 = new THREE.Object3D();	

        let ax=new THREE.AxesHelper(2)
        
       // ax.position.x=-0.5

        this.c3.add(ax)




       /* let mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1,2,2,2),this.par.mvbMaterial.material)
       	
    	this.c3.add(mesh);*/

        this.array=[];
        this.object=[];
        var sah0 = 0.0
        var sah01 = 0.1
        var sah05 = 0.5
        var sah_1 = 1
        var sahZZZ = 0.01
        this.drag=function(){
        	let mesh;

        	sah01=this._sah01
			
        	///////4////////////////////////

        	this.plus("gr_4",[[4, sah01, sah01, sah_1-sah01, sah_1-sah01, 0.2, 0.2, 0.4, 0.4]]);
        	
        	this.plus("gr_4_3",[        			
        			[4, sah0, sah01,  sah01, sah_1-sah01,  			0.0+sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ],
        			[3, sah_1-sah01, sah01, sah_1, sah_1-sah01, 	0.2-sahZZZ, 0.2-sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ]
        		]
        	);

			this.plus("gr_4_3_0",[        			
        			[4, sah0, sah0,  sah01, sah01,  		0.0+sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ],
        			[3, sah_1-sah01, sah0,  sah_1, sah01,  	0.2-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ],
        			[0, sah0, sah_1-sah01,  sah01, sah_1,  	0.0+sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ, 0.0+sahZZZ],
        		]
        	);
			this.plus("gr_4_0",[        			
        			[4, sah01, sah0, sah_1-sah01,  sah01 , 			0.2-sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ],
        			[0, sah01, sah_1-sah01, sah_1-sah01,  sah_1 , 	0.2-sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ, 0.0+sahZZZ],
        		]
        	);




        	this.plus("gr_4_1",[        			
        			[4, sah_1-sah01, sah01,  sah_1, sah_1-sah01,  0.2-sahZZZ, 0.2-sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ],
        			
        			[1, sah_1-sah01, sah01,  sah_1, sah_1-sah01,  0.0+sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ]
        		]
        	);	


        	this.plus("gr_4_1_0",[        			
        			[4, sah_1-sah01, sah0,  sah_1, sah01,  0.2-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ],
        			[1, sah_1-sah01, sah0,  sah_1, sah01,  0.0+sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ],
        			[0, sah_1-sah01, sah_1-sah01,  sah_1, sah_1,  	0.2-sahZZZ, 0.2-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ],
        		]
        	);

        	
/*
        	this.plus("gr_4_2",[        			
        			[4, sah01, sah_1-sah01, sah_1-sah01,  sah_1 , 0.18, 0.2, 0.19, 0.0]
        		]
        	);

        	

        	

        	this.plus("gr_4_1_2",[        			
        			[4, sah_1-sah01, sah_1-sah01,  sah_1, sah_1,  0.2, 0.2, 0.0, 0.0]
        		]
        	);
        	this.plus("gr_4_3_2",[        			
        			[4, sah0, sah_1-sah01,  sah01, sah_1,  0.0, 0.2, 0.2, 0.0]
        		]
        	);*/

        	
        	///////0////////////////////////


        	this.plus("gr_0",[[0, sah01, sah01, sah_1-sah01, sah_1-sah01, 0.4, 0.4, 0.6, 0.6]]);

        	this.plus("gr_0_3",[
        		[0, sah0, sah01, sah01, sah_1-sah01, 0.0+sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ],
        		[3, sah01, sah0, sah_1-sah01, sah01, 0.2-sahZZZ, 0.0+sahZZZ,0.2-sahZZZ, 0.2-sahZZZ],
        	]);


        	///////3////////////////////////

        	this.plus("gr_3",[[3, sah01, sah01, sah_1-sah01, sah_1-sah01, 0.4, 0.0, 0.6, 0.2]]);

        	///////1///////////////////////

        	this.plus("gr_1",[[1, sah01, sah01, sah_1-sah01, sah_1-sah01, 0.2+sahZZZ, 0.0, 0.4, 0.2]]);

        	
        	this.plus("gr_1_0",[
        		[1, sah01, sah0, sah_1-sah01, sah01, 0.2-sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ],
        		[0, sah_1-sah01, sah01, sah_1, sah_1-sah01, 0.2-sahZZZ, 0.2-sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ],
        	]);


        	///////5////////////////////////

        	this.plus("gr_5",[[5, sah01, sah01, sah_1-sah01, sah_1-sah01, 0.4, 0.2, 0.6, 0.4]]);

        	this.plus("gr_5_1",[
        		[5, sah_1-sah01, sah01, sah_1, sah_1-sah01, 0.0+sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ],
        		[1, sah0, sah01, sah01, sah_1-sah01, 0.2-sahZZZ, 0.2-sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ],
        	]);/**/

        	this.plus("gr_5_0",[
        		[5, sah01, sah0, sah_1-sah01, sah01, 0.2-sahZZZ,0.0+sahZZZ, 0.2-sahZZZ,  0.2-sahZZZ],
        		[0, sah01, sah0, sah_1-sah01, sah01, 0.2-sahZZZ,0.0+sahZZZ, 0.2-sahZZZ,  0.2-sahZZZ],
        	])


        	this.plus("gr_5_1_0",[
        		[5, sah_1-sah01, sah0, sah_1, sah01, 	0.0+sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ, 0.2-sahZZZ],
        		[1, sah0, sah0, sah01, sah01, 			0.2-sahZZZ, 0.0+sahZZZ,  0.0+sahZZZ, 0.2-sahZZZ],
        		[0, sah_1-sah01, sah0, sah_1, sah01, 			0.2-sahZZZ, 0.0+sahZZZ,  0.0+sahZZZ, 0.2-sahZZZ],
        	]);/**/


        	this.plus("gr_5_3_0",[
        		[5, sah0, sah0, sah01, sah01, 	0.2-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ],        		
        		[3, sah0, sah0, sah01, sah01, 			0.0+sahZZZ, 0.0+sahZZZ,  0.2-sahZZZ, 0.2-sahZZZ],
        		[0, sah0, sah0, sah01, sah01, 			0.0+sahZZZ, 0.0+sahZZZ,  0.2-sahZZZ, 0.2-sahZZZ],
        	]);	

        	this.plus("gr_5_3",[
        		[5, sah0, sah01, sah01, sah_1-sah01, 	0.2-sahZZZ, 0.2-sahZZZ, 0.0+sahZZZ, 0.2-sahZZZ],        		
        		[3, sah0, sah01, sah01, sah_1-sah01, 			0.0+sahZZZ, 0.2-sahZZZ,  0.2-sahZZZ, 0.2-sahZZZ]
        	]);

        	///////2////////////////////////	
        	this.plus("gr_2",[[2, sah01, sah01, sah_1-sah01, sah_1-sah01, 0.4, 0.6, 0.2, 0.4]]);

        	this.plus("gr_2_4",[
        		[2, sah01, sah_1-sah01, sah_1-sah01, sah_1,  	0.2-sahZZZ, 0.2-sahZZZ,  0.2-sahZZZ, 0.0+sahZZZ],        		
        		[4, sah01, sah_1-sah01, sah_1-sah01, sah_1,		0.2-sahZZZ, 0.2-sahZZZ,   0.2-sahZZZ, 0.0+sahZZZ]
        	]);

        	this.plus("gr_2_5",[
        		[2, sah01, sah0, sah_1-sah01, sah01,  		0.2-sahZZZ, 0.0+sahZZZ,  0.2-sahZZZ, 0.2-sahZZZ],        		
        		[5, sah01, sah_1-sah01, sah_1-sah01, sah_1, 0.2-sahZZZ,0.2-sahZZZ,  0.2-sahZZZ, 0.0+sahZZZ],
        	]);

        	this.plus("gr_2_3",[
        		[2, sah0, sah01, sah01, sah_1-sah01,  		0.2-sahZZZ, 0.2-sahZZZ,0.0+sahZZZ,   0.2-sahZZZ],        		
        		[3, sah01, sah_1-sah01, sah_1-sah01, sah_1, 0.2-sahZZZ,0.2-sahZZZ,  0.2-sahZZZ, 0.0+sahZZZ],
        	]);

        	this.plus("gr_2_1",[
        		[2, sah_1-sah01, sah01, sah_1, sah_1-sah01,  			0.0+sahZZZ, 0.2-sahZZZ,	0.2-sahZZZ,  0.2-sahZZZ ],        		
        		[1, sah01, sah_1-sah01, sah_1-sah01, sah_1, 			0.2-sahZZZ,	0.2-sahZZZ,  0.2-sahZZZ, 0.0+sahZZZ ],
        	]);


        	
        	this.plus("gr_2_1_4",[
        		[2, sah_1-sah01, sah_1-sah01, sah_1, sah_1, 		0.0+sahZZZ, 0.2-sahZZZ,0.2-sahZZZ,   0.0+sahZZZ],        		
        		[1, sah_1-sah01, sah_1-sah01, sah_1, sah_1,			    0.0+sahZZZ,0.2-sahZZZ,  0.2-sahZZZ, 0.0+sahZZZ],
        		[4,  sah_1-sah01, sah_1-sah01, sah_1, sah_1,		0.2-sahZZZ, 0.2-sahZZZ,   0.0+sahZZZ, 0.0+sahZZZ]
        	]);

        	this.plus("gr_2_1_5",[
        		[2, sah_1-sah01, sah0, sah_1, sah01,  		0.0+sahZZZ, 0.0+sahZZZ,0.2-sahZZZ,   0.2-sahZZZ],        		
        		[1, sah0, sah_1-sah01, sah01, sah_1,			    0.2-sahZZZ,0.2-sahZZZ,  0.0+sahZZZ, 0.0+sahZZZ],
        		[5, sah_1-sah01, sah_1-sah01, sah_1, sah_1, 0.0+sahZZZ,0.2-sahZZZ,  0.2-sahZZZ, 0.0+sahZZZ],
        	]);

        	this.plus("gr_2_3_5",[
        		[2, sah0, sah0, sah01, sah01,  		0.2-sahZZZ, 0.0+sahZZZ,0.0+sahZZZ,   0.2-sahZZZ],        		
        		[3, sah0, sah_1-sah01, sah01, sah_1, 0.0+sahZZZ,0.2-sahZZZ,  0.2-sahZZZ, 0.0+sahZZZ],
        		[5, sah0, sah_1-sah01, sah01, sah_1, 0.2-sahZZZ,0.2-sahZZZ,  0.0+sahZZZ, 0.0+sahZZZ],
        	]);

        	this.plus("gr_2_3_4",[
        		[2, sah0, sah_1-sah01, sah01, sah_1,  		0.2-sahZZZ, 0.2-sahZZZ,0.0+sahZZZ,   0.0+sahZZZ],       		
        		[3, sah_1-sah01, sah_1-sah01, sah_1, sah_1, 0.2-sahZZZ,0.2-sahZZZ,  0.0+sahZZZ, 0.0+sahZZZ],
        		[4,  sah0, sah_1-sah01, sah01, sah_1,		0.0+sahZZZ, 0.2-sahZZZ,   0.2-sahZZZ, 0.0+sahZZZ]
        	]);
        }


        this.plus=function(s,arr){

        	let b=true
        	let mesh=null
        	if(this.object[s])mesh=this.object[s]

        	if(mesh==null){
        		mesh=new MMesh(this);
        		b=false        		
        	}	
        	
        	
        	let ap=[]
        	let auv=[]

        	for (var i = 0; i < arr.length; i++) {
        		this.plus1(arr[i],ap,auv)
        	}

        	mesh.set(s,ap,auv);
        	

        	if(!b){
        		this.object[s]=mesh
        		this.c3.add(mesh.mesh)
        		this.array.push(mesh);
        	}
        	

        	return mesh;
        }

        this.plus1 = function(_arr,ap,auv){
        	if(_arr[0]==3){//лицо  
        		ap.push(
        			new THREE.Vector3( -sah05,-sah05+_arr[1], -sah05+_arr[2]),//0
        			new THREE.Vector3( -sah05,-sah05+_arr[1], -sah05+_arr[4]),//3
        			new THREE.Vector3( -sah05,-sah05+_arr[3], -sah05+_arr[4]),//2
        			new THREE.Vector3( -sah05,-sah05+_arr[3], -sah05+_arr[2])//1
        		)	
        			
        		auv.push(
        			new THREE.Vector2(_arr[5],_arr[6]),//0
					new THREE.Vector2(_arr[5],_arr[8]),//3
					new THREE.Vector2(_arr[7],_arr[8]),//2
        			new THREE.Vector2(_arr[7],_arr[6])//1   
        		)
        	} 



        	if(_arr[0]==1){//лицо  
        		ap.push(
        			new THREE.Vector3( sah05,-sah05+_arr[3], -sah05+_arr[2]),//1
					new THREE.Vector3( sah05,-sah05+_arr[3], -sah05+_arr[4]),//2
        			new THREE.Vector3( sah05,-sah05+_arr[1], -sah05+_arr[4]),//3
        			new THREE.Vector3( sah05,-sah05+_arr[1], -sah05+_arr[2]),//0      			
        			
        			
        		)	
        			
        		auv.push(
        			new THREE.Vector2(_arr[5],_arr[6]),//0
					new THREE.Vector2(_arr[5],_arr[8]),//3
					new THREE.Vector2(_arr[7],_arr[8]),//2
        			new THREE.Vector2(_arr[7],_arr[6])//1   
        		)
        	} 



        	if(_arr[0]==0){//лицо  
        		ap.push(
        			new THREE.Vector3(-sah05+_arr[1], -sah05+_arr[2], -sah05),//0
        			new THREE.Vector3(-sah05+_arr[1], -sah05+_arr[4], -sah05),//3
        			new THREE.Vector3(-sah05+_arr[3], -sah05+_arr[4], -sah05),//2
        			new THREE.Vector3(-sah05+_arr[3], -sah05+_arr[2], -sah05)//1
        		)	
        			
        		auv.push(
        			new THREE.Vector2(_arr[5],_arr[6]),//0
					new THREE.Vector2(_arr[5],_arr[8]),//3
					new THREE.Vector2(_arr[7],_arr[8]),//2
        			new THREE.Vector2(_arr[7],_arr[6])//1   
        		)
        	}  


        	if(_arr[0]==2){//лицо  
        		ap.push(
new THREE.Vector3(-sah05+_arr[3], -sah05+_arr[2], sah05),//1
new THREE.Vector3(-sah05+_arr[3], -sah05+_arr[4], sah05),//2
        			new THREE.Vector3(-sah05+_arr[1], -sah05+_arr[4], sah05),//3
        			new THREE.Vector3(-sah05+_arr[1], -sah05+_arr[2], sah05),//0
        			
        			
        			
        		)	
        			
        		auv.push(
        			new THREE.Vector2(_arr[5],_arr[6]),//0
					new THREE.Vector2(_arr[5],_arr[8]),//3
					new THREE.Vector2(_arr[7],_arr[8]),//2
        			new THREE.Vector2(_arr[7],_arr[6])//1   
        		)
        	} 
        	

        	if(_arr[0]==4){
        		
        		for (var i = 0; i < _arr.length; i++) {
        			trace("pp,",i,"==",_arr[i])
        		}
        		ap.push(
        			new THREE.Vector3(-sah05+_arr[1], sah05, -sah05+_arr[2]),//0
        			new THREE.Vector3(-sah05+_arr[1], sah05, -sah05+_arr[4]),//3
        			new THREE.Vector3(-sah05+_arr[3], sah05, -sah05+_arr[4]),//2
        			new THREE.Vector3(-sah05+_arr[3], sah05, -sah05+_arr[2])//1
        		)	
        			
        		auv.push(
        			new THREE.Vector2(_arr[5],_arr[6]),//0
					new THREE.Vector2(_arr[5],_arr[8]),//3
					new THREE.Vector2(_arr[7],_arr[8]),//2
        			new THREE.Vector2(_arr[7],_arr[6])//1
        			
        			

        			)
        	}     
        	if(_arr[0]==5){
        		
        		
        		ap.push(
        			new THREE.Vector3(-sah05+_arr[3], -sah05, -sah05+_arr[2]),//1
					new THREE.Vector3(-sah05+_arr[3], -sah05, -sah05+_arr[4]),//2
        			new THREE.Vector3(-sah05+_arr[1], -sah05, -sah05+_arr[4]),//3
        			new THREE.Vector3(-sah05+_arr[1], -sah05, -sah05+_arr[2]),//0     			
              	)	
        			
        		auv.push(
        			new THREE.Vector2(_arr[5],_arr[6]),//0
					new THREE.Vector2(_arr[5],_arr[8]),//3
					new THREE.Vector2(_arr[7],_arr[8]),//2
        			new THREE.Vector2(_arr[7],_arr[6])//1     			
        		)
        	} 

        }


    }
}


export class  MMesh{
    constructor(par) {
        this.type = "MMesh";
        var self = this;
        this.name = 'xz';
        this.geometry
        this.mesh
		this.arrPosition=[]
        this.arrUV=[];


        this.init = function(s,ap,auv){
        	if(this.mesh){
        		return
        	}
        	trace("pppp,,,",s,ap,auv)
        	this.geometry = new THREE.BufferGeometry();


        	this.mesh = new THREE.Mesh( this.geometry, par.par.mvbMaterial.material );
        }

        this.set = function(s,ap,auv){
        	
        	this.init()
        	this.arrPosition=[]
        	this.arrUV=[];
        	let r=1
        	let rr=22
        	/*for (var i = 0; i < 3*rr; i++) {
        		this.arrPosition.push(Math.random()*r-r/2,Math.random()*r-r/2,Math.random()*r-r/2)
        	}
        	for (var i = 0; i < 2*rr; i++) {
        		this.arrUV.push(Math.random(),Math.random())
        	}
*/
        	for (var i = 0; i < ap.length; i+=4) {
        		this.plus(ap[i],ap[i+1],ap[i+2],ap[i+3],auv[i],auv[i+1],auv[i+2],auv[i+3])
        		this.plus1(ap[i],ap[i+1],ap[i+2],ap[i+3],auv[i],auv[i+1],auv[i+2],auv[i+3])
        	}


        	this.vertices = new Float32Array( this.arrPosition)
        	this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );
        	//this.geometry.setAttribute( 'uvs', new THREE.BufferAttribute( this.arrUV, 2 ) );
        	this.geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( this.arrUV, 2 ) );
        }



        this.plus = function(p,p1,p2,p3,au,au1,au2,au3){

        	trace('pppp,,,',p,p1,p2,p3,au,au1,au2,au3)

        	this.arrPosition.push(p.x,p.y,p.z)
        	this.arrPosition.push(p1.x,p1.y,p1.z)
        	this.arrPosition.push(p2.x,p2.y,p2.z)   
        	this.arrUV.push(au.x,au.y)
        	this.arrUV.push(au1.x,au1.y)
        	this.arrUV.push(au2.x,au2.y)  
        }


        this.plus1 = function(p,p1,p2,p3,au,au1,au2,au3){        	
        	this.arrPosition.push(p.x,p.y,p.z)
        	this.arrPosition.push(p2.x,p2.y,p2.z)
        	this.arrPosition.push(p3.x,p3.y,p3.z)        	
        	this.arrUV.push(au.x,au.y)
        	this.arrUV.push(au2.x,au2.y)
        	this.arrUV.push(au3.x,au3.y)
        	
        }


    }
}




//Подложка под Локол Хорон
export function LocalS(fun,_key) {
	this.fun = fun;
	var self = this;
	this.object;
	this.key = _key||'shirt';
	this.object; // тут храняться все данные с localStorage
	var b;
	// инициализация localStorage
	this.initLoad=function() {
		b=true;
		this.object = window.localStorage[this.key];
		if(this.object == "undefined")b=false;
		if(this.object == undefined)b=false;
		
		// проверка пуст ли  localStorage
		if(b == false) {
			this.object = this.getStartObj(); // если localStorage пуст, записываем обьект с функции getStartObj
		}else {
			this.object = jQuery.parseJSON(this.object); // если localStorage не пуст записываем содержимое предварительно
		}	
		if(this.fun)self.fun();
	}
	
	// если localStorage пуст, записываем обьект
	this.getStartObj = function() {
		/*var obj = {
			activ:false,
			dubag:false,
			menu:{},
			xz:{}
		};*/
		return {}//obj;
	}

	// сохраняем в localStorage данные
	this.save = function() {		
		window.localStorage[this.key] = JSON.stringify(self.object);
	}

	// сохраняем в localStorage данные
	this.clear = function() {
		window.localStorage[this.key] = undefined;
	}
	self.initLoad();
	//setTimeout(function() {self.initLoad();}, 1);
		
}



