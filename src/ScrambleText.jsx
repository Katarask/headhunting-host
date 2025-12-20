import { useEffect, useRef, useCallback } from 'react';

/**
 * ScrambleText Component - Anduril-Style Text Scramble Effect
 * Based on yomotsu/ScrambleText
 * 
 * Features:
 * - Scrambles in AND out
 * - Respects HTML tags and spaces
 * - Configurable character set
 * - FPS control for smooth animation
 */

const DEFAULT_CHARS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '!', '#', '$', '%', '&', ':', ';', '?', '@', '[', ']', '^', '_'
];

// Split string into array of { type, content } objects
function splitText(string) {
  const array = [];
  const tag = /^(\s*)?<\/?[a-z](.*?)>(\s*)?/i;
  const space = /^\s+/;

  string = string.replace(/^\s+/, '').replace(/\s+$/, '');

  while (string.length !== 0) {
    const matchTag = string.match(tag);
    if (matchTag) {
      array.push({ type: 'tag', content: matchTag[0] });
      string = string.replace(matchTag[0], '');
      continue;
    }

    const matchSpace = string.match(space);
    if (matchSpace) {
      array.push({ type: 'space', content: ' ' });
      string = string.replace(matchSpace[0], '');
      continue;
    }

    array.push({ type: 'character', content: string[0] });
    string = string.slice(1);
  }

  return array;
}

// Get random character from charset
function getRandChar(chars) {
  const randNum = Math.floor(Math.random() * chars.length);
  const lowChoice = -0.5 + Math.random();
  const char = chars[randNum];
  return lowChoice < 0 ? char.toLowerCase() : char;
}

// Shuffle text array based on current position
function shuffleText(contents, chars, position, direction = 'in') {
  const textArray = [];

  for (let i = 0; i < contents.length; i++) {
    // Always preserve HTML tags
    if (contents[i].type === 'tag') {
      textArray.push(contents[i].content);
      continue;
    }

    // Always preserve spaces
    if (contents[i].type === 'space' || /\s/.test(contents[i].content)) {
      textArray.push(contents[i].content);
      continue;
    }

    if (direction === 'in') {
      // Revealing: show real char if position passed, else scramble
      if (i < position) {
        textArray.push(contents[i].content);
      } else {
        textArray.push(getRandChar(chars));
      }
    } else {
      // Hiding: scramble if position passed, else show real char
      if (i < position) {
        textArray.push(getRandChar(chars));
      } else {
        textArray.push(contents[i].content);
      }
    }
  }

  return textArray;
}

const ScrambleText = ({
  text,
  isActive = true,
  delay = 0,
  speed = 30,           // ms per character reveal
  fps = 60,
  chars = DEFAULT_CHARS,
  scrambleOut = false,  // Also scramble out when isActive becomes false
  onComplete,
  className = '',
  style = {},
  as: Component = 'span'
}) => {
  const elRef = useRef(null);
  const stateRef = useRef({
    running: false,
    direction: 'in',
    position: 0,
    startTime: 0,
    elapsedTime: 0,
    contents: [],
    animFrameId: null,
    hasCompletedIn: false,
  });

  const animate = useCallback(() => {
    const state = stateRef.current;
    const el = elRef.current;
    if (!el || !state.running) return;

    const now = Date.now();
    const elapsedTime = now - state.startTime;
    const deltaTime = elapsedTime - state.elapsedTime;
    const needsUpdate = 1000 / fps <= deltaTime;

    if (!needsUpdate) {
      state.animFrameId = requestAnimationFrame(animate);
      return;
    }

    state.elapsedTime = elapsedTime;
    state.position = Math.floor(state.elapsedTime / speed);

    // Check if animation complete
    if (state.position >= state.contents.length) {
      state.running = false;
      
      if (state.direction === 'in') {
        // Finished revealing - show final text
        el.innerHTML = state.contents.map(c => c.content).join('');
        state.hasCompletedIn = true;
        if (onComplete) onComplete('in');
      } else {
        // Finished hiding - show scrambled or empty
        el.innerHTML = shuffleText(state.contents, chars, state.contents.length, 'out').join('');
        state.hasCompletedIn = false;
        if (onComplete) onComplete('out');
      }
      return;
    }

    state.animFrameId = requestAnimationFrame(animate);

    const textArray = shuffleText(state.contents, chars, state.position, state.direction);
    el.innerHTML = textArray.join('');
  }, [fps, speed, chars, onComplete]);

  const startAnimation = useCallback((direction) => {
    const state = stateRef.current;
    const el = elRef.current;
    if (!el) return;

    // Cancel any existing animation
    if (state.animFrameId) {
      cancelAnimationFrame(state.animFrameId);
    }

    state.contents = splitText(text);
    state.direction = direction;
    state.position = 0;
    state.startTime = Date.now();
    state.elapsedTime = 0;
    state.running = true;

    // Set initial state
    if (direction === 'in') {
      // Start fully scrambled
      el.innerHTML = shuffleText(state.contents, chars, 0, 'in').join('');
    } else {
      // Start with real text (will scramble out)
      el.innerHTML = state.contents.map(c => c.content).join('');
    }

    animate();
  }, [text, chars, animate]);

  // Handle isActive changes
  useEffect(() => {
    const state = stateRef.current;
    
    if (isActive) {
      // Start reveal animation after delay
      const timeoutId = setTimeout(() => {
        startAnimation('in');
      }, delay);
      return () => clearTimeout(timeoutId);
    } else if (scrambleOut && state.hasCompletedIn) {
      // Start hide animation
      startAnimation('out');
    }
  }, [isActive, delay, scrambleOut, startAnimation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const state = stateRef.current;
      if (state.animFrameId) {
        cancelAnimationFrame(state.animFrameId);
      }
    };
  }, []);

  // Set initial text (scrambled if should animate, real if not)
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    
    if (!isActive) {
      // Show scrambled text initially if not active
      const contents = splitText(text);
      el.innerHTML = shuffleText(contents, chars, 0, 'in').join('');
    }
  }, []);

  return (
    <Component
      ref={elRef}
      className={className}
      style={style}
    >
      {text}
    </Component>
  );
};

export default ScrambleText;
