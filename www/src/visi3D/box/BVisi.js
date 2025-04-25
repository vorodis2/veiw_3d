
export class BVisi {
    constructor(keyDon) {
        this.type = "BVisi";
        var self = this;
        this.keyDon = keyDon
        //this.fun = fun
        this.c3d = new THREE.Object3D();
        // this.par.content3d.add(this.c3d);
        this.timeNax = 0;
        this._alpha = 0.5;
        this._color = "#ffffff"
        this.colorFin = "#ff0000"
        if (window.bdLevu != undefined) bdLevu.add(this.c3d)

        this.ac3d = []
        this.ar = []
        this.array = []
        this.arrayChesh = []
        this.sah = 0
        this.old = null

        this._in3d = null;

        this.clear = function() {
            for (var i = 0; i < this.arrayChesh.length; i++) {
                this.arrayChesh[i].stop()
            }
        }

        this.dragIn3d = function() {
            this.startObj(this._in3d);
        }


        this.init = function(c3d) {

        }

        this.startObj = function(c) {
            this.array.length = 0
            this.sah = 0
            this.ar.length = 0;
            this.sss(c);            
            for (var i = 0; i < this.ar.length; i++) {
                this.startObj1(this.ar[i])
            }
        }


        this.sss = function(c) {
            if (c.geometry) {
                this.ar.push(c)
            }
            if (c.children) {
                for (var i = 0; i < c.children.length; i++) {
                    this.sss(c.children[i])
                }
            }
        }


        this.startObj1 = function(c) {
            this.arrO = []
            this.ooo = this.getPath(c, this.keyDon);
           
            if (this.arrO.length < 2) return

            if (this.arrayChesh[this.sah] == undefined) {
                this.arrayChesh[this.sah] = new S3Blok(this)
            }
            this.array[this.sah] = this.arrayChesh[this.sah]
            let blok = this.array[this.sah]
            this.sah++

            blok.start(c, this.arrO[0])
            var c3
            var c3k = blok.mesh
            for (var i = 1; i < this.arrO.length; i++) {
                c3 = this.get()
                c3.position.copy(this.arrO[i].position)
                c3.rotation.copy(this.arrO[i].rotation)
                c3.scale.copy(this.arrO[i].scale)

                c3.add(c3k);
                c3k = c3;
            }
            if (this.fun) this.fun("drag")
            this.c3d.add(c3);
        }


        this.getPath = function(c3d, param) {
            let rez = null;

            function xz(c3d) {
                self.arrO.push(c3d)
                if (c3d[param]) {
                    return c3d[param];
                }
                if (c3d.parent) return xz(c3d.parent)
                return null
            }
            rez = xz(c3d);
            return rez
        }


        this.get = function() {
            for (var i = 0; i < this.ac3d.length; i++) {
                if (this.ac3d[i].visible == false) {
                    this.ac3d[i].visible = true
                    return this.ac3d[i]
                }
            }
            let c = new THREE.Object3D();
            this.ac3d.push(c);
            return c;
        }


        this.dragActive = function() { //РОдитель изменил активность
            let c = null;
            if (this.par._parent == undefined) {
                this.color = null
                return
            }
            if (this.par.errorPipe.active == true) {
                c = dcmParam.colorError
            }
            if (this.par._aGOt) c = dcmParam.getColor(dcmParam.color3d)
            if (this.par._aObject) {
                c = dcmParam.color3dActive
            }
            if (this.par._aGroup) c = dcmParam.color3d

            if (this.par._aDown) {
                if (c) {
                    c = dcmParam.getColor(dcmParam.color3d1, dcmParam.offsetСolor)
                } else {
                    c = dcmParam.color3d1;
                }
            }

            if (this.par.errorPipe.active == true && c != null) {
                c = this.colorSmess(dcmParam.colorError, c)
            }
            this.color = c
        }


        this.colorSmess = function(c0, c1) {
            let a0 = dcmParam.hexDec(c0)
            let a1 = dcmParam.hexDec(c1)
            let a2 = [];
            a2[0] = Math.round((a0[0] + a1[0]) / 2)
            a2[1] = Math.round((a0[1] + a1[1]) / 2)
            a2[2] = Math.round((a0[2] + a1[2]) / 2)
            let c = dcmParam.compToHexArray(a2)
            return c;
        }


        this.dragcolor = function() {
            if (this._color) {
                if (this.c3d.parent == undefined) {
                    if(this.par && this.par.content3d) this.par.content3d.add(this.c3d);
                }
                for (var i = 0; i < this.array.length; i++) {
                    this.array[i].color = this._color
                }
            } else {
                if (this.c3d.parent !== undefined && this.c3d.parent !== null) {
                    this.c3d.parent.remove(this.c3d);
                }
            }
        }
    }

    set alpha(v) {
        if (this._alpha !== v) {
            this._alpha = v;            
            for (var i = 0; i < this.arrayChesh.length; i++) {
                this.arrayChesh[i].alpha = this._alpha
            }
        }
    }
    get alpha() { return this._alpha; }



    set color(v) {
        if (this._color !== v) {
            this._color = v;
            this.dragcolor()
            for (var i = 0; i < this.arrayChesh.length; i++) {
                this.arrayChesh[i].color = this._color
            }
        }
    }
    get color() { return this._color; }

    set in3d(v) {
        if (this._in3d !== v) {
            this._in3d = v;
            this.dragIn3d()
        }
    }
    get in3d() { return this._in3d; }


}


export class S3Blok {
    constructor(par) {
        var self = this;
        this.type = "S3Blok";
        this.par = par;

        this.timeNax = this.par.timeNax
        this._color = par._color

        let oo = {
            color: this._color,
            wireframe: true,
            opacity: this.par.alpha,
            transparent: true
        }


        this.material = new THREE.MeshPhongMaterial(oo)
        this.mesh = new THREE.Mesh();
        this.mesh.notActiv = true;
        this.mesh.name = 'S3Blok'
        this.arrO = []
        this.ooo
        if (this.timeNax) {
            this.tween = new TWEEN.Tween(this.material)
            this.tween.onUpdate(function() {
                visi3D.intRend = 1
            })
            this.tween.onComplete(function() {
                self.stop()
            })
        }

        this.stop = function() {
            this.tween.stop();
            if (self.mesh.parent) self.mesh.parent.remove(self.mesh)
            visi3D.intRend = 1
        }

        this.start = function(c, c1) {
            if (this.timeNax) {
                this.tween.stop()
                this.material.transparent = true;
                this.material.opacity = 0.1;
                this.tween.easing(TWEEN.Easing.Exponential.In)
                this.tween.to({ opacity: 0 }, this.timeNax).start()
            }
            this.mesh.geometry = c.geometry;
            this.mesh.material = this.material
            this.mesh.position.copy(c1.position)
            this.mesh.rotation.copy(c1.rotation)
            this.mesh.scale.copy(c1.scale)
        }
    }
    set color(v) {
        if (this._color !== v) {
            this._color = v;
            this.material.color.setStyle(v);
        }
    }
    get color() { return this._color; }


    set alpha(v) {
        if (this._alpha !== v) {
            this._alpha = v;
            this.material.opacity = v;
        }
    }
    get alpha() { return this._alpha; }


}