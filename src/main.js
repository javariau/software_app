import * as THREE from 'three';
import './style.css';
import './pages.css';
import './marketing.css';

const container = document.querySelector('#three-scene');
if (container) {
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(0, 1.3, 7.2);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const group = new THREE.Group();
scene.add(group);
const cyan = new THREE.MeshBasicMaterial({ color: 0x52e9e5 });
const blue = new THREE.MeshBasicMaterial({ color: 0x2376ed });
const soft = new THREE.MeshBasicMaterial({ color: 0x83d8ff, transparent: true, opacity: 0.42 });
const nodeGeo = new THREE.SphereGeometry(0.065, 8, 8);
const nodePoints = [];
for (let layer = 0; layer < 4; layer++) {
  const y = (layer - 1.5) * 0.82;
  const count = layer % 2 ? 4 : 3;
  for (let index = 0; index < count; index++) {
    const x = (index - (count - 1) / 2) * 1.38 + (layer % 2 ? 0.35 : -0.15);
    const z = Math.sin(index * 2.1 + layer) * 0.32;
    const mesh = new THREE.Mesh(nodeGeo, layer % 2 ? cyan : blue);
    mesh.position.set(x, y, z);
    group.add(mesh); nodePoints.push(mesh.position.clone());
  }
}
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4ddfe4, transparent: true, opacity: 0.48 });
for (let i = 0; i < nodePoints.length; i++) {
  for (let j = i + 1; j < nodePoints.length; j++) {
    const a = nodePoints[i], b = nodePoints[j];
    if (a.distanceTo(b) < 1.75 && Math.abs(a.y - b.y) < 1.25) {
      const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
      group.add(new THREE.Line(geometry, lineMaterial));
    }
  }
}
const ring = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.012, 6, 80), soft);
ring.rotation.x = Math.PI / 2.15; ring.position.y = 0.1; group.add(ring);
const halo = new THREE.Mesh(new THREE.SphereGeometry(2.28, 20, 20), new THREE.MeshBasicMaterial({ color: 0x0c5ca0, transparent: true, opacity: 0.045, wireframe: true }));
group.add(halo);

let targetX = 0;
let targetY = 0;
window.addEventListener('pointermove', (event) => { targetX = (event.clientX / window.innerWidth - 0.5) * 0.32; targetY = (event.clientY / window.innerHeight - 0.5) * 0.2; }, { passive: true });
function animate() { requestAnimationFrame(animate); group.rotation.y += (targetX - group.rotation.y) * 0.018 + 0.001; group.rotation.x += (targetY - group.rotation.x) * 0.018; group.position.y = Math.sin(Date.now() * 0.0007) * 0.05; renderer.render(scene, camera); }
animate();
const resize = () => {
  const bounds = container.getBoundingClientRect();
  const width = bounds.width || window.innerWidth * 0.9;
  const height = bounds.height || (window.innerWidth <= 800 ? 380 : Math.min(window.innerHeight * 0.68, 600));
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  renderer.domElement.style.width = `${width}px`;
  renderer.domElement.style.height = `${height}px`;
};
window.addEventListener('resize', resize);
requestAnimationFrame(resize);
}

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');
if (nav && !nav.querySelector('a[href="/"]')) {
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'Home';
  if (window.location.pathname === '/') homeLink.classList.add('active');
  nav.prepend(homeLink);
}
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!open)); nav.classList.toggle('open', !open); });
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }));
if (window.location.pathname.endsWith('/services.html')) {
  const services = document.querySelector('.page-services');
  if (services) {
    const detail = document.createElement('div');
    detail.className = 'service-detail-grid';
    detail.innerHTML = '<div><span>WHAT YOU GET</span><h3>Clear scope, thoughtful design, production-ready delivery.</h3></div><div><p>Mulai dari workshop singkat, kami bantu memilih fitur yang paling penting, menyusun pengalaman pengguna, lalu membangun produk yang siap dipakai.</p><a class="button button-primary" href="/contact.html">Konsultasikan kebutuhan <span>↗</span></a></div>';
    services.append(detail);
  }
}
const whatsappButton = document.createElement('a');
whatsappButton.className = 'floating-whatsapp';
whatsappButton.href = 'https://wa.me/6289529559852';
whatsappButton.target = '_blank';
whatsappButton.rel = 'noreferrer';
whatsappButton.setAttribute('aria-label', 'Chat WhatsApp softwareapp');
whatsappButton.innerHTML = '<span>WA</span><b>Chat dengan kami</b>';
document.body.append(whatsappButton);
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
