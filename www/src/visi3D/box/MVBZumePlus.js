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
import { MRot } from './MRot.js';     //вьювер3д
import { MRot2 } from './MRot.js';     //вьювер3д

import { MMesh } from './MMesh.js';     //вьювер3д




export class  MVBZumePlus{
    constructor(par) {
        this.type = "MVBZumePlus";
        var self = this;
        this.wh=286;
        this.par=par;

        this._sah01=this.par._sah01;
        this._activeMesh=null
        this._active=false
        this.content3d = new THREE.Object3D(); 
        this.content3d.visible=this._active

        this.c3 = new THREE.Object3D();	
        this.content3d.add(this.c3)

        
        this.mRot=undefined;

        this._zome=1;

        this._ot=0.03
        this._z=0.005
        this._z1=0.01
        let ss=0.01

        this._angel=180;
        this._angel1=15;
        this._plusRadius=1.32;
        this._plusRadius1=1.4;

        
        this.init=function(){
            if(this.mRot) return       


            this.mRot = new MRot(this,  par.mvbMaterial.material)
            this.mRot.mesh.position.z=0.5;
            //this.mRot.mesh.position.y=0.5
            this.mRot.mesh.name = "mRot11";
            
            par.visi3D.addChildMouse(this.mRot.mesh);




            this.mRot1 = new MRot(this,  par.mvbMaterial1.material)
            this.mRot1.mesh.position.z=0.5;
            

          






            this.drah()      

        }

        this.setAngelDown=function(ang){
            
            let a1= ang- this.content3d.rotation.z 
         

            let a=a1%Math.PI*2 //- this.content3d.rotation.z-Math.PI*2;




            let na=(this._angel*Math.PI/180)*2
            let pros=a/na

            let min=this.par.vGlaf.position3d.minZum
            let max=this.par.vGlaf.position3d.maxZum
            let pz=(max-min)*pros

            if(pz>max)pz=max
            if(pz<min)pz=min    
           
            this.par.vGlaf.zume=pz;
            
        }
       
        this.drah=function(){
            if(!this._active)return
            this.mRot.angel = this._angel;

            this.mRot._dist=this._plusRadius
            this.mRot._dist2=this._plusRadius1
            this.mRot._angel = this._angel;
            this.mRot._z=this._z

            this.mRot1._z=this._z1
            this.mRot1._dist=this._plusRadius- this._ot
            this.mRot1._dist2=this._plusRadius1+this._ot
            this.mRot1._angel = this._angel1;

            this.mRot.drah()
            this.mRot1.drah()
            this.drag()
        }

    

        this.drag=function(){
            if(!this._active)return

            let min=this.par.vGlaf.position3d.minZum
            let max=this.par.vGlaf.position3d.maxZum
            let pz=(this._zume-min)/(max-min)

            let aa=this._angel-this._angel1

            this.mRot1.mesh.rotation.z=(aa*Math.PI/180)*pz

            trace(pz,this.mRot1.mesh.rotation.z)







        }
        this.setXZ=function(x,z){
            //trace(x)
            this.content3d.rotation.z=z+Math.PI/2

        }






       


        let zz=0.39   
        let xxx=0;
        let yyy=0;
        let mmm=0.39;
        this.dragXY=function(){
            
       /*     if(this.mBox==undefined){
                return
            }

            let xx=self.par.vGlaf.xVerh/self.par.vGlaf.position3d.distMinMaxBox;
            let yy=self.par.vGlaf.yVerh/self.par.vGlaf.position3d.distMinMaxBox;

            xx*=zz
            yy*=zz
            //distMinMaxBox

           
            if(xx>mmm)xx=mmm
            if(xx<-mmm)xx=-mmm
            
            if(yy>mmm)yy=mmm
            if(yy<-mmm)yy=-mmm    
               
            if(xx!=xxx || yy==yyy){
                xxx=xx;
                yyy=yy;

                this.mBox.mesh.position.x=xx
                this.mBox.mesh.position.y=yy


            }*/

        }


    }


    set zume(value) {
        if(this._zume!==value){
            this._zume=value;
            this.drag();
            
        }       
    }
    get zume() {
        return this._zume;
    }  


    set active(value) {
        if(this._active!==value){
            this._active=value;
            this.init();

            this.content3d.visible=this._active
            this.drah()
        }       
    }
    get active() {
        return this._active;
    }

    /*

this._ot=0.03
        let ss=0.01

        this._angel=180;
        this._angel1=15;
        this._plusRadius=1.28;
        this._plusRadius1=1.4;
    */




    set ot(value) {
        if(this._ot!==value){
            this._ot=value;           
            this.drah()
        }       
    }
    get ot() {
        return this._ot;
    }

    set angel(value) {
        if(this._angel!==value){
            this._angel=value;           
            this.drah()
        }       
    }
    get angel() {
        return this._angel;
    }


    set angel1(value) {
        if(this._angel1!==value){
            this._angel1=value;           
            this.drah()
        }       
    }
    get angel1() {
        return this._angel1;
    }


   /**/ set plusRadius1(value) {
        if(this._plusRadius1!==value){
            this._plusRadius1=value;           
            this.drah()
        }       
    }
    get plusRadius1() {
        return this._plusRadius1;
    }


    set plusRadius(value) {
        if(this._plusRadius!==value){
            this._plusRadius=value;           
            this.drah()
        }       
    }
    get plusRadius() {
        return this._plusRadius;
    }
    set z(value) {
        if(this._z!==value){
            this._z=value;           
            this.drah()
        }       
    }
    get z() {
        return this._z;
    }

    set z1(value) {
        if(this._z1!==value){
            this._z1=value;           
            this.drah()
        }       
    }
    get z1() {
        return this._z1;
    }



}

