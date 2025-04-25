THREE.JDLoader = function(manager) {
    this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager
};
THREE.JDLoader.prototype = {
    json: null,
    mode: 'viewer',
    isAntiCache: false,
    constructor: THREE.JDLoader,
    uploadType: "",
    currentMapFiles: [],
    queue: [],
    queueAll: [],
    renderer: null,
    queueTotal: 0,
    parsedData: null,
    llllload: null,
    load: function(url, onLoad, onProgress, onError, onFilesLoaded) {

        var self1 = this;

        var scope = this;

        self1.llllload = onLoad;

        var texturePath = this.texturePath && (typeof this.texturePath === "string") ? this.texturePath : THREE.Loader.prototype.extractUrlBase(url);
        var loader = new THREE.FileLoader(this.manager);
        url = self1.isAntiCache ? (url + "?cache="+self1.isAntiCache) : url;
        loader.load(url, function(text) {
            scope.loadText(text, onLoad, texturePath, onFilesLoaded)
        }, onProgress, onError)
    },
    loadText: function(text, onLoad, texturePath, onFilesLoaded) {
        var self2 = this;


        this.json = JSON.parse(text);

        this.parsedData = null;

        if (this.json) {
            var object = this.parse(this.json, texturePath, onFilesLoaded);
            this.parsedData = $.extend(true, {}, object);
            //onLoad(object)
        }
    },
    loadJson: function(_json, onLoad, texturePath, onFilesLoaded) {
        var self2 = this;

        this.json = _json;

        self2.llllload = onLoad;

        this.parsedData = null;

        if (this.json) {
            var object = this.parse(this.json, texturePath, onFilesLoaded);
            this.parsedData = $.extend(true, {}, object);
            //onLoad(object)
        }
    },
    setTexturePath: function(value) {
        this.texturePath = value;
    },
    parse: function(json, texturePath, onFilesLoaded) {
        var self = this;

        var i = 0;
        var scope = this;
        var materials = [];
        var settings = null;
        var nodes = [];
        var geometries = [];

        function parseSettings() {

            if (json.hasOwnProperty('settings')) {
                settings = json.settings;
            }
        }

        function getBoundingSphere() {
            var boundingSphere = new THREE.Sphere();
            var i, j, geometry;
            var d = 0,
                sumRidius = 0,
                radius = 0;
            var certerArray = [],
                radiusArray = [],
                weights = [];
            var center = new THREE.Vector3(0, 0, 0);
            var vTemp = new THREE.Vector3(0, 0, 0);
            if (geometries && geometries.length) {
                for (i = 0; i < geometries.length; ++i) {
                    if (!geometries[i].boundingSphere) {
                        geometries[i].computeBoundingSphere()
                    }
                    sumRidius += geometries[i].boundingSphere.radius
                }
                if (sumRidius > 0) {
                    for (i = 0; i < geometries.length; ++i) {
                        geometry = geometries[i];
                        radiusArray.push(geometry.boundingSphere.radius);
                        certerArray.push(geometry.boundingSphere.center);
                        vTemp.copy(geometry.boundingSphere.center);
                        vTemp.multiplyScalar(geometry.boundingSphere.radius / sumRidius);
                        center.add(vTemp)
                    }
                    for (i = 0; i < geometries.length; ++i) {
                        var len = center.distanceTo(certerArray[i]);
                        if (len >= d) {
                            d = len;
                            radius = d + radiusArray[i]
                        }
                    }
                    boundingSphere.center = center;
                    boundingSphere.radius = radius
                }
            }
            return boundingSphere
        }

        function getBones(mesh) {
            if (mesh && mesh.skin && mesh.skin.skinBones.length && mesh.skin.skinWeights.length) {
                return nodes
            } else {
                var newNodes = [];
                newNodes.push(nodes[0]);
                var node = nodes[mesh.node];
                var newNode = {};
                newNode.name = node.name;
                newNode.parent = 0;
                newNode.pos = [node.pos[0], node.pos[1], node.pos[2]];
                newNode.scl = [node.scl[0], node.scl[1], node.scl[2]];
                newNode.rotq = [node.rotq[0], node.rotq[1], node.rotq[2], node.rotq[3]];
                newNodes.push(newNode);
                return newNodes
            }
        }

        function parseMaterials() {

            materials = [];

            var defaultPhysic = self.uploadType == "newJd" ? true : false;

            //console.error("ZZ defaultPhysicdefaultPhysic", defaultPhysic);

            if (json.materials === undefined || json.materials.length === 0) return;

            var ix = 0;
            var mL = json.materials.length;


            function parsemat(materialJD) { // если материал не из библиотеки, то парсим как ранее. иначе - грузим по url, а затем парсим
                var currentSettings = T_SHADER.SETTINGS.getModelUVData(settings);

                if (materialJD.hasOwnProperty('materialData')) {

                    API.getMaterialById(callbackSuccess, callbackError, materialJD.materialData.materialId);

                    function callbackSuccess(materialToParseFromLib) {

                        //console.log("callbackSuccess!", materialToParseFromLib);

                        //console.log("MATERIAL [LIB]: ", currentSettings, materialToParseFromLib.name, materialJD, materialToParseFromLib);

                        // сделал это тк библиотеки теперь не грузятся сразу и матераил надо делать из Info
                        //libraryManager0.doThreeMaterial(callbackSuccessJD, null, materialInfo);


                        if (materialToParseFromLib.data) {   // это готовый шейдерный материал

                            API.getJD(materialToParseFromLib, callbackSuccessJD);

                            function callbackSuccessJD(materialJd) {

                              //console.log("JD", materialJd, materialJD);



                                var _arr = ["aoMap", "lightMap"];

                                var isCheckT = copySettingsFromLibMaterialToGloablSettings(materialToParseFromLib.settings, settings, materialJD);

                                //console.error("materialToParseFromLib", isCheckT, materialToParseFromLib, materialJD, materialToParseFromLib.settings, settings);

                                // normalMap
                                /* var isParam1 = false;
                                 if (objectMat.normalMap && objectMat.normalMapChannel.toString() == "2") {
                                     isParam1 = true;

                                     var _normalMap = objectMat.normalMap;
                                     var _normalScale = objectMat.normalScale;
                                 }*/

                                if (isCheckT) {
                                    _arr.push("normalMap");
                                    _arr.push("bump");

                                    materialToParseFromLib.normalScale = materialJD.normalScale;
                                }

                                //console.log("_arr", _arr, materialJD.maps, materialToParseFromLib.maps);

                                // взять maps (_arr) из материала, которому применили библиотечный
                                if (materialJD) {
                                    var _maps = [];

                                    // взять с материала лишь _arr maps
                                    $.each(materialJD.maps, function(index11, value11) {

                                        if (_arr.indexOf(value11.type) != -1) {
                                            //if (value11.type == "aoMap" || value11.type == "lightMap") {
                                            _maps.push(value11);
                                        }
                                    });
                                    // c библиотечного взять все, кроме _arr maps
                                    //$.each(materialToParseFromLib.maps, function(index, value) {
                                    $.each(materialJd.maps, function(index, value) {
                                        if (_arr.indexOf(value.type) == -1) {
                                            //if (value.type != "aoMap" && value.type != "lightMap") {
                                            _maps.push(value);
                                        }
                                    })

                                    //console.log("_maps", _maps);

                                    //materialToParseFromLib.maps = _maps;
                                    materialJd.maps = _maps;
                                }

                                //materialToParseFromLib.name = materialJD.name;
                                materialJd.name = materialJD.name;

if (materialJd.type) materialToParseFromLib.type = materialJd.type;

                                //var materialThree = T_SHADER.createMaterialFromJD(materialToParseFromLib, currentSettings, texturePath, defaultPhysic);
                                var materialThree = T_SHADER.createMaterialFromJD(materialJd, currentSettings, texturePath, defaultPhysic,          false, null, self.renderer);
                                //materialThree.materialData.uniq = new THREE.generateUUID();
                                if(materialThree.materialData){
                                    materialThree.materialData.settings = currentSettings;
                                    materialThree.materialData.type = "LibraryMaterial";
                                    materialThree.materialData.name = materialToParseFromLib.name;      // materialJd.name;
                                    materialThree.materialData.icon = materialToParseFromLib.icon ? materialToParseFromLib.icon.url : "img/noimage.jpg";
                                    materialThree.materialData.materialJson = materialToParseFromLib;
                                    materialThree.materialData.materialId = materialToParseFromLib.id;
                                    materialThree.materialData.index = materialJD.materialData.index;
                                    materialThree.materialData.libraryId = null;


                                }
                                

                                //console.error("ZXcallbackSuccessJD", materialThree, materialJD, materialToParseFromLib, materialToParseFromLib.settings, settings, currentSettings);

                                materials.push(materialThree);
                                ix++; isAllMatsParsed(currentSettings);


                            }

                        } else {
                            // это материал пользователя. просто картинка

                            if (materialToParseFromLib.files && materialToParseFromLib.files[0]) {

                                const loader = new THREE.TextureLoader().load(
                                    materialToParseFromLib.files[0].url,
                                    function (texture) {
                                        var materialThree = new THREE.PhysicalShaderMaterial();
                                        materialThree.map = texture;
                                        materialThree.lights = false;
                                        materialThree.map.anisotropy = engine.renderer.capabilities.getMaxAnisotropy();
//materialThree.map.minFilter = THREE.LinearMipMapLinearFilter;
//materialThree.map.magFilter = THREE.LinearFilter;
//materialThree.map.mapping = THREE.UVMapping;
materialThree.map.encoding = THREE.sRGBEncoding;

materialThree.aoMap = self.sphereAoLightMapTexture;
materialThree.aoMap.encoding = THREE.LinearEncoding;

materialThree.lightMap = self.sphereAoLightMapTexture;
materialThree.lightMap.encoding = THREE.LinearEncoding;


materialThree.lightMap.minFilter = materialThree.aoMap.minFilter = THREE.LinearMipMapLinearFilter;
materialThree.lightMap.magFilter = materialThree.aoMap.magFilter = THREE.LinearFilter;


                                        materialThree.name = materialToParseFromLib.name;
                                        //materialThree.materialData.settings = currentSettings;

                                        if(materialThree.materialData){
                                            materialThree.materialData.type = "LibraryMaterial";
                                            materialThree.materialData.name = materialToParseFromLib.name;
                                            materialThree.materialData.icon = materialToParseFromLib.files[0] ? materialToParseFromLib.files[0].adminThumb : "img/noimage.jpg";
                                            materialThree.materialData.materialId = materialToParseFromLib.id;
                                            materialThree.materialData.libraryId = materialToParseFromLib.libraryId;
                                        }


                                        /*if (callbackSuccess0) {
                                            setTimeout(function() {
                                                materials.push(materialThree);
                                                ix++; isAllMatsParsed(currentSettings);
                                            }, 1000)
                                        }*/

                                        setTimeout(function() {
                                            materials.push(materialThree);
                                            ix++; isAllMatsParsed(currentSettings);
                                        }, 10)
                                    },
                                    undefined,
                                    function (err) {
                                        console.error('An error happened');
                                    }
                                );

                            } else {
                                var materialThree = new THREE.PhysicalShaderMaterial();
                                materialThree.name = materialToParseFromLib.name;
                                materialThree.lights = false;


materialThree.aoMap = self.sphereAoLightMapTexture;
materialThree.lightMap = self.sphereAoLightMapTexture;

materialThree.lightMap.minFilter = materialThree.aoMap.minFilter = THREE.LinearMipMapLinearFilter;
materialThree.lightMap.magFilter = materialThree.aoMap.magFilter = THREE.LinearFilter;

                                if(materialThree.materialData){    
                                    //materialThree.materialData.settings = currentSettings;
                                    materialThree.materialData.type = "LibraryMaterial";
                                    materialThree.materialData.name = materialToParseFromLib.name;
                                    materialThree.materialData.icon = materialToParseFromLib.files[0] ? materialToParseFromLib.files[0].adminThumb : "img/noimage.jpg";
                                    materialThree.materialData.materialId = materialToParseFromLib.id;
                                    materialThree.materialData.libraryId = materialToParseFromLib.libraryId;
                                }

                                materials.push(materialThree);
                                ix++; isAllMatsParsed(currentSettings);
                            }
                        }


                        // закомментил старое. когда библиотеки материалаов грузились сразу
                        /*  if (materialInfo.data) {
                        API.getJD(materialInfo, callbackSuccessJD);
                        } else {
                            ix++; isAllMatsParsed(currentSettings);
                        }*/

                        function callbackSuccessJD(materialThree) {


                            materials.push(materialThree);
                            ix++; isAllMatsParsed(currentSettings);
                        }
                        function callbackErrorJD() { }
                    }
                    function callbackError(e) {
                        console.error("API.getMaterialByIdFromMaterialLib", e);

                        materials.push(T_SHADER.getMaterial('noLibMaterial', materialJD));
                        ix++; isAllMatsParsed(currentSettings);
                    }

                } else {

                    var materialThree = T_SHADER.createMaterialFromJD(materialJD, currentSettings, texturePath, defaultPhysic,      false, null, self.renderer);
                        if(materialThree.materialData){    
                            materialThree.materialData.settings = currentSettings;
                            materialThree.materialData.type = "Material";
                            materialThree.materialData.name = materialJD.name;
                            materialThree.materialData.icon = "img/noimage.jpg";
                            materialThree.materialData.index = ix;
                            materialThree.materialData.materialJson = null;
                            materialThree.materialData.materialId = null;
                            materialThree.materialData.libraryId = null;
                        }


                    materials.push(materialThree);
                    ix++; isAllMatsParsed(currentSettings);
                }
            }

            function copySettingsFromLibMaterialToGloablSettings(libSettings, globalSettings, materialJD) {
                var rez = false;

                //console.error("copySettingsFromLibMaterialToGloablSettings libSettings, globalSettings", libSettings, globalSettings);

                //console.log("------------000------------", libSettings, globalSettings);


                if (!libSettings || !globalSettings) return;

                //var _sett0 = $.extend(true, {}, globalSettings.uploader.uv);  // сохранить начальные настройки в _sett
                //var _sett = libSettings;   $.extend(true, {}, _libSettings); //$.extend(true, {}, _globalSettings.uploader.uv);

                // при добавлении из библиотеки в сет, эта карта может попасть на модель только в случае если на родном мате модели нет карты нормалей во втором канале. Карта нормалей второго канала родного мата всегда в приоритете
                /*var isParam1 = false;
                if (objectMaterial.normalMap && objectMaterial.normalMapChannel.toString() == "2") {
                    isParam1 = true;
                }*/

                //console.log("----------------------------", libSettings);

                var _arr = ["aoMap", "lightMap"];

                // aoMap и lighMap настройки взять с globalSettings. остальные с библиотечного. и имя настрйокам сделать то что у материала, а не библиотечное
                $.each(["userChannel", "userOffset", "userRotation", "userScale", "userWrap"], function(index1, userD) {
                    //console.log("---1---", userD);

                    if (libSettings[userD]) {
                        $.each(libSettings[userD], function(index2, value2) {

                            if (value2 && libSettings[userD] && libSettings[userD][index2]) {
                                //console.log("--------1---------");
                                //console.log(index2, value2, _sett[userD][index2]);
                                //console.log("--------2---------");

                                // копируем все кроме aoMap, lightMap
                                //if (_sett[userD][index2] != "aoMap" && _sett[userD][index2] == "lightMap") {

                                    $.each(libSettings[userD][index2], function(index3, value3) {
                                        //console.log("index3, value3", index3, value3);
                                        if (_arr.indexOf(index3) == -1) {
                                            //console.log("X");
                                            if (globalSettings)
                                            if (globalSettings.uploader)
                                            if (globalSettings.uploader.uv)
                                            if (globalSettings.uploader.uv[userD])
                                            if (globalSettings.uploader.uv[userD][materialJD.name]) {

                                                var isCheck = false;

                                                if (userD == "userChannel" && index3 == "normalMap") {
                                                    // при добавлении из библиотеки в сет, normalMap карта может попасть на модель только в случае если на родном мате модели нет карты нормалей во втором канале. Карта нормалей второго канала родного мата всегда в приоритете
                                                    console.log("==", index2, userD, libSettings[userD], libSettings[userD][index2], (libSettings[userD][index2]).normalMap);
                                                    if (libSettings[userD] && libSettings[userD][index2] && (libSettings[userD][index2]).normalMap.toString() == "2") {
                                                        //console.log("DA");

                                                        isCheck = true;

                                                        rez = isCheck;
                                                    }
                                                }

                                                if (!isCheck)
                                                globalSettings.uploader.uv[userD][materialJD.name][index3] = value3;
                                            }

                                        }
                                    });

                            }
                        })
                    }
                })

                return rez;
            }

            function isAllMatsParsed(sett) {
                if (ix == mL) {

                   var oooobj = {
                        geometries: geometries,
                        materials: materials,
                        settings: settings,
                        boundingSphere: sphere,
                        jd: self.json
                    };

                   self.llllload(oooobj);

                    parseMaterialsProcess(sett);
                } else {
                    parsemat(json.materials[ix]);
                }
            }

            parsemat(json.materials[ix]);
        }

        function parseMaterialsProcess(sett2) {


            // LOAD MATERIALS
            self.queueAll = materials;
            self.queueTotal = materials.length;

            // step 1: получить все уникальные пути
            self.pathsAll = [];

            $.each(self.queueAll, function(index, materialThree) {
                //console.error("Xmaterial", sett2, materialThree);
                if(materialThree.materialData){
                    if (materialThree.materialData.hasOwnProperty('maps')) {
                        $.each(materialThree.materialData.maps, function(index2, mapData) {
                            self.pathsAll.pushIfNotExist(mapData, function(e) {
                                return e.materialPath === mapData.materialPath;
                            });
                        })
                    }
                }
                
            })
            //console.error("Start", self.queueTotal, self.pathsAll.length, self.pathsAll);

            if (self.pathsAll.length == 0) {
                setTimeout(function() {


                   if(onFilesLoaded) onFilesLoaded(self.parsedData);
                }, 20)
                //return;
            }

            loadQueueMaterials();

            function loadQueueMaterials() {
                // tip: без текстур около 500-600 mb памяти


                // step 2:
                var limit = 4;
                self.pathCounter = 0;
                self.paths = self.pathsAll;
                self.paths = (self.paths.length > limit) ? self.paths.slice(0, limit) : self.paths;
                self.pathsAll = self.pathsAll.slice(limit, self.pathsAll.length);

                //console.error("zx", self.paths.length, self.pathsAll.length);

                $.each(self.paths, function(index1, pathData) {

                    var isGIF = T_URL.isGIF(pathData.materialPath);  //pathData.materialPath.search(/\.gif($|\?)/i) > 0;

                    //console.error("pathData.materialPath", isGIF, pathData.materialPath);

                    var texture = null;


                    if (isGIF) {

                        var gifLoader = GIFLoader(
                            pathData.materialPath,
                            async function( container ) {

                                texture = new THREE.ComposedTexture( container )
                                texture.name = pathData.mapName;    // имя важно тк иначе а админке при сохранении у map нет имени и map не сохраняется

                                gogo(texture, pathData, true);
                            },
                            async function(  ) {

                                var image = new Image();
                                var texture = new THREE.Texture(image);
                                    image.onload = function() {
                                        texture.needsUpdate = true;
                                    };
                                    image.src = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMdaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkI2QjdGRjQ5RDg4MTExRTk4RjAwODhERDBDQzc2RkUxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI2QjdGRjQ4RDg4MTExRTk4RjAwODhERDBDQzc2RkUxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iQzYyQzU5ODQwQjlCNEIyMTNCOENBQ0JFMzFDNzQ3NUMiIHN0UmVmOmRvY3VtZW50SUQ9IkM2MkM1OTg0MEI5QjRCMjEzQjhDQUNCRTMxQzc0NzVDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwM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"

                                gogo(texture, pathData, true);
                            }
                        );

                    } else {

                        var loader1 = new ARImageLoader();
                            loader1.setCrossOrigin(scope.crossOrigin);
                            loader1.load(pathData.materialPath, function(image, resultType) {

                                    if (resultType == "success") {

                                        if (scope.mode == "viewer" && T_DEVICE.anyMobile() && (image.width >= 2048 || image.height >= 2048)) {        // load image and reduce resolution if >= 2048 (for ios\ipad\iphone only)

                                            var canvas = document.createElement("canvas");
                                                canvas.width = image.width / 4;
                                                canvas.height = image.height / 4;
                                                canvas.name = "XXX";

                                            var ctx = canvas.getContext('2d');
                                            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                                            setTimeout(function () {
                                                texture = new THREE.Texture(canvas);

                                                gogo(texture, pathData);

                                                canvas = null;
                                            }, 1);
                                        } else {
                                            texture = new THREE.Texture();
                                            texture.image = image;

                                            gogo(texture, pathData);
                                        }

                                    } else {
                                        console.error("no image", image);
                                    }
                                },
                                function(xhr) {},
                                function(e) {
                                    //console.log("Error", e);
                                }
                            );

                    }

                })
            }

            function gogo(_texture, _pathData, isgif) {
                self.pathCounter++;

                // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
                var isJPEG = _pathData.materialPath.search(/\.jpe?g($|\?)/i) > 0 || _pathData.materialPath.search(/^data\:image\/jpeg/) === 0;

                //if (!isgif) {
                    _texture.format = isJPEG ? THREE.RGBAFormat : THREE.RGBAFormat;
                    _texture.name = _pathData.mapName;
                    if (self.renderer) {
                        _texture.anisotropy = self.renderer.capabilities.getMaxAnisotropy();
                    }
                    _texture.minFilter = THREE.LinearMipMapLinearFilter;
                    _texture.magFilter = THREE.LinearFilter;
                    _texture.mapping = THREE.UVMapping;


                if (isgif) {
                    _texture.encoding = THREE.sRGBEncoding;
                }
                    _texture.needsUpdate = true;
               // }

                // apply texture to map of material
                $.each(self.queueAll, function(index2, materialThree) {
                    if (materialThree.materialData.hasOwnProperty('maps')) {

                        $.each(materialThree.materialData.maps, function(index3, mapData3) {

                            if (mapData3.mapName == _pathData.mapName && _pathData.materialPath == mapData3.materialPath /* && _pathData.mapType == index3*/) {     // чтобы совпадали не только имена, но и пути. тогда грузим один раз

if (index3 == "map" || index3 == "emissiveMap") {
    _texture.encoding = THREE.sRGBEncoding;
} else {
    _texture.encoding = THREE.LinearEncoding;
}

                                mapData3.isLoaded = true;
                                //mat[index3] = _texture;

                                if (isgif) {
                                    _texture.originalImagePath = _pathData.materialPath;
                                    materialThree[index3] = _texture;

                                    materialThree[index3].gifSpeed = 1.1;
                                } else {
                                    var texture2 = _texture.clone();
                                    texture2.needsUpdate = true;
                                    materialThree[index3] = texture2;
                                }

                                //mat[index3].uuid = THREE.Math.generateUUID();

                                // apply shader settings
                                T_SHADER.SETTINGS.applyShaderSettings(sett2, materialThree, index3);
                                var f = materialThree[index3 + 'UpdateMatrix']; if (f) f(index3);
                            }
                        })
                    }
                })

                // load next files
                if (self.pathsAll.length > 0) {
                    if (self.paths.length == self.pathCounter) {
                        loadQueueMaterials();
                    }
                } else {
                    if (self.paths.length == self.pathCounter) {
                        if (self.isAntiCache) {
                            setTimeout(function() {
                                if(onFilesLoaded)onFilesLoaded(self.parsedData);

                                /*self.paths = null;
                                self.queueAll = null;
                                self.queueTotal = null;
                                self.pathsAll = null;
                                self.pathCounter = null;*/
                            }, 120)
                        } else {
                            setTimeout(function() {
                                if(onFilesLoaded)onFilesLoaded(self.parsedData);

                                /*self.paths = null;
                                self.queueAll = null;
                                self.queueTotal = null;
                                self.pathsAll = null;
                                self.pathCounter = null;*/
                            }, 20)
                        }
                    }
                }
            }
        }

        function parseHierachy() {
            nodes = (json.hierarchy !== undefined ? json.hierarchy.nodes : json.nodes);
            if (Array.isArray(nodes) && nodes.length > 0) {
                for (var i = 0; i < nodes.length; ++i) {
                    if (nodes[i].rot !== undefined) {
                        nodes[i].rotq = nodes[i].rot;
                        nodes[i].rot = undefined
                    }
                }
            } else {
                nodes = []
            }
        }

        function getWorldTransform(iNode) {
            var tm = new THREE.Matrix4();
            if (!nodes || iNode < 0 || !nodes[iNode]) {
                return tm
            }
            for (var i = iNode; i >= 0; i = nodes[i].parent) {
                var node = nodes[i];
                var pos = new THREE.Vector3(node.pos[0], node.pos[1], node.pos[2]);
                var scl = new THREE.Vector3(node.scl[0], node.scl[1], node.scl[2]);
                var rot = new THREE.Quaternion(node.rotq[0], node.rotq[1], node.rotq[2], node.rotq[3]);
                var tmNode = new THREE.Matrix4().compose(pos, rot, scl);
                tm.premultiply(tmNode)
            }
            return tm
        }

        function getNodeTransform(iNode) {
            var tm = new THREE.Matrix4();
            if (!nodes || iNode < 0 || !nodes[iNode]) {
                return tm
            }
            var node = nodes[iNode];
            var pos = new THREE.Vector3(node.pos[0], node.pos[1], node.pos[2]);
            var scl = new THREE.Vector3(node.scl[0], node.scl[1], node.scl[2]);
            var rot = new THREE.Quaternion(node.rotq[0], node.rotq[1], node.rotq[2], node.rotq[3]);

            return {
                pos: pos,
                rot: rot,
                scl: scl
            }
        }

        function getFirstUVIndex(groups) {
            var i = -1;
            if (!groups || !json.materials) {
                return 0
            }

            for (var iGroup = 0; iGroup < groups.length; ++iGroup) {
                var mat = json.materials[groups[iGroup].materialIndex];


            }
            return (i < 0 ? 0 : i)
        }

        function parseModel() {
            var model = json.model;
            if (!model || !model.meshes) {
                return
            }
            for (var iMesh = 0; iMesh < model.meshes.length; ++iMesh) {
                var i, j, d, n, geometry, mesh, nVerts, verts, iVert, vertElementObj, nLength, vertex, face, normal, uvLayer, uv, u, v, faceObj, vertIndices, normals, colors, uvs, skin, nodeIndex, meshNode, vertElementIndices, groups, tmNode, a, b, c, nFaces, iFace, iSkin;

                var geometry = new THREE.BufferGeometry();

                var mesh = model.meshes[iMesh];


                if (mesh == undefined) {
                    return;
                }
                if (mesh.name) {
                    geometry.name = mesh.name
                }

                verts = mesh.verts;
                if (verts == undefined) {
                    return;
                }
                vertElementObj = mesh.vertElement;
                if (vertElementObj == undefined) {
                    return;
                }

                faceObj = mesh.face;
                vertIndices = vertElementObj.vertIndices;
                //normals = parseN(vertElementObj.normals);

                normals = vertElementObj.normals;

                colors = vertElementObj.colors;
                uvs = vertElementObj.uvs;

                skin = mesh.skin;
                nodeIndex = mesh.node;

                if (nodeIndex == undefined || !(nodeIndex >= 0 && nodeIndex < nodes.length)) {
                    return;
                }
                meshNode = nodes[nodeIndex];
                if (!meshNode || !meshNode.pos || !meshNode.rotq || !meshNode.scl) {
                    return;
                }
                if (faceObj == undefined) {
                    return;
                }
                vertElementIndices = faceObj.vertElementIndices;

                groups = faceObj.groups;
                if (!vertElementIndices || !groups) {
                    return;
                }
                tmNode = getWorldTransform(nodeIndex);
                nVerts = vertIndices.length;





                var positions = new Float32Array(nVerts * 3);
                for (iVert = 0; iVert < nVerts; ++iVert) {
                    i = vertIndices[iVert] * 3;
                    j = iVert * 3;
                    vertex = new THREE.Vector3(verts[i], verts[i + 1], verts[i + 2]);
                    vertex.applyMatrix4(tmNode);
                    positions[j] = vertex.x;
                    positions[j + 1] = vertex.y;
                    positions[j + 2] = vertex.z;
                }
                geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

                geometry.userData.materialIndex = groups[0].materialIndex;

                //console.error("geometry.userData.materialIndex", uvs);


                if (uvs !== undefined && uvs.length > 0) {

                    i = getFirstUVIndex(groups);

                    i = (i < uvs.length ? i : 0);
                    var uv = new Float32Array(uvs[i]);

                    geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

                    if (uvs.length > 1) {       // взять второй канал из первого, если второго нет в модели
                        i = (i == 0 ? 1 : 0);
                        uv = new Float32Array(uvs[i]);

                        geometry.setAttribute("uv2", new THREE.BufferAttribute(uv, 2));
                    }

                }

                //console.log("geometry", geometry);


                if (normals !== undefined && normals.length > 0) {
                    geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3))

                    //console.log(" G R ", mesh.name, normals);
                }

                var indices = new Uint32Array(vertElementIndices);
                geometry.setIndex(new THREE.BufferAttribute(indices, 1));
                geometry.groups = groups;



                n = verts.length / 3;
                if (!skin && meshNode.parent >= 0) {
                    skin = mesh.skin = {};
                    skin.skinBones = [], skin.skinWeights = [];
                    for (iVert = 0; iVert < n; ++iVert) {
                        skin.skinBones.push([nodeIndex]);
                        skin.skinWeights.push([1])
                    }
                }
                var skinIndices = [],
                    skinWeights = [];
                iSkin = 0;
                var vBoneIndices, vWeights;
                if (skin && skin.skinBones && skin.skinWeights && skin.skinBones.length == skin.skinWeights.length) {
                    for (iVert = 0; iVert < n; ++iVert) {
                        vBoneIndices = new THREE.Vector4(0, 0, 0, 0);
                        vWeights = new THREE.Vector4(0, 0, 0, 0);
                        var iLink = 0;
                        for (d = 0; d < 4; ++d) {
                            if (d < skin.skinBones[iVert].length) {
                                vBoneIndices.setComponent(d, skin.skinBones[iVert][d]);
                                vWeights.setComponent(d, skin.skinWeights[iVert][d]);
                                ++iLink
                            } else {
                                vBoneIndices.setComponent(d, 0);
                                vWeights.setComponent(d, 0)
                            }
                        }
                        while (iLink < skin.skinWeights[iVert].length) {
                            vWeights.addScalar(skin.skinWeights[iVert][iLink] * 0.25);
                            ++iLink
                        }
                        skinIndices.push(vBoneIndices);
                        skinWeights.push(vWeights)
                    }
                }



                if (skinIndices.length > 0 && skinWeights.length > 0) {
                    geometry.setAttribute("skinIndex", new THREE.Float32BufferAttribute(new Float32Array(nVerts * 4), 4));
                    geometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(new Float32Array(nVerts * 4), 4));
                    for (iVert = 0; iVert < nVerts; ++iVert) {
                        i = vertIndices[iVert];
                        vBoneIndices = skinIndices[i];
                        vWeights = skinWeights[i];
                        geometry.attributes.skinIndex.setXYZW(iVert, vBoneIndices.x, vBoneIndices.y, vBoneIndices.z, vBoneIndices.w);
                        geometry.attributes.skinWeight.setXYZW(iVert, vWeights.x, vWeights.y, vWeights.z, vWeights.w)
                    }
                }

                var bones = getBones(mesh);

                if (bones && bones.length > 0) {
                    geometry.bones = bones
                }


                if (!normals) {
                    //geometry.computeFaceNormals();
                    geometry.computeVertexNormals();
                }


               // console.error("TANG");
                //geometry.computeTangents();



                geometries.push(geometry)
            }
        }

        function parseKeyFrameAnimations() {
            var anim = json.animation;
            if (!anim || !anim.keyframeAnimations || anim.keyframeAnimations.length == 0) {
                return
            }
            var keyFrameAnimations = anim.keyframeAnimations.concat();
            var animClips = [];
            var i, c, iAnim, iTrack, trackName;
            for (i = 0; i < keyFrameAnimations.length; i++) {
                c = parseKeyFrameAnimation(keyFrameAnimations[i]);
                if (c) {
                    animClips.push(c)
                }
            }
            if (animClips.length > 0) {
                for (i = 0; i < geometries.length; ++i) {
                    var hasSkin = false;
                    if (geometries[i] instanceof THREE.BufferGeometry) {
                        hasSkin = (geometries[i].skinIndices && geometries[i].skinIndices.length > 0 && geometries[i].skinWeights && geometries[i].skinWeights.length > 0)
                    } else {
                        if (geometries[i] instanceof THREE.BufferGeometry) {
                            hasSkin = (geometries[i].attributes.skinIndex && geometries[i].attributes.skinIndex.count > 0 && geometries[i].attributes.skinWeight && geometries[i].attributes.skinWeight.count > 0)
                        }
                    }
                    if (hasSkin) {
                        geometries[i].animations = animClips
                    } else {
                        geometries[i].animations = [];
                        for (iAnim = 0; iAnim < animClips.length; ++iAnim) {
                            var tracks = [];
                            for (iTrack = animClips[iAnim].tracks.length - 1; iTrack >= 0; --iTrack) {
                                trackName = animClips[iAnim].tracks[iTrack].name;
                                if (trackName == ".bones[" + geometries[i].name + "].position" || trackName == ".bones[" + geometries[i].name + "].quaternion" || trackName == ".bones[" + geometries[i].name + "].scale") {
                                    tracks.push(animClips[iAnim].tracks[iTrack])
                                }
                            }
                            if (tracks.length > 0) {
                                geometries[i].animations.push(new THREE.AnimationClip(animClips[iAnim].name, animClips[iAnim].duration, tracks))
                            }
                        }
                    }
                }
            }
        }

        function parseKeyFrameAnimation(animation) {
            if (!animation) {
                //console.error("parseKeyFrameAnimation: no animation");
                return null
            }
            var fps = animation.fps || 30;
            var useSeconds = true;
            var duration = animation.length || -1;
            if (animation.timeline == "frames") {
                useSeconds = false;
                duration = duration / fps
            }
            var addTrack = function(trackType, trackName, obj, destTracks) {
                if (obj && Array.isArray(obj.times) && Array.isArray(obj.values)) {
                    var times = [];
                    var values = [];
                    times = times.concat(obj.times);
                    values = values.concat(obj.values);
                    if (!useSeconds) {
                        for (var i = 0; i < times.length; ++i) {
                            times[i] /= fps
                        }
                    }
                    if (times && times.length != 0 && values && values.length != 0) {
                        destTracks.push(new trackType(trackName, times, values))
                    }
                }
            };
            var tracks = [];
            var clipName = animation.name || "default";
            var animNodes = animation.animNodes || [];
            for (var iNode = 0; iNode < animNodes.length; iNode++) {
                var animNode = animNodes[iNode];
                if (!animNode) {
                    continue
                }
                var nodeName = "";
                if (animNode.nodeName !== undefined) {
                    nodeName = animNode.nodeName
                } else {
                    if (animNode.nodeIndex !== undefined) {
                        nodeName = nodes[animNode.nodeIndex].name
                    }
                }
                var boneName = ".bones[" + nodeName + "]";
                addTrack(THREE.VectorKeyframeTrack, boneName + ".position", animNode.pos, tracks);
                addTrack(THREE.VectorKeyframeTrack, boneName + ".scale", animNode.scl, tracks);
                addTrack(THREE.QuaternionKeyframeTrack, boneName + ".quaternion", animNode.rot, tracks)
            }
            if (tracks.length === 0) {
                return null
            }
            var clip = new THREE.AnimationClip(clipName, duration, tracks);
            return clip
        }

        var sphere = getBoundingSphere();

        parseSettings();
        parseHierachy();
        parseModel();
        parseMaterials();
        parseKeyFrameAnimations();


        for (i = 0; i < geometries.length; ++i) {
            //geometries[i].computeFaceNormals();
            //geometries[i].computeBoundingSphere();
           // geometries[i].computeVertexNormals();
        }
    }
};










const GIFLoader = (function( url, complete, error ) {
    var fileLoader = new THREE.FileLoader;
        fileLoader.responseType = 'arraybuffer';
        fileLoader.load( url, async function( data ) {

        const gif = new GIF( data );

        /* Container, frames can be from any source, their structure is:

        Either patch or image, if a arraybuffer is provided it will be converted to an Image
        - patch (uncompressed Uint8Array)
        - image (Image element)

        - dims (left, top, width, height)
        - disposalType (number 0-3)
        - delay (number ms)

        */


            //var arrayBufferView = new Uint8Array( data );
            //var blob = new Blob( [ arrayBufferView ], { type: "image/gif" } );

        const container = {
            downscale: false,	// Canvas needs to be power of 2, by default size is upscaled (false)
            width: gif.raw.lsd.width,
            height: gif.raw.lsd.height,
            frames: gif.decompressFrames( true ),
        };

        complete( container );
    },
    function(xhr) {
        //console.log("Progress", xhr);
    },
    function(e) {


        error();
    });


});



$.fn.exists = function () {
    return this.length !== 0;
}

// comparer : function(currentElement)
Array.prototype.inArray = function(comparer) {
    for(var i=0; i < this.length; i++) {
        if(comparer(this[i])) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};
/*
this.removeDuplicates = function(myArr, prop) {
    return myArr.filter(function (obj, pos, arr) {
        return arr.map(function(mapObj) {
            return mapObj[prop]
        }).indexOf(obj[prop]) === pos;
    });
}*/

// adds an element to the array if it does not already exist using a comparer
// function
Array.prototype.pushIfNotExist = function(element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};

Number.prototype.formatMoney = function(c, d, t){
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

CanvasRenderingContext2D.prototype.clear =
    CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
        if (preserveTransform) {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
        }

        this.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (preserveTransform) {
            this.restore();
        }
    };

THREE.Object3D.prototype.rotateAroundWorldAxis = function() {
    var q1 = new THREE.Quaternion();
    return function ( point, axis, angle ) {

        q1.setFromAxisAngle( axis, angle );

        this.quaternion.multiplyQuaternions( q1, this.quaternion );

        this.position.sub( point );
        this.position.applyQuaternion( q1 );
        this.position.add( point );

        return this;
    }
}();


/** Gives the aptitude for an object3D to clone recursively with its material cloned (normal clone does not clone material)*/
THREE.Object3D.prototype.deepClone = function ( recursive ) {

    return new this.constructor().deepCopy( this, recursive );

},
    THREE.Object3D.prototype.deepCopy = function( source, recursive ) {

        if ( recursive === undefined ) recursive = true;

        this.name = source.name;

        this.up.copy( source.up );

        this.position.copy( source.position );
        this.quaternion.copy( source.quaternion );
        this.scale.copy( source.scale );

        this.matrix.copy( source.matrix );
        this.matrixWorld.copy( source.matrixWorld );
        if(source.material){
            //changed
            this.material = source.material.clone()
        }
        if(source.geometry){
            //changed
            this.geometry = source.geometry.clone()
        }
        this.matrixAutoUpdate = source.matrixAutoUpdate;
        this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

        this.layers.mask = source.layers.mask;
        this.visible = source.visible;

        this.frustumCulled = source.frustumCulled;
        this.renderOrder = source.renderOrder;

        this.userData = JSON.parse( JSON.stringify( source.userData ) );

        if ( recursive === true ) {

            for ( var i = 0; i < source.children.length; i ++ ) {

                var child = source.children[ i ];
                this.add( child.deepClone() ); //changed

            }

        }

        return this;

    }

/*THREE.Object3D.prototype.GdeepCloneMaterials = function() {
    var object = this.clone( new THREE.Object3D(), false );

    for ( var i = 0; i < this.children.length; i++ ) {

        var child = this.children[ i ];
        if ( child.GdeepCloneMaterials ) {
            object.add( child.GdeepCloneMaterials() );
        } else {
            object.add( child.clone() );
        }

    }
    return object;
};

THREE.Mesh.prototype.GdeepCloneMaterials = function( object, recursive ) {
    if ( object === undefined ) {
        object = new THREE.Mesh( this.geometry, this.material.clone() );

       // object.material.onBeforeCompile = T_SHADER.SETTINGS.onBeforeCompile.bind(object.material);
    }

    THREE.Object3D.prototype.GdeepCloneMaterials.call( this, object, recursive );

    return object;
};*/


// ------------------------------------------------------------------------------------------- tools math

var T_MATH = (function () {
    var tools = {
        toRadians : function(degrees) {
            return degrees * Math.PI / 180;
        },
        toDegrees : function(radians) {
            return radians * 180 / Math.PI;
        },
        floatPrecision2 : function(number) {
            return parseFloat(number).toPrecision(2);
        },
        lineIntersection : function(x1, y1, x2, y2, x3, y3, x4, y4) {
            var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
            if (denom == 0) {
                return null;
            }
            ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
            ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
            return {
                x: x1 + ua*(x2 - x1),
                y: y1 + ua*(y2 - y1),
                seg1: ua >= 0 && ua <= 1,
                seg2: ub >= 0 && ua <= 1
            };
        },
        formatBytes : function(a,b) {if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}
};
    return tools;
})();

// ------------------------------------------------------------------------------------------- tools files

var T_URL = (function () {
    var tools = {
        isGIF : function(url) {
            return url.search(/\.gif($|\?)/i) > 0
        },
        getParameterByName : function(name, url) {
            if (!url) url = window.location.href;

            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';

            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        isValidURL : function(str) {
            var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
                '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
                '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
                '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
                '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
                '(\#[-a-z\d_]*)?$','i'); // fragment locater
            if (!pattern.test(str)) {
                return false;
            } else {
                return true;
            }
        },
        httpsToHttp : function(url) {
            if (!url) return null;

            url = url.replace(/^https:\/\//i, 'http://');

            return url;
        },
        httpToHttps : function(url) {
            if (!url) return null;

            url = url.replace(/^http:\/\//i, 'https://');

            return url;
        },
        getURLWithoutParameters : function(url) {
            if (url.indexOf("?") != -1)
                return url.substring(0, url.indexOf("?"));
            else
                return url;

            //console.log("getURLWithoutParameters");
        },
        genCubeUrls: function( prefix, postfix ) {
            return [
                prefix + 'px' + postfix, prefix + 'nx' + postfix,
                prefix + 'py' + postfix, prefix + 'ny' + postfix,
                prefix + 'pz' + postfix, prefix + 'nz' + postfix
            ];
        }
    };
    return tools;
})();

// ------------------------------------------------------------------------------------------- tools files

var T_FILES = (function () {
    var tools = {
        getFileExtension : function(f) {
            if (!f || f.indexOf(".") == -1) return null;

            return f.slice((f.lastIndexOf(".") - 1 >>> 0) + 2);
        },
        getFileName : function(f) {
            if (!f || f.indexOf(".") == -1) return null;        // + url.substring(url.lastIndexOf('/')+1)

            return f.split('.')[0];
        },
        getFileNameFromUrl : function(f) {
            //console.error("getFileNameFromUrl", f);

            if (!f) return "noname";

            return f.split(/(\\|\/)/g).pop()
        },
        generateFileName: function() {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        },
        generateFileNameShort: function() {
            return Math.random().toString(36).substring(5, 10);
        },
        dataURItoBlob: function(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], {type:mimeString});
        },
        getExtensionOfFileFromBase64: function(bs64) {
            var result = null;

            if (typeof bs64 !== 'string') {
                return result;
            }

            var mime = bs64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

            if (mime && mime.length) {
                result = mime[1];
            }

            return result;
        },
        getFileNameOfFileFromBase64: function(bs64) {
            var result = null;

            if (typeof bs64 !== 'string') {
                return result;
            }

            var mime = bs64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

            if (mime && mime.length) {
                result = mime[0];
            }

            return result;
        },
        isImage: function(url) {
            return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
        },
        base64StringtoFile: function(base64String, filename) {
            var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        },

    };
    return tools;
})();

// ------------------------------------------------------------------------------------------- tools 3D
var T_TYPES = (function () {
    var tools = {
        getType : function(num, def) {
            return typeof num === 'number'
                ? num
                : (typeof def === 'number' ? def : 0)
        },
    };
    return tools;
})();

var T_3D = (function () {
    var tools = {
        isEmpty : function(val) {
            return (val === undefined || val == null || val.length <= 0) ? true : false;
        },
        getCompoundBoundingBox : function(object3D) {
            var box = null;
            object3D.traverse(function (obj3D) {
                var geometry = obj3D.geometry;
                if (geometry === undefined) return;
                geometry.computeBoundingBox();
                if (box === null) {
                    box = geometry.boundingBox;
                } else {
                    box.union(geometry.boundingBox);
                }
            });
            return box;
        },
    };
    return tools;
})();

var T_LOGIC = (function () {
    var tools = {
        isEmpty : function(val) {
            return (val === undefined || val == null || val.length <= 0) ? true : false;
        },
        isProperyExists : function(obj /*, level1, level2, ... levelN*/) {
            var args = Array.prototype.slice.call(arguments, 1);

            for (var i = 0; i < args.length; i++) {
                if (!obj || !obj.hasOwnProperty(args[i])) {
                    return false;
                }
                obj = obj[args[i]];
            }
            return true;
        },
        createProperty: function(object, property) {
            object[property] = {};
        },
        checkOrCreateEmptyObject: function(settings) {
            if (!settings) settings = {};

            return settings;
        },
    }

    return tools;
})();

var T_OBJECT = (function () {
    var tools = {
        size : function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        },
    };
    return tools;
})();

var T_DEVICE = (function () {
    var tools = {
        isAndroid: function () {
            return navigator.userAgent.match(/Android/i);
        },
        isBlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        isIOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        isOpera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        isEdge: function () {
            return navigator.userAgent.match(/Edge/i);
        },
        isIOSChrome: function () {
            return navigator.userAgent.match(/CriOS/i);
        },
        isIE: function () {
            return (navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/))/* || (typeof $.browser !== "undefined" && $.browser.msie == 1)*/);
        },
        isFF: function () {
            return navigator.userAgent.match(/Firefox/i);
        },
        isWindowsMobile: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        isTouch: function() {
            var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
            var mq = function(query) {
                return window.matchMedia(query).matches;
            }

            if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
                return true;
            }

            // include the 'heartz' as a way to have a non matching MQ to help terminate the join
            // https://git.io/vznFH
            var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
            return mq(query);
        },
        anyMobile: function () {
            return (this.isAndroid() || this.isBlackBerry() || this.isIOS() || this.isWindowsMobile() || this.isTouch());
        },
    };
    return tools;
})();

// ------------------------------------------------------------------------------------------- tools shader

var T_CANVAS = (function () {
    var tools = {
        clone : function (oldCanvas) {  // create a blank image (canvas)
            var newCanvas = document.createElement('canvas');
            var context = newCanvas.getContext('2d');

            //set dimensions
            newCanvas.width = oldCanvas.width;
            newCanvas.height = oldCanvas.height;

            //apply the old canvas to the new one
            context.drawImage(oldCanvas, 0, 0);

            //return the new canvas
            return newCanvas;
        },
        cvsCreateCircleImage : function (WH, R, color) {
            var centerX = WH / 2;
            var centerY = WH / 2;

            var canvas = document.createElement("canvas");
            canvas.width = WH;
            canvas.height = WH;
            canvas.ctx = canvas.getContext("2d");

            canvas.ctx.beginPath();
            canvas.ctx.arc(centerX, centerY, R, 0, 2 * Math.PI, false);
            canvas.ctx.fillStyle = color;
            canvas.ctx.fill();
            canvas.ctx.lineWidth = 1;
            canvas.ctx.strokeStyle = '#ffffff';
            canvas.ctx.stroke();

            //var img = $('<img>');
            var img = canvas.toDataURL("image/png");

            //document.write('<img src="'+img+'"/>');

            return img;
        },
        cvsCreateCircleText : function (WH, R, color, text, textSize, descrValue) {
            var centerX = WH / 2;
            var centerY = WH / 2;

            var canvas1 = document.createElement("canvas");
                canvas1.width = 120;
                canvas1.height = 50;

                canvas1.ctx = canvas1.getContext("2d");
                canvas1.ctx.font = "16px Arial";
                canvas1.ctx.fillStyle = color;
                canvas1.ctx.fillText(descrValue + "=" + text + " cm", 1, 12);

            var img = canvas1.toDataURL("image/png");

            return img;
        },
    };
    return tools;
})();

// ------------------------------------------------------------------------------------------- tools array

var T_ARRAY = (function () {
    var tools = {
        insertArrayAt: function(array, index, arrayToInsert) {
            Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
            return array;
        },
        /*removeFromArrayAt: function(array, index, val) {
            var i = this.indexOf(val);
            return i >-1 ? this.splice(i, 1) : array;
        },*/
        dynamicSort: function(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        },
        getFirstKey: function(data) {
            for (var prop in data) if (data.propertyIsEnumerable(prop)) return prop;
        },
        copyDeep: function(arrInit) {
            return JSON.parse(JSON.stringify(arrInit))
        },
        createArray: function(data) {
            return Array.isArray(data) ? data : [data];
        },

        sortIndex: function(a, b) {
            if ( a.sortIndex < b.sortIndex) {
                return -1;
            }
            if ( a.sortIndex > b.sortIndex) {
                return 1;
            }
            return 0;
        }
    }
    return tools;
})();

// ------------------------------------------------------------------------------------------- tools shader

var T_SHADER = (function () {
    var tools = {
        isSnapPrefix : function(name) {
            if (name.length > 0 && name.substring(0,5) == "_snap") {
                return true;
            }
            return false;
        },

        isShadow : function(name) {
            if (name && name.length > 0 && name.substring(0,4) == "_sha") {
                return true;
            }
            return false;
        },

        isPrefix : function(name) {
            /*if (name && name.length > 0 && name.charAt(0) == "_") {
                return true;
            }
            return false;*/

            if (name && name.length > 0 && name.charAt(0) == "_" && name.length > 2 && name.length < 7 && isNaN(parseInt(name.charAt(1), 7)) ) {
                return true;
            }
            return false;
        },
        getPrefix : function(name) {
            if (name && name.length > 0 && name.charAt(0) == "_" && name.length > 2 && name.length < 7 && isNaN(parseInt(name.charAt(1), 7)) ) {
                var rez = name.substring(1, name.length);

                //console.log("!!!1!!!", rez);

                if (rez.indexOf("_") == -1) {
                    //console.log("!!!21!!!", rez);

                    //return rez;
                } else {
                    rez = rez.substring(0, rez.indexOf("_"));
                    //console.log("!!!22!!!", rez);
                }

                return "_"+rez;
            }
            return name;
        },




        envMaps: [],
        loadEnvMaps : function (API_URL, type, callbackSuccess, callbackError, url) {
            var self = this;

            //console.log("loadEnvMaps", type);

            $.ajax({
                type: "GET",
                url: API_URL,
                data: { },
                dataType: 'json',
                success: function (d) {
                    if (d.data) {

                        var mapType = d.data.defaultForViewer;
                        if (type == "ar") {
                            mapType = d.data.defaultForAr;
                        } else
                        if (type == "viewer") {
                            mapType = d.data.defaultForViewer;
                        } else
                        if (type == "mobile") {
                            mapType = d.data.defaultForMobile;  //"mobile";
                        }

                        var eMap1 = {};
                        eMap1.uuid = 1;
                        eMap1.name = "Interior";
                        eMap1.default = mapType == 'interior' ? true : false;
                        eMap1.url = d.data.interiorMap.url;

                        var eMap2 = {};
                        eMap2.uuid = 2;
                        eMap2.name = "Exterior";
                        eMap2.default = mapType == 'exterior' ? true : false;
                        eMap2.url = d.data.exteriorMap.url;
                        //eMap2.url = "img/env/piz_compressed.exr";

                        var eMap3 = {};
                        eMap3.uuid = 3;
                        eMap3.name = "Studio";
                        eMap3.default = mapType == 'studio' ? true : false;
                        eMap3.url = d.data.studioMap.url;

                        var eMapMobile = {};
                        eMapMobile.uuid = 4;
                        eMapMobile.name = "Mobile";
                        eMapMobile.default = mapType == 'mobile' ? true : false;    //mapType == 'mobile' ? true : false;
                        eMapMobile.url = d.data.mobileMap.url;      //"img/env/studio_mobile.png";
                        //d.data.mobileMap.url;//
                        self.envMaps.push(eMap1, eMap2, eMap3, eMapMobile);
                    }

                    if (callbackSuccess) callbackSuccess(d);
                },
                error: function (err) {
                    //if (callbackError) callbackError(err);
                }
            });
        },

        defaultEnvMap: null,
        defaultEnvMapLib: null,

        loadDefaultEnvMap : function (envMapUUID, renderer, callbackSuccess, callbackError) {
            var self = this;

            var envMap = null;

            // load map where default = true or load selected emap by user envMapId
            if (!envMapUUID) {
                $.each(self.envMaps, function(index, emap) {
                    if (emap.default) {
                        envMap = emap;

                        return false;
                    }
                });
            } else {
                $.each(self.envMaps, function(index, emap) {
                    if (emap.uuid == envMapUUID) {
                        envMap = emap;
                        return false;
                    }
                });
            }

            if (!envMap) return;

            self.envMapData = envMap;

            // load selected map
            //console.error("envMap", envMap, self.envMapData);

            //self.loadDefaultEnvMapProcess(envMapUUID, renderer, callbackSuccess, callbackError, self.envMapData);

            var em = envMap;

            if (em.url.toLowerCase().indexOf(".png") != -1) {
                new THREE.TextureLoader().load( em.url, function ( texture, textureData ) {
                    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                    texture.encoding = THREE.sRGBEncoding;

                    var options = {
                        resolution: 512,
                        anisotropy: renderer.capabilities.getMaxAnisotropy(),
                    };

                    var rtCube = new THREE.CubemapGenerator(renderer).fromEquirectangular(texture, options);

                    //var cubemapGenerator = new THREE.EquirectangularToCubeGenerator( texture, options );
                    //var rtCube = cubemapGenerator.update( renderer );

                    rtCube.texture.envMapIntensity += 11;

                    var pmremGenerator = new THREE.PMREMGenerator(rtCube.texture);  //rtCube.texture
                    pmremGenerator.update(renderer);
                    var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);
                    pmremCubeUVPacker.update(renderer);
                    self.exrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

                    //if (!self.defaultEnvMap) {
                    self.defaultEnvMap = self.exrCubeRenderTarget ? self.exrCubeRenderTarget.texture : null;
                    self.defaultEnvMap.encoding = THREE.sRGBEncoding;
                    self.defaultEnvMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
                    //}

                    // self.defaultEnvMap.wrapS = self.defaultEnvMap.wrapT = THREE.ClampToEdgeWrapping;

                    texture.dispose();
                    pmremGenerator.dispose();
                    pmremCubeUVPacker.dispose();

                    //setTimeout(function() {
                    if (callbackSuccess) callbackSuccess(self.defaultEnvMap);
                    //}, 500)
                });

            } else
            if (em.url.toLowerCase().indexOf(".hdr") != -1 || em.name == "Studio") {
                console.log("HDRCubeTextureLoader");

                var hdrCubeMap = new THREE.HDRCubeTextureLoader()
                    .setPath( './img/hdr/' )
                    .load( THREE.UnsignedByteType, [ 'px.hdr?v=1', 'nx.hdr?v=1', 'py.hdr?v=1', 'ny.hdr?v=1', 'pz.hdr?v=1', 'nz.hdr?v=1' ], function () {       //UnsignedByteType

                        var pmremGenerator = new THREE.PMREMGenerator(hdrCubeMap);
                        pmremGenerator.update(renderer);

                        var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);
                        pmremCubeUVPacker.update(renderer);

                        self.exrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

                        //self.defaultEnvMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;
                        //self.defaultEnvMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

                        //hdrCubeMap.magFilter = THREE.LinearFilter;
                        hdrCubeMap.needsUpdate = true;

                        self.defaultEnvMap = self.exrCubeRenderTarget ? self.exrCubeRenderTarget.texture : null;
                        self.defaultEnvMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

                        //self.defaultEnvMap.mapping = THREE.CubeRefractionMapping;

                        pmremGenerator.dispose();
                        pmremCubeUVPacker.dispose();

                        setTimeout(function() {
                            if (callbackSuccess) callbackSuccess(self.defaultEnvMap);
                        }, 700);
                    } );
            } else {
                new THREE.EXRLoader().load( em.url, function ( texture, textureData ) {
                    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                    texture.minFilter = THREE.NearestFilter;
                    texture.encoding = THREE.LinearEncoding;

                    var options = {
                        resolution: 512,
                        magFilter: THREE.LinearFilter,
                        anisotropy: renderer.capabilities.getMaxAnisotropy(),
                        type: THREE.HalfFloatType,
                    };

                    var rtCube = new THREE.CubemapGenerator(renderer).fromEquirectangular(texture, options);

                    /*var cubemapGenerator = new THREE.EquirectangularToCubeGenerator( texture, { resolution: 512, type: THREE.HalfFloatType } );
                    var rtCube = cubemapGenerator.update( renderer );*/

                    var pmremGenerator = new THREE.PMREMGenerator(rtCube.texture);  //rtCube.texture
                    pmremGenerator.update(renderer);
                    var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);
                    pmremCubeUVPacker.update(renderer);
                    self.exrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

                    self.defaultEnvMap = self.exrCubeRenderTarget ? self.exrCubeRenderTarget.texture : null;
                    self.defaultEnvMap.encoding = THREE.LinearEncoding;
                    self.defaultEnvMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
                    // self.defaultEnvMap.wrapS = self.defaultEnvMap.wrapT = THREE.ClampToEdgeWrapping;

                    //console.log("self.defaultEnvMap", self.defaultEnvMap);

                    texture.dispose();
                    pmremGenerator.dispose();
                    pmremCubeUVPacker.dispose();

                    if (callbackSuccess) callbackSuccess(self.defaultEnvMap);
                });
            }
        },

        initEnvMap: null,

        loadDefaultEnvMapV2 : function (envMapUUID, renderer, callbackSuccess, callbackError, path) {
            var self = this;

            self.initEnvMap = null;

            // load map where default = true or load selected emap by user envMapId
            if (!envMapUUID) {
                $.each(self.envMaps, function(index, emap) {
                    if (emap.default) {
                        self.initEnvMap = emap;
                        return false;
                    }
                });
            } else {
                $.each(self.envMaps, function(index, emap) {
                    if (emap.uuid == envMapUUID) {
                        self.initEnvMap = emap;
                        return false;
                    }
                });
            }
            if (!self.initEnvMap) return;

            // load selected map
            //console.error("initEnvMap", self.initEnvMap);

            self.loadDefaultEnvMapProcess(envMapUUID, renderer, callbackSuccess, callbackError, self.initEnvMap, path);
        },

        loadDefaultEnvMapProcess: function(envMapUUID, renderer, callbackSuccess, callbackError, em, path) {
            var self = this;

            if (em.name == "Exterior") {
                console.log("[ENV] " + em.url, em.name);

                THREE.DefaultLoadingManager.onLoad = function ( ) {
                    pmremGenerator.dispose();
                };

                var exrMap = new THREE.EXRLoader()
                    .setDataType( THREE.UnsignedByteType )
                    .load( em.url, function () {

                        self.exrRenderTarget = pmremGenerator.fromEquirectangular( exrMap );

                        //exrMap.magFilter = THREE.LinearFilter;
                        //hdrCubeMap.minFilter = THREE.LinearMipmapNearestFilter;
                        exrMap.needsUpdate = true;

                        self.defaultEnvMap = self.exrRenderTarget ? self.exrRenderTarget.texture : null;
                        self.defaultEnvMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
                        //self.defaultEnvMap.encoding = THREE.LinearEncoding;

                        setTimeout(function() {
                            console.log("EXRLoader 4");

                            if (callbackSuccess) callbackSuccess(self.defaultEnvMap);
                        }, 700);
                    } );

                const pmremGenerator = new THREE.PMREMGenerator( renderer );
                pmremGenerator.compileEquirectangularShader();

                /*console.log("[ENV] " + em.url, em.name);

                new THREE.TextureLoader().load( em.url, function ( texture ) {

                    texture.encoding = THREE.LinearEncoding;

                    self.pngCubeRenderTarget = pmremGenerator.fromEquirectangular( texture );

                    self.defaultEnvMap = self.pngCubeRenderTarget ? self.pngCubeRenderTarget.texture : null;
                    self.defaultEnvMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

                    texture.dispose();


                    setTimeout(function () {
                        if (callbackSuccess) callbackSuccess(self.defaultEnvMap);
                    }, 700);

                } );

                const pmremGenerator = new THREE.PMREMGenerator(renderer);
                pmremGenerator.compileCubemapShader();*/
            } else
            if (em.name == "Interior") {
                console.log("[ENV] " + em.url, em.name);

                THREE.DefaultLoadingManager.onLoad = function ( ) {
                    pmremGenerator.dispose();
                };

                var exrMap = new THREE.EXRLoader()
                    .setDataType( THREE.UnsignedByteType )
                    .load( em.url, function () {

                        self.exrRenderTarget = pmremGenerator.fromEquirectangular( exrMap );

                        //exrMap.magFilter = THREE.LinearFilter;
                        //hdrCubeMap.minFilter = THREE.LinearMipmapNearestFilter;
                        exrMap.needsUpdate = true;

                        self.defaultEnvMap = self.exrRenderTarget ? self.exrRenderTarget.texture : null;
                        self.defaultEnvMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

                        setTimeout(function() {
                            console.log("EXRLoader 4");

                            if (callbackSuccess) callbackSuccess(self.defaultEnvMap);
                        }, 700);
                    } );

                const pmremGenerator = new THREE.PMREMGenerator( renderer );
                    pmremGenerator.compileEquirectangularShader();

            } else
            if (em.url.toLowerCase().indexOf(".png") != -1) {
                console.log("[ENV] " + em.name + " PNG");

                new THREE.TextureLoader().load( em.url, function ( texture, textureData ) {
                    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                    texture.encoding = THREE.sRGBEncoding;

                    var options = {
                        resolution: 512,
                        anisotropy: renderer.capabilities.getMaxAnisotropy(),
                    };

                    var rtCube = new THREE.CubemapGenerator(renderer).fromEquirectangular(texture, options);

                    //var cubemapGenerator = new THREE.EquirectangularToCubeGenerator( texture, options );
                    //var rtCube = cubemapGenerator.update( renderer );

                    rtCube.texture.envMapIntensity += 11;

                    var pmremGenerator = new THREE.PMREMGenerator(rtCube.texture);  //rtCube.texture
                    pmremGenerator.update(renderer);
                    var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);
                    pmremCubeUVPacker.update(renderer);
                    self.exrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;


                        self.defaultEnvMap = self.exrCubeRenderTarget ? self.exrCubeRenderTarget.texture : null;
                        self.defaultEnvMap.encoding = THREE.sRGBEncoding;
                        self.defaultEnvMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

                    // self.defaultEnvMap.wrapS = self.defaultEnvMap.wrapT = THREE.ClampToEdgeWrapping;

                    texture.dispose();
                    pmremGenerator.dispose();
                    pmremCubeUVPacker.dispose();

                    //setTimeout(function() {
                    if (callbackSuccess) callbackSuccess(self.defaultEnvMap);
                    //}, 500)
                });

            } else
            if (em.name == "Studio") {

                /*console.log("[ENV] " + em.name + " HDR (6 parts)");

                var pmremGenerator = new THREE.PMREMGenerator(renderer);
                    pmremGenerator.compileCubemapShader();

                THREE.DefaultLoadingManager.onLoad = function () {
                    pmremGenerator.dispose();
                };

                function loadCubeMap(hdrUrls) {
                    return new Promise(resolve => {
                        var hdrCubeMap = new THREE.HDRCubeTextureLoader()
                            .setPath('./img/hdr/')
                            .setDataType(THREE.UnsignedByteType )
                            .load(hdrUrls, resolve);
                    });
                }

                const promises = [
                    loadCubeMap(['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr']),
                ];

                return Promise.all(promises).then(result => {
                    self.hdrRenderTarget = pmremGenerator.fromCubemap(result[0]);



                    self.defaultEnvMap = self.hdrRenderTarget ? self.hdrRenderTarget.texture : null;
                    self.defaultEnvMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

                    self.defaultEnvMap.magFilter = THREE.NearestFilter;

                    if (callbackSuccess) callbackSuccess(self.defaultEnvMap);
                });*/


                console.log("[ENV] " + em.name + " HDR (6 parts)");

                var pmremGenerator = new THREE.PMREMGenerator(renderer);
                    pmremGenerator.compileCubemapShader();

                THREE.DefaultLoadingManager.onLoad = function () {
                    pmremGenerator.dispose();
                };

                function loadCubeMap(hdrUrls) {
                    return new Promise(resolve => {
                        var hdrCubeMap = new THREE.HDRCubeTextureLoader()
                            .setPath((path ? path : "") + './img/hdr/')
                            .setDataType(THREE.HalfFloatType )
//.setDataType(THREE.UnsignedByteType )
                            .load(hdrUrls, resolve);
                    });
                }

                const promises = [
                    loadCubeMap(['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr']),
                ];


                return Promise.all(promises).then(result => {

                    result[0].magFilter = THREE.LinearFilter;
                    result[0].needsUpdate = true;

                    self.hdrRenderTarget = pmremGenerator.fromCubemap(result[0]);

                    self.defaultEnvMap = self.hdrRenderTarget ? self.hdrRenderTarget.texture : null;
                    self.defaultEnvMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
                    self.defaultEnvMap.minFilter = THREE.LinearMipmapLinearFilter;
                    self.defaultEnvMap.magFilter = THREE.LinearFilter;
                    //self.defaultEnvMap.encoding = THREE.RGBM16Encoding;


                    if (callbackSuccess) callbackSuccess(self.defaultEnvMap);
                });




            } else
            if (em.url.toLowerCase().indexOf(".exr") != -1) {
                console.log("[ENV] " + em.name + " EXR");

                THREE.DefaultLoadingManager.onLoad = function ( ) {
                    pmremGenerator.dispose();
                };

                exrMap = new THREE.EXRLoader()
                    .setDataType( THREE.UnsignedByteType )
                    .load( em.url, function () {

                        self.exrRenderTarget = pmremGenerator.fromEquirectangular( exrMap );

                        exrMap.magFilter = THREE.LinearFilter;
                        //hdrCubeMap.minFilter = THREE.LinearMipmapNearestFilter;
                        exrMap.needsUpdate = true;

                        self.defaultEnvMap = self.exrRenderTarget ? self.exrRenderTarget.texture : null;
                        self.defaultEnvMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

                        setTimeout(function() {
                            console.log("EXRLoader 4");

                            if (callbackSuccess) callbackSuccess(self.defaultEnvMap);
                        }, 700);
                    } );

                const pmremGenerator = new THREE.PMREMGenerator( renderer );
                pmremGenerator.compileEquirectangularShader();
            } else
            if (em.url.toLowerCase().indexOf(".hdr") != -1) {
                console.log("[ENV] " + em.name + " HDR" + "=> todo");
            }

        },

        // ------------------------------------------------------------------------------- channels. (vUv, vUv2, vUv3)
        SETTINGS: {
            pattern: /#include <(.*)>/gm,
            mapRegex: /texture2D\( (.*Map|map), (vUv|vUv2|vUv3) \)/gm,
            parseIncludes: function (string) {
                function replace(match, include) {
                    var replace = THREE.ShaderChunk[include]
                    return T_SHADER.SETTINGS.parseIncludes(replace)
                }
                return string.replace(T_SHADER.SETTINGS.pattern, replace)
            },
            mapsList: {
                'roughnessMap': {
                    enabled: true,
                    channelDefault: '1',
                },
                'metalnessMap': {
                    enabled: true,
                    channelDefault: '1',
                },
                'normalMap': {
                    enabled: true,
                    channelDefault: '1',
                },
                'alphaMap': {
                    enabled: true,
                    channelDefault: '1',
                },
                'aoMap': {
                    enabled: true,
                    channelDefault: '2',
                },
                'specularMap': {
                    enabled: true,
                    channelDefault: '1',
                },
                'emissiveMap': {
                    enabled: true,
                    channelDefault: '1',
                },
                'lightMap': {
                    enabled: true,
                    channelDefault: '2',
                },
                'map': {
                    enabled: true,
                    channelDefault: '1',
                },
            },
            DEFAULT_SETTINGS_TEXTURE: {
                SCALE: {
                    x: 1,
                    y: 1
                },
                OFFSET: {
                    x: 0,
                    y: 0
                },
                ROTATION: 0,
                WRAP: {
                    s: THREE.RepeatWrapping,
                    t: THREE.RepeatWrapping
                }
            },
            getChannel: function(material, mapName) {
                var rez = {
                    value: "",
                    show: "1"
                };

                //var M = material.cloneExtra();

                //console.error(">>>X<<<", material.name, mapName, material[mapName], material[mapName + 'Channel']);

                if (material[mapName]) {
                    if (material.hasOwnProperty(mapName + 'Channel') && material[mapName + "Channel"] != '0' && material[mapName + "Channel"] != '1') {
                        rez.value = material[mapName + "Channel"];
                        rez.show = material[mapName + "Channel"];
                        //console.log("P1");
                    } else {
                        if (T_SHADER.SETTINGS.mapsList.hasOwnProperty(mapName)) {
                            if (T_SHADER.SETTINGS.mapsList[mapName].channelDefault == '1' || T_SHADER.SETTINGS.mapsList[mapName].channelDefault == '0') {
                                //console.log("P2");
                                rez.value = "";
                                rez.show = "1";
                            } else {
                                rez.value = T_SHADER.SETTINGS.mapsList[mapName].channelDefault;
                                rez.show = T_SHADER.SETTINGS.mapsList[mapName].channelDefault;
                                //console.log("P3");
                            }
                        }
                    }
                }

                //if (material.name == "_2")
                //console.log("R E Z", material.name, material, material[mapName], mapName, rez);

                return rez;
            },
            applyShaderSettings: function(uvSettings, MAT, mapType) {
                //console.log("SSS", MAT, uvSettings);

                // WRAP
                if (MAT[mapType]) {
                    if (T_LOGIC.isProperyExists(uvSettings, 'userWrap', MAT.name, mapType)) {
                        MAT[mapType].wrapS = uvSettings.userWrap[MAT.name][mapType].s;
                        MAT[mapType].wrapT = uvSettings.userWrap[MAT.name][mapType].t;
                    } else {
                        MAT[mapType].wrapS = T_SHADER.SETTINGS.DEFAULT_SETTINGS_TEXTURE.WRAP.s;
                        MAT[mapType].wrapT = T_SHADER.SETTINGS.DEFAULT_SETTINGS_TEXTURE.WRAP.t;
                    }

                   // console.log("MAT[mapType].wrap", MAT[mapType].wrapS, MAT[mapType].wrapT);
                }

                // SCALE
                var scaleX;
                var scaleY;

                if (T_LOGIC.isProperyExists(uvSettings, 'userScale', MAT.name, mapType)) {
                    scaleX = uvSettings.userScale[MAT.name][mapType].x;
                    scaleY = uvSettings.userScale[MAT.name][mapType].y;
                } else {
                    scaleX = T_SHADER.SETTINGS.DEFAULT_SETTINGS_TEXTURE.SCALE.x;
                    scaleY = T_SHADER.SETTINGS.DEFAULT_SETTINGS_TEXTURE.SCALE.y;
                }

               /* if (MAT[mapType]) {
                    MAT[mapType].repeat.x = scaleX;
                    MAT[mapType].repeat.y = scaleY;
                }*/


                // OFFSET
                var offsetX;
                var offsetY;
                if (T_LOGIC.isProperyExists(uvSettings, 'userOffset', MAT.name, mapType)) {
                    offsetX = uvSettings.userOffset[MAT.name][mapType].x;
                    offsetY = uvSettings.userOffset[MAT.name][mapType].y;
                } else {
                    offsetX = T_SHADER.SETTINGS.DEFAULT_SETTINGS_TEXTURE.OFFSET.x;
                    offsetY = T_SHADER.SETTINGS.DEFAULT_SETTINGS_TEXTURE.OFFSET.y;
                }

                // ROTATION
                var rot;
                if (T_LOGIC.isProperyExists(uvSettings, 'userRotation', MAT.name, mapType)) {
                    rot = uvSettings.userRotation[MAT.name][mapType];
                } else {
                    rot = T_SHADER.SETTINGS.DEFAULT_SETTINGS_TEXTURE.ROTATION;
                }

                var gifSpeed;
                if (T_LOGIC.isProperyExists(uvSettings, 'userGIF', MAT.name, mapType)) {
                    gifSpeed = uvSettings.userGIF[MAT.name][mapType];
                    MAT[mapType].gifSpeed = gifSpeed;
                }

                // CHANNEL
                var ch;
                if (T_LOGIC.isProperyExists(uvSettings, 'userChannel', MAT.name, mapType)) {
                    ch = uvSettings.userChannel[MAT.name][mapType];
                } else {
                    ch = T_SHADER.SETTINGS.mapsList[mapType].channelDefault;
                }

                //console.log("chch", ch, mapType);

                MAT[mapType + 'Scale'] = new THREE.Vector2(scaleX, scaleY);
                MAT[mapType + 'Offset'] = new THREE.Vector2(offsetX, offsetY);
                MAT[mapType + 'Rotation'] = rot;
                MAT[mapType + 'Channel'] = ch;

                MAT.needsUpdate = true;

                var f = MAT[mapType + 'UpdateMatrix'];
                if (f) f(mapType);
            },

            updateShadersManually: function(mat) {
                //console.log("updateShadersManually")
                mat.needsUpdate = true;

                $.each(T_SHADER.SETTINGS.mapsList, function(key, mapsShaderData) {
                    var f = mat[key + 'UpdateMatrix'];
                    if (f) f(key);
                });

                mat.needsUpdate = true;
            },

            getModelUVData: function(settings) {
                if (settings && settings !== undefined && settings.uploader !== undefined && settings.uploader.uv !== undefined) {
                    return settings.uploader.uv;
                } else {
                    return null;
                }
            },

            clearProperties: function(settings, material) {

                // if no map then remove
                $.each(T_SHADER.SETTINGS.mapsList, function(mapName, mapNameD) {
                    if (material && !material[mapName]) {

                        // если в настройках есть такая map, то удалить (настрйока это userScale, userOffset и т.д)
                        if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userScale', material.name, mapName)) {
                            delete settings.uploader.uv.userScale[material.name][mapName];
                        }
                        if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userOffset', material.name, mapName)) {
                            delete settings.uploader.uv.userOffset[material.name][mapName];
                        }
                        if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userRotation', material.name, mapName)) {
                            delete settings.uploader.uv.userRotation[material.name][mapName];
                        }
                        if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userGIF', material.name, mapName)) {
                            delete settings.uploader.uv.userGIF[material.name][mapName];
                        }
                        if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userChannel', material.name, mapName)) {
                            delete settings.uploader.uv.userChannel[material.name][mapName];
                        }
                        if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userWrap', material.name, mapName)) {
                            delete settings.uploader.uv.userWrap[material.name][mapName];
                        }
                    }
                });

                // если в материале нет вообще мапов юзера, то удалить материале из настройки
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userScale', material.name) && Object.keys(settings.uploader.uv.userScale[material.name]).length == 0) {
                    delete settings.uploader.uv.userScale[material.name];
                }
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userOffset', material.name) && Object.keys(settings.uploader.uv.userOffset[material.name]).length == 0) {
                    delete settings.uploader.uv.userOffset[material.name];
                }
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userRotation', material.name) && Object.keys(settings.uploader.uv.userRotation[material.name]).length == 0) {
                    delete settings.uploader.uv.userRotation[material.name];
                }
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userGIF', material.name) && Object.keys(settings.uploader.uv.userGIF[material.name]).length == 0) {
                    delete settings.uploader.uv.userGIF[material.name];
                }
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userChannel', material.name) && Object.keys(settings.uploader.uv.userChannel[material.name]).length == 0) {
                    delete settings.uploader.uv.userChannel[material.name];
                }
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userWrap', material.name) && Object.keys(settings.uploader.uv.userWrap[material.name]).length == 0) {
                    delete settings.uploader.uv.userWrap[material.name];
                }

                // если в настройке нет вообще материалов, то удалить настройку
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userScale') && Object.keys(settings.uploader.uv.userScale).length == 0) {
                    delete settings.uploader.uv.userScale;
                }
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userOffset') && Object.keys(settings.uploader.uv.userOffset).length == 0) {
                    delete settings.uploader.uv.userOffset;
                }
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userRotation') && Object.keys(settings.uploader.uv.userRotation).length == 0) {
                    delete settings.uploader.uv.userRotation;
                }
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userGIF') && Object.keys(settings.uploader.uv.userGIF).length == 0) {
                    delete settings.uploader.uv.userGIF;
                }
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userChannel') && Object.keys(settings.uploader.uv.userChannel).length == 0) {
                    delete settings.uploader.uv.userChannel;
                }
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv', 'userWrap') && Object.keys(settings.uploader.uv.userWrap).length == 0) {
                    delete settings.uploader.uv.userWrap;
                }

                // если нет вообще настроек то удалить uv
                if (T_LOGIC.isProperyExists(settings, 'uploader', 'uv') && Object.keys(settings.uploader.uv).length == 0) {
                    delete settings.uploader.uv;
                }
            }
        },


        isShaderExist: function (ar, prefix) {
            for (var i = 0; i < ar.length; i++) {
                var s = ar[i];
                if (s && s.name == prefix) return true;
            }
            return false;
        },

        getMaterials: function (API, callbackSuccess, callbackError) {
            //console.log("T_SHADER getMaterials");

            $.ajax({
                type: "GET",
                url: API,
                data: { },
                dataType: 'json',
                success: function(data) {
                    if (callbackSuccess) callbackSuccess(data.data);
                },
                error: function(err) {
                    if (callbackError) callbackError(err);
                }
            });
        },

        getMaterial: function(type, materialToParse) {
            switch (type) {
                case "default":
                    var m = new THREE.PhysicalShaderMaterial({
                        color: new THREE.Color(0x444444),
                        roughness: 0,
                        metalness: 1,
                    });
                    break;

                case "noLibMaterial":
                    var m = new THREE.PhysicalShaderMaterial({
                        color: new THREE.Color(0x444444),
                        roughness: 0,
                        metalness: 1,
                    });
                    m.materialData = {
                        index : materialToParse.materialData.index,
                        materialId: materialToParse.id,
                    };
                    m.name = materialToParse.name;

                    break;
                default:
                    var m = new THREE.PhysicalShaderMaterial({
                        color: new THREE.Color(0xffffff),
                        roughness: 0,
                        metalness: 1,
                    });
                    m.materialData = {};
                    m.name = "standart_material";
                    break;
            }
            return m;
        },

        createMaterialFromJD: function(m, uvSettings, texturePath, defaultPhysic, isLIBRARY, callbackTexturesOk, rend) {
            //var m = mn.materialThree;

            //console.error("!!!!!!!!!!!", m, defaultPhysic);

            if (m.hasOwnProperty('type') && m.type == "MeshPhysicalMaterial") {
                m.type = "PhysicalShaderMaterial";
            }
            if (m.hasOwnProperty('type') && m.type == "MeshPhongMaterial") {
                m.type = "PhongShaderMaterial";
            }
            if (!m.hasOwnProperty('type')) {
                if (defaultPhysic) {
                    m.type = "PhysicalShaderMaterial";
                } else {
                    m.type = "PhongShaderMaterial";
                }
            }

            //console.log("M", m.type);

            // parse diffuse
            var diffuse = new THREE.Color(16777215);
            if (m.diffuse) {
                var newDiffuse = m.diffuse;
                // IMPORTANT : THIS IS FIX FOR OLD MODELS. SOME MODELS WITH GRAY DIFFUSE BUT WE NEED WHITE. SO THIS IS TRICK
                // IF DIFFUSE IF GRAY (0.588, 0.588, 0.588) THEN REPLACE WITH WHITE COLOR
                var currDiffuseColor = new THREE.Color().fromArray(newDiffuse);
                var grayDiffuseColor1 = new THREE.Color().fromArray([0.588, 0.588, 0.588]);
                var grayDiffuseColor2 = new THREE.Color().fromArray([0.588235, 0.588235, 0.588235]);
                var grayDiffuseColor3 = new THREE.Color().fromArray([0.647059, 0.647059, 0.647059]);
                if (currDiffuseColor.equals(grayDiffuseColor1) || currDiffuseColor.equals(grayDiffuseColor2) || currDiffuseColor.equals(grayDiffuseColor3)) {
                    newDiffuse = new THREE.Color(0xffffff).toArray();
                }
                // END FIX
                diffuse.fromArray(newDiffuse);
            }

            // parse emissive
            var emissive = new THREE.Color(0);
            if (m.emissive) {
                emissive.fromArray(m.emissive);
            }

            // parse specular
            var specular = new THREE.Color(1644825);
            if (m.specular) {
                specular.fromArray(m.specular);
            }

            // parse glossiness (same as shininess)
            var glossiness = m.glossiness !== undefined ? m.glossiness : 40;


            switch(m.type) {
                case "PhysicalShaderMaterial":

                    var clearcoatRoughness = 0;
                    if (m.hasOwnProperty('clearcoatRoughness')) {
                        clearcoatRoughness = m.clearcoatRoughness;
                    } else
                    if (m.hasOwnProperty('clearCoatRoughness')) {
                        clearcoatRoughness = m.clearCoatRoughness;
                    }

                    var clearcoat = 0;
                    if (m.hasOwnProperty('clearcoat')) {
                        clearcoat = m.clearcoat;
                    } else
                    if (m.hasOwnProperty('clearCoat')) {
                        clearcoat = m.clearCoat;
                    }


                    var roughness = 0.5;
                    if (m.hasOwnProperty('roughness')) {
                        roughness = m.roughness;
                    }
                    if (!m.hasOwnProperty('REVISION')) {        // в версии 132 старое значение с версии 101 делим на 2
                        roughness = roughness/2;
                    }

                    var sheen = 0.3;
                    if (m.hasOwnProperty('sheen')) {
                        sheen = m.sheen;
                    }

                    var sheenColor = new THREE.Color("#ffffff");
                    if (m.sheenColor) {
                        sheenColor.fromArray(m.sheenColor);
                    }

                    var sheenRoughness = 0.3;

                    var specularColor = new THREE.Color("#000000");
                    if (m.specularColor) {
                        specularColor.fromArray(m.specularColor);
                    }

                    var transmission = 0;
                    if (m.hasOwnProperty('transmission')) {
                        transmission = m.transmission;
                    }

                    var ior = 1.5;
                    if (m.hasOwnProperty('ior')) {
                        ior = m.ior;
                    }

                    // в файле color храним в SRGB. для editor выводим srgb
                    var currentMat = new THREE.MeshPhysicalMaterial({
                    //var currentMat = new THREE.PhysicalShaderMaterial({
                        name: m.name,
                        color: diffuse.getHex(),        // serj 12.12.2018 color: texture ? 0xFFFFFF : diffuse.getHex(),
                        emissive: emissive.getHex(),
                        //specular: specular.getHex(),
                        //shininess: glossiness,
                        flatShading: m.flatShading ? m.flatShading : false,
                        side: m.hasOwnProperty('side') ? m.side : THREE.DoubleSide,
                        blending: m.hasOwnProperty('blending') ? m.blending : THREE.NormalBlending,
                        opacity: m.opacity,
                        transparent: m.hasOwnProperty('transparent') ? m.transparent : false,
                        //skinning: false,
                        alphaTest: m.hasOwnProperty('alphaTest') ? m.alphaTest : 0,
                        wireframe: m.hasOwnProperty('wireframe') ? m.wireframe : false,
                        wireframeLinewidth: m.hasOwnProperty('wireframeLinewidth') ? m.wireframeLinewidth : 1,
                        displacementScale: m.hasOwnProperty('displacementScale') ? m.displacementScale : 1,
                        displacementBias: m.hasOwnProperty('displacementBias') ? m.displacementBias : 0,
                        reflectivity: m.hasOwnProperty('reflectivity') ? m.reflectivity : 0.5,    // near env
                        aoMapIntensity: m.hasOwnProperty('aoMapIntensity') ? m.aoMapIntensity : 1,
                        roughness: roughness,
                        metalness: m.hasOwnProperty('metalness') ? m.metalness : 0.5,
                        clearcoat: clearcoat,
                        clearcoatRoughness: clearcoatRoughness,
                        lightMapIntensity: m.hasOwnProperty('lightMapIntensity') ? m.lightMapIntensity : 1,
                        emissiveIntensity: m.hasOwnProperty('emissiveIntensity') ? m.emissiveIntensity : 1,
                        envMapIntensity: m.hasOwnProperty('envMapIntensity') ? m.envMapIntensity : 1,
                        depthWrite: m.hasOwnProperty('depthWrite') ? m.depthWrite : true,
                        depthTest: m.hasOwnProperty('depthTest') ? m.depthTest : true,
                        normalScale: m.hasOwnProperty('normalScale') ? m.normalScale : new THREE.Vector2(1,1),
                        envMapDefault: m.hasOwnProperty('envMapDefault') ? m.envMapDefault : (defaultPhysic ? true : true),
                        sheen: sheen,
                        sheenColor: sheenColor.getHex(),
                        sheenRoughness: m.hasOwnProperty('sheenRoughness') ? m.sheenRoughness : sheenRoughness,
                        specularIntensity: m.hasOwnProperty('specularIntensity') ? m.specularIntensity : 1.0,
                        specularColor: specularColor.getHex(),
                        transmission: transmission,
                        ior: ior,
                    });
                    currentMat.lights = false;

                    currentMat.color.convertSRGBToLinear();

                    // ------------------------ INFO --------------------------------------------------------------------------------------------------------
                    // convertSRGBToLinear. цвет храним в jd файле в виде #d3cdcf. если в материале одном выставить цвет, а в другом текстуру сделанную из этого цвета, то они визуально не совпадают
                    // текстара у нас в кодировке encoding = sRGB. цвет конвертируем в convertSRGBToLinear. потмо в редакторе надо отобразить уже тот что был #d3cdcf. и снова конвертировать его в linear. при сохранении материала его снвоа в createJDMaterial конвертируем в SRGB
                    // также т.к three js 134 конвертирует цвет 1.1.1 в srgb как 0.999999 0.99999 0.99999 то в жвижке функцию обновил ...
                    //function LinearToSRGB(c) {                                                      //    https://entropymine.com/imageworsener/srgbformula/
                        // было : return c < 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 0.41666) - 0.055;
                        //return (c < 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 0.41666) - 0.055).toFixed(8);
                    //}
                    // --------------------------------------------------------------------------------------------------------------------------------------
                    break;
                default:
                    //var currentMat = new THREE.PhongShaderMaterial({
                    var currentMat = new THREE.MeshPhongMaterial({
                        name: m.name,
                        color: diffuse.getHex(),        // serj 12.12.2018 color: texture ? 0xFFFFFF : diffuse.getHex(),
                        emissive: emissive.getHex(),
                        specular: specular.getHex(),
                        shininess: glossiness,
                        flatShading: m.flatShading ? m.flatShading : false,
                        side: m.hasOwnProperty('side') ? m.side : THREE.DoubleSide,
                        blending: m.hasOwnProperty('blending') ? m.blending : THREE.NormalBlending,
                        opacity: m.opacity,
                        transparent: m.hasOwnProperty('transparent') ? m.transparent : false,
                        //skinning: false,
                        alphaTest: m.hasOwnProperty('alphaTest') ? m.alphaTest : 0,
                        wireframe: m.hasOwnProperty('wireframe') ? m.wireframe : false,
                        wireframeLinewidth: m.hasOwnProperty('wireframeLinewidth') ? m.wireframeLinewidth : 1,
                        displacementScale: m.hasOwnProperty('displacementScale') ? m.displacementScale : 1,
                        displacementBias: m.hasOwnProperty('displacementBias') ? m.displacementBias : 0,
                        reflectivity: m.hasOwnProperty('reflectivity') ? m.reflectivity : 0.5,    // near env
                        aoMapIntensity: m.hasOwnProperty('aoMapIntensity') ? m.aoMapIntensity : 1,
                        lightMapIntensity: m.hasOwnProperty('lightMapIntensity') ? m.lightMapIntensity : 1,
                        emissiveIntensity: m.hasOwnProperty('emissiveIntensity') ? m.emissiveIntensity : 1,
                        //envMapIntensity: m.hasOwnProperty('envMapIntensity') ? m.envMapIntensity : 1,
                        depthWrite: m.hasOwnProperty('depthWrite') ? m.depthWrite : true,
                        depthTest: m.hasOwnProperty('depthTest') ? m.depthTest : true,
                        normalScale: m.hasOwnProperty('normalScale') ? m.normalScale : new THREE.Vector2(1,1),

                        //roughness: m.hasOwnProperty('roughness') ? m.roughness : 0.5,
                        //metalness: m.hasOwnProperty('metalness') ? m.metalness : 0.5,
                    });
                    currentMat.lights = true;

                    currentMat.color.convertSRGBToLinear();
                    break;
            }

            ///console.error("OOOOOOOOOOOOO", m, currentMat);


            // parse maps
            if (m.maps) {
                for (var iMap = m.maps.length-1; iMap > -1 ; --iMap) {
                    if (m.maps[iMap] && m.maps[iMap].file != "") {
                        var fileType = m.maps[iMap].file.substring(m.maps[iMap].file.lastIndexOf(".") + 1);
                        fileType = fileType.toLowerCase();
                        fileType = fileType == "jpg" ? "jpeg" : fileType;

                        // согласование *.max, *.jd и threejs
                        var mapType = m.maps[iMap].type;
                        switch(mapType) {
                            case "diffuse":
                                mapType = "map";
                                break;
                            case "opacity":
                                mapType = "alphaMap";
                                break;
                            case "bump":
                                mapType = "normalMap";
                                break;
                        }

                        switch(mapType) {
                            case "map":
                            case "alphaMap":     // *.max opacity == *.threejs alpha
                            case "normalMap":    // *.max bump == *.threejs normal
                            case "displacementMap":
                            case "roughnessMap":
                            case "metalnessMap":
                            case "specularMap":
                            case "lightMap":
                            case "aoMap":
                            case "emissiveMap":

                                if (isLIBRARY) {
//console.log("[m]", m, m.maps[iMap].file);

                                    currentMat.texturesAll++;

                                    currentMat[mapType] = new THREE.TextureLoader().load(m.maps[iMap].file,
                                        function ( texture ) {
                                            currentMat.texturesLoaded++;
                                            //console.log("COUNTER OK 1");


                                            doCallback();
                                           //console.log("texture", currentMat[mapType], texture);
                                        },
                                        null,
                                        function ( ev ) {
                                           //console.error( 'NO IMAGE. LOAD DEFAULT ', currentMat[mapType], /*this, ev */);

                                            var image = new Image();
                                            var texture = new THREE.Texture(image);
                                            image.onload = function() {
                                                texture.needsUpdate = true;


                                                currentMat.texturesLoaded++;
                                                console.log("COUNTER OK 1");
                                                doCallback();
                                            };
                                            image.src = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMdaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkI2QjdGRjQ5RDg4MTExRTk4RjAwODhERDBDQzc2RkUxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI2QjdGRjQ4RDg4MTExRTk4RjAwODhERDBDQzc2RkUxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iQzYyQzU5ODQwQjlCNEIyMTNCOENBQ0JFMzFDNzQ3NUMiIHN0UmVmOmRvY3VtZW50SUQ9IkM2MkM1OTg0MEI5QjRCMjEzQjhDQUNCRTMxQzc0NzVDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwM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"


                                            currentMat[mapType] = texture;
                                        }
                                    );
                                    currentMat[mapType].name = m.maps[iMap].name == "" ? T_FILES.generateFileName() : m.maps[iMap].name;


if (mapType == "map" || mapType == "emissiveMap") {
    currentMat[mapType].encoding = THREE.sRGBEncoding;
} else {
    currentMat[mapType].encoding = THREE.LinearEncoding;
}

                                } else {
                                    currentMat[mapType] = new THREE.Texture();
                                    currentMat[mapType].name = m.maps[iMap].name == "" ? T_FILES.generateFileName() : m.maps[iMap].name;

                                if (mapType == "map" || mapType == "emissiveMap") {
                                    currentMat[mapType].encoding = THREE.sRGBEncoding;
                                } else {
                                    currentMat[mapType].encoding = THREE.LinearEncoding;
                                }
                                    trace(rend)
                                
                                    if(rend)currentMat[mapType].anisotropy = rend.capabilities.getMaxAnisotropy();
                                }
                                trace(currentMat.materialData)

                                if(currentMat.materialData){
                                    if (!T_LOGIC.isProperyExists(currentMat.materialData, 'maps')) {
                                        currentMat.materialData.maps = {};
                                    }
                                    if (!T_LOGIC.isProperyExists(currentMat.materialData.maps, mapType)) {
                                        T_LOGIC.createProperty(currentMat.materialData.maps, mapType);
                                    }

                                    currentMat.materialData.maps[mapType].materialPath = texturePath + m.maps[iMap].file + (self.isAntiCache ? ("?ac=" + Math.random()) : "");
                                    currentMat.materialData.maps[mapType].mapName = currentMat[mapType].name;
                                    currentMat.materialData.maps[mapType].mapType = mapType;
                                }

                                

                                break;
                        }
                    }
                }
            }

            function doCallback() {
                if (currentMat.texturesAll == currentMat.texturesLoaded) {
                    if (callbackTexturesOk) callbackTexturesOk();
                }
            }

            if (currentMat.alphaMap) currentMat.transparent = true; // improve alpha map

            doCallback();

            return currentMat;
        },

        removeMapFromMaterial : function(maps, type) {
            //console.error("removeMapFromMaterial", type);

            $.each(maps, function(index, map){
                if (this.type == type){
                    maps.splice(index, 1);
                }
            });
        },

        createSettingsFromMaterial: function(json, material, map, isLIBLOGIC) {
            //console.log("c reateSettingsFromMaterial json", json);

            if (json) {
                var mSet = {};

                //console.log("mSet", json, isLIBLOGIC);

                if (isLIBLOGIC) {
                    mSet = json.settings || {};
                } else {
                    json.settings.uploader = json.settings.uploader || {};
                    json.settings.uploader.uv = json.settings.uploader.uv || {};
                    mSet = json.settings.uploader.uv || {};

                    //json.settings.uploader = json.settings.uploader || {};
                    //json.settings.uploader.uv = json.settings.uploader.uv || {};
                    //mSet = json.settings || {};
                }

                //console.log("SSSSS", mSet, isLIBLOGIC);

                // scale (repeat)
                mSet.userScale = mSet.userScale || {};
                mSet.userScale[material.name] = mSet.userScale[material.name] || {};
                if (material[map + 'Scale'] !== undefined) {
                    mSet.userScale[material.name][map] = new THREE.Vector2(material[map + 'Scale'].x, material[map + 'Scale'].y);
                }

                // offset
                mSet.userOffset = mSet.userOffset || {};
                mSet.userOffset[material.name] = mSet.userOffset[material.name] || {};
                if (material[map + 'Offset'] !== undefined) {
                    mSet.userOffset[material.name][map] = new THREE.Vector2(material[map + 'Offset'].x, material[map + 'Offset'].y);
                }

                // rotation
                mSet.userRotation = mSet.userRotation || {};
                mSet.userRotation[material.name] = mSet.userRotation[material.name] || {};
                if (material[map + 'Rotation'] !== undefined) {
                    mSet.userRotation[material.name][map] = material[map + 'Rotation'];
                }

                // gif speed
                mSet.userGIF = mSet.userGIF || {};
                mSet.userGIF[material.name] = mSet.userGIF[material.name] || {};
                if (material[map].gifSpeed !== undefined) {
                    mSet.userGIF[material.name][map] = material[map].gifSpeed;
                }


                // wrap
                mSet.userWrap = mSet.userWrap || {};
                mSet.userWrap[material.name] = mSet.userWrap[material.name] || {};
                if (material[map]) {
                    mSet.userWrap[material.name][map] = {'s': material[map].wrapS, 't': material[map].wrapT};
                }

                // channel
                mSet.userChannel = mSet.userChannel || {};
                mSet.userChannel[material.name] = mSet.userChannel[material.name] || {};
                if (material[map + 'Channel'] !== undefined) {
                    mSet.userChannel[material.name][map] = material[map + 'Channel'];
                }

                //console.log("mSet", mSet);
            }

            return mSet;
        },

        getFilesFromMapsOfMaterial: function(m, callback) {
            var totalFiles = 0;

            m.materialData.mapFiles = [];
            $.each(T_SHADER.SETTINGS.mapsList, function(map, mapData) {
                if (m[map]) {
                    totalFiles++;

                    var img = m[map].image;
                    var imageNewFileNameTemp = T_FILES.getFileNameFromUrl(img.src);

                    console.log("img.src", imageNewFileNameTemp, img.src);

                    /*fetch(img.src)
                        .then(function(res) {
                            res.blob()
                        })
                        .then(function(blob) {
                            const file = new File([blob], imageNewFileNameTemp, blob)
                            console.log(file)

                            m.materialData.mapFiles.push(file);

                            if (m.materialData.mapFiles.length == totalFiles) {
                                if (callback) {
                                    setTimeout(function() {
                                        callback(m);
                                    }, 300)
                                }
                            }
                        })*/



                    fetch(img.src)
                        .then(res => res.blob())
                        .then(blob => {
                            const file = new File([blob], imageNewFileNameTemp, blob)
                            console.log(file)
                            m.materialData.mapFiles.push(file);

                            if (m.materialData.mapFiles.length == totalFiles) {
                                if (callback) {
                                    setTimeout(function() {
                                        callback(m);
                                    }, 300)
                                }
                            }
                        })
                }
            })


            setTimeout(function() {
                if (totalFiles == 0) {
                    callback(m);
                }
            }, 100)


            /*function result() {
                if (m.materialData.mapFiles.length == totalFiles) {
                callback(m);
            }*/
        },

        createJDMaterial: function(materialJD, materialCurrent, jdFileNew, mapFiles, isLIBLOGIC, preventMaps, isUnlinkLogic) {
            console.error("><><>", materialJD, materialCurrent, jdFileNew, mapFiles, isLIBLOGIC, preventMaps, isUnlinkLogic);


            var materialJD = materialJD || {};

            materialJD.type = materialCurrent.type;                         // ?? bug here when replace jd file with other file

            var _calcColor = materialCurrent.color.clone().convertLinearToSRGB();
            materialJD.diffuse = _calcColor.toArray();

            if (materialJD.type == "PhongShaderMaterial") {
                materialJD.specular = materialCurrent.specular ? materialCurrent.specular.toArray() : null;
            }

            materialJD.emissive = materialCurrent.emissive.toArray();

            materialJD.REVISION = THREE.REVISION;

            materialJD.glossiness = materialCurrent.shininess;
            materialJD.side = materialCurrent.side;
            materialJD.flatShading = materialCurrent.flatShading;
            materialJD.blending = materialCurrent.blending;
            materialJD.opacity = materialCurrent.opacity;
            materialJD.transparent = materialCurrent.transparent;
            materialJD.alphaTest = materialCurrent.alphaTest;
            materialJD.wireframe = materialCurrent.wireframe;
            materialJD.wireframeLinewidth = materialCurrent.wireframeLinewidth;
            materialJD.displacementScale = materialCurrent.displacementScale;
            materialJD.displacementBias = materialCurrent.displacementBias;
            materialJD.reflectivity = materialCurrent.reflectivity;

            //if (preventMaps.indexOf('lightMap') != -1) {        // для аплоадера не сохранять lightMap и aoMap. они у них свои
            materialJD.lightMapIntensity = materialCurrent.lightMapIntensity;
            //}
            //if (preventMaps.indexOf('aoMap') != -1) {
            materialJD.aoMapIntensity = materialCurrent.aoMapIntensity;
            //}

            materialJD.emissiveIntensity = materialCurrent.emissiveIntensity;
            materialJD.normalScale = materialCurrent.normalScale;

            materialJD.depthWrite = materialCurrent.depthWrite;
            materialJD.depthTest = materialCurrent.depthTest;

            // phy extra parameters
            if (materialJD.type == "PhysicalShaderMaterial") {

                console.log("M CURRR", materialCurrent);

                if (materialCurrent.hasOwnProperty("_sheen")) {
                    materialJD.sheen = materialCurrent._sheen;
                } else {
                    materialJD.sheen = 0.3;
                }

                if (materialCurrent.hasOwnProperty('sheenColor')) {
                    materialJD.sheenColor = materialCurrent.sheenColor.toArray();
                }
                if (materialCurrent.hasOwnProperty('specularColor')) {
                    materialJD.specularColor = materialCurrent.specularColor.toArray();
                }
                if (materialCurrent.hasOwnProperty('specularIntensity')) {
                    materialJD.specularIntensity = materialCurrent.specularIntensity;
                } else {
                    materialJD.specularIntensity = 1.0;
                }
                if (materialCurrent.hasOwnProperty('sheenRoughness')) {
                    materialJD.sheenRoughness = materialCurrent.sheenRoughness;
                } else {
                    materialJD.sheenRoughness = 0.3;
                }



                if (materialCurrent.hasOwnProperty('_transmission')) {
                    materialJD.transmission = materialCurrent._transmission;
                } else {
                    materialJD.transmission = 0;
                }

                if (materialCurrent.hasOwnProperty('ior')) {
                    materialJD.ior = materialCurrent.ior;
                }

                if (materialCurrent.hasOwnProperty('roughness')) {
                    materialJD.roughness = materialCurrent.roughness;
                }

                if (materialCurrent.hasOwnProperty('metalness')) {
                    materialJD.metalness = materialCurrent.metalness;
                }


                delete materialJD.clearCoat;

                if (materialCurrent.clearcoat) {
                    materialJD['clearcoat'] = materialCurrent.clearcoat;
                } else {
                    materialJD['clearcoat'] = 0;
                }






                if (materialCurrent.hasOwnProperty('clearcoatRoughness')) {
                    materialJD.clearcoatRoughness = materialCurrent.clearcoatRoughness;
                }

                if (materialCurrent.hasOwnProperty('envMapDefault')) {
                    materialJD.envMapDefault = materialCurrent.envMapDefault;
                }

                if (materialCurrent.hasOwnProperty('envMapIntensity')) {
                    materialJD.envMapIntensity = materialCurrent.envMapIntensity;
                }
            }


            // if no map (or user setting is default) then remove settings
            if (jdFileNew) T_SHADER.SETTINGS.clearProperties(jdFileNew.settings, materialCurrent);

            // * MAPS
            $.each(T_SHADER.SETTINGS.mapsList, function(map, mapData) {
                var mapJD = map;

                switch(map) {
                    case "map":
                        mapJD = "diffuse";
                        break;
                    case "alphaMap":
                        mapJD = "opacity";
                        break;
                    case "normalMap":
                        mapJD = "bump";
                        break;
                }

                if (preventMaps.indexOf(map) != -1) {
                    return true;
                }

                switch(map) {
                    case "map":
                    case "alphaMap":        // *.max opacity == *.threejs alpha
                    case "normalMap":       // *.max bump == *.threejs normal
                    case "displacementMap":
                    case "roughnessMap":
                    case "metalnessMap":
                    case "specularMap":
                    case "lightMap":
                    case "aoMap":
                    case "emissiveMap":

                       // console.log("map", map, materialCurrent[map]);

                        if (!materialCurrent[map]) {
                            //console.log("P 1");
                            T_SHADER.removeMapFromMaterial(materialJD.maps, mapJD);
                        } else {
                            //console.log("P 2");
                            if (!materialCurrent[map].image) {
                                // если сняли чекбокс т.е удаляем текстуру
                                T_SHADER.removeMapFromMaterial(materialJD.maps, mapJD);
                            } else {

                                var image;
                                var imageUrl;

                                if (materialCurrent[map] && materialCurrent[map] instanceof THREE.ComposedTexture) {
                                    imageUrl = materialCurrent[map].originalImagePath.replace(" ", "");

                                    var CCC = T_FILES.getFileNameFromUrl(imageUrl);

                                } else {
                                    image = materialCurrent[map].image;
                                    imageUrl = image.src;
                                }

                                // if this is updated image (so base 64) then upload. if src = url then skip file (leave old)
                                // если картинку загрузили заново (или выбрали из только что загруженных. т.е base64)
                                if (imageUrl.indexOf("base64") != -1) {

                                    //console.error("base64");

                                    var imageNewFileName = null;
                                    var ext = T_FILES.getExtensionOfFileFromBase64(imageUrl);

                                    //console.log("E X T", mapFiles, ext, imageUrl);

                                    if (ext) {
                                        ext = ext.replace('image/', '');
                                        //console.log("T1");
                                    } else {
                                        ext = "png";     // по умолчанию png
                                        //console.log("T2");
                                    }

                                    var _f = null;     // get already processed file (base 64). so file that loaded manually and then selected from library
                                    $.each(mapFiles, function (index, tempF) {
                                        if (tempF.src == imageUrl) {
                                            _f = tempF;
                                            return false;
                                        }
                                    });

                                    //console.log("CCC", materialCurrent.userData, map);

                                    if (_f) {
                                        //console.log("T3");
                                        imageNewFileName = _f.name;
                                    } else {
                                        // есть ли имя загруженного файла. или генерировать свое новое
                                        if (materialCurrent.userData && materialCurrent.userData[map] && materialCurrent.userData[map].uploadedFileName) {
                                            //console.log("T4");

                                            imageNewFileName = materialCurrent.userData[map].uploadedFileName;
                                            ext = T_FILES.getFileExtension(imageNewFileName);

                                            imageNewFileName = T_FILES.getFileName(imageNewFileName).replaceAll("__", "_").replaceAll(" ", "_").replaceAll("-", "_");    // иначе проблемы с загрузкой файлов с двойным подчеркиванием типа image__1.jpg
                                        } else {
                                            //console.log("T5");

                                            imageNewFileName = T_FILES.generateFileName();      // generate new image name
                                            ext = "png";
                                        }

                                        // create image file
                                        var blob = T_FILES.dataURItoBlob(imageUrl);
                                        var file = new File([blob], imageNewFileName + "." + ext);

                                        var F = {
                                            file: file,
                                            src: imageUrl,
                                            name: imageNewFileName
                                        }

                                        //console.log("2blob", F.name, blob);

                                        if (mapFiles) mapFiles.push(F);

                                        // remove map info from material
                                        //T_SHADER.removeMapFromMaterial(materialJD.maps, mapJD);
                                    }

                                    // remove map info from material
                                    T_SHADER.removeMapFromMaterial(materialJD.maps, mapJD);

                                    // place map info in jd file
                                    var mapDataX = {
                                        name: imageNewFileName,
                                        type: mapJD,
                                        uvsIndex: 0,
                                        file: imageNewFileName + "." + ext,
                                    }

                                } else {

                                    //console.log(">2");

                                    // this is just map data update (если текстура не меняется вручную через аплоад)
                                    var imageNewFileNameTemp = T_FILES.getFileNameFromUrl(imageUrl);     // name with extension
                                    var imageNewFileNameExtension = T_FILES.getFileExtension(imageNewFileNameTemp);
                                    var imageNewFileName = T_FILES.getFileName(imageNewFileNameTemp);

                                    //console.log(">>>", imageNewFileNameTemp, imageNewFileNameExtension, imageNewFileName);

                                    // remove map info from material
                                    T_SHADER.removeMapFromMaterial(materialJD.maps, mapJD);

                                    // place map info in jd file. but init texture name can be with jpg .. then leave jpg
                                    //console.log("isLIBLOGIC", isLIBLOGIC);
                                    if (isLIBLOGIC) {   // взять весь путь
                                        var mapDataX = {
                                            name: materialCurrent[map].name,
                                            //name: T_FILES.getFileName(materialCurrent[map].name),
                                            type: mapJD,
                                            uvsIndex: 0,
                                            file: isUnlinkLogic ? (imageNewFileName + "." + imageNewFileNameExtension) : imageUrl
                                        }
                                    } else {
                                        var mapDataX = {
                                            name: materialCurrent[map].name,
                                            //name: T_FILES.getFileName(materialCurrent[map].name),
                                            type: mapJD,
                                            uvsIndex: 0,
                                            file: isUnlinkLogic ? (imageNewFileName + "." + imageNewFileNameExtension) : imageUrl
                                            //file: imageNewFileName + "." + imageNewFileNameExtension,
                                        }
                                    }
                                }

                                //console.log("materialCurrent", materialCurrent, jdFileNew, imageNewFileNameTemp, imageNewFileNameExtension, imageNewFileName);

                                T_SHADER.createSettingsFromMaterial(jdFileNew, materialCurrent, map, isLIBLOGIC);

                                if (materialJD.maps == undefined) materialJD.maps = [];

                                materialJD.maps.push(mapDataX);
                                //console.log("materialJD.maps.length=", materialJD.maps, mapDataX);
                            }
                        }
                        break;
                }
            });

            //console.log("AA", materialJD.maps, jdFileNew.settings);

            materialJD.settings =  jdFileNew.settings;//T_SHADER.SETTINGS.getModelUVData(jdFileNew.settings);;

            return materialJD;
        },

        shaders: [],

        isShaderExist : function (ar, prefix) {
            for (var i = 0; i < ar.length; i++) {
                var s = ar[i];
                if (s && s.name == prefix) {
                    return true;
                }
            }
            return false;
        },
        getShaders : function (API_URL, obj, prefixes, callbackSuccess, callbackError) {  // array of prefixes: for exampe _obj, _met etc
            var self = this;

            //console.log("getShaders");

            $.ajax({
                type: "GET",
                url: API_URL + prefixes,
                data: { },
                dataType: 'json',
                success: function (d) {
                    //console.log("d.data", d.data);

                    $.each(d.data, function(key, shaderData) {
                        // new year self.createShaderMaterial(shaderData);
                        self.createShaderNewMaterial(shaderData);
                    });

                    if (callbackSuccess) callbackSuccess(obj);
                },
                error: function (err) {
                    if (callbackError) callbackError(err);
                }
            });
        },
        createShaderNewMaterial : function (shaderData) {       // new function for physic shaders
            console.log("createShaderNewMaterial", shaderData);

            var self = this;

            if (!self.isShaderExist(self.shaders, shaderData.prefix)) {

                var options = {};

                if (typeof shaderData.video != 'undefined') {
                   /* var col = 0x000000;

                    if (typeof shaderData.color != 'undefined') {
                        col = shaderData.color;
                    }

                    var op = (shaderData.opacity !== undefined && shaderData.opacity < 1) ? true : false;


                    var videoURL = shaderData.video.url;


                    var shaderMaterialX = new THREE.ChromaKeyMaterial();
                    shaderMaterialX.setP(videoURL, col, op);
                    shaderMaterialX.uuid = shaderMaterialX.id = THREE.Math.generateUUID();
                    shaderMaterialX.name = shaderData.prefix;

                    shaderMaterialX.needsUpdate = true;
                    shaderMaterialX.uniformsNeedUpdate = true;

                    var cube_height = 100;
                    var cube_width = 100;

                    shaderMaterialX.createChromaKeyMaterial(cube_width, cube_height);

                    self.shaders.push(shaderMaterialX);*/
                } else {
                    //console.log('shaderDatas',shaderData);

                    // diffuse map
                    if (typeof shaderData.map != 'undefined') {
                        THREE.ImageUtils.crossOrigin = '';
                        var textureLoader = new THREE.TextureLoader();
                        textureLoader.setCrossOrigin('');
                        textureLoader.load(shaderData.map.image);

                        //options['map'] = new THREE.TextureLoader().load(shaderData.map.image);
                        options['map'] = textureLoader;
                        //options['map'].wrapS = options['map'].wrapT = THREE.RepeatWrapping;
                    }
                    // diffuse color
                    if (!shaderData.map) {
                        if (typeof shaderData.color != 'undefined') {
                            options['color'] = shaderData.color;
                        }
                    } else options['color'] = 0xFFFFFF;

                    // specular
                    if (typeof shaderData.specular != 'undefined') {
                        /////  options['specular'] = shaderData.specular;
                    }

                    // specular map
                    if (typeof shaderData.specularMap != 'undefined') {
                        THREE.ImageUtils.crossOrigin = '';
                        var textureLoader = new THREE.TextureLoader();
                        textureLoader.setCrossOrigin('');
                        textureLoader.load(shaderData.specularMap.image);

                        options['specularMap'] = textureLoader;

                        //options['specularMap'] = new THREE.TextureLoader().load(shaderData.specularMap.image);
                    }

                    // shininess
                    if (typeof shaderData.shininess != 'undefined') {
                        ///// options['shininess'] = shaderData.shininess;
                    }

                    // transparent
                    if (typeof shaderData.transparent != 'undefined') {
                        options['transparent'] = shaderData.transparent;
                    }

                    //options['alphaTest'] = 0.5;
                    //options['transparent'] = true;
                    //options['depthWrite'] = false;

                    //if (shaderData.prefix == "_te" || shaderData.prefix == "_te2")
                    //options['depthTest'] = true;

                    // opacity
                    if (typeof shaderData.opacity != 'undefined') {
                        options['opacity'] = shaderData.opacity;

                        if (shaderData.prefix.substr(0, 3) == "_gl") {
                            //options['depthTest'] = false;
                            options['depthWrite'] = false;
                        }
                    }

                    if (typeof shaderData.isDefaultEnvMap != 'undefined' && shaderData.isDefaultEnvMap == true) {
                        options['envMap'] = self.defaultEnvMap;

                        //options.envMapDefault = true;

                        ///// options['flatShading '] = shaderData.shading == "SmoothShading" ? false : true;      // TRUE ИЛИ ПРОПАДЕТ ENV MAP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    } else {
                        if (typeof shaderData.envMap != 'undefined') {
                            //console.log("zzz lib defaultEnvMap2");

                            //options.envMapDefault = false;

                            //options['envMap'] = self.createEnvMap(shaderData.envMap)
                            /////  options['flatShading '] = shaderData.shading == "SmoothShading" ? false : true; // options['shading '] = THREE.SmoothShading;      // TRUE ИЛИ ПРОПАДЕТ ENV MAP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                        }
                    }

                    // env map reflectivity
                    if (typeof shaderData.reflectivity != 'undefined' && options['envMap']) {
                        options['reflectivity'] = shaderData.reflectivity;
                    }

                    // normalMap
                    if (typeof shaderData.normalMap != 'undefined') {
                        options['normalMap'] = new THREE.TextureLoader().load(shaderData.normalMap.image);
                        options['normalMap'].wrapS = options['normalMap'].wrapT = THREE.RepeatWrapping;
                    }

                    var shaderMaterial = new THREE.MeshPhysicalMaterial(options);

shaderMaterial.lights = false;
                    shaderMaterial.name = shaderData.prefix;


                    if (typeof shaderData.isDefaultEnvMap != 'undefined' && shaderData.isDefaultEnvMap == true) {
                        shaderMaterial.envMapDefault = true;
                        shaderMaterial.needsUpdate = true;
                    }


                    // IMPORTANT : old materials with transparent = true. but new logic transparent = false so we need to apply for old glass prefixes transparent = true
                        shaderMaterial.transparent = true;
                    // end fix

                    //console.log("==>", shaderMaterial);

                    self.shaders.push(shaderMaterial);
                }
            }
        },



        applyMaterialLogic : function (obj, maxAnisotropy, callback) {
            var self = this;

            if (!obj) return;

            var prefixes = [];

            obj.traverse(function(child) {
                if (!self.isSnapPrefix(child.name)) {

                    if (self.isPrefix(child.name)) {

                        if (self.isShadow(child.name)) {
                            if (!T_3D.isEmpty(child.material)) {
                                child.material.side = THREE.DoubleSide;
                                child.material.transparent = true;
                            }
                        } else {
                            if (!T_3D.isEmpty(child.material)) {
                                if (child.material.map) {
                                    child.material.map.wrapS = child.material.map.wrapT = THREE.RepeatWrapping;
                                    child.material.map.anisotropy = maxAnisotropy;
                                    child.material.map.minFilter = THREE.LinearMipMapLinearFilter;
                                    child.material.map.magFilter = THREE.LinearFilter;
                                    child.material.map.mapping = THREE.UVMapping;
                                }
                            }

                            prefixes.push(self.getPrefix(child.name));
                        }

                        child.material.needsUpdate = true;
                    } else {
                        if (!T_3D.isEmpty(child.material)) {
                            $.each(T_SHADER.SETTINGS.mapsList, function(mapType, mapTypeD) {
                                if (child.material[mapType]) {
                                    child.material[mapType].anisotropy = maxAnisotropy;
                                    child.material[mapType].minFilter = THREE.LinearMipMapLinearFilter;
                                    child.material[mapType].magFilter = THREE.LinearFilter;
                                    child.material[mapType].mapping = THREE.UVMapping;
                                }
                            });
                        }
                    }

                    // video
                    if (child) {
                        if (child.material && (child.material && child.material.isChromaKeyShaderMaterial)) {
                            //console.log("XZchildObject", child);

                            var box = new THREE.Box3().setFromObject( child );

                            var cube_height = box.max.y - box.min.y;
                            var cube_width = box.max.x - box.min.x;

                            child.material.createChromaKeyMaterial(cube_width, cube_height);

                            //shaderMaterialX.needsUpdate = true;
                            //child.material.fragmentShader = (child.material.opacity !== undefined && child.material.opacity < 1) ? chromaKeyMaterialFragmentShader : chromaKeyMaterialFragmentShaderNoAlpha,

                        }
                    }

                }

            });

            if (prefixes.length == 0) {
                //console.log("No prefixes");
                return;
            }

            if (callback) callback(obj, prefixes);
        },
        applyShaderExtraLogic : function (obj, callback, renderer) {

            /* tip
            * if prefix/shader has map(texture) and object with same name(prefix) has texture
            * then we use original texture and not texture of prefix/shader
            * */

            /* tip
            * if map extension is *.mp4 then this is video (ChromaKeyMaterial)
            */

            var self = this;

            if (!obj) return;
            //console.log(">>s", self.shaders);


            //obj.scale.setScalar(0.2);


            // shaders
            obj.traverse(function(childObject) {
                if (childObject) {

                    var mat = self.getShaderMaterialByPrefix(self.shaders, self.getPrefix(childObject.name));

                    if (mat) {

                        /*if (childObject.name == "_po") {
                            childObject.material.diffuse = 0xFFFFFF;
                        }*/

                        if (childObject.name == "_wtrp") {


                            /*var video = document.createElement('video');
                            video.loop = true;
                            video.crossOrigin = "";
                            video.autoplay = true;
                            video.width = 1024;
                            video.height = 1024;
                            video.setAttribute('webkit-playsinline', 'webkit-playsinline');
                            video.muted = "muted";
                            video.src = '../img/water.mp4';
                            video.play();


                            self.dudvMap = new THREE.TextureLoader().load( '../img/waterdudv.jpg', function(texture) {
                                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                            });*/

/* var water = new THREE.WaterNew(
    childObject, {
        textureWidth: 1024,
        textureHeight: 1024,
        color: mat.color,
        scale: 4,
        flowDirection: new THREE.Vector2(1, 1),
        shader: THREE.WaterShader,

        /!*waterNormalMap1: new THREE.TextureLoader().load('../img/waternormals6.jpeg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        waterNormalMap2: new THREE.TextureLoader().load('../img/waternormals3.jpg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        waterNormalMap3: new THREE.TextureLoader().load('../img/waternormals2.jpg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        waterNormalVideo: new THREE.VideoTexture(video, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.LinearFilter, THREE.LinearFilter, THREE.RGBFЫormat, THREE.UnsignedByteType, renderer.getMaxAnisotropy() ),
        diffuseMap: new THREE.TextureLoader().load('../img/water.jpg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        dudvMap: self.dudvMap,
        alpha: 0.8,
        sunColor: 0xffffff,
        distortionScale: 20.7,*!/
        //sunDirection: APPLICATION.directionalLight.position.clone().normalize(),
    }
);*/
                            //water.position.y = 1;
                            //water.rotation.x = Math.PI * - 0.5;
                            //APPLICATION.scene.add( water );




                            /*var waterGeometry = new THREE.PlaneBufferGeometry( 120, 120 );
                            var water2 = new THREE.WaterNew( waterGeometry, {
                                color: mat.color,
                                scale: 4,
                                flowDirection: new THREE.Vector2( 1, 1 ),
                                textureWidth: 1024,
                                textureHeight: 1024
                            } );

                            water2.position.y = 200;
                            water2.rotation.x = Math.PI * - 0.5;
                            APPLICATION.scene.add( water2 );*/



                            if (callback) callback(childObject.material);
                        } else {
                            childObject.material = mat;
                        }
                    }
                }
            });
        },
        getShaderMaterialByPrefix : function (ar, prefix) {
            var self = this;

            for (var i = 0; i < ar.length; i++) {
                //var s = self.copyMaterial(self.shaders[i]);
                var s = ar[i];

                if (s.name == prefix) {
                    return s;
                }
            }

            return null;
        },
        createEnvMap : function (m) {
            var self = this;

            if (typeof m === 'undefined') return undefined;
            var sortedImages = self.sortEnvMap(m.images);

            if (sortedImages) {
                var map = new THREE.CubeTextureLoader().setCrossOrigin("").load(sortedImages); //THREE.ImageUtils.loadTextureCube(sortedImages);
                    map.mapping = m.mapping;


                return map;
            }

            return null;
        },
        createNormalMap : function (m) {
            if (typeof m === 'undefined') return undefined;

            if (m.image) {
                var loader = new THREE.TextureLoader();

                var map = loader.load(m.image);

                return map;
            }

            return null;
        },
        sortEnvMap : function (images) {
            if (images.length < 6) return null;

            var newImages = [];

            images.forEach(function (im) {
                var imgName = im.replace(/^.*[\\\/]/, '');

                if (imgName.length < 2) return null;

                switch (imgName[0] + imgName[1]) {
                    case 'px':
                        newImages[0] = im;
                        break;
                    case 'nx':
                        newImages[1] = im;
                        break;
                    case 'py':
                        newImages[2] = im;
                        break;
                    case 'ny':
                        newImages[3] = im;
                        break;
                    case 'pz':
                        newImages[4] = im;
                        break;
                    case 'nz':
                        newImages[5] = im;
                        break;
                }
            });

            if (newImages.length < 6) return null;

            //var ar = [];
            //$.each(newImages, function(index, im) {
                //ar.push(T_URL.httpsToHttp(im));
            //});

            return newImages;
        },
        copyMaterial : function (mat) {
            var newMaterial = new THREE.MeshPhongMaterial();
            for (var p in mat) {
                if (mat.hasOwnProperty(p) && p !== "id") {
                    var obj = mat[p];
                    newMaterial[p] = obj;
                }
            }

            newMaterial.uuid = THREE.Math.generateUUID();

            return newMaterial;
        },
        //chromaKeyMaterials: [],
        updateChromaKeyMaterials : function (materials) {
            var self = this;

            $.each( materials, function( index, material ){
                material.updateChromaKeyMaterial();
            });
        },
    };
    return tools;
})();


// ------------------------------------------------------------------------------------------- tools color sets

var T_COLOR_SET = (function () {
    var tools = {
        getLayers : function(product) {
            if (product.textureSetLayers) {
                if (product.textureSetLayers.data) {
                    if (product.textureSetLayers.data.length > 0) {
                        return product.textureSetLayers.data;
                    }
                }
            }
            return null;
        },
        getLayersInit : function(product) {
            if (product.textureSetLayersInit) {
                if (product.textureSetLayersInit.data) {
                    if (product.textureSetLayersInit.data.length > 0) {
                        return product.textureSetLayersInit.data;
                    }
                }
            }
            return null;
        },
        getColorSets : function(product) {
            if (product.textureSets) {
                if (product.textureSets.data) {
                    if (product.textureSets.data.length > 0) {
                        return product.textureSets.data;
                    }
                }
            }
            return null;
        },
        getDefaultColorSetForLayers: function(product) {     // дефолтный сет это первый сет в первом слое
            var rez = null;

            var colorSetsLayers = T_COLOR_SET.getLayers(product);

            if (colorSetsLayers) {
                var layerFirst = colorSetsLayers[0];

                if (layerFirst.textureSets && layerFirst.textureSets.data) {
                    var firstSet = layerFirst.textureSets.data[0];
                    rez = firstSet;

                    return rez;
                }
            }
            return null;
        },
        isColorSetTextureNameSame: function(fileurl, seturl) {
            var rez = false;
            fileurl = T_URL.getURLWithoutParameters(fileurl);
            seturl = T_URL.getURLWithoutParameters(seturl);

            //console.log(">>>", fileurl, seturl);

            if (!seturl || !fileurl) return rez;
            fileurl = decodeURI(fileurl);
            var seturlCut = seturl.substring(seturl.lastIndexOf('/') + 1);
            var fileurlCut = fileurl.substring(fileurl.lastIndexOf('/') + 1);
            if (fileurlCut.toLowerCase() == seturlCut.toLowerCase()) {
                //console.log("same true");
                return true;
            }

            //console.log("same false");
            return false;
        }

    };
    return tools;
})();

