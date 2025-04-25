

import { MVisi3D } from '../visi3D/MVisi3D.js';     //вьювер3д
import { SceneSB } from '../visi3D/SceneSB.js'      //для в3д
import { PM } from '../pm/PM.js';                   //бд 3д для кешев  


import { View } from './view/View.js';              //менюхи

import { Menu } from './menu/Menu.js';              //менюхи
import { TimeDrag } from '../component/utility/TimeInfo.js';





///Ветка основных класов, короче главный
export class Glaf {
    constructor(par) {
        this.type = "Glaf";
        var self = this;
        this.par = par;
        this.param = this.par.param;
        window.glafBig=this
        //window.aGlaf=this

       
        this.contHTML = document.createElement('div');
        this.contHTML.style.position = 'fixed';
        this.contHTML.style.top = '0px';
        this.contHTML.style.left = '0px';

        this.gPlusTitle=new GPlusTitle(this)


        //var o = mhbd.getKeyId("scenes3d", 2);//настройки сцены
        var oSp = mhbd.getKeyId("all", 1) 
        var alpha = false 
        var efect = true
 
        
      // if(localS.object.dubag1==true){
            alpha = true 
            efect = false
      //  }

        if(localS.object.behavior == undefined)  localS.object.behavior = false 
        
     
       


        this.dC = new DCont(par.contentHTML);
        /*if(localS.object.dubag || localS.object.dubag1){
            setTimeout(function() {
                self.par.fun("alphaLoad", 1)
            }, 1);
        }else{
            this.dC.alpha=0;
            let t=new TWEEN.Tween(this.dC)
            t.onUpdate(function() {
                self.par.fun("alphaLoad", self.dC.alpha)
        
            })
           
            setTimeout(function() {
                if(t)t.to({alpha:1},500).start() 
            }, 1); 
        }*/
       
        


        this.dDvisi= new DCont(this.dC);     
        this.dDvisi.div.appendChild(this.contHTML);

        //порезаный от пикси вювер        
        this.visi3D = new MVisi3D(this.contHTML, null, dcmParam.mobile, true, efect, true, alpha);
        this.visi3D.yes3d = true;
        this.content3d = new THREE.Object3D();
        this.visi3D.groupObject.add(this.content3d);
        window.visi3D = this.visi3D
        visi3D.position3d.boolMouseRight = false;

        this.content3d.rotation.x=-Math.PI/2



        window.visi3D=this.visi3D

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


        visi3D.sbfog.color=dcmParam.color3d2;

        let ss='{"xVerh":-270,"yVerh":-51.92,"zVerh":-235,"rotationX":1.43,"rotationZ":-0.85,"zume":930,"fov":45}'
        this.visi3D.setObj(JSON.parse(ss))

        

        this.visi3D.utility.sky.setObj(oSp.sky)

        this.visi3D.utility.sky.setObjMirro(oSp.mirro,function(t){            
            if(window.pm)window.pm.mat.mirroAll() 
        })     


        /*   window.pm = this.pm = new PM(visi3D, mhbd.objectBase, function(s, p, p1) {
           
            if(s=="creatMatDoReturn"){//Мат токо создан, но еще не отдался тому кто его хотел
                p.idObj=p.userData
            }
            if(s=="creatObject3dDoReturn"){//Мат токо создан, но еще не отдался тому кто его хотел
             
                p.rotation.x=Math.PI/2
            }
        })*/


        



        this.dCont = new DCont(this.dC);


        window.pm = this.pm = new PM(visi3D, mhbd.objectBase, function(s, p, p1) {
           
           /* if(s=="creatMatDoReturn"){//Мат токо создан, но еще не отдался тому кто его хотел
                p.idObj=p.userData
            }
            if(s=="creatObject3dDoReturn"){//Мат токо создан, но еще не отдался тому кто его хотел
             
                p.rotation.x=Math.PI/2
            }*/
        })
        pm.mat.colorStart = this.param.color1

        let b=false;
        if(localS.object.dubag1 || localS.object.dubag)b=true;
        
        pm.shapeAdd.active=true


        pm.mat.mColorA = new THREE.MeshPhongMaterial({
            color:dcmParam.color3d,
            transparent:true,          
            depthFunc:THREE.AlwaysDepth
        })
        pm.mat.mColorA.opacity=dcmParam.alpha3d


       /* pm.mat.mColorB = new THREE.MeshPhongMaterial({
            color:'#ff0000',//dcmParam.color3d,
            transparent:true//,          
            //depthFunc:THREE.AlwaysDepth
        })
        pm.mat.mColorB.opacity=dcmParam.alpha3d*/



        //ветка менюхи
        this.menu = new Menu(this, function(s, p, p1) {
            
       

            if(s=='zamena'){
                tudaSuda.drag()
            }


            if(s=='dragModel') {                
                self.menu.setPrice(bObjects.array)
                tudaSuda.drag()
            }
             if(s=='arrayGroup'){
                self.menu.activeObject=null
                self.view.activeObject=null
                self.menu.arrayGroup=p
                self.view.arrayGroup=p
            }

            if(s=='activeObject'){
                self.menu.arrayGroup=[]
                self.view.arrayGroup=[]
                self.menu.activeObject=p
                self.view.activeObject=p 

                let c3d=null;
                if(self.view.activeObject)c3d=self.view.activeObject.c3dLoad;
                self.visi3D.arrOut=c3d;

            }
            if(s=='activeObjectDrah'){
    
                let hh=self.menu.activeObject
                self.menu.activeObject=null
                self.view.activeObject=null
       
                self.menu.activeObject=hh
                self.view.activeObject=hh
            }
        });

        this.view = new View(this, function(s, p, p1) {
            

            if(s=='dragModel') {  
                
                self.menu.setPrice(bObjects.array) 
                tudaSuda.drag()               
            }
            // self.fun(s,p,p1);

            if(s=='activeObject'){
                self.menu.arrayGroup=[]
                self.view.arrayGroup=[]
                self.menu.activeObject=p
                self.view.activeObject=p

                let c3d=null;
                if(self.view.activeObject)c3d=self.view.activeObject.c3dLoad;
                self.visi3D.arrOut=c3d;
            }

            if(s=='activeObjectDrah'){
                let hh=self.menu.activeObject
                self.menu.activeObject=null
                self.view.activeObject=null                
                self.menu.activeObject=hh
                self.view.activeObject=hh
            }

            if(s=='arrayGroup'){
                self.menu.activeObject=null
                self.view.activeObject=null
                self.menu.arrayGroup=p
                self.view.arrayGroup=p
            }


        });




        this.timeInfo=new TimeDrag()
        this.timeInfo.drag = function(){            
            localS.object["dragVisi3d"]=visi3D.getObj();
            let str=JSON.stringify(localS.object["dragVisi3d"])          
            localS.save()           
        }

  
        visi3D.fun_rotationX=function(){
            self.timeInfo.timeDrag()
            self.view.fun_rotationX() 
            self.menu.fun_rotationX() 
        }


        this.saveO  = function(o){
            if(!o)return
            if(!o.uuid)return
            menuBig.setObjDrag(o)
            let a=o.uuid.split('_')
            mhbd.saveTime(a[0])           
        }


        this.startLS = function() {
            if(localS.object["dragVisi3d"]!=undefined) {
                //if(localS.object.dubag1==true){
                    let oo=localS.object["dragVisi3d"]
                    let b=true;
                    for (var s in oo) {
                        if(oo[s]==null)b=false;
                        if(oo[s]==undefined)b=false;

                        if(b){
                            if(typeof oo[s]  == 'number'){
                                
                                if(Math.abs(oo[s])>5000){
                                    b=false;
                                }
                            }
                        }
                    }
                   
                    if(b)visi3D.setObj(oo)
                //}
            }   
           
            if(getURLParameters('id')!=null){
                
                self.path = '';
                if(mainBig.keyUser!=null)self.path = "users/"+mainBig.keyUser+"/";


                var ll="./"+self.path+"save/";
               
                $.ajax({
                    url: ll+getURLParameters('id')+"/config.json?v="+Math.random(),
                    success: function function_name(data) {   
                                     
                        var conf =data
                        if(typeof data === "string") {
                            conf = JSON.parse(data)                           
                        } 

                        userInfo.setOpenProduct(getURLParameters('id'))

                        if(tudaSuda.isAmimat(conf)==false){
                            scane3d.setObj(conf) 
                            tudaSuda.drag() 
                        }
                        if(localS.object.dubag1==false) 
                        if(conf.dragVisi3d!=undefined){
                            let t=new TWEEN.Tween(visi3D);

                            conf.dragVisi3d.rotationZ%=Math.PI*2
                            if(conf.dragVisi3d.rotationZ>Math.PI)conf.dragVisi3d.rotationZ-= Math.PI*2
                            if(conf.dragVisi3d.rotationZ<-Math.PI)conf.dragVisi3d.rotationZ+=Math.PI*2    
                          

                            t.to(conf.dragVisi3d,700).start();                        
                        }
                        self.menu.setPrice(bObjects.array) 

                        self.gPlusTitle.setIdProduct(getURLParameters('id'));
                                          
                    }
                })
            }else{
                tudaSuda.drag();
            }
        }



        //великая грабля с событиями 
        this.touchmove=function(e){                    
            e.preventDefault();
            self.visi3D.mousemove(e);
            dcmParam.mousemove(e)
            e.stopPropagation();
        } 

        
        if (dcmParam.mobile == true){             
            window.addEventListener('touchmove', this.touchmove, { passive: false, capture: true });           
            visi3D.position3d.div.removeEventListener('touchmove', visi3D.mousemove);
            document.removeEventListener('touchmove', dcmParam.mousemove);
        }


        this.startLS()


        this.update = function() {
            this.menu.update();
            this.visi3D.upDate(); 
            this.view.upDate();               
        }


        this.update1 = function() {            
            if(this.menu.mDebug!==undefined) this.menu.mDebug.update1();              
        }


        //расчет окна
        var w, h, s;
        this.sizeWindow = function(_w, _h, _s) {
            if (_w) {
                w = _w;
                h = _h;
                s = _s;
            }            
            this.dCont.scale = s;
            this.menu.sizeWindow(w, h, s);
            this.visi3D.sizeWindow(0,0,w*s, h*s);
        }


        //События кеев
        this.dragKey = function() {
            let k=null;
            if(self.boolShift)k=1;
            if(self.boolCTRL)k=0.001;
            dcmParam.valueSlid = k;
        }

        this.setDubag = function(b) {
            localS.object.dubag = b;
            localS.save();
            oWord.debug=b;
            this.menu.setDubag(b)
        }

        this.setBehavior = function(b) {

            localS.object.behavior = b;  
            localS.save();
            menedshers.behavior = b; 

        }


        self.boolShift=false;
        self.boolCTRL=false;
        var sahSS = 0
        this.keydown = function(event) {
            if (event.keyCode == 17) self.boolCTRL = true;
            if (event.keyCode == 16) self.boolShift = true;
        
            self.dragKey()
            if (event.keyCode == 81 && self.boolCTRL) {
                //localS.object.dubag = !localS.object.dubag;
               // localS.save();
                
                self.setDubag(!localS.object.dubag)
                //location.reload()

            }
             if (event.keyCode == 66 && self.boolCTRL) {
                localS.object.dubag1 = !localS.object.dubag1;
                localS.save();
                location.reload()
            }

            sahSS = 0;            
            
            if (self.boolCTRL && event.keyCode == 83) {
                sahSS = 1;
                self.menu.keydown("save", event, self.boolCTRL);                
                return false
            }
           
            self.menu.keydown("down", event, self.boolCTRL)
            self.view.keydown("down", event, self.boolCTRL)
            /*controler.keydown("down", event, self.boolCTRL);
            gpsWord.groupBase.keydown("down", event, self.boolCTRL);*/

        }
        this.keyup = function(event) {
            if (event.keyCode == 17) self.boolCTRL = false;
            if (event.keyCode == 16) self.boolShift = false;
            self.dragKey()
            self.menu.keyup("up", event, self.boolCTRL);
            self.view.keyup("up", event, self.boolCTRL);

        }
        document.onkeydown = this.keydown
        //window.addEventListener( 'keydown', this.keydown );    
        window.addEventListener('keyup', this.keyup);


        function getURLParameters(paramName){
            var sURL = window.document.URL.toString();
            var arrParams = sURL.split("/");                        
            if (sURL.indexOf("?") > 0) {
                var arrParams = sURL.split("?");
                var arrURLParams = arrParams[1].split("&");
                var arrParamNames = new Array(arrURLParams.length);
                var arrParamValues = new Array(arrURLParams.length);
                arrParams = sURL.split("?");
                arrURLParams = arrParams[1].split("&");
                arrParamNames = new Array(arrURLParams.length);
                arrParamValues = new Array(arrURLParams.length);
                var i = 0;
                for (i = 0; i < arrURLParams.length; i++) {

                    var sParam =  arrURLParams[i].split("=");
                    arrParamNames[i] = sParam[0];
                    if (sParam[1] != "")
                        arrParamValues[i] = unescape(sParam[1]);
                    else
                        arrParamValues[i] = null;
                }
                for (i=0; i<arrURLParams.length; i++) {
                    if (arrParamNames[i] == paramName) {
                        return arrParamValues[i];
                    }
                }
                return null;
            }
        }

    }

}

export class GPlusTitle{
    constructor(par) {
        this.type = "GPlusTitle";
        var self = this;

        this.setIdProduct=function(id){

           // $('head').append('<link rel="icon" href="/save/'+id+'/info.png">');
            document.title = 'physicsCalc N '+id;
          //  this.setFinal(id)///**/

        }



        this.setFinal=function(id){

            


        }   

    }
}