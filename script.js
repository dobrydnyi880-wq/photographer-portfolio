document.addEventListener('DOMContentLoaded', () => {
    // --- Three.js Setup ---
    const canvas = document.querySelector('canvas.webgl');
    const scene = new THREE.Scene();

    // Add Fog for depth
    scene.fog = new THREE.FogExp2(0x050505, 0.05);

    // Sizes
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 10;
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- 3D Objects: The Globe ---
    // Particles (Stars/Dust)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        // Spread particles around
        posArray[i] = (Math.random() - 0.5) * 25;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Wireframe Globe
    const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(globe);

    // Inner Solid Globe to hide back wires
    const innerSphereGeo = new THREE.SphereGeometry(2.95, 32, 32);
    const innerSphereMat = new THREE.MeshBasicMaterial({
        color: 0x050505
    });
    const innerGlobe = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    scene.add(innerGlobe);

    // Group to hold globe and inner globe for animation
    const globeGroup = new THREE.Group();
    globeGroup.add(globe);
    globeGroup.add(innerGlobe);
    // Position slightly to the right for the hero section
    globeGroup.position.x = 2;
    scene.add(globeGroup);

    // --- Lights (Not strictly needed for BasicMaterial, but good if we upgrade to Standard) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // --- Window Resize ---
    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // --- Mouse Interaction (Parallax) ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Target for smooth mouse follow
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Auto rotation
        globeGroup.rotation.y += 0.002;
        particlesMesh.rotation.y = -0.0005 * elapsedTime;

        // Mouse Parallax Effect
        globeGroup.rotation.y += 0.05 * (targetX - globeGroup.rotation.y);
        globeGroup.rotation.x += 0.05 * (targetY - globeGroup.rotation.x);

        particlesMesh.position.x += 0.05 * (targetX * 2 - particlesMesh.position.x);
        particlesMesh.position.y += 0.05 * (-targetY * 2 - particlesMesh.position.y);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };

    tick();

    // --- GSAP ScrollTrigger Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation
    const tl = gsap.timeline();
    tl.from('.hero-title', { opacity: 0, y: 50, duration: 1, ease: 'power3.out', delay: 0.5 })
      .from('.hero-subtitle', { opacity: 0, y: 20, duration: 1, ease: 'power3.out' }, "-=0.5")
      .from('.scroll-indicator', { opacity: 0, duration: 1 }, "-=0.5");

    // Scroll Animations for 3D Object
    // Section 2: Destinations
    gsap.to(globeGroup.position, {
        x: -2, // Move left
        z: -2, // Move back slightly
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '#destinations',
            start: 'top bottom',
            end: 'center center',
            scrub: true
        }
    });

    gsap.to(globeGroup.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '#destinations',
            start: 'top bottom',
            end: 'center center',
            scrub: true
        }
    });

    // Section 3: Experience
    gsap.to(globeGroup.position, {
        x: 0, // Move to center
        y: -1, // Move down
        z: 3, // Move closer
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '#experience',
            start: 'top bottom',
            end: 'center center',
            scrub: true
        }
    });

    // Text Fade Ins on Scroll
    gsap.utils.toArray('.section').forEach((section, i) => {
        if(i === 0) return; // Skip hero

        gsap.from(section.querySelector('.content'), {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: "play none none reverse"
            }
        });
    });
});
