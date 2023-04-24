const loader = new THREE.GLTFLoader();
const UPDATE_DURATION = 100;
const AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
var scene, camera,
    runing = false,
    cd,
    bars, musicBoxList = [], ground;
const boxGeometry = new THREE.BoxGeometry(0.01, 0.01, 0.08), size = 50;
boxGeometry.translate(0, 0, 0.04);
const offsetX = 0.8 / size, offsetY = 0.8 / size;
const musicCenter = [0.6, 0.9];
let updateId;
const color = ['#000', '#03A04C', '#03A04C', '#E3B814', '#fff'];
const materialMap = {};
const params = {
    groundColor: '#cfcfcf'
}

function init() {
    const width = window.innerWidth, height = window.innerHeight;
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color('#fff');
    // scene.rotation.z = Math.PI;
    //

    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100000);
    camera.position.set(0.0021618414672400815, -2.1584257035785575, 0.8339931995638086);

    //

    const directionalLight = new THREE.DirectionalLight('#fff', 0.4);
    directionalLight.position.set(0.75, 1.75, 5.0).normalize();
    scene.add(directionalLight);
    // directionalLight.castShadow = true;
    // directionalLight.shadow.mapSize.width = 512 * 10;
    // directionalLight.shadow.mapSize.height = 512 * 10;

    // const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1, 'red');
    // scene.add(lightHelper);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // const pointLight = new THREE.PointLight('#fff', 0.40);
    // pointLight.position.set(0, 1.5, -4);
    // pointLight.castShadow = false;
    // scene.add(pointLight);

    const spotLight = new THREE.SpotLight('white');
    // spotLight.castShadow = true;
    spotLight.intensity = 0.5;
    spotLight.angle = 0.46;
    // spotLight.shadow.mapSize.width = 512 * 10;
    // spotLight.shadow.mapSize.height = 512 * 10;
    // spotLight.penumbra = 0.05;
    // spotLight.decay = 2;
    spotLight.distance = 200;
    spotLight.position.set(0, 50, 100);
    spotLight.target.position.set(0, 0, 0);

    scene.add(spotLight);

    // const texture = new THREE.TextureLoader().load('./data/R-C.jfif');
    // texture.needsUpdate = true; //使用贴图时进行更新
    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    // // texture.repeat.set(0.002, 0.002);
    // texture.repeat.set(1, 1);

    const planeGeometry = new THREE.PlaneBufferGeometry(6, 6);
    ground = new THREE.Mesh(planeGeometry, new THREE.MeshStandardMaterial({
        opacity: 1, color: params.groundColor, side: 2, roughness: 0,
        metalness: 0,
        // map: texture
    }));
    ground.position.z = -0.06;
    // ground.rotation.x = -Math.PI / 2;
    // ground.position.set(0, -0.9, 0);
    // ground.receiveShadow = true;
    scene.add(ground);

    // const pointLight1 = new THREE.PointLight('#fff', 1);
    // pointLight1.position.set(2, 0, 0.5);
    // scene.add(pointLight1);



    const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    // const { width, height } = renderDom.getBoundingClientRect();
    renderer.setSize(width, height);
    renderer.setClearColor(new THREE.Color(1, 1, 1), 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.needsUpdate = true;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild(renderer.domElement);

    //
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.1;
    controls.maxDistance = 2000;

    function animation() {
        requestAnimationFrame(animation);
        renderer.render(scene, camera);
        loopCD();
        loopMusicBox();
    }
    animation();

    window.addEventListener('resize', () => {
        const width = window.innerWidth, height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
    return scene;
}

function ignoreLights(scene) {
    scene.children = scene.children.filter(object3d => {
        return !(object3d instanceof THREE.Light);
    })
}

function addPhone() {
    loader.load('./modules/phone-white.glb', function (gltf) {
        ignoreLights(gltf.scene);
        scene.add(gltf.scene);
    });
}

function addQQMusicModel() {
    loader.load('./modules/qqmusic.glb', function (gltf) {
        ignoreLights(gltf.scene);
        const group = new THREE.Group();
        group.position.x = -0.95;
        group.position.z = 0.06;
        group.rotation.z = Math.PI / 4;
        group.add(gltf.scene);

        scene.add(group);
        gltf.scene.rotation.x = Math.PI / 2;
        gltf.scene.scale.x = .4;
        gltf.scene.scale.y = .4;
        gltf.scene.scale.z = .75;
    
    });
}


function addCD() {
    loader.load('./modules/cd.glb', function (gltf) {
        ignoreLights(gltf.scene);
        scene.add(gltf.scene);
        gltf.scene.scale.x = .5;
        gltf.scene.scale.y = .5;
        gltf.scene.scale.z = .6;
        // gltf.scene.scale.z = 1;
        gltf.scene.position.y = -0.45;
        gltf.scene.position.z = 0.02;
        cd = gltf.scene;
    });
}

//CD动画
function loopCD() {
    if (!runing) {
        return;
    }
    cd.rotation.z -= 0.01;
}

function addMusicBox() {
    loader.load('./modules/musicbox.glb', function (gltf) {
        ignoreLights(gltf.scene);
        const musicBox = gltf.scene;
        musicBox.rotation.x = -Math.PI / 2;
        scene.add(musicBox);
        musicBox.scale.x = .1;
        musicBox.scale.y = .1;
        musicBox.scale.z = .2;
        musicBox.position.x = -0.35;
        musicBox.position.y = -0.50;
        musicBox.position.z = 0.16

        const musicBox1 = musicBox.clone();
        musicBox1.position.x = -musicBox1.position.x;
        scene.add(musicBox1);
        musicBoxList.push(musicBox, musicBox1);

    });
}

//音响动画
function loopMusicBox() {
    if (!runing) {
        return;
    }
    musicBoxList.forEach(group => {
        if (group._scaleZ === undefined) {
            group._scaleZ = 1;
        }
        if (group._scaleZ > 1.4) {
            group._scaleZ = 1;
        }
        group._scaleZ += 0.1;
        const children = group.children;
        children.forEach(child => {
            const len = child.children.length;
            child.children.slice(0, len - 2).forEach(object3d => {
                object3d.scale.z = group._scaleZ;
            })
        });
    });
}

function initVisualizer(audioBuffer) {

    //创建 AudioBufferSourceNode
    var source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Must invoked right after click event
    source.start(0);
    // AudioContext的createAnalyser()方法能创建一个AnalyserNode，可以用来获取音频时间和频率数据，以及实现数据可视化。
    var analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 4096;

    var gainNode = audioContext.createGain();
    gainNode.gain.value = 1;
    source.connect(gainNode);
    gainNode.connect(analyzer);
    // Connect the source to be analysed
    analyzer.connect(audioContext.destination);

    // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
    var frequencyBinCount = analyzer.frequencyBinCount;
    var dataArray = new Uint8Array(frequencyBinCount);


    //循环读取音频的数据
    function update() {
        analyzer.getByteFrequencyData(dataArray);
        const scale = 1;
        var dataProvider = [];
        let isEmpty = true;

        //将音频的数据分布到50x50个格子上
        for (var i = 0; i < size * size; i++) {
            var x = i % size;
            var y = Math.floor(i / size);
            var dx = x - size / 2;
            var dy = y - size / 2;

            var angle = Math.atan2(dy, dx);
            if (angle < 0) {
                angle = Math.PI * 2 + angle;
            }
            var dist = Math.sqrt(dx * dx + dy * dy);
            var idx = Math.min(
                frequencyBinCount - 1, Math.round(angle / Math.PI / 2 * 60 + dist * 60) + 100
            );

            var val = Math.pow(dataArray[idx] / 100, 3);
            dataProvider.push([x, y, Math.max(val, 0.1)]);
            if (val > 0) {
                isEmpty = false;
            }
        }
        runing = !isEmpty;
        var musdata = [];
        let min = Infinity, max = -Infinity;

        //组装每个格子的位置和高度数据
        for (var i = 0; i < dataProvider.length; i++) {
            var d = dataProvider[i];
            var x = d[0],
                y = d[1],
                z = d[2];
            var px = -1 + x * offsetX;
            var py = -1 + y * offsetY;
            var height = z * scale;
            min = Math.min(height, min);
            max = Math.max(height, max);
            if (height < 0.650 || musdata.length > 2000) continue;
            musdata.push({
                value: [px, py, height]
            });
        }
        // console.log(min, max);
        //利用柱子可视化音频数据
        addBar(musdata);
        updateId = setTimeout(update, UPDATE_DURATION);
    }
    update();
}

function addBar(data) {
    clear();
    bars = data.map(function (d) {
        const [x, y, z] = d.value;
        const material = getMaterial(z);
        const bar = new THREE.Mesh(boxGeometry, material);
        bar.scale.z = z;
        bar.position.x = x + musicCenter[0];
        bar.position.y = y + musicCenter[1];
        scene.add(bar);
        return bar;
    });
}

function getColor(z) {
    if (z <= 0.3) {
        return color[0];
    }
    if (z > 0.3 && z <= 1.2) {
        return color[1];
    }
    if (z > 1.2 && z <= 2) {
        return color[2];
    }
    if (z > 2 && z <= 3) {
        return color[3];
    }
    return color[4];
}

function getMaterial(z) {
    var color = getColor(z);
    var material = materialMap[color];
    if (!material) {
        material = materialMap[color] = new THREE.MeshStandardMaterial({
            color,
            roughness: 0,
            metalness: 0,
            // blending:  THREE.AdditiveBlending 
        });
    }
    return material;
}

function clear() {
    if (bars) {
        bars.forEach(bar => {
            scene.remove(bar);
        });
        bars = [];
    }
}

function iniGUI() {
    const gui = new window.dat.GUI({
        width: 350
    });
    gui.addColor(params, 'groundColor').onChange(() => {
        ground.material.color.setStyle(params.groundColor);
    })
}

scene = init();
addPhone();
addQQMusicModel();
addCD();
addMusicBox();
iniGUI();
const musicFileDom = document.querySelector('#musicfile');
musicFileDom.addEventListener('change', () => {
    if (audioContext) {
        audioContext.close();
    }
    audioContext = new AudioContext();
    clear();
    const fileRender = new FileReader();
    fileRender.onload = () => {
        if (updateId) {
            clearTimeout(updateId);
        }
        audioContext.decodeAudioData(fileRender.result, initVisualizer);
        runing = true;
    };
    fileRender.readAsArrayBuffer(musicFileDom.files[0]);
})