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
 
*/
export default function MFoto3D() { // для фотографирования 3д
    var self = this;

    var SCREEN_WIDTH = 256;
    var SCREEN_HEIGHT = 256;

    var scene = new THREE.Scene();
    // var camera = new THREE.PerspectiveCamera(54, SCREEN_WIDTH / SCREEN_HEIGHT, 0.01, 1000000);
    var camera = new THREE.OrthographicCamera(SCREEN_WIDTH / -2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / -2, 0.001, 10000);
    var clock = new THREE.Clock();
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
    });
    camera.position.set(200, 200, 200);
    scene.add(camera);

    // var ctx = renderer.context.canvas.getContext("webgl");
    
    this.camera = camera;

    this.fotoContainer = new THREE.Object3D();
    scene.add(this.fotoContainer);

    scene.background = new THREE.Color(0x0096ff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    renderer.localClippingEnabled = true; //

    var contentHTML = document.createElement('div');
    contentHTML.style.position = 'absolute';
    contentHTML.style.bottom = '0px';
    contentHTML.style.left = '0px';
    // contentHTML.style.zIndex = '150';
    contentHTML.appendChild(renderer.domElement);
    this.contentHTML = contentHTML;
    this.canvas = renderer.domElement;
    this.contentHTML = contentHTML;
    // document.body.appendChild(contentHTML);

    var ambientLight = new THREE.AmbientLight("#ffffff", 1);
    scene.add(ambientLight);
    // var sunLight = new THREE.DirectionalLight('rgb(255,255,255)', 0.9);
    // scene.add(sunLight);

    // helper debug
    var gridHelper = new THREE.GridHelper(1000, 10);
    var axesHelper = new THREE.AxesHelper(100);
    var boxHelper = new THREE.BoxHelper(this.fotoContainer, 0xffff00);
    scene.add(gridHelper);
    scene.add(axesHelper);
    scene.add(boxHelper);

    var arrHelper = [axesHelper, gridHelper, boxHelper];

    function animate() {
        render();
        boxHelper.setFromObject(self.fotoContainer);
    }

    function render() {
        renderer.render(scene, camera);
    }
    this.render = render;
    animate();


    var box = new THREE.Box3();
    var center = new THREE.Vector3();

    this.box = box;
    this.center = center;


    this.setSize = function(width, height) { // размер рендера
        SCREEN_WIDTH = width;
        SCREEN_HEIGHT = height;
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
    };

    this.addObjFoto = function(obj) {
        // this.fotoContainer.children.length = 0;
        // obj.position.set(0, 0, 0);
        // obj.visible = true;
        this.fotoContainer.add(obj);
        boxHelper.setFromObject(this.fotoContainer);
    };
    this.removeObjFoto = function(obj) {
        this.fotoContainer.remove(obj);
    };


    this.moveToObj = function(obj) {
        box.setFromObject(obj || self.fotoContainer);
        var w = (box.max.x - box.min.x);
        var h = (box.max.z - box.min.z);
        self.moveToRect(box.min.x, box.min.z, w, h);
    };

    this.moveToRect = function(x, y, w, h) { // здвинуть на рект
        x += w / 2;
        y += h / 2;
        center.set(x, 0, y);

        camera.position.set(center.x, 9000, center.z);
        camera.lookAt(center);

       // orbitControls.target.set(center.x, center.y, center.z);

        if (camera.type === 'OrthographicCamera') {
            var s = Math.max(h, w);
            camera.zoom = 1;
            camera.left = s / -2;
            camera.right = s / 2;
            camera.top = s / 2;
            camera.bottom = s / -2;
            camera.aspect = s / s;
        }
        camera.updateProjectionMatrix();
        // render();
    };

    this.getFoto = function(imgWH) { /// получить b64
        imgWH = imgWH || 1024;

        for (var i = 0; i < arrHelper.length; i++) {
            arrHelper[i].visible = false;
        }
        var prev = scene.background;
        scene.background = null;
        renderer.setSize(imgWH, imgWH);
        render();
        var imgData = renderer.domElement.toDataURL("image/png");
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        scene.background = prev;

        for (var j = 0; j < arrHelper.length; j++) {
            arrHelper[j].visible = true;
        }
        render();
        return imgData;
    };

    this.getCanvas = function(imgWH) {
        imgWH = imgWH || 1024;
        for (var i = 0; i < arrHelper.length; i++) {
            arrHelper[i].visible = false;
        }
        var prev = scene.background;
        scene.background = null;

        var wh = renderer.getSize();
        if (wh.width != imgWH || wh.height != imgWH) {
            renderer.setSize(imgWH, imgWH);
        }
        render();

        // todo delete
        // setTimeout(function() {
        //     renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        //     scene.background = prev;

        //     for (var j = 0; j < arrHelper.length; j++) {
        //         arrHelper[j].visible = true;
        //     }
        //     render();

        // }, 1);

        return renderer.domElement;
    };


    // дебаг управление todo delete
   /* var orbitControls = new THREE.OrbitControls(camera, contentHTML);
    orbitControls.enableKeys = false;
    orbitControls.minDistance = 1;
    orbitControls.minZoom = 1;
    orbitControls.maxZoom = 1;
    orbitControls.addEventListener('change', function() {
        animate();
    });*/

}