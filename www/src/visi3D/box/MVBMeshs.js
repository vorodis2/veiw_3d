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

import { MMesh } from './MMesh.js';     //вьювер3д




export class  MVBMeshs{
    constructor(par) {
        this.type = "MVBMeshs";
        var self = this;
        this.wh=256;
        this.par=par;

        this._sah01=this.par._sah01;
        this._activeMesh=null

        this.c3 = new THREE.Object3D();	

        




       /* let mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1,2,2,2),this.par.mvbMaterial.material)
       	
    	this.c3.add(mesh);*/

        this.mRot = new MRot(this,  par.mvbMaterial.material)
        this.mRot.mesh.position.z=0.5
        this.mRot.mesh.name = "mRot";
        
        par.visi3D.addChildMouse(this.mRot.mesh);



        this.mRot1 = new MRot(this,  par.mvbMaterial1.material)
        this.mRot1.mesh.position.z=0.5;
        this.mRot1.mesh.visible=false


        this.mBox = undefined// new MBox(this,  par.mvbMaterial.material)




       

        let ss=0.01

        this.mRot1._dist-=ss
        this.mRot1._dist2+=ss
        this.mRot1._z+=ss
        this.mRot1.angel=2;
        //this.mRot1.drah()


       
        this.array=[];
        this.object=[];
        var sah0 = 0.0
        var sah01 = 0.1
        var sah05 = 0.5
        var sah_1 = 1
        var sahZZZ = 0.01

        var sahUV = 0.3

        this.drag=function(){
        	let mesh;




        	sah01=this._sah01
			
        	///////4////////////////////////

        	this.plus("gr_4",[[4, sah01, sah01, sah_1-sah01, sah_1-sah01, sahUV, sahUV, sahUV*2, sahUV*2]],0,90);
        	


        	this.plus("gr_4_3",[        			
        			[4, sah0, sah01,  sah01, sah_1-sah01,  			0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
        			[3, sah_1-sah01, sah01, sah_1, sah_1-sah01, 	sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ]
        		],45,90
        	);

			this.plus("gr_4_3_0",[        			
        			[4, sah0, sah0,  sah01, sah01,  		0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
        			[3, sah_1-sah01, sah0,  sah_1, sah01,  	sahUV-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ],
        			[0, sah0, sah_1-sah01,  sah01, sah_1,  	0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ],
        		],45,45
        	);

//------------------------- 

			this.plus("gr_4_0",[        			
        			[4, sah01, sah0, sah_1-sah01,  sah01 , 			sahUV-sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
        			[0, sah01, sah_1-sah01, sah_1-sah01,  sah_1 , 	sahUV-sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ],
        		],0,45
        	);




        	this.plus("gr_4_1",[        			
        			[4, sah_1-sah01, sah01,  sah_1, sah_1-sah01,  sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ],
        			
        			[1, sah_1-sah01, sah01,  sah_1, sah_1-sah01,  0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ]
        		],-45,90
        	);	


        	this.plus("gr_4_1_0",[        			
        			[4, sah_1-sah01, sah0,  sah_1, sah01,  sahUV-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ],
        			[1, sah_1-sah01, sah0,  sah_1, sah01,  0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
        			[0, sah_1-sah01, sah_1-sah01,  sah_1, sah_1,  	sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ],
        		],-45,45
        	);

        	

        	
        	///////0////////////////////////

        	this.plus("gr_0",[[0, sah01, sah01, sah_1-sah01, sah_1-sah01, sahUV*2, sahUV*2, sahUV*3, sahUV*3]],0,0);

        	this.plus("gr_0_3",[
        		[0, sah0, sah01, sah01, sah_1-sah01, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
        		[3, sah01, sah0, sah_1-sah01, sah01, sahUV-sahZZZ, 0.0+sahZZZ,sahUV-sahZZZ, sahUV-sahZZZ],
        	],90,45);


        	///////3////////////////////////

        	this.plus("gr_3",[[3, sah01, sah01, sah_1-sah01, sah_1-sah01, sahUV*2, 0.0, sahUV*3, sahUV]],90,90);

        	///////1///////////////////////

        	this.plus("gr_1",[[1, sah01, sah01, sah_1-sah01, sah_1-sah01, sahUV+sahZZZ, 0.0, sahUV*2, sahUV]],-90,90);

       	
        	this.plus("gr_1_0",[
        		[1, sah01, sah0, sah_1-sah01, sah01, sahUV-sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
        		[0, sah_1-sah01, sah01, sah_1, sah_1-sah01, sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ],
        	],-90,45);


        	///////5////////////////////////

        	this.plus("gr_5",[[5, sah01, sah01, sah_1-sah01, sah_1-sah01, sahUV*2, sahUV, sahUV*3, sahUV*2]],180,90);

        	this.plus("gr_5_1",[
        		[5, sah_1-sah01, sah01, sah_1, sah_1-sah01, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
        		[1, sah0, sah01, sah01, sah_1-sah01, sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ],
        	],-135,90);

        	this.plus("gr_5_0",[
        		[5, sah01, sah0, sah_1-sah01, sah01, sahUV-sahZZZ,0.0+sahZZZ, sahUV-sahZZZ,  sahUV-sahZZZ],
        		[0, sah01, sah0, sah_1-sah01, sah01, sahUV-sahZZZ,0.0+sahZZZ, sahUV-sahZZZ,  sahUV-sahZZZ],
        	],180,45)
            

        	this.plus("gr_5_1_0",[
        		[5, sah_1-sah01, sah0, sah_1, sah01, 	0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
        		[1, sah0, sah0, sah01, sah01, 			sahUV-sahZZZ, 0.0+sahZZZ,  0.0+sahZZZ, sahUV-sahZZZ],
        		[0, sah_1-sah01, sah0, sah_1, sah01, 			sahUV-sahZZZ, 0.0+sahZZZ,  0.0+sahZZZ, sahUV-sahZZZ],
        	],-135,45);

            
        	this.plus("gr_5_3_0",[
        		[5, sah0, sah0, sah01, sah01, 	sahUV-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ],        		
        		[3, sah0, sah0, sah01, sah01, 			0.0+sahZZZ, 0.0+sahZZZ,  sahUV-sahZZZ, sahUV-sahZZZ],
        		[0, sah0, sah0, sah01, sah01, 			0.0+sahZZZ, 0.0+sahZZZ,  sahUV-sahZZZ, sahUV-sahZZZ],
        	],135,45);	

        	this.plus("gr_5_3",[
        		[5, sah0, sah01, sah01, sah_1-sah01, 	sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ],        		
        		[3, sah0, sah01, sah01, sah_1-sah01, 			0.0+sahZZZ, sahUV-sahZZZ,  sahUV-sahZZZ, sahUV-sahZZZ]
        	],135,90);

        	///////2////////////////////////	
        	this.plus("gr_2",[[2, sah01, sah01, sah_1-sah01, sah_1-sah01, sahUV*2, sahUV*3, sahUV, sahUV*2]],0,180);

        	this.plus("gr_2_4",[
        		[2, sah01, sah_1-sah01, sah_1-sah01, sah_1,  	sahUV-sahZZZ, sahUV-sahZZZ,  sahUV-sahZZZ, 0.0+sahZZZ],        		
        		[4, sah01, sah_1-sah01, sah_1-sah01, sah_1,		sahUV-sahZZZ, sahUV-sahZZZ,   sahUV-sahZZZ, 0.0+sahZZZ]
        	],0,135);

        	this.plus("gr_2_5",[
        		[2, sah01, sah0, sah_1-sah01, sah01,  		sahUV-sahZZZ, 0.0+sahZZZ,  sahUV-sahZZZ, sahUV-sahZZZ],        		
        		[5, sah01, sah_1-sah01, sah_1-sah01, sah_1, sahUV-sahZZZ,sahUV-sahZZZ,  sahUV-sahZZZ, 0.0+sahZZZ],
        	],180,135);

        	this.plus("gr_2_3",[
        		[2, sah0, sah01, sah01, sah_1-sah01,  		sahUV-sahZZZ, sahUV-sahZZZ,0.0+sahZZZ,   sahUV-sahZZZ],        		
        		[3, sah01, sah_1-sah01, sah_1-sah01, sah_1, sahUV-sahZZZ,sahUV-sahZZZ,  sahUV-sahZZZ, 0.0+sahZZZ],
        	],90,135);

        	this.plus("gr_2_1",[
        		[2, sah_1-sah01, sah01, sah_1, sah_1-sah01,  			0.0+sahZZZ, sahUV-sahZZZ,	sahUV-sahZZZ,  sahUV-sahZZZ ],        		
        		[1, sah01, sah_1-sah01, sah_1-sah01, sah_1, 			sahUV-sahZZZ,	sahUV-sahZZZ,  sahUV-sahZZZ, 0.0+sahZZZ ],
        	],-90,135);


        	
        	this.plus("gr_2_1_4",[
        		[2, sah_1-sah01, sah_1-sah01, sah_1, sah_1, 		0.0+sahZZZ, sahUV-sahZZZ,sahUV-sahZZZ,   0.0+sahZZZ],        		
        		[1, sah_1-sah01, sah_1-sah01, sah_1, sah_1,			    0.0+sahZZZ,sahUV-sahZZZ,  sahUV-sahZZZ, 0.0+sahZZZ],
        		[4,  sah_1-sah01, sah_1-sah01, sah_1, sah_1,		sahUV-sahZZZ, sahUV-sahZZZ,   0.0+sahZZZ, 0.0+sahZZZ]
        	],-45, 135);

        	this.plus("gr_2_1_5",[
        		[2, sah_1-sah01, sah0, sah_1, sah01,  		0.0+sahZZZ, 0.0+sahZZZ,sahUV-sahZZZ,   sahUV-sahZZZ],        		
        		[1, sah0, sah_1-sah01, sah01, sah_1,			    sahUV-sahZZZ,sahUV-sahZZZ,  0.0+sahZZZ, 0.0+sahZZZ],
        		[5, sah_1-sah01, sah_1-sah01, sah_1, sah_1, 0.0+sahZZZ,sahUV-sahZZZ,  sahUV-sahZZZ, 0.0+sahZZZ],
        	],-135, 135);

        	this.plus("gr_2_3_5",[
        		[2, sah0, sah0, sah01, sah01,  		sahUV-sahZZZ, 0.0+sahZZZ,0.0+sahZZZ,   sahUV-sahZZZ],        		
        		[3, sah0, sah_1-sah01, sah01, sah_1, 0.0+sahZZZ,sahUV-sahZZZ,  sahUV-sahZZZ, 0.0+sahZZZ],
        		[5, sah0, sah_1-sah01, sah01, sah_1, sahUV-sahZZZ,sahUV-sahZZZ,  0.0+sahZZZ, 0.0+sahZZZ],
        	],135,135);

        	this.plus("gr_2_3_4",[
        		[2, sah0, sah_1-sah01, sah01, sah_1,  		sahUV-sahZZZ, sahUV-sahZZZ,0.0+sahZZZ,   0.0+sahZZZ],       		
        		[3, sah_1-sah01, sah_1-sah01, sah_1, sah_1, sahUV-sahZZZ,sahUV-sahZZZ,  0.0+sahZZZ, 0.0+sahZZZ],
        		[4,  sah0, sah_1-sah01, sah01, sah_1,		0.0+sahZZZ, sahUV-sahZZZ,   sahUV-sahZZZ, 0.0+sahZZZ]
        	],45,135);


            //////////////////////

            let gr_Box=this.plus("gr_Box",[
                [0, sah01, sah01, sah_1-sah01, sah_1-sah01,    sahZZZ, sahUV*2, sahUV-sahZZZ, sahUV*3],
                
               // [5, sah0, sah0, sah01, sah01,   sahUV-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ],                
               // [3, sah0, sah0, sah01, sah01,           0.0+sahZZZ, 0.0+sahZZZ,  sahUV-sahZZZ, sahUV-sahZZZ],
                [0, sah0, sah0, sah01, sah01,           0.0+sahZZZ, 0.0+sahZZZ,  sahUV-sahZZZ, sahUV-sahZZZ],

               // [5, sah_1-sah01, sah0, sah_1, sah01,    0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
               // [1, sah0, sah0, sah01, sah01,           sahUV-sahZZZ, 0.0+sahZZZ,  0.0+sahZZZ, sahUV-sahZZZ],
                [0, sah_1-sah01, sah0, sah_1, sah01,            sahUV-sahZZZ, 0.0+sahZZZ,  0.0+sahZZZ, sahUV-sahZZZ],

               // [5, sah01, sah0, sah_1-sah01, sah01, sahUV-sahZZZ,0.0+sahZZZ, sahUV-sahZZZ,  sahUV-sahZZZ],
                [0, sah01, sah0, sah_1-sah01, sah01, sahUV-sahZZZ,0.0+sahZZZ, sahUV-sahZZZ,  sahUV-sahZZZ],

                [0, sah0, sah01, sah01, sah_1-sah01, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
              //  [3, sah01, sah0, sah_1-sah01, sah01, sahUV-sahZZZ, 0.0+sahZZZ,sahUV-sahZZZ, sahUV-sahZZZ],    


               // [4, sah_1-sah01, sah0,  sah_1, sah01,  sahUV-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ],
              //  [1, sah_1-sah01, sah0,  sah_1, sah01,  0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
                [0, sah_1-sah01, sah_1-sah01,  sah_1, sah_1,    sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ],

               // [4, sah01, sah0, sah_1-sah01,  sah01 ,          sahUV-sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
                [0, sah01, sah_1-sah01, sah_1-sah01,  sah_1 ,   sahUV-sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ],

               // [4, sah0, sah0,  sah01, sah01,          0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
               // [3, sah_1-sah01, sah0,  sah_1, sah01,   sahUV-sahZZZ, 0.0+sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ],
                [0, sah0, sah_1-sah01,  sah01, sah_1,   0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ],

               // [1, sah01, sah0, sah_1-sah01, sah01, sahUV-sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ, sahUV-sahZZZ],
                [0, sah_1-sah01, sah01, sah_1, sah_1-sah01, sahUV-sahZZZ, sahUV-sahZZZ, 0.0+sahZZZ, sahUV-sahZZZ],
               
                ],0,0);


            if(this.mBox ==undefined){
                this.mBox =gr_Box;
                this.mBox.mesh.position.z=1
                this.mBox.mesh.position.x=0.5//1

                this.dragXY()

            }
        }


        this.plus=function(s,arr,rZ,rX){

        	let b=true
        	let mesh=null
        	if(this.object[s])mesh=this.object[s]

        	if(mesh==null){
        		mesh=new MMesh(this);
                if(rZ!=undefined){
                    mesh.rZ=rZ;
                    mesh.rX=rX;
                }
                
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
                mesh.idArr= this.array.length
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


        let zz=0.39   
        let xxx=0;
        let yyy=0;
        let mmm=0.39;
        this.dragXY=function(){
            
            if(this.mBox==undefined){
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


            }

        }


    }





    set activeMesh(value) {
        if(this._activeMesh!==value){
            this._activeMesh=value;
            let ii=-1;
            if(this._activeMesh) ii=this._activeMesh.idArr

            for (var i = 0; i < this.array.length; i++) {
                if(i==ii){
                    this.array[i].active=true
                }else{
                    this.array[i].active=false
                }
            }  
        }       
    }
    get activeMesh() {
        return this._activeMesh;
    }
}

