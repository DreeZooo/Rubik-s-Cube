const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight - 100);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const cubeSize = 1;
const gap = 0.01;
const cubes = [];
const initialCubeStates = [];

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const materials = [
                new THREE.MeshStandardMaterial({ color: 0x0000FF }), // Face droite (X+)
                new THREE.MeshStandardMaterial({ color: 0x00FF00 }), // Face gauche (X-)
                new THREE.MeshStandardMaterial({ color: 0xFFFF00 }), // Face haute (Y+)
                new THREE.MeshStandardMaterial({ color: 0xFFFFFF }), // Face basse (Y-)
                new THREE.MeshStandardMaterial({ color: 0xFF0000 }), // Face avant (Z+)
                new THREE.MeshStandardMaterial({ color: 0xff8000 })  // Face arrière (Z-)
            ];
            const cube = new THREE.Mesh(geometry, materials);
            cube.position.set(x * (cubeSize + gap), y * (cubeSize + gap), z * (cubeSize + gap));
            scene.add(cube);
            cubes.push(cube);

            initialCubeStates.push({
                position: cube.position.clone(),
                rotation: cube.rotation.clone(),
                materials: materials.map(m => m.clone())
            });
        }
    }
}

camera.position.z = 5;

function rotateLayer(axis, index, angle) {
    const rotatingCubes = cubes.filter(cube => Math.round(cube.position[axis]) === index);
    const group = new THREE.Group();
    rotatingCubes.forEach(cube => {
        scene.remove(cube);
        group.add(cube);
    });
    scene.add(group);

    gsap.to(group.rotation, {
        duration: 0.5,
        [axis]: "+=" + angle,
        ease: "power2.inOut",
        onComplete: () => {
            rotatingCubes.forEach(cube => {
                cube.updateMatrixWorld();
                const newPosition = new THREE.Vector3();
                newPosition.setFromMatrixPosition(cube.matrixWorld);
                cube.position.copy(newPosition);
                cube.rotation.set(0, 0, 0);
                group.remove(cube);
                scene.add(cube);
                reorderMaterials(cube, axis, angle);
            });
            scene.remove(group);
        }
    });
}

function reorderMaterials(cube, axis, angle) {
    const materials = cube.material;
    const newMaterials = materials.slice();

    if (axis === 'x') {
        [newMaterials[2], newMaterials[3], newMaterials[4], newMaterials[5]] =
            angle > 0 ? [newMaterials[5], newMaterials[4], newMaterials[2], newMaterials[3]]
                      : [newMaterials[4], newMaterials[5], newMaterials[3], newMaterials[2]];
    } else if (axis === 'y') {
        [newMaterials[0], newMaterials[1], newMaterials[4], newMaterials[5]] =
            angle > 0 ? [newMaterials[4], newMaterials[5], newMaterials[1], newMaterials[0]]
                      : [newMaterials[5], newMaterials[4], newMaterials[0], newMaterials[1]];
    } else if (axis === 'z') {
        [newMaterials[0], newMaterials[1], newMaterials[2], newMaterials[3]] =
            angle > 0 ? [newMaterials[3], newMaterials[2], newMaterials[0], newMaterials[1]]
                      : [newMaterials[2], newMaterials[3], newMaterials[1], newMaterials[0]];
    }

    cube.material = newMaterials;
}

function shuffleCube() {
    const moves = [
        { axis: 'x', index: 1, angle: Math.PI / 2 },
        { axis: 'x', index: -1, angle: -Math.PI / 2 },
        { axis: 'y', index: 1, angle: Math.PI / 2 },
        { axis: 'y', index: -1, angle: -Math.PI / 2 },
        { axis: 'z', index: 1, angle: Math.PI / 2 },
        { axis: 'z', index: -1, angle: -Math.PI / 2 }
    ];

    let delay = 0;
    for (let i = 0; i < 20; i++) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        setTimeout(() => rotateLayer(move.axis, move.index, move.angle), delay);
        delay += 600;
    }
}

function resetCube() {
    cubes.forEach((cube, index) => {
        cube.position.copy(initialCubeStates[index].position);
        cube.rotation.copy(initialCubeStates[index].rotation);
        cube.material = initialCubeStates[index].materials.map(m => m.clone());
    });
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
