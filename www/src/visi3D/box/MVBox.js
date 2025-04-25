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

import { MVisi3D } from '../MVisi3D.js';     //вьювер3д
import { SceneSB } from '../SceneSB.js';     //вьювер3д
import { MVBMaterial } from './MVBMaterial.js';     //вьювер3д
import { MVBMeshs } from './MVBMeshs.js';     //вьювер3д

import { MVBZumePlus } from './MVBZumePlus.js';     //вьювер3д


export class  MVBox{
    constructor(fun) {
        this.type = "MVBox";
        var self = this;
        this.pause=false
        this._wh=128;
        this._activeMesh=null;
        this._rotationX=0;
        this._rotationZ=0;
        this.fun=fun

        this._lineSize=20
        this._lineSize1=80
        this._fontSize=120;

        this.pz={x:0,y:0,s:1,width:this._wh,height:this._wh}
        this._sah01=0.2;
        this._fontFamily='Arial'//dcmParam._fontFamily;
        this._colorText="#ff0000"//dcmParam._colorText; 
        //this._aText=['X1','-X3','Y4','-Y5','Z2','-Z0'];
        this._aText=['X','-X','Y','-Y','Z','-Z'];
        //this._aText=['СПРАВА','СЛЕВА','СПЕРЕДИ','СЗАДИ','СНИЗУ','СВЕРХУ'];
        this._colorLine="#00ff00";
    	this._color="#cccccc";
        this._color1='#45739a'
        this.time=500;
        this._startAngel=0.5;
        this._boolAlpha=false;

        this._prp=40;

        this.compToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? '0' + hex : hex;
        };

        this.hexDec = function (h) {
            var m = h.slice(1).match(/.{2}/g);
            m[0] = parseInt(m[0], 16);
            m[1] = parseInt(m[1], 16);
            m[2] = parseInt(m[2], 16);
            return m;
        };

        this.compToHexArray = function (a, num) {
            if (num != undefined)
                for (var i = 0; i < a.length; i++) {
                    a[i] += num;
                    if (a[i] < 0) a[i] = 0;
                    if (a[i] > 255) a[i] = 255;
                }
            return (
                '#' +
                this.compToHex(a[0]) +
                this.compToHex(a[1]) +
                this.compToHex(a[2])
            );
        };


        var cc,vv,bb,aa,nn, uu
        ///Вернет цвет ниже/выще по 255 color=._color1 value=20 bool=false
        this.getColor = function (color, value, bool) {
            cc=color||this._color1; 
            vv=value||20
            bb=false 
            if(bool===true)bb=true;

            aa=this.hexDec(color);
            nn=(aa[0]+aa[1]+aa[2])/2

            uu=1;
            if(bb==false){
                if(nn>128){
                    uu=-1

                }
                vv=Math.abs(vv)
            }        
            return this.compToHexArray(this.hexDec(cc),uu*vv)   
        }


        
        this._colorLine=this.getColor(this._color,this.prp)
        this._colorText=this.getColor(this._color,this.prp)
        this.contHTML = document.createElement('div');
        this.contHTML.style.position = 'fixed';
        this.contHTML.style.top = '0px';
        this.contHTML.style.left = '0px';
        this.contHTML.style.pointerEvents = 'none';
        this.visi3D = new MVisi3D(this.contHTML, null, false, true, true, true, true);
        this.visi3D.yes3d = true;
        this.content3d = new THREE.Object3D();


        let dCont=new DCont(this.contHTML)

       /* let panel=new DPanel(dCont)
        panel.wh=11*/

        let r1=100;
        this.content3d.scale.set(r1,r1,r1)
    	this.visi3D.groupObject.add(this.content3d) 

        //this.visi3D.groupObject.position.z=-100

        this.content3d1 = new THREE.Object3D();
        this.visi3D.groupObject.add(this.content3d1) 

        this.setObjV3D = function(oSp){
            this.sceneSB = new SceneSB(this.visi3D);        
            if(oSp){
                for (var i = 0; i < this.sceneSB.array.length; i++) {
                    if (oSp.scene[this.sceneSB.array[i].name] === undefined) {
                        oSp.scene[this.sceneSB.array[i].name] = {};
                    }                
                    this.sceneSB.array[i].setBasa(oSp.scene[this.sceneSB.array[i].name]);
                }
            } 
            this.dddddv3()
        }


        this.dddddv3 = function(){
            let r=400
            this.visi3D.zume = r;
            this.visi3D.position3d.minZum=r
            this.visi3D.position3d.maxZum=r
            this.visi3D.isDragPan=false;  
            this.visi3D.utility.debug=false;  
            this.visi3D.intRend=1;
        }


        ///////////////////////////////////////////  
        this.isRect = function (point, rect) {
            if ((point.x >= rect.x) && (point.x <= rect.x + rect.width*rect.s)) {
                if ((point.y >= rect.y) && (point.y <= rect.y + rect.height*rect.s)) {
                    return true;
                }
            }
            return false;
        };


        let p3={x:0, y:0}
        var ep, ep1
        var rezultB
        this.tFun = function(s,p,p1){
            ep=p
            ep1=p1
            self.pz.width=self._wh;
            self.pz.height=self._wh;  
            rezultB=false
            if(self.isRect(p1,self.pz)==true){                
                rezultB=true;

                

                p3.x=(p1.x-self.pz.x)/self.pz.s;
                p3.y=(p1.y-self.pz.y)/self.pz.s;//-(self.wh*(1-self.pz.s))
                
             /*   panel.x=p3.x
                panel.y=p3.y*/


                if(s=="down"){
                    self.visi3D.event3DArr.naCont=true
                    self.visi3D.event3DArr.mousedown(p,p3)
                    if(self.fun){
                        self.fun("down", p,p1)
                    }
                }
                self.visi3D.event3DArr.naCont=true
                self.visi3D.event3DArr.mousemove(p,p3)

                if(self.mvbMeshs && self.mvbMeshs.mRot1.mesh.visible){
                  
                    self.positionSetE(self.visi3D.event3DArr.event3D)
                }

            }

            if(self.boolS1)rezultB=self.boolS1

            self.boolAlpha=rezultB;

            return false
        }

        ///////////////////////////////////////////////////////////////////
        this.mouseup = function (e) {  
            if(oPos)self.corectAngel(dinO)    
            self.stop()                    
        }


        this.stop = function () {           
            if (self.mobile == false) {
                document.removeEventListener('mouseup', self.mouseup);
            } else {
                document.removeEventListener('touchend', self.mouseup);
            }
            dcmParam.removeFunMove(self.mouseMove)

            oPos=null
            
        }


        this.mouseMove= function (e) {            
            

            if(Math.abs(dcmParam.globXY.x-oPos.x)>2 || Math.abs(dcmParam.globXY.x-oPos.x)>2 ){              
                self.stop()
            }
        }
        //////////---------------------------------------------------------------

        ///////////////////////////////////////////////////////////////////
        this.mouseup1 = function (e) {  
            //if(oPos)self.corectAngel(dinO)    
            self.stop1()                    
        }


        this.stop1 = function () {           
            if (self.mobile == false) {
                document.removeEventListener('mouseup', self.mouseup1);
            } else {
                document.removeEventListener('touchend', self.mouseup1);
            }
            dcmParam.removeFunMove(self.mouseMove1)
          
            self.vGlaf.position3d.pause=sPause;
            self.mvbMeshs.mRot1.angel=1;
            self.boolS1=false;
            self.mvbMeshs.mRot1.mesh.visible=false;
          
            self.tFun("move",ep,ep1)
            
        }


        this.mouseMove1= function (e) {   


            if(self.pause)return  


                let asd=self.angleStart1-self.angleStart; 
                let asd1=asd*180/Math.PI
                self.boolS1=true;           
                let ase=self.getAngel()  

                let ase1=ase-self.asAA;           
                if(self.vGlaf.rotationX>Math.PI/2){
                    ase1*=-1
                   
                }
                let ase2=ase//%(Math.PI);



                
                let aad = self.asRotZ-ase1

                let av=aad*180/Math.PI
                let av1=Math.round(av/45)*45;
                let dsds=0
                if(Math.abs(av1-av)<4){
                    dsds=av1-av
                    av=  av1 
                    
                }

                let avss= av 

                let ase3=(avss-av);

                let addo1=-(ase1 -dsds*Math.PI/180 )*180/Math.PI;
                let addo=addo1;
                if(addo>180){
                    addo=addo-360
                }
                if(addo<-180){
                    addo=360+addo
                }
                


                


            if(dinO && dinO.par.type=="MVBMeshs"){ 
            






                self.mvbMeshs.mRot1.angel=addo;

                self.vGlaf.rotationZ= avss* Math.PI  / 180;//aad
            } 
            //trace(dinO)
            if(dinO && dinO.par.type=="MVBZumePlus"){ 
                
               // self.positionSetEWWW(e)
                trace("======",addo,addo1,self.angleStart )
                
                dinO.par.setAngelDown(self.angleStart-addo*Math.PI/180)                     
                self.visi3D.intRend=1;
            }
            
        }

        this.start1 = function () { 
            sPause=  self.vGlaf.position3d.pause
            self.vGlaf.position3d.pause=true;
            self.boolS1=true; 
            if (dcmParam.mobile == false) {
                document.addEventListener('mouseup', self.mouseup1);
            } else {
                document.addEventListener('mouseup', self.mouseup1);                    
            }
          
            dcmParam.addFunMove(self.mouseMove1)
            self.asAA=self.getAngel(true) 
            self.angleStart1=self.angleStart
            self.asRotZ=self.vGlaf.rotationZ;

            if(dinO && dinO.par.type=="MVBMeshs"){ 
                self.mvbMeshs.mRot1.mesh.visible=true
                
            }
            
        } 

        this.pointZdvig={x:0,y:0}
        self.asAA=0;
        self.asRotZ=0;
        self.boolS1=false;
        self.positionA={x:0,y:0};
        self.pA={x:0,y:0};
        let vsw=new THREE.Vector3()
        this.getAngel = function (b) { 
            if(b){
                self.content3d1.add(self.o3d)
                self.o3d.getWorldPosition(vsw)
                self.toScreenXY(vsw)
                self.positionA.x=self.pz.x+vectorScreen.x+self.pointZdvig.x;
                self.positionA.y=self.pz.y+vectorScreen.y+self.pointZdvig.y;
                self.content3d1.remove(self.o3d)
            }

            //let aaa=self.getAngle11(self.positionA, dcmParam.globXY);

            /*visiP.x=self.positionA.x;
            visiP.y=self.positionA.y*/;

            return self.getAngle11(self.positionA, dcmParam.globXY) 

        }
        this.getAngle11 = function (a, b) {            
            return Math.atan2(b.y - a.y, b.x - a.x);
        };
        var vectorScreen = new THREE.Vector2();
        var vector3 = new THREE.Vector3();
        this.toScreenXY = function (v3) { // 3d world vector to screen
            vector3.copy(v3);
            vector3.project(self.visi3D.camera);
            vectorScreen.x = Math.round((vector3.x + 1) * self.visi3D._width / 2*1000)/1000;
            vectorScreen.y = Math.round((-vector3.y + 1) * self.visi3D._height / 2*1000)/1000;

            return vector3;
        };


        this.o3d=new THREE.Object3D()
        this.o3d.position.z=50
        


        //////////---------------------------------------------------------------



        let  sPause
        let dinO
        let oPos=null
        this.down = function (e) { 
            if(self.pause)return
            if(e && e.target){  
                if(e.target.objectDin){  
                    trace(">>>>positionSetE>>1>")            
                    dinO=e.target.objectDin  
                    if (dcmParam.mobile == false) {
                        document.addEventListener('mouseup', self.mouseup);
                    } else {
                        document.addEventListener('mouseup', self.mouseup);                    
                    }
                    oPos={x:0,y:0}
                    oPos.x = dcmParam.globXY.x;
                    oPos.y = dcmParam.globXY.y;
                    dcmParam.addFunMove(self.mouseMove)
                  
                } 
                    
                if(e.target.oDin){
                    if(e.target.oDin.par.type=="MVBZumePlus"){
                        dinO=e.target.oDin 
                        self.positionSetE(e)
                        e.target.oDin.par.setAngelDown(self.angleStart)
                        self.start1();
                        self.visi3D.intRend=1;
                    }
                    
                    if(e.target.oDin.par.type=="MVBMeshs"){
                        dinO=e.target.oDin 
                        self.positionSetE(e)
                        self.start1();
                        
                        self.visi3D.intRend=1;
                    } 
                }    
                    
            }
        }


        this.out = function (e) {  
            if(self.pause)return
            if(self.boolS1==true)return   
            if(e && e.target && e.target.objectDin){
                e.target.objectDin.active=false;
                self.activeMesh=null;
                self.visi3D.intRend=1;
            }
            if(e && e.target && e.target.oDin){
                if(e.target.oDin.par.type=="MVBZumePlus"){

                }
                
                if(e.target.oDin.par.type=="MVBMeshs"){
                    e.target.oDin.par.mRot1.mesh.visible=false;              
                    self.visi3D.intRend=1;
                }                
            }
        }


        this.over = function (e) { 
            if(self.pause)return            
            if(self.boolS1==true)return

            if(e && e.target && e.target.objectDin){
             
                e.target.objectDin.active=true; 
                self.activeMesh=e.target.objectDin; 
                self.visi3D.intRend=1;              
            } 
            if(e && e.target && e.target.oDin){
                if(e.target.oDin.par.type=="MVBZumePlus"){

                }
                
                if(e.target.oDin.par.type=="MVBMeshs"){
                    e.target.oDin.par.mRot1.mesh.visible=true;  
                    self.positionSetE(e) 
                    self.visi3D.intRend=1; 
                }
                trace(">ww>>",e.target.oDin.par)
                            
            }            
        }

        this.getAngle = function (a, b) {            
            return Math.atan2(b.y - a.y, b.x - a.x);
        };


        let vv0=new THREE.Vector3()
        let vv1=new THREE.Vector3(0,0,0)

       // this.ax=new THREE.AxesHelper(20)
       // this.content3d1.add(this.ax)

        let aaa,aaa1;
        this.angleStart;
        self.angleStart1;
        this.positionSetE = function (e) { 
           
            if(self.pause)return
     
            if(!e)return
            if(!e.target)return    
            if(self.boolS1)return 
          
            if(!e.target)return 
           
            if(!e.target.oDin)return  
                
            
            this.positionSetEWWW(e)
        }

        this.positionSetEWWW = function (e) { 
            vv0.x=e.point.x;
            vv0.y=-e.point.z;
            self.visi3D.intRend=1;
          

            aaa=this.getAngle(vv0, vv1)            
            aaa1=-aaa+Math.PI
         
            self.angleStart=aaa1
            if(e.target.oDin){
                if(e.target.oDin.par.type=="MVBMeshs"){
                    e.target.oDin.par.mRot1.mesh.rotation.z=aaa1  
                }
            }
        }

        

        this.visi3D.addEvent("down", this.down);
        this.visi3D.addEvent("out", this.out);        
        this.visi3D.addEvent("over", this.over);

        this.az=[]
        this.tween
        let pp,pp1
        this.corectAngel = function(objectDin){          
            let rX=objectDin.rX;
            let rZ=objectDin.rZ;           

            if(this.tween == undefined){
                this.tween=new TWEEN.Tween(this.vGlaf)
                this.tween.onComplete(function(){                    
                    self.tFun("move", ep, ep1)
                    self.visi3D.intRend=1;  
                })
                this.tween.onUpdate(function(){                    
                    
                    self.visi3D.intRend=1;  
                })

            }
            if(objectDin.name=="gr_Box"){
                if(this.tween1 == undefined){
                    this.tween1=new TWEEN.Tween(this.vGlaf)
                    
                }
                this.tween1.stop();
                this.tween1.to( {xVerh:0, yVerh:0, zVerh:0 },this.time).start()
                this.tween.onUpdate(function(){                    
                    
                    self.visi3D.intRend=1;  
                })
                return
            }

            


            rX=rX*Math.PI/180            
            if (this.vGlaf.position3d.minMaxX.x > rX) rX = this.vGlaf.position3d.minMaxX.x;
            if (this.vGlaf.position3d.minMaxX.y < rX) rX = this.vGlaf.position3d.minMaxX.y;
            rZ=rZ*Math.PI/180
            this.vGlaf.rotationZ%= Math.PI*2;
            this.az[0]=this.vGlaf.rotationZ-rZ;
            this.az[1]=this.vGlaf.rotationZ-Math.PI*2 - rZ;
            this.az[2]=this.vGlaf.rotationZ+Math.PI*2 - rZ;
            pp=9999999999990;
            pp1 = 0
            for (var i = 0; i < this.az.length; i++) {
                if(Math.abs(this.az[i])<pp){
                    pp=Math.abs(this.az[i]);
                    pp1=i
                }
            }          
            if(pp1==2)this.vGlaf.rotationZ+= Math.PI*2
            if(pp1==1)this.vGlaf.rotationZ-= Math.PI*2  


          

            this.tween.stop();
            this.tween.to({rotationZ:rZ,rotationX:rX },this.time).start()
        }


        ////////////////////////////////


        this.vGlaf
        this.setVisi3D = function(vGlaf){
            this.vGlaf=vGlaf;
            this.vGlaf.arrFunDrag.push(this.funDrag);
            this.vGlaf.event3DArr.addFun(this.tFun)
        }


        this.funDrag = function(){  
            if(self.pause)return       
            self.rotationX = self.vGlaf.rotationX;
            self.rotationZ = self.vGlaf.rotationZ; 
            self.mvbZumePlus.setXZ(self.vGlaf.rotationX,self.vGlaf.rotationZ)
            self.mvbZumePlus.zume=self.vGlaf.zume;
            self.visi3D.intRend=1
            if(self.mvbMeshs)self.mvbMeshs.dragXY()
            
        }

   
        this.drag = function(){  
        	this.visi3D.sizeWindow(0,0,this._wh,this._wh)					
		}

		
		this.init = function(){
			if(this.mvbMaterial)return
			this.mvbMaterial = new MVBMaterial(this) 
            this.mvbMaterial.init();
            this.mvbMaterial1 = new MVBMaterial(this) 
            this.mvbMaterial1.init();
        	this.mvbMeshs = new MVBMeshs(this)			
			this.mvbMeshs.drag();
			this.content3d.add(this.mvbMeshs.c3);


            this.mvbZumePlus=new MVBZumePlus(this)             
            this.content3d.add(this.mvbZumePlus.content3d);

			this.drag()
            this.drag1()
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
            this.mvbMaterial._colorText=this.getColor(this._color,this.prp)
            this.mvbMaterial._colorLine=this.getColor(this._color,this.prp) 
        	this.mvbMaterial.dragCanvas();	
            
            this.mvbMaterial1._color=this._color1;

            this.mvbMaterial1._colorText=this.getColor(this._color1,this.prp)
            this.mvbMaterial1._colorLine=this.getColor(this._color1,this.prp) 

            this.mvbMaterial1._fontFamily=this._fontFamily            
            this.mvbMaterial1._aText=this._aText
            this.mvbMaterial1._lineSize=this._lineSize;
            this.mvbMaterial1._lineSize1=this._lineSize1;
            this.mvbMaterial1._fontSize=this._fontSize;
            this.mvbMaterial1.dragCanvas();  
        	this.visi3D.intRend=1		
		}


		this.drag2 = function(){
        	this.mvbMeshs._sah01=this._sah01;
        	this.mvbMeshs.drag();
        	this.visi3D.intRend=1;		
		}


		this.drag3 = function(){        	
        	this.visi3D.rotationZ=	this._rotationZ
        	this.visi3D.rotationX=	this._rotationX
		}
		

		this.upDate = function() {        
            this.visi3D.upDate(); 
        }
	   
        this.dddddv3();
        this.tba=undefined
        self.alpha=self._startAngel    
	}	

    set boolAlpha(value) {
        if(this._boolAlpha!=value){
            this._boolAlpha = value;
            if(this.tba==undefined)this.tba=new TWEEN.Tween(this);
            this.tba.stop()
            if(this._boolAlpha){
                this.tba.to({alpha:1},this.time).start()
            }else{
                this.tba.to({alpha:this._startAngel},this.time).start()
            }
        }
    }
    get boolAlpha() { return  this._boolAlpha;}


    set alpha(value) {
        if(this._alpha!=value){
            this._alpha = value;
            this.contHTML.style.opacity = this._alpha;
        }
    }
    get alpha() { return  this._alpha;}

    set startAngel(value) {
        if(this._startAngel!=value){
            this._startAngel = value;
            this.alpha=this._startAngel;            
        }
    }
    get startAngel() { return  this._startAngel;}   


    set activeMesh(value) {
        if(this._activeMesh!==value){
            this._activeMesh=value;
            this.mvbMeshs.activeMesh=value;
        }       
    }
    get activeMesh() {
        return this._activeMesh;
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

    set prp(value) {
        if(this._prp!==Math.round(value)){
            this._prp=Math.round(value)
            this.drag1();
        }       
    }
    get prp() {
        return this._prp;
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


    set color(value) {
        if(this._color!==value){
            this._color=value
            this._colorLine=this.getColor(this._color,this.prp)
            this._colorText=this.getColor(this._color,this.prp)
            this.drag1();
        }       
    }
    get color() {
        return this._color;
    }   


    set color1(value) {
        if(this._color1!==value){
            this._color1=value 
            this.drag1();
        }       
    }
    get color1() {
        return this._color1;
    }   
}





