<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rubik's Cube en Three.js</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        // Initialisation de la scène
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Création du Rubik's Cube
        const cubeSize = 1;
        const gap = 0.05;
        const cubes = [];

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                    const materials = [
                        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Rouge
                        new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Vert
                        new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Bleu
                        new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Jaune
                        new THREE.MeshBasicMaterial({ color: 0xffa500 }), // Orange
                        new THREE.MeshBasicMaterial({ color: 0xffffff })  // Blanc
                    ];
                    const cube = new THREE.Mesh(geometry, materials);
                    cube.position.set(x * (cubeSize + gap), y * (cubeSize + gap), z * (cubeSize + gap));
                    scene.add(cube);
                    cubes.push(cube);
                }
            }
        }

        camera.position.z = 5;

        // Animation et rotation avec la souris
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        document.addEventListener("mousedown", (event) => {
            isDragging = true;
        });

        document.addEventListener("mousemove", (event) => {
            if (isDragging) {
                const deltaX = event.clientX - previousMousePosition.x;
                const deltaY = event.clientY - previousMousePosition.y;
                scene.rotation.y += deltaX * 0.01;
                scene.rotation.x += deltaY * 0.01;
            }
            previousMousePosition = { x: event.clientX, y: event.clientY };
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    </script>
</body>
</html>
