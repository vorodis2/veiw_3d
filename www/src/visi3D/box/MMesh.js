
export class  MMesh{
    constructor(par) {
        this.type = "MMesh";
        var self = this;
        this.par=par
        this.name = 'xz';
        this.geometry
        this.mesh
		this.arrPosition=[]
        this.arrUV=[];
        this._active=false

        this.rZ=0
        this.rX=0
        this.init = function(s,ap,auv){
        	if(this.mesh){
        		return
        	}
        	
        	this.geometry = new THREE.BufferGeometry();          
        	this.mesh = new THREE.Mesh( this.geometry, par.par.mvbMaterial.material );
            par.par.visi3D.addChildMouse(this.mesh);
            this.mesh.objectDin=this;
            this.mesh.name=this.name

        }

        this.set = function(s,ap,auv){
        	this.name=s
        	this.init()
        	this.arrPosition=[]
        	this.arrUV=[];
            for (var i = 0; i < ap.length; i+=4) {
        		this.plus(ap[i],ap[i+1],ap[i+2],ap[i+3],auv[i],auv[i+1],auv[i+2],auv[i+3])
        		this.plus1(ap[i],ap[i+1],ap[i+2],ap[i+3],auv[i],auv[i+1],auv[i+2],auv[i+3])
        	}
            
        	this.vertices = new Float32Array( this.arrPosition)

           
        	this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );
        	//this.geometry.setAttribute( 'uvs', new THREE.BufferAttribute( this.arrUV, 2 ) );
        	this.geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( this.arrUV, 2 ) );
            this.geometry.computeBoundingBox()
            this.geometry.computeVertexNormals()
            this.mesh.material=par.par.mvbMaterial.material
        }



        this.plus = function(p,p1,p2,p3,au,au1,au2,au3){

        	

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


    set active(value) {
        if(this._active!==value){
            this._active=value;
          
            if(this._active==true){
                this.mesh.material=this.par.par.mvbMaterial1.material
            }else{
                this.mesh.material=this.par.par.mvbMaterial.material
            }

            this.par.par.visi3D.intRend=1
            
            
        }       
    }
    get active() {
        return this._active;
    }



}

