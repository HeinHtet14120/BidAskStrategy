import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import '../index.css';

const TextCursor = ({
  icons = ['⚠️'],
  delay = 0.01,
  radius = 80,
  spawnInterval = 200,
  randomFloat = true,
  exitDuration = 0.5,
  removalInterval = 30,
  maxPoints = 8,
  minDistance = 30
}) => {
  const [points, setPoints] = useState([]);
  const containerRef = useRef(null);
  const lastSpawnTimeRef = useRef(0);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const idCounter = useRef(0);

  const getRandomIcon = () => {
    if (Array.isArray(icons) && icons.length > 0) {
      const selectedIcon = icons[Math.floor(Math.random() * icons.length)];
      // If it's a React element, clone it with a key to avoid warnings
      if (typeof selectedIcon === 'object' && selectedIcon !== null && 'type' in selectedIcon) {
        return selectedIcon;
      }
      return selectedIcon;
    }
    return icons;
  };

  const handleMouseMove = e => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const now = Date.now();
    const timeSinceLastSpawn = now - lastSpawnTimeRef.current;
    const distanceFromLast = Math.sqrt(
      Math.pow(mouseX - lastMousePosRef.current.x, 2) + 
      Math.pow(mouseY - lastMousePosRef.current.y, 2)
    );

    // Spawn new icon if enough time has passed and mouse moved enough
    if (timeSinceLastSpawn >= spawnInterval && distanceFromLast >= minDistance) {
      // Generate random position around cursor
      const angle = Math.random() * Math.PI * 2;
      const distance = radius * (0.5 + Math.random() * 0.5); // Random distance between 50% and 100% of radius
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      const newPoint = {
        id: idCounter.current++,
        x: mouseX + offsetX,
        y: mouseY + offsetY,
        icon: getRandomIcon(),
        angle: (Math.random() - 0.5) * 360,
        randomX: randomFloat ? (Math.random() - 0.5) * 20 : 0,
        randomY: randomFloat ? (Math.random() - 0.5) * 20 : 0,
        randomRotate: randomFloat ? (Math.random() - 0.5) * 30 : 0
      };

      setPoints(prev => {
        const newPoints = [...prev, newPoint];
        if (newPoints.length > maxPoints) {
          return newPoints.slice(newPoints.length - maxPoints);
        }
        return newPoints;
      });

      lastSpawnTimeRef.current = now;
      lastMousePosRef.current = { x: mouseX, y: mouseY };
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        if (prev.length > 0) {
          // Remove oldest point
          return prev.slice(1);
        }
        return prev;
      });
    }, removalInterval);
    return () => clearInterval(interval);
  }, [removalInterval]);

  return (
    <div ref={containerRef} className="text-cursor-container">
      <div className="text-cursor-inner">
        <AnimatePresence>
          {points.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.5, rotate: item.angle }}
              animate={{
                opacity: 1,
                scale: 1,
                x: randomFloat ? [0, item.randomX || 0, 0] : 0,
                y: randomFloat ? [0, item.randomY || 0, 0] : 0,
                rotate: randomFloat 
                  ? [item.angle, item.angle + (item.randomRotate || 0), item.angle] 
                  : item.angle
              }}
              exit={{ opacity: 0, scale: 0, rotate: item.angle + 180 }}
              transition={{
                opacity: { duration: exitDuration, ease: 'easeOut', delay },
                scale: { duration: 0.2, ease: 'easeOut' },
                ...(randomFloat && {
                  x: {
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'mirror'
                  },
                  y: {
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'mirror'
                  },
                  rotate: {
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'mirror'
                  }
                })
              }}
              className="text-cursor-item"
              style={{ 
                left: item.x, 
                top: item.y,
                transform: 'translate(-50%, -50%)'
              }}>
              {item.icon}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TextCursor;
