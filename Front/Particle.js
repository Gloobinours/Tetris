const colorPalette = [
  "#fc5c65", "#fd9644", "#fed330", "#26de81", "#2bcbba",
  "#eb3b5a", "#fa8231", "#f7b731", "#20bf6b", "#0fb9b1",
  "#45aaf2", "#4b7bec", "#a55eea", "#d1d8e0", "#778ca3",
  "#2d98da", "#3867d6", "#8854d0", "#a5b1c2", "#4b6584"
];
const container = document.getElementById('particle-container');
const particleTiming = {
  duration: 5000,
  iterations: Infinity,
}
const scaler = 5

/**
 * Generate an animation using css keyframes
 * @returns {array} objects representing keyframes
 */
function generateAnimation() {
  let particleFloating = [
    {
      transform: `translate3d(${Math.floor(Math.random() * 90)}px,` + 
                `${Math.floor(Math.random()*90)}px,` +
                `${Math.floor(Math.random() * 100)}px)`,
      opacity: `0%`
    },
    {
      opacity: `100%`
    },
    {
      opacity: `0`
    }
  ]
  return particleFloating
}

/**
 * Generate 20 particles using all colors from {@link colorPalette},
 * give each particle a random size from 5 to 10 pixels
 */
function generateParticles() {
  for (let i = 0; i < colorPalette.length*scaler; i++) {
    let particleSize = Math.random() * 5 + 5;
    let particle = document.createElement("div");
    let particleFloating = generateAnimation();
    particle.className = 'particle';
    particle.id = i;
    container.appendChild(particle);
    document.getElementById(i).style.width = `${particleSize}px`;
    document.getElementById(i).style.height = `${particleSize}px`;
    document.getElementById(i).style.background = `${colorPalette[i]}`;
    document.getElementById(i).style.left = `${Math.random() * 100 -10}%`;
    document.getElementById(i).style.top = `${Math.random() * 100 -10}%`;
    document.getElementById(i).animate(particleFloating, particleTiming);
  }
}

let an = generateAnimation()
/**
 * Delete previous particles and animation
 * and regenerate new particles
 */
setInterval((an) => {
  while(container.firstChild) {
    container.removeChild(container.firstChild)
  }
  generateParticles();
  for (let i = 0; i < colorPalette.length*scaler; i++) {
    document.getElementById(i).animate(an, particleTiming);
  }
}, particleTiming.duration);