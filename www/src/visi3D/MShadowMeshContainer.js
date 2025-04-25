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

/*
        var s = 300;
        smc = new MShadowMeshContainer();
        smc.fotoPosition.set(0, 0);// def 0,0
        smc.fotoWH = s;// def 150

        var geo = new THREE.PlaneBufferGeometry();
        geo.translate(0.5, -0.5, 0);
        geo.rotateX(-Math.PI / 2);

        // для тени
        var m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
            transparent: true,
            map: smc.texturePlan
        }));
        m.scale.set(s, 1, s);
        m.position.set(smc.fotoPosition.x, 0, smc.fotoPosition.y);
        scene.add(m);

        smc.upDate();// animate
 */

import MFoto3D from './MFoto3D.js';

export default function MShadowMeshContainer(_foto3D) {
    var self = this;

    var uuid = THREE.Math.generateUUID();

    var normalVector = new THREE.Vector3(0, 1, 0);
    var planeConstant = 0.01; // this value must be slightly higher than the groundMesh's y position of 0.0
    var groundPlane = new THREE.Plane(normalVector, planeConstant);
    var lightPosition4D = new THREE.Vector4(0, 999, 0, 0.001);

    var box = new THREE.Box3();
    var foto3D = _foto3D || new MFoto3D();
    this.foto3D = foto3D;

    var tp = new THREE.Vector2(0, 0);
    var twh = 100;

    var imageBlur = new ImageBlur(); // 
    this.canvas = imageBlur.canvas;

    this.isTime = false;

    var texturePlan = new THREE.Texture(imageBlur.canvas); // текстура плана тени !!!!
    this.texturePlan = texturePlan;

    this.matPlan = new THREE.MeshPhongMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        // opacity: 0.7,
        map: texturePlan
    });

    var canvasGG = new CanvasGG();
    this.canvasGG = canvasGG;
    // для текстуры тени

    // "arrColorStopTranspanent": [0.15, 1],
    // "arrProcent": [0.82, 1]
    canvasGG.arrColorStopTranspanent[0] = 0.15;
    canvasGG.arrProcent[0] = 0.82;
    canvasGG.arrColorStopTranspanent[1] = 1;
    canvasGG.arrProcent[1] = 1;
    canvasGG.update();

    var textureShadow = new THREE.Texture(canvasGG.canvas); // текстура обектов тени
    textureShadow.needsUpdate = true; // important!
    this.textureShadow = textureShadow;

    this.content3d = new THREE.Object3D(); // в нем план тени
    this.shadowContent3d = new THREE.Object3D(); // контейнер для теней ()
    // this.content3d.add(this.shadowContent3d);

    // foto3D.addObjFoto(self.shadowContent3d);

    this.meshPlan = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.matPlan); // сам пла масштабируется по scale
    this.meshPlan.rotation.x = -Math.PI / 2;
    this.content3d.add(this.meshPlan);

    // дебагер точки света
    var meshLight = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16));
    meshLight.position.set(lightPosition4D.x, lightPosition4D.y, lightPosition4D.z);

    // if (window.visi3D && window.visi3D.objects && window.visi3D.sceneHelpers) {
    //     visi3D.sceneHelpers.add(meshLight);
    //     visi3D.objects.push(meshLight);
    // }

    // meshLight.addEventListener('objectChange', function(e) {
    //     lightPosition4D.x = meshLight.position.x;
    //     lightPosition4D.y = meshLight.position.y;
    //     lightPosition4D.z = meshLight.position.z;
    //     self.upDate();
    // });


    this.arrShadowMesh = []; // обекты тени
    this.arrObj = []; // 3д обекты по которым делаем тени

    this._dunamic = true;
    this.dirty = true; // если нужно полюбому сделать рендер

    this._lightPosition4D = lightPosition4D; // позиция освещения

    this._fotoPosition = new THREE.Vector2(0, 0); // позиция где делать фото тени
    this._fotoWH = 150; // размер что фотать

    this._imgWH = 512; // размер картинки
    this._imgBlur = 1; // not used
    this._imgAlpha = 1; // not used

    this._offsetY = 0; // смещение 0 расчетов теней
    this._scaleShadow = 1; // масштаб теней

    this._isDinamFotoRect = false; // true - берет размер всех обектов, false - берет размеры 

    this._opacityMat = 1; // прозрачность материала тени


    var clipPlanes = [
        new THREE.Plane(new THREE.Vector3(0, -1, 0), 100),
        new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    ];

    this._shadowMaterial = new THREE.MeshBasicMaterial({ // материал тени
        // color: 0x000000,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: this._opacityMat,
        depthWrite: false,
        map: textureShadow,

        clippingPlanes: clipPlanes,
        clipIntersection: false

    });

    this.arrDataSempl = []; // данные для шагов блюра
    this.arrDataSempl.push(new DataSempl(0, 200, 3, 1));


    // helpers
    var helpers = new THREE.Group();
    this.content3d.add(helpers);

    var meshShad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: textureShadow,
        transparent: true,
    }));
    meshShad.scale.set(1, 30, 1);
    meshShad.rotation.z = -Math.PI / 2;
    helpers.add(meshShad);
    helpers.visible = false;
    this.helpers = helpers;

    this.setConstMax = function(c) {
        clipPlanes[0].constant = c;
    };
    this.setConstMin = function(c) {
        clipPlanes[1].constant = -c;
    };

    this.addObj = function(object) {
       
        var index = self.arrObj.indexOf(object);
        if (index != -1) return; // обект уже есть
        object.updateMatrixWorld();

        var sc = object.clone();
        bridge(sc, object);
        replaceMaterialMesh(sc);

        self.arrShadowMesh.push(sc);
        self.arrObj.push(object);
        self.shadowContent3d.add(sc);
        this.dirty = true;
    };

    this.removeObj = function(object) {
        var index = self.arrObj.indexOf(object);
        if (index == -1) return;
        self.arrObj.splice(index, 1);
        self.shadowContent3d.remove(self.arrShadowMesh[index]);
        self.arrShadowMesh.splice(index, 1);
        this.dirty = true;
    };

    this.clear = function() {
        var len = 0;
        while ((len = self.arrObj.length) > 0) {
            self.removeObj(self.arrObj[len - 1]);
            if (len === self.arrObj.length) {
                throw new Error('object not remove');
            }
        }
    };

    this.intRend = 1;
    this.intRendOk = 1;

    // var tim = null;
    this.upDate = function() {
        if (!self.opacityMat) return;
        if (self.dunamic) {
            self.intRend = self.intRendOk;
        }

        if (self.intRend == self.intRendOk) {
            // clearTimeout(tim);
            // tim = setTimeout(self.render, 10);
            if (self.dirty || isChangeObj()) {

                self.render();
            }
        }
        self.intRend++;
    };

    var offsetFotoDinamRect = 100;

    this.render = function() {
        if (self.isTime) console.time('render ' + uuid);

        self.dirty = false;

        updateShadowMatrixMesh();

        // var par = self.shadowContent3d.parent;

        foto3D.addObjFoto(self.shadowContent3d);

        twh = self.fotoWH;
        tp.x = self.fotoPosition.x;
        tp.y = self.fotoPosition.y;

        if (self.isDinamFotoRect) {
            box.setFromObject(self.shadowContent3d);
            tp.x = box.min.x;
            tp.y = box.min.z;
            twh = Math.max((box.max.x - box.min.x), (box.max.z - box.min.z));

            tp.x -= offsetFotoDinamRect;
            tp.y -= offsetFotoDinamRect;
            twh += offsetFotoDinamRect * 2;
        }

        foto3D.moveToRect(tp.x, tp.y, twh, twh); // здвигаем 

        updateTexturePlan();

        // foto3D.removeObjFoto(self.shadowContent3d);

        self.meshPlan.scale.set(twh, twh, 1);
        self.meshPlan.position.set(tp.x + twh / 2, 0, tp.y + twh / 2);

        // if (par) par.add(self.shadowContent3d);

        if (self.isTime) console.timeEnd('render ' + uuid);

        if (self.onUpdate) self.onUpdate();
    };

    function isChangeObj() { // проверка изменился ли обекты
        for (var i = 0; i < self.arrShadowMesh.length; i++) {

            if (!self._isDinamFotoRect) {
                if (!isInFotoRectMesh(self.arrShadowMesh[i])) {
                    continue;
                }
            }
            if (isChangeMesh(self.arrShadowMesh[i])) {
                return true;
            }
        }
        return false;
    }

    function isInFotoRectMesh(shadowMesh) { // попадает ли обект в рект фото
        var colisTarget = false;
        var colisShadow = false;
        var x = box.min.x;
        var y = box.min.z;
        var w = box.max.x - box.min.x;
        var h = box.max.z - box.min.z;

        box.setFromObject(shadowMesh.userData.targetObject);
        x = box.min.x;
        y = box.min.z;
        w = box.max.x - box.min.x;
        h = box.max.z - box.min.z;
        colisTarget = isColRect(x, y, w, h, self.fotoPosition.x, self.fotoPosition.y, self.fotoWH, self.fotoWH);
        box.setFromObject(shadowMesh);
        x = box.min.x;
        y = box.min.z;
        w = box.max.x - box.min.x;
        h = box.max.z - box.min.z;
        colisShadow = isColRect(x, y, w, h, self.fotoPosition.x, self.fotoPosition.y, self.fotoWH, self.fotoWH);

        if (!colisTarget && !colisShadow) { // оба обекта верхнего уровня за границой
            return false;
        }
        //---
        colisTarget = false;
        colisShadow = false;
        for (var i = 0; i < shadowMesh.children.length; i++) {
            box.setFromObject(shadowMesh.children[i].userData.targetObject);
            x = box.min.x;
            y = box.min.z;
            w = box.max.x - box.min.x;
            h = box.max.z - box.min.z;
            colisTarget = colisTarget || isColRect(x, y, w, h, self.fotoPosition.x, self.fotoPosition.y, self.fotoWH, self.fotoWH);
            box.setFromObject(shadowMesh.children[i]);
            x = box.min.x;
            y = box.min.z;
            w = box.max.x - box.min.x;
            h = box.max.z - box.min.z;
            colisShadow = colisShadow || isColRect(x, y, w, h, self.fotoPosition.x, self.fotoPosition.y, self.fotoWH, self.fotoWH);

            if (colisTarget || colisShadow) { // какойто внутрений обект не за границой
                return true;
            }
        }

        return true;
    }

    function isChangeMesh(shadowMesh) { // проверка изменился ли обект
        if (!isEqualsTransform(shadowMesh, shadowMesh.userData.targetObject)) {
            return true;
        }
        for (var i = 0; i < shadowMesh.children.length; i++) {
            if (isChangeMesh(shadowMesh.children[i])) {
                return true;
            }
        }
        return false;
    }

    function updateTexturePlan() { // обновить текстуру плана
        var c = foto3D.getCanvas(self.imgWH);
        imageBlur.setCanvas(c);
        // foto3D.render();
        if (self.arrDataSempl.length == 0) imageBlur.update();

        for (var i = 0; i < self.arrDataSempl.length; i++) {
            self.setConstMin(self.arrDataSempl[i].min * self._scaleShadow + (self._offsetY));
            self.setConstMax(self.arrDataSempl[i].max * self._scaleShadow + (self._offsetY));

            foto3D.render();

            imageBlur._blur = self.arrDataSempl[i].blur + (self._scaleShadow > 1 ? self._scaleShadow : 0);
            imageBlur._alpha = self.arrDataSempl[i].alpha;
            imageBlur.update();
        }

        self.setConstMin(-999999);
        self.setConstMax(999999);
        texturePlan.needsUpdate = true;
    }

    function applyTransfornRec(obj) { // применить трансформацию обекта рекусивно
        applyTransforn(obj, obj.userData.targetObject);
        for (var i = 0; i < obj.children.length; i++) {
            applyTransfornRec(obj.children[i]);
        }
    }

    function updateShadowMatrixMesh() { // пересчитать тени обектов
        // return
        lightPosition4D.w = 0.001; // more of a directional Light value
        meshLight.position.set(lightPosition4D.x, lightPosition4D.y, lightPosition4D.z);

        for (var i = 0; i < self.arrShadowMesh.length; i++) {
            applyTransfornRec(self.arrShadowMesh[i]);
        }

        updateShadowUv();
    }

    var boundingBoxUv = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3(300, 300, 300));
    this.boundingBoxUv = boundingBoxUv;
    var position = new THREE.Vector3();

    function corectUVShadow(shadowMesh) { // пересчет ув по высоте
        if (shadowMesh.geometry.uuid === shadowMesh.userData.targetObject.geometry.uuid) {
            shadowMesh.geometry = shadowMesh.userData.targetObject.geometry.clone();
        }
        // shadowMesh.geometry.computeBoundingBox();
        var boundingBox = boundingBoxUv; // shadowMesh.geometry.boundingBox; //boundingBoxUv; // 
        var py = 0;

        if (shadowMesh.geometry instanceof THREE.Geometry) {

            var faces = shadowMesh.geometry.faces;
            var vertices = shadowMesh.geometry.vertices;
            var faceVertexUvs = shadowMesh.geometry.faceVertexUvs[0];
            for (var i = 0; i < faces.length; i++) {

                position.set(vertices[faces[i].a].x, vertices[faces[i].a].y, vertices[faces[i].a].z);
                shadowMesh.localToWorld(position);
                py = 1 - getProcent(position.y - (self._offsetY /*/ self._scaleShadow*/ ), boundingBox.min.y, boundingBox.min.y + boundingBox.max.y) / 100;
                faceVertexUvs[i][0].set(py, py);

                position.set(vertices[faces[i].b].x, vertices[faces[i].b].y, vertices[faces[i].b].z);
                shadowMesh.localToWorld(position);
                py = 1 - getProcent(position.y - (self._offsetY /*/ self._scaleShadow*/ ), boundingBox.min.y, boundingBox.min.y + boundingBox.max.y) / 100;
                faceVertexUvs[i][1].set(py, py);

                position.set(vertices[faces[i].c].x, vertices[faces[i].c].y, vertices[faces[i].c].z);
                shadowMesh.localToWorld(position);
                py = 1 - getProcent(position.y - (self._offsetY /*/ self._scaleShadow*/ ), boundingBox.min.y, boundingBox.min.y + boundingBox.max.y) / 100;
                faceVertexUvs[i][2].set(py, py);
            }

            shadowMesh.geometry.uvsNeedUpdate = true;

        } else {


            var arrPosition = shadowMesh.geometry.attributes.position.array;


            if (!shadowMesh.geometry.attributes.uv) { // если нет атрибута создаем новый
                arrUvAttribut = new Float32Array((arrPosition.length / 3) * 2);
                shadowMesh.geometry.addAttribute('uv', new THREE.BufferAttribute(arrUvAttribut, 2));
            }

            var arrUv = shadowMesh.geometry.attributes.uv.array;
            var itemSize = shadowMesh.geometry.attributes.uv.itemSize;

            var arrIndex = shadowMesh.geometry.index.array;
            var count = shadowMesh.geometry.index.count;

            var indexUv = 0;
            var indexInd = 0;

            //----
            for (var i = 0; i < count; i++) {
                var ind = arrIndex[i];
                var indP = (ind * 3);
                var indUv = (ind * 2);

                position.set(arrPosition[(indP)], arrPosition[(indP + 1)], arrPosition[(indP + 2)]);

                shadowMesh.localToWorld(position);

                // var px = 1 - getProcent(position.x, boundingBox.min.x, boundingBox.max.x) / 100;
                py = 1 - getProcent(position.y - (self._offsetY /*/ self._scaleShadow*/ ), boundingBox.min.y, boundingBox.min.y + boundingBox.max.y * self._scaleShadow) / 100;
                // var pz = 1 - getProcent(position.z, boundingBox.min.z, boundingBox.max.z) / 100;
                // var ppx = 1 - calc.diffNum(0.5, px) / 0.5;
                // var ppz = 1 - calc.diffNum(0.5, pz) / 0.5;
                // var py = 1 - getProcent(arrPosition[(indP + 1)], boundingBox.min.y, boundingBox.max.y) / 100;
                arrUv[indUv] = py; // * ppz * ppx; //(py*ppx *ppz/*+ (ppx + ppz)*0.1*/) // 3;
                arrUv[indUv + 1] = py; // * ppz * ppx; //(py*ppx *ppz/*+ (ppx + ppz)*0.1*/) // 3;
            }
            shadowMesh.geometry.attributes.uv.needsUpdate = true;
        }

    }

    function findRecMesh(obj, arr) { //найти все мешы в обекте
        if (obj.type == 'Mesh') {
            arr.push(obj);
        }
        for (var i = 0; i < obj.children.length; i++) {
            if (obj.type == 'Mesh') {
                arr.push(obj.children[i]);
            } else {
                findRecMesh(obj.children[i], arr);
            }
        }
    }

    function updateUvMesh(obj) {
        if (obj.type === 'Mesh') {
            var isUpdateUvMesh = false; // нужно ли пересчитывать ув меша 
            var wpos = obj.getWorldPosition(obj.position);
            var wrot = obj.getWorldQuaternion(obj.quaternion);
            var maxHeight = self.maxHeight;
            wpos.y -= (self._offsetY /* / self._scaleShadow*/ );

            if (!obj.userData.pos) { // когда первый раз зашли
                isUpdateUvMesh = true;
            } else if (obj.userData.pos.y != wpos.y) { // когда позиция по высоте поменылась
                isUpdateUvMesh = true;
            } else if (!obj.userData.rot.equals(wrot)) { // когда повернули 
                isUpdateUvMesh = true;
            } else if (obj.userData.maxHeight !== maxHeight) { // когда поменялся конф высота
                isUpdateUvMesh = true;
            } else if (obj.userData.scaleShadow !== self._scaleShadow) { // когда поменялся конф высота
                isUpdateUvMesh = true;
            }

            if (!self._isDinamFotoRect) { // оптимизация если обект за ректом его пересчитывать не нужно 
                box.setFromObject(obj);
                if (!isColRect(box.min.x, box.min.z, box.max.x - box.min.x, box.max.z - box.min.z, self.fotoPosition.x, self.fotoPosition.y, self.fotoWH, self.fotoWH)) {
                    isUpdateUvMesh = false;
                }
            }

            if (isUpdateUvMesh) {
                corectUVShadow(obj);
                obj.userData.pos = wpos;
                obj.userData.rot = wrot;
                obj.userData.maxHeight = maxHeight;
                obj.userData.scaleShadow = self._scaleShadow;
            }
        }
        for (var i = 0; i < obj.children.length; i++) {
            updateUvMesh(obj.children[i]);
        }
    }

    function updateShadowUv() {

        meshShad.scale.x = (self.boundingBoxUv.max.y || 1) * self._scaleShadow;
        meshShad.position.y = (meshShad.scale.x / 2) + self.boundingBoxUv.min.y;

        for (var i = 0; i < self.arrShadowMesh.length; i++) {

            if (!self._isDinamFotoRect) {
                box.setFromObject(self.arrShadowMesh[i]);
                if (!isColRect(box.min.x, box.min.z, box.max.x - box.min.x, box.max.z - box.min.z, self.fotoPosition.x, self.fotoPosition.y, self.fotoWH, self.fotoWH)) {
                    continue;
                }
            }

            updateUvMesh(self.arrShadowMesh[i]);

        }
    }
    this.updateShadowUv = updateShadowUv;

    this.updateShadowTexture = function() {
        this.canvasGG.update();
        this.textureShadow.needsUpdate = true;
    };

    this.setShadowColor = function(r, g, b) {
        canvasGG.r = r;
        canvasGG.g = g;
        canvasGG.b = b;
        self.updateShadowTexture();
    };

    this.getConfig = function() {
        var o = {};
        o.imgWH = self.imgWH;
        o.fotoPosition = {
            x: self._fotoPosition.x,
            y: self._fotoPosition.y
        };
        o.fotoWH = self.fotoWH;
        o.maxHeight = self.maxHeight;
        o.isDinamFotoRect = self.isDinamFotoRect;
        o.arrDataSempl = self.arrDataSempl;
        o.opacityMat = self.opacityMat;
        o.dunamic = self.dunamic;
        o.canvasGG = {
            arrColorStopTranspanent: self.canvasGG.arrColorStopTranspanent,
            arrProcent: self.canvasGG.arrProcent,
        };
        return o;
    };

    this.setConfig = function(o) {
        self.canvasGG.arrColorStopTranspanent = o.canvasGG.arrColorStopTranspanent;
        self.canvasGG.arrProcent = o.canvasGG.arrProcent;
        self.fotoPosition.x = o.fotoPosition.x;
        self.fotoPosition.y = o.fotoPosition.y;
        self.fotoWH = o.fotoWH;
        self.isDinamFotoRect = o.isDinamFotoRect;
        self.arrDataSempl = o.arrDataSempl;
        self.opacityMat = o.opacityMat;
        self.imgWH = o.imgWH;
        self.dunamic = o.dunamic;
        self.updateShadowTexture();
        self.maxHeight = o.maxHeight;

    };

    var sss = {
        "imgWH": 1024,
        "fotoPosition": {
            "x": 0,
            "y": 0
        },
        "fotoWH": 150,
        "maxHeight": 300,
        "isDinamFotoRect": false,
        "arrDataSempl": [{
            "min": 0,
            "max": 6,
            "blur": 0.8,
            "alpha": 0.25
        }, {
            "min": 4,
            "max": 15,
            "blur": 3,
            "alpha": 0.64
        }, {
            "min": 10,
            "max": 23,
            "blur": 4,
            "alpha": 0.5
        }, {
            "min": 15,
            "max": 50,
            "blur": 15,
            "alpha": 1
        }, {
            "min": 20,
            "max": 198.09,
            "blur": 15,
            "alpha": 0.7
        }, {
            "min": 0,
            "max": 2,
            "blur": 1.02,
            "alpha": 1
        }],
        "opacityMat": 1,
        "dunamic": true,
        "canvasGG": {
            "arrColorStopTranspanent": [0, 1, 0.25],
            "arrProcent": [0.4, 1, 0.96]
        }
    };
    this.sss = sss;
    this.setConfig(sss);

    function bridge(obj, obj1) { // установка связи
        obj.userData.targetObject = obj1;
        for (var i = 0; i < obj.children.length; i++) {
            if (!obj1.children[i]) throw new Error('обекты не одинаковы');
            bridge(obj.children[i], obj1.children[i]);
        }
    }

    function replaceMaterialMesh(obj) { // замена материалов 
        var arr = [];
        findRecMesh(obj, arr);
        for (var i = 0; i < arr.length; i++) {
            arr[i].material = self._shadowMaterial;
        }
    }

    function isEqualsTransform(obj, obj1) { // одинакова ли трансформация обектов
        var isEqualsPos = false;
        // if (self._scaleShadow !== 1) {
        //     isEqualsPos = 
        //         (Math.abs((obj.position.x * self._scaleShadow) - obj1.position.x) < 1) &&
        //         (Math.abs((obj.position.y * self._scaleShadow) - obj1.position.y) < 1) &&
        //         (Math.abs((obj.position.z * self._scaleShadow) - obj1.position.z) < 1);

        // } else {
        isEqualsPos = obj.position.equals(obj1.position);
        // }

        if (isEqualsPos &&
            obj.quaternion.equals(obj1.quaternion) &&
            (obj.scale.equals(obj1.scale)
                // obj.scale.x === obj1.scale.x &&
                // obj.scale.z === obj1.scale.z
            ) &&
            obj.visible === obj1.visible) {
            return true;
        }
        return false;
    }

    function applyTransforn(obj, obj1) { // скопировать трансф обекта
        obj.position.copy(obj1.position);
        obj.quaternion.copy(obj1.quaternion);
        obj.scale.copy(obj1.scale);
        obj.visible = obj1.visible;

        // if (self._scaleShadow !== 1) {
        //     obj.position.x = obj1.position.x / self._scaleShadow;
        //     obj.position.y = obj1.position.y / self._scaleShadow;
        //     obj.position.z = obj1.position.z / self._scaleShadow;
        // }

        // obj.scale.set(1, 1, 1);// ignore scale object
    }


    // проверка на пересечение прямоугольников
    function isColRect(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < (x2 + w2) && y1 < (y2 + h2) && (x1 + w1) > x2 && (y1 + h1) > y2;
    }

    function getProcent(val, min, max, okrug) {
        min = min != undefined ? min : 0;
        max = max != undefined ? max : 100;
        okrug = okrug || 100;
        if (isNaN(parseFloat(val))) val = min;
        if (val < min) val = min;
        if (val > max) val = max;
        val = Math.round(val * okrug) / okrug;
        return (min < 0) ? (Math.abs(min) + val) * 100 / ((Math.abs(min) + Math.abs(max)) || 1) :
            (Math.abs(min) - val) * 100 / ((Math.abs(min) - Math.abs(max)) || 1);
    }

    function roundNum(num, siz) {
        siz = siz != undefined ? siz : 10000;
        return Math.round((num * siz)) / siz;
    }

    this.getBase64 = function() {
        self.render();
        return imageBlur.canvas.toDataURL();
    };

    this.debug = false;
}

Object.defineProperties(MShadowMeshContainer.prototype, {

    scaleShadow: {
        set: function(value) {
            this.dirty = true;
            this._scaleShadow = value;
            // this.content3d.scale.x = this.content3d.scale.z = value;
        },
        get: function() {
            return this._scaleShadow;
        }
    },

    debug: {
        set: function(value) {
            this.helpers.visible = value;
        },
        get: function() {
            return this.helpers.visible;
        }
    },
    offsetY: {
        set: function(value) {
            this._offsetY = value;
            this.dirty = true;
        },
        get: function() {
            return this._offsetY;
        }
    },

    maxHeight: {
        set: function(value) {
            this.dirty = true;
            this.boundingBoxUv.max.y = value;
            this.updateShadowUv();
        },
        get: function() {
            return this.boundingBoxUv.max.y;
        }
    },

    dunamic: {
        set: function(value) {
            this.dirty = true;
            this._dunamic = value;
        },
        get: function() {
            return this._dunamic;
        }
    },
    fotoPosition: {
        set: function(value) {
            this.dirty = true;
            this._fotoPosition = value;
        },
        get: function() {
            return this._fotoPosition;
        }
    },
    fotoWH: {
        set: function(value) {
            this.dirty = true;
            this._fotoWH = value;
        },
        get: function() {
            return this._fotoWH;
        }
    },
    imgWH: {
        set: function(value) {
            this.dirty = true;
            this._imgWH = value;
        },
        get: function() {
            return this._imgWH;
        }
    },
    imgBlur: {
        set: function(value) {
            this.dirty = true;
            this._imgBlur = value;
        },
        get: function() {
            this.dirty = true;
            return this._imgBlur;
        }
    },
    imgAlpha: {
        set: function(value) {
            this.dirty = true;
            this._imgAlpha = value;
        },
        get: function() {
            return this._imgAlpha;
        }
    },

    isDinamFotoRect: {
        set: function(value) {
            this.dirty = true;
            this._isDinamFotoRect = value;
        },
        get: function() {
            return this._isDinamFotoRect;
        }
    },
    opacityMat: {
        set: function(value) {
            this.dirty = true;
            this._opacityMat = value;
            this.matPlan.opacity = this._opacityMat;
        },
        get: function() {
            return this._opacityMat;
        }
    },

    shadowMaterial: {
        set: function(value) {
            if (value !== this._shadowMaterial) {
                this._shadowMaterial = value;
                for (var i = 0; i < this.arrShadowMesh.length; i++) {
                    if (this.arrShadowMesh[i] instanceof THREE.ShadowMesh) {
                        this.arrShadowMesh[i].material = this._shadowMaterial;
                    } else {
                        for (var j = 0; j < this.arrShadowMesh[i].children.length; j++) {
                            if (this.arrShadowMesh[i].children[j] instanceof THREE.ShadowMesh) {
                                this.arrShadowMesh[i].children[j].material = this._shadowMaterial;
                            }
                        }
                    }
                }
            }
        },
        get: function() {
            return this._shadowMaterial;
        }
    },

    lightPosition4D: {
        set: function(value) {
            this._lightPosition4D.set(value.x, value.y, value.z, 0.001);
        },
        get: function() {
            return this._lightPosition4D;
        }
    },

});


function DataSempl(min, max, blur, alpha) {
    this.min = min || 0;
    this.max = max || 1;
    this.blur = blur || 0;
    this.alpha = alpha || 1;
}



function ImageBlur() {
    var self = this;

    var canvas = document.createElement('canvas');
    this.canvas = canvas;
    canvas.width = 256;
    canvas.height = 256;
    var context = canvas.getContext("2d");
    var img = new Image();
    this.b64 = null;
    this._blur = 0;
    this._blur1 = 1;
    this._alpha = 1;
    this.image = new Image();

    this.setBase64 = function(_b64, fun) {
        this.b64 = _b64;
        img = new Image();
        img.onload = function() {
            canvas.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = img.width;
            canvas.height = img.height;
            self.update();
            if (fun) fun(canvas.toDataURL());
        };
        img.src = _b64;
    };

    this.setCanvas = function(c) {
        img = c;
        canvas.width = c.width;
        canvas.height = c.height;
        // self.update();
    };

    this.update = function() {
        // context.clearRect(0, 0, canvas.width, canvas.height);
        // context.filter = 'blur(' + self._blur1 + 'px)';
        // context.globalAlpha = 0.1;
        // context.drawImage(img, 0, 0);
        context.filter = 'blur(' + self._blur + 'px)';
        context.globalAlpha = self._alpha;
        context.drawImage(img, 0, 0);
    };
}
Object.defineProperties(ImageBlur.prototype, {
    blur: {
        set: function(value) {
            this._blur = value;
            // this.update();
        },
        get: function() {
            return this._blur;
        }
    },
    alpha: {
        set: function(value) {
            this._alpha = value;
            // this.update();
        },
        get: function() {
            return this._alpha;
        }
    },

});

function CanvasGG() {
    var self = this;

    var canvas = document.createElement('canvas');
    // document.body.appendChild(canvas);
    // canvas.style.position = 'fixed';
    canvas.width = canvas.height = 256;
    this.canvas = canvas;
    var context = canvas.getContext("2d");
    this._blur = 0;
    this._alpha = 1;

    this.arrColorStopTranspanent = [0, 1]; //CSS Colors transpanent
    this.arrProcent = [0, 1]; //0 ... 1

    this.position = new THREE.Vector2(); //0 ... 1
    this.position1 = new THREE.Vector2(1, 0); //0 ... 1

    this.r = 0;
    this.g = 0;
    this.b = 0;

    this.update = function() {
        var w = canvas.width;
        var h = canvas.height;

        context.clearRect(0, 0, w, h);

        context.rect(0, 0, w, h);
        context.filter = 'blur(' + self._blur + 'px)';
        context.globalAlpha = self._alpha;

        var px = self.position.x * w;
        var py = self.position.y * h;
        var px1 = self.position1.x * w;
        var py1 = self.position1.y * h;

        var gradient = context.createLinearGradient(px, py, px1, py1);

        for (var i = 0; i < self.arrColorStopTranspanent.length; i++) {
            gradient.addColorStop(self.arrProcent[i], 'rgba(' + self.r + ',' + self.g + ',' + self.b + ',' + self.arrColorStopTranspanent[i] + ')');
        }

        context.fillStyle = gradient;
        context.fill();

    };
    this.update();
}
Object.defineProperties(CanvasGG.prototype, {
    // blur: {
    //     set: function(value) {
    //         this._blur = value;
    //         this.update();
    //     },
    //     get: function() {
    //         return this._blur;
    //     }
    // },
    // alpha: {
    //     set: function(value) {
    //         this._alpha = value;
    //         this.update();
    //     },
    //     get: function() {
    //         return this._alpha;
    //     }
    // },

});