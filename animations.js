document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.fibonacci-dots');
  const dotCount = 150; // Increase the number of dots for a denser pattern

  const fibonacci = (n) => {
    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
      sequence[i] = sequence[i - 1] + sequence[i - 2];
    }
    return sequence;
  };

  const fibSequence = fibonacci(dotCount);

  fibSequence.forEach((num, index) => {
    const angle = (index * 137.5) * (Math.PI / 180);
    const radius = 1 * Math.sqrt(num); 
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;

    container.appendChild(dot);
  });
});
