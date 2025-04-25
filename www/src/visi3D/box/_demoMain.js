

import { MVisi3D } from '../../visi3D/MVisi3D.js';     //вьювер3д
import { SceneSB } from '../../visi3D/SceneSB.js'      //для в3д


import { MVBox } from './MVBox.js'          //для в3д
///Ночало))







export class Main{
 	constructor(fun) {
		this.type="Main";		 	

	 	window.mainBig=this
	    var self=this;
	    this.fun=fun
	  	this.contentHTML= document.createElement(
			'div'
		);// dsds
	 	this.contentHTML.style.position = 'fixed';
		this.contentHTML.style.top = '0px';			
		this.contentHTML.style.left = '0px';
		document.body.appendChild(this.contentHTML);  



		dcmParam.wh2=24;				//Маленькая высота компонентов
  		dcmParam.fontSize=16;	//шрифт
  		dcmParam.fontSizeLitte=10;//мелкий шрифт
  		dcmParam.otstup=2//	10//		5;//			//отступ 
  		dcmParam.borderRadius=4;
  		dcmParam.color= "#05828e"//"#545454"//оновная поалитра 
  		dcmParam.color1="#202c31"//"#3d3d3d"//оновная поалитра 
  		dcmParam.colorActive="#bdbdbd"
  		dcmParam.fontFamily = "SFUIDisplay-Light"//"PT Mono";			//тип шрифта, надо подключать
  		dcmParam.scalePic=0.5;						//картинки в конпках по умолчанию



		this.dCont=new DCont(this.contentHTML)

		this.dContv3 = new DCont(this.dCont)
		this.dContBox = new DCont(this.dCont)
		this.dCont1 = new DCont(this.dCont)	
		trace("ffff")	




		//создание сцены
  		this.start = function () {	


  			let sss='{"id":1,"ru":"Настройки сцены","en":"all_1_en","bg":"all_1_bg","cn":"all_1_cn","uuid":"all_1_uuid","t":"a","json":{},"icon":"resources/date/all/1/i/image.svg","sort":1,"scane":{"ambient":{"works":true,"active":true,"color":"#ffffff","intensity":2.56},"shadow":{"works":true,"active":true,"mapSize":4096,"color":"#ffffff","bias":-0.0004,"intensity":3.1,"radius":2,"bAlphaForCoating":false,"fixation":false,"rotationX":-0.39,"rotationZ":-2.32,"distance":400,"cubWidth":600,"cubHeight":297.54,"distanceUpdateShadow":500},"sky":{"works":true,"active":false,"color":"0xffffff","link":"nullMy","radius":2268},"visi3D":{"works":true,"alwaysRender":true,"fov":45,"far":100000,"minZum":1,"maxZum":4000,"zume":250,"powerZum":50,"minRotationX":2.5,"maxRotationX":0,"debug":true,"isDragPan":true,"alphaAd":false,"rotationX":0,"rotationZ":0,"globZ":0},"positBox":{"works":true,"active":true,"distMinMaxBox":500,"activeAround":true,"visiRaund":true},"fog":{"works":true,"active":true,"color":"#000000","near":610,"far":17677}},"scene":{"ambient":{"works":true,"active":true,"color":"#ffffff","intensity":2.56},"shadow":{"works":true,"active":true,"mapSize":4096,"color":"#ffffff","bias":-0.0004,"intensity":3.1,"radius":2,"bAlphaForCoating":false,"fixation":false,"rotationX":-0.39,"rotationZ":-2.32,"distance":400,"cubWidth":600,"cubHeight":297.54,"distanceUpdateShadow":500},"sky":{"works":true,"active":false,"color":"0xffffff","link":"nullMy","radius":2268},"visi3D":{"works":true,"alwaysRender":true,"fov":45,"far":100000,"minZum":1,"maxZum":4000,"zume":250,"powerZum":50,"minRotationX":2.5,"maxRotationX":0,"debug":true,"isDragPan":true,"alphaAd":false,"rotationX":0,"rotationZ":0,"globZ":0},"positBox":{"works":true,"active":true,"distMinMaxBox":500,"activeAround":true,"visiRaund":true},"fog":{"works":true,"active":true,"color":"#000000","near":610,"far":17677}},"sky":{"boolFormat":true,"array":[{"key":"null","name":"1708502789_flomaster-top-p-gorodskaya-panorama-pinterest-risunok-6.jpg","size":110004,"text":"110004kbs, 1708502789_flomaster-top-p-gorodskaya-panorama-pinterest-risunok-6.jpg","a":false,"src":"resources/date/all/1/sky/1708502789_flomaster-top-p-gorodskaya-panorama-pinterest-risunok-6.jpg","info":{"key":"JPG","name":"1708502789_flomaster-top-p-gorodskaya-panorama-pinterest-risunok-6.jpg","src":"resources/date/all/1/sky/1708502789_flomaster-top-p-gorodskaya-panorama-pinterest-risunok-6.jpg","width":750,"height":223,"whText":"750x223px"}},{"key":"null","name":"1708502789_flomaster-top-p-gorodskaya-panorama-pinterest-risunok-6 (1).jpg","size":977853,"text":"977853kbs, 1708502789_flomaster-top-p-gorodskaya-panorama-pinterest-risunok-6 (1).jpg","a":false,"src":"resources/date/all/1/sky/1708502789_flomaster-top-p-gorodskaya-panorama-pinterest-risunok-6 (1).jpg","info":{"key":"JPG","name":"1708502789_flomaster-top-p-gorodskaya-panorama-pinterest-risunok-6 (1).jpg","src":"resources/date/all/1/sky/1708502789_flomaster-top-p-gorodskaya-panorama-pinterest-risunok-6 (1).jpg","width":2560,"height":761,"whText":"2560x761px"}}],"key":"png","name":"Carbon.png","active":false,"radius":2479},"mirro":{"boolFormat":true,"array":[{"src":"null","key":"hdr","name":"blouberg_sunrise_2_1k.hdr","size":1539084,"text":"1539084kbs, blouberg_sunrise_2_1k.hdr","a":true},{"src":"resources/date/all/1/mirro//moonless_golf_1k.hdr","key":"hdr","name":"moonless_golf_1k.hdr","size":1672754,"text":"1672754kbs, moonless_golf_1k.hdr","a":false},{"key":"null","name":"pic.png","size":26401,"text":"26401kbs, pic.png","a":false,"src":"null","info":{"key":"PNG","name":"pic.png","src":"null","width":256,"height":256,"whText":"256x256px"}}],"key":"hdr","name":"null"}}'
  			let oSp=JSON.parse(sss);

			this.visi3D = new MVisi3D(this.dContv3.div, null, dcmParam.mobile, true, false, true, false);
	        this.visi3D.yes3d = true;
	        this.content3d = new THREE.Object3D();
	        this.visi3D.groupObject.add(this.content3d);
	        window.visi3D = this.visi3D
	        visi3D.position3d.boolMouseRight = false;
	        //this.content3d.rotation.x=-Math.PI/2;



	        this.visi3D.utility.sky.setObj(oSp.sky)
	        this.visi3D.utility.sky.setObjMirro(oSp.mirro,function(t){            
	            if(window.pm)window.pm.mat.mirroAll() 
	        })
	        
	        
	        //

	        this.sceneSB = new SceneSB(this.visi3D);        
	        if(oSp){
	            for (var i = 0; i < this.sceneSB.array.length; i++) {
	                if (oSp.scene[this.sceneSB.array[i].name] === undefined) {
	                    oSp.scene[this.sceneSB.array[i].name] = {};
	                }                
	                this.sceneSB.array[i].setBasa(oSp.scene[this.sceneSB.array[i].name]);
	            }
	        }        
	        visi3D.utility.debug=false;  
	        visi3D.intRend=1;



	      /*  this.gridHelper = new THREE.GridHelper(1000, 10);
			this.gridHelper.rotation.x = -Math.PI / 2;

			
			this.content3d.add(this.gridHelper)*/



		 	

		 /*	this.mvBox = new MVBox();
		 	this.mvBox.setObjV3D(oSp);
		 	this.mvBox.setVisi3D(visi3D);
		 	this.mvBox._wh=200
	        this.mvBox.init();	        
	        this.dContBox.div.appendChild(this.mvBox.contHTML); */



	        this.array=[]
			this.plus = function (wh, pW, pH, color, color1) {
		    	let box= new MVBox(function(s,p,p1){
		    		
		    		if(s=="down"){
		    			menu.setBox(this)
		    		}
		    	});
		    	box.setVisi3D(this.visi3D); 
		        box.wh=wh
		        box._color=color 
		        box._color1=color1//dcmParam.getColor(color,40)      
		        box.init();
		        box.dCont=new DCont(this.dCont);
		        box.pW=pW;
		        box.pH=pH;	       
		        box.dCont.div.appendChild(box.contHTML)
		        box.idArr=this.array.length
				this.array.push(box);

				
				if(this.array.length==1)this.mvBox=box

		    }
		    this.plus(300, 1, 0, "#ffffff", "#444444")
		    this.plus(200, 1, 1, dcmParam.color,dcmParam.color1)
		    this.plus(100, 0, 1, "#f64601", "#000000")	
		    this.mvBox.prp=256;
		    this.mvBox.mvbZumePlus.active=true

		    visi3D.position3d.pScane.material.color=new THREE.Color("#f64601")
		    visi3D.position3d.pScane.material.opacity=0.95


		    this.mvBox=this.array[1];


	        var mause=new Mause(this);
	        this.mause=mause;
	        var menu=new Menu(this);	        
	        this.menu=menu;	

			var localS11=new LocalS1(function(){},"localS1111_");	

	        window.visi3D.fun_rotationX=function(){ 
	            

	            localS11.object["dragVisi3d1"]=self.visi3D.getObj();  
	            localS11.save()         
	        }

	      	if(localS11.object["dragVisi3d1"]){
            	this.visi3D.setObj(localS11.object["dragVisi3d1"])            
        	}

        	this.tick()
        }
   

        

	
        this.drag = function(){
        	

        	this.visi3D.sizeWindow(0,0,this._wh,this._wh)
						
		}

	        
	
	
		

		//тик размит надва
		var b=true
		this.tick = function () {
			requestAnimationFrame( self.tick );	
			self.visi3D.upDate(); 
			TWEEN.update();	
			if(self.mvBox)self.mvBox.upDate() 	
			for (var i = 0; i < self.array.length; i++) {
				self.array[i].upDate() 	
			}
		}



		this.scaleScan=1
		this.ww=100;
		this.hh=100;

 
		//Маштабим окна 		
  		this.sizeWindow = function(w,h){
  			
  			if(w){
  				this.ww=w;
				this.hh=h;
  			}
  			
  			
  			this.visi3D.sizeWindow(0,0,this.ww, this.hh);
  			
  			this.dContBox.x=Math.round(this.ww- this.mvBox._wh);
  			this.mvBox.pz.x=this.dContBox.x

  			this.sizeWindow1()
  		}
  		this.sizeWindow1= function(){
  			for (var i = 0; i < this.array.length; i++) {
  				let box=this.array[i]
  				box.dCont.x=(this.ww-box._wh)*box.pW;
	    		box.dCont.y=(this.hh-box._wh)*box.pH;

	    		box.pz.y=box.dCont.y//*s//-box._wh/2
            	box.pz.x=box.dCont.x//*s
				
	    		//box.pz.s=s;	

	    		box.pointZdvig.x=0//-box._wh/2//*(1-s);
            	box.pointZdvig.y=0//-box._wh/2//*(1-s); 

	    	} 
  		}

  		
  		this.start()



  	}
}



import { BVisi } from './BVisi.js' //для в3д


export class Mause{
 	constructor(par) {
		this.type="Mause";	
	    var self=this;
	    this.par=par;


	    this.array=[]

	    this.content3d = new THREE.Object3D();
	    this.par.content3d.add(this.content3d)	



	    this.addC3d=function(c3){

	    	let c3d = new THREE.Object3D();
	    	c3.tMause=this
	    	c3d.tMause1=this
	    	//c3d.tMause=this
	    	c3d.idArrCesh = this.array.length;	    	
	    	this.array.push(c3d)
	    	c3d.ao=false
	    	c3d.add(c3)
	    	this.content3d.add(c3d)

	    	visi3D.addChildMouse(c3)
			c3d.bVisi = new BVisi("tMause")        	
        	c3d.bVisi.in3d=c3;
        	c3d.add(c3d.bVisi.c3d);
        	c3d.bVisi.c3d.visible=false;
	    }


		let rr1=1000;
		let rr2=50;

        this.getO=function(_m){
	        var c1 = new THREE.Object3D();
	        var bm1=new THREE.Mesh(new THREE.BoxGeometry(1,1,1,2,2,2), _m)	       
	        bm1.scale.set(-rr1,rr1,rr2)
	        c1.add(bm1);		
	 		var re=rr1/3;
	        var rep=rr1/2;
	        for (var i = 0; i < 7; i++) {
	        	var m=new THREE.Mesh(new THREE.BoxGeometry(), _m)//new THREE.MeshPhongMaterial({color:0xffffff*Math.random()}))
	        	m.scale.set(Math.random()*re-re/2,Math.random()*re-re/2,Math.random()*re-re/2)
	        	m.position.set(Math.random()*rep-rep/2,Math.random()*rep-rep/2,Math.random()*rep-rep/2)
	        	c1.add(m)
	        }
	        return c1;
        }

		var d0=this.getO(this.par.mvBox.mvbMaterial.material)
		
        this.addC3d(d0)


		var d1=this.getO(this.par.mvBox.mvbMaterial1.material)
		d1.position.x=rr1-100
		d1.position.z=-100

        this.addC3d(d1)

		this.setColMat = function(cm, cm1) {   
			for (var i = 0; i < d0.children.length; i++) {
				d0.children[i].material=cm
			}
			for (var i = 0; i < d1.children.length; i++) {
				d1.children[i].material=cm1
			}
		} 
		this.setColMat(this.par.mvBox.mvbMaterial.material, this.par.mvBox.mvbMaterial1.material)      


		this.getPath = function(c3d, param) {   
		
			if(!c3d) return null
            if(c3d[param]!=undefined) return c3d[param];
            if(c3d.parent)return this.getPath(c3d.parent, param)
            return null
        }



        this.down = function (e) {   
        	
        	let tMause=self.getPath(e.target, "idArrCesh")
        	if(tMause!=null){
        		self.index=tMause;
        	}else{
        		self.index=-1;
        	}

        	//trace(tMause, e)
        }

        this.out = function (e) {  
        	
        	let tMause=self.getPath(e.target, "idArrCesh");

        	if(tMause!=null){
        		self.array[tMause].mNa=false
        		self.drah()
        	}
        }

        this.over = function (e) {  
        	let tMause=self.getPath(e.target, "idArrCesh");
        	if(tMause!=null){
        		self.array[tMause].mNa=true

        		self.drah()
        	}
        }

        this.move = function (e) {   

        }

        visi3D.addEvent("down", this.down);
        visi3D.addEvent("out", this.out);        
        visi3D.addEvent("over", this.over);


        this.drah = function () {   
        	for (var i = 0; i < this.array.length; i++) {
        		this.drah1(this.array[i])
        	}
        }
        let visi,color,alpha
        this.drah1 = function (c3d) {   
        	visi=false;
        	alpha=0.5

        	if(c3d.mNa){
        		color = dcmParam.color1//"#ffff00"//dcmParam.colorActive
        		visi=true;
        		alpha=0.65
        	}

        	if(c3d.ao){
        		color = dcmParam.color//"#ffff00"//dcmParam.colorActive
        		
        		if(c3d.mNa)color = dcmParam.getColor(dcmParam.color)

        		visi=true;
        		alpha=1
        	}

        	c3d.bVisi.color=color;
        	c3d.bVisi.alpha=alpha;
        	c3d.bVisi.c3d.visible=visi;      	
        }
	}


    set index(value) {
        if(this._index!==value){
            this._index=value 
            for (var i = 0; i < this.array.length; i++) {
            	if(i!=this._index)this.array[i].ao=false
            	else this.array[i].ao=true
            }
            this.drah()
        }       
    }
    get index() {
        return this._index;
    }  



}








export class Menu{
 	constructor(par) {
		this.type="Menu";	
	    var self=this;
	    this.par=par;
	    this.dCont=new DCont(this.par.dCont1)
	    this.wind=new DWindow(this.dCont, dcmParam.otstup,dcmParam.otstup,'debugger')
	    this.wind.width=222
	    this.wind.dragBool=false;



		let sss=0.8;
	    let yy=dcmParam.otstup

	    let ai=[
	    	{n:'xyz', fs:this.par.mvBox._fontSize, at:['X','-X','Y','-Y','Z','-Z']},
	    	{n:'xyzO12..', fs:100, at:['X1','-X3','Y4','-Y5','Z2','-Z0']},
	    	{n:'ru', fs:32, at:['СЛЕВА','СПРАВА','СПЕРЕДИ','СЗАДИ','СНИЗУ','СВЕРХУ']},
	    	{n:'en', fs:42, at:['LEFT', 'RIGHT', 'FRONT', 'BACK', 'BELOW', 'TOP']},
	    ]
	    let aaa=[]
	    for (var i = 0; i < ai.length; i++) {
	    	aaa[i]=ai[i].n;
	    }

	    let bs=new DButtons(this.wind.content,dcmParam.otstup,yy,aaa,function(){
	    	let ii=this.index	    	
	    	self.mvBox._aText=ai[ii].at;
	    	self.mvBox._fontSize=ai[ii].fs;
	    	trace(ii,self.mvBox._aText)
	    	self.mvBox.drag1()
	    	dPO.addObject(self.mvBox)

	    	
	    })
	    yy+=dcmParam.otstup+dcmParam.wh/sss

	    	    
		var dPO = new DParamObject(this.wind.content,dcmParam.otstup,yy,function(){
        	self.par.sizeWindow()
        	if(self.par.panel)self.par.panel.wh=self.mvBox._wh
		},1)
		dPO.window.title='MVBox';
		dPO.width=(this.wind.width-dcmParam.otstup*2)/sss
		dPO.mobile=true
		dPO.window.scale = sss;
		dPO.okrug=1000
	
		dPO.typeNotArray=["alpha", 'rotationX', 'rotationZ']
		

		yy+=dPO.height*sss+dcmParam.otstup

		this.wind.height=yy+dcmParam.wh2

		this.wind1=new DWindow(this.dCont, dcmParam.otstup*2+this.wind.width,dcmParam.otstup,'rotate')
	    this.wind1.width=222
	    this.wind1.dragBool=false;

	    var dP1 = new DParamObject(this.wind1.content,dcmParam.otstup,dcmParam.otstup,function(){
        	self.par.sizeWindow()
        	
		},1)
		dP1.window.title='MVBox';
		dP1.width=(this.wind.width-dcmParam.otstup*2)/sss
		dP1.mobile=true
		dP1.window.scale = sss;
		dP1.okrug=1000
		dP1.typeNotArray=['zume']

		this.box=undefined
		this.setBox=function(box){
			this.box=box
			this.mvBox=box
			dPO.addObject(this.box)	

			let aa=this.box._aText[0];
			let ii=0
			for (var i = 0; i < ai.length; i++) {
		    	if(ai[i].at[0]==aa){
		    		ii=i
		    	}
		    }
		    bs.index=ii;
		    this.par.mause.setColMat(this.box.mvbMaterial.material, this.box.mvbMaterial1.material) 
		    yy=dPO.height*sss+dcmParam.otstup
		    yy+=dcmParam.otstup*2+dcmParam.wh/sss
			this.wind.height=yy+dcmParam.wh2

			if(this.box.mvbZumePlus.active==true){
				this.wind1.visible=true
				dP1.addObject(this.box.mvbZumePlus)	
				this.wind1.height=dP1.height*sss+dcmParam.wh/sss
			}else{
				this.wind1.visible=false
			}


		}


		this.setBox(this.par.mvBox)

	}
}





//Подложка под Локол Хорон
function LocalS1(fun,_key) {
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

