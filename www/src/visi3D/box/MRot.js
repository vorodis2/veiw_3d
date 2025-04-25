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


export class  MRot{
    constructor(par,  m) {
        this.type = "MRot";
        var self = this;
        this.par=par

        this.geometry = new THREE.BufferGeometry();          
        

        this._angel = 360;

        var z=0.02  
        let dist=0.9;
        let dist1=1.2; 
        let dist2=1.28; 

        this._z=z;        
        this._dist=dist;
        this._dist2=dist2;

        let aS=5;

        var sahZZZ = 0.01

        var sahUV = 0.3

        this.drah=function(){

            this.arrPosition=[]
            this.arrUV=[];




            z=this._z
            dist=this._dist
            dist2=this._dist2 
       
            if(this._angel>0){
                for (var i = 0; i < this._angel; i+=aS) {
                    if(i+aS>=this._angel){
                        this.plusAngel(i,this._angel,i,true); 
                        break
                    }
                    this.plusAngel(i,i+aS,i); 
                }
            }else{
                for (var i = this._angel; i < 0; i+=aS) {
                    if(i+aS>=0){
                        this.plusAngel(i,0,i,true); 
                        break
                    }
                    this.plusAngel(i,i+aS,i); 
                }
            }
            


            
            this.vertices = new Float32Array( this.arrPosition)
            this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );            
            this.geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( this.arrUV, 2 ) );
            this.geometry.computeBoundingBox()
            this.geometry.computeVertexNormals()
        }

       
        var v0=new THREE.Vector2();
        var v1=new THREE.Vector2();
        var v2=new THREE.Vector2();
        var v3=new THREE.Vector2();
        var v4=new THREE.Vector2();
        var v5=new THREE.Vector2();

        var u0=new THREE.Vector2();
        var u1=new THREE.Vector2();
        var u2=new THREE.Vector2();
        var u3=new THREE.Vector2();

           


        this.plusAngel=function(a,a1, ii,bool){  
            dist1=dist+(dist2-dist)/2

            this.getVector(dist,a*Math.PI/180,v0)
            this.getVector(dist,a1*Math.PI/180,v1)
            this.getVector(dist1,a1*Math.PI/180,v2)
            this.getVector(dist1,a*Math.PI/180,v3)

            this.getVector(dist2,a1*Math.PI/180,v4)
            this.getVector(dist2,a*Math.PI/180,v5)            



            u0.set(sahZZZ, sahUV-sahZZZ)
            u1.set(sahUV-sahZZZ, sahUV-sahZZZ)
            u2.set(sahUV-sahZZZ, sahUV-sahZZZ)
            u3.set(sahZZZ, sahUV-sahZZZ)
            

            u3.set(sahZZZ, sahUV-sahZZZ)

            this.plus(v0,v1,v2,z,u3,u0,u2);
            this.plus(v0,v2,v3,z,u0,u1,u1);
            this.plus(v4, v3, v2,z,u3, u2,u2);
            this.plus(v4, v5, v3,z,u3, u3,u2);
            


            this.plus1(v0,v1,z,u0);
            this.plus2(v4,v5,z,u0);

            if(ii==0 && this._angel>0){
                this.plus1(v5,v0,z,u0);
            }

            if(bool){
                this.plus2(v1,v4,z,u0);
            }/**/

        }







        this.getVector = function (length, angle, point) {            
            if (length < 0) angle += Math.PI;
            point.x = Math.abs(length) * Math.cos(angle);
            point.y = Math.abs(length) * Math.sin(angle);
            return point;
        };


        this.plus1 = function(p,p1,z, au){  
           
            this.arrPosition.push(p.x,p.y,z)
            this.arrPosition.push(p1.x,p1.y,z)
            this.arrPosition.push(p1.x,p1.y,-z)  

            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y) 


            this.arrPosition.push(p.x,p.y,-z)
            this.arrPosition.push(p.x,p.y,z)            
            this.arrPosition.push(p1.x,p1.y,-z)    
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)  
        }

        this.plus2 = function(p,p1,z, au){  
            
            this.arrPosition.push(p.x,p.y,z)
            this.arrPosition.push(p1.x,p1.y,z)
            this.arrPosition.push(p1.x,p1.y,-z)  

            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y) 

   
            this.arrPosition.push(p.x,p.y,-z)
            this.arrPosition.push(p.x,p.y,z)        
            this.arrPosition.push(p1.x,p1.y,-z)    
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)  
        }




        this.plus = function(p,p1,p2,z, au,au1,au2){  
           
            this.arrPosition.push(p.x,p.y,-z)
            this.arrPosition.push(p1.x,p1.y,-z)
            this.arrPosition.push(p2.x,p2.y,-z)   
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au1.x,au1.y)
            this.arrUV.push(au2.x,au2.y) 

            this.arrPosition.push(p2.x,p2.y,z)
            this.arrPosition.push(p1.x,p1.y,z)
            this.arrPosition.push(p.x,p.y,z) 

            this.arrUV.push(au2.x,au2.y)  
            this.arrUV.push(au1.x,au1.y) 
            this.arrUV.push(au.x,au.y)   

        }



        this.drah()

        this.mesh = new THREE.Mesh( this.geometry, m );
        this.mesh.oDin=this;
        par.c3.add(this.mesh)

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


}




export class  MRot2{
    constructor(par,  m) {
        this.type = "MRot2";
        var self = this;
        this.par=par

        this.geometry = new THREE.BufferGeometry();          
        

        this._angel = 360;

        var z=0.02  
        let dist=0.9;
        let dist1=1.2; 
        let dist2=1.28; 
        let dist3=1.28; 
        this._z=z;
        this._dist = 1;
        this._dist1 = 1;
        this._dist2 = 2;
        this._dist3 = 2;

        let aS=5;

        var sahZZZ = 0.01

        var sahUV = 0.3

        this.drah=function(){

            this.arrPosition=[]
            this.arrUV=[];




            z=this._z
            dist=this._dist
            dist2=this._dist2 


 
            if(this._angel>0){
                
                for (var i = 0; i < this._angel; i+=aS) {
                    if(i+aS>=this._angel){
                        this.plusAngel(i,this._angel,i,true, i/(this._angel-aS)); 
                        break
                    }
                    this.plusAngel(i,i+aS,i,null, i/(this._angel-aS)); 
                }

            }else{
                for (var i = this._angel; i < 0; i+=aS) {
                    if(i+aS>=0){
                        this.plusAngel(i,0,i,true); 
                        break
                    }
                    this.plusAngel(i,i+aS,i); 
                }
            }
            


            
            this.vertices = new Float32Array( this.arrPosition)
            this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );            
            this.geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( this.arrUV, 2 ) );
            this.geometry.computeBoundingBox()
            this.geometry.computeVertexNormals()
        }

       
        var v0=new THREE.Vector2();
        var v1=new THREE.Vector2();
        var v2=new THREE.Vector2();
        var v3=new THREE.Vector2();
        var v4=new THREE.Vector2();
        var v5=new THREE.Vector2();

        var u0=new THREE.Vector2();
        var u1=new THREE.Vector2();
        var u2=new THREE.Vector2();
        var u3=new THREE.Vector2();

           


        this.plusAngel=function(a,a1, ii,bool,prosent){  
            


            dist1 = dist+(dist2-dist)/2*(a1/(this._angel))

            dist3 = dist+(dist2-dist)/2*(a/(this._angel))



            
            this.getVector(dist,a*Math.PI/180,v0)
            this.getVector(dist,a1*Math.PI/180,v1)
            this.getVector(dist1,a1*Math.PI/180,v2)
            this.getVector(dist3,a*Math.PI/180,v3)

            


            this.getVector(dist1,a1*Math.PI/180,v4)
            this.getVector(dist3,a*Math.PI/180,v5)   /*  */        



            u0.set(sahZZZ, sahUV-sahZZZ)
            u1.set(sahUV-sahZZZ, sahUV-sahZZZ)
            u2.set(sahUV-sahZZZ, sahUV-sahZZZ)
            u3.set(sahZZZ, sahUV-sahZZZ)
            

            u3.set(sahZZZ, sahUV-sahZZZ)

            this.plus(v0,v1,v2,z,u3,u0,u2);
            this.plus(v0,v2,v3,z,u0,u1,u1);
            this.plus(v4, v3, v2,z,u3, u2,u2);
            this.plus(v4, v5, v3,z,u3, u3,u2);
            


            this.plus1(v0,v1,z,u0);
            this.plus2(v4,v5,z,u0);

            if(ii==0 && this._angel>0){
                this.plus1(v5,v0,z,u0);
            }

            if(bool){
                this.plus2(v1,v4,z,u0);
            }

        }







        this.getVector = function (length, angle, point) {            
            if (length < 0) angle += Math.PI;
            point.x = Math.abs(length) * Math.cos(angle);
            point.y = Math.abs(length) * Math.sin(angle);
            return point;
        };


        this.plus1 = function(p,p1,z, au){  
           
            this.arrPosition.push(p.x,p.y,z)
            this.arrPosition.push(p1.x,p1.y,z)
            this.arrPosition.push(p1.x,p1.y,-z)  

            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y) 


            this.arrPosition.push(p.x,p.y,-z)
            this.arrPosition.push(p.x,p.y,z)            
            this.arrPosition.push(p1.x,p1.y,-z)    
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)  
        }

        this.plus2 = function(p,p1,z, au){  
            
            this.arrPosition.push(p.x,p.y,z)
            this.arrPosition.push(p1.x,p1.y,z)
            this.arrPosition.push(p1.x,p1.y,-z)  

            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y) 

   
            this.arrPosition.push(p.x,p.y,-z)
            this.arrPosition.push(p.x,p.y,z)        
            this.arrPosition.push(p1.x,p1.y,-z)    
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au.x,au.y)  
        }




        this.plus = function(p,p1,p2,z, au,au1,au2){  
           
            this.arrPosition.push(p.x,p.y,-z)
            this.arrPosition.push(p1.x,p1.y,-z)
            this.arrPosition.push(p2.x,p2.y,-z)   
            this.arrUV.push(au.x,au.y)
            this.arrUV.push(au1.x,au1.y)
            this.arrUV.push(au2.x,au2.y) 

            this.arrPosition.push(p2.x,p2.y,z)
            this.arrPosition.push(p1.x,p1.y,z)
            this.arrPosition.push(p.x,p.y,z) 

            this.arrUV.push(au2.x,au2.y)  
            this.arrUV.push(au1.x,au1.y) 
            this.arrUV.push(au.x,au.y)   

        }



        this.drah()

        this.mesh = new THREE.Mesh( this.geometry, m );
        this.mesh.oDin=this;
        par.c3.add(this.mesh)

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


}
