import { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, TrendingDown, BarChart3, X, Target, Waves, ChevronDown, Copy, Check, Coffee, X as XIcon } from 'lucide-react';
import {
  Tooltip,
  Button,
} from "@heroui/react";
import metlogo from '../assets/metlogo.png';
import luffy from '../assets/luggy.JPG';
import lplogo from '../assets/lplogo.png';

const Home = () => {
    const [mode, setMode] = useState('combined');
    const [binSteps, setBinSteps] = useState(20);
    const [coinAmount, setCoinAmount] = useState(5000);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentWave, setCurrentWave] = useState(0);
    const [waveDirection, setWaveDirection] = useState('forward');
    const [totalFees, setTotalFees] = useState(0);
    const [solPercent, setSolPercent] = useState(50); // SOL percentage for 'both' mode
    const [tokenPercent, setTokenPercent] = useState(50); // Token percentage for 'both' mode
    const [copiedSol, setCopiedSol] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const animationRef = useRef(null);
    const dropdownRef = useRef(null);
    const bounceStateRef = useRef({ phase: 0, goingOut: true, randomRanges: [] }); // For agents mode bouncing with random ranges

    // Get heading based on strategy mode
    const getStrategyHeading = () => {
      switch(mode) {
        case 'bid':
          return 'BID Strategy';
        case 'ask':
          return 'ASK Strategy';
        case 'both':
          return 'BID ASK Strategy';
        case 'spots':
          return 'SPOTS Strategy';
        case 'agents':
          return 'CURVE 4 Dummies';
        default:
          return 'CURVE 4 Dummies';
      }
    };

    const generateBars = useCallback(() => {
      return Array.from({ length: binSteps }, (_, index) => {
        let height;
        const progress = index / binSteps;
        
        switch(mode) {
          case 'combined':
            // eslint-disable-next-line no-case-declarations
            const midPoint = binSteps / 2;
            // eslint-disable-next-line no-case-declarations
            const distance = Math.abs(index - midPoint);
            height = 50 + Math.random() * 40 - distance * 1.5;
            break;
          case 'bid':
            height = 100 - (progress * 100);
            break;
          case 'ask':
            height = progress * 100;
            break;
          case 'both':
            // V-shape: lowest point shifts based on SOL/Token ratio
            // More SOL = midpoint shifts right (more buying power, higher price)
            // More Token = midpoint shifts left (more supply, lower price)
            // eslint-disable-next-line no-case-declarations
            const dynamicCenter = (solPercent / 100) * binSteps;
            // eslint-disable-next-line no-case-declarations
            const distanceFromDynamicCenter = Math.abs(index - dynamicCenter);
            // eslint-disable-next-line no-case-declarations
            const maxDistance = Math.max(dynamicCenter, binSteps - dynamicCenter);
            // V-shape: starts at 0 at dynamic center, increases to 100 on both sides
            height = (distanceFromDynamicCenter / maxDistance) * 100;
            break;
          case 'spots':
            // Straight/flat bars - all same height
            height = 70;
            break;
          case 'agents':
            // Curved strategy: Pyramid shape - lowest at both ends, highest in middle
            // Center point shifts based on SOL/Token ratio (like bid/ask)
            // More SOL = center shifts right (more buying power, higher price)
            // More Token = center shifts left (more supply, lower price)
            // eslint-disable-next-line no-case-declarations
            const agentsDynamicCenter = (solPercent / 100) * binSteps;
            // eslint-disable-next-line no-case-declarations
            const agentsDistanceFromCenter = Math.abs(index - agentsDynamicCenter);
            // eslint-disable-next-line no-case-declarations
            const agentsMaxDistance = Math.max(agentsDynamicCenter, binSteps - agentsDynamicCenter);
            // Pyramid: highest at dynamic center (100%), lowest at edges (0%)
            // Adjust curve intensity based on SOL/Token ratio
            // eslint-disable-next-line no-case-declarations
            const agentsCurveIntensity = 0.5 + (solPercent / 100) * 0.5; // 0.5 to 1.0
            // Inverted: closer to dynamic center = higher, farther = lower
            // eslint-disable-next-line no-case-declarations
            const agentsNormalizedHeight = 1 - (agentsDistanceFromCenter / agentsMaxDistance);
            height = agentsNormalizedHeight * 100 * agentsCurveIntensity;
            break;
          default:
            height = 60;
        }
        
        return {
          id: index,
          height: Math.max(0, Math.min(100, height)),
          liquidity: (coinAmount / binSteps)
        };
      });
    }, [mode, binSteps, coinAmount, solPercent]);
  
    const [bars, setBars] = useState(() => generateBars());
  
    useEffect(() => {
      setBars(generateBars());
    }, [generateBars]);
  
    // Set initial wave position based on mode
    useEffect(() => {
      if (!isAnimating) {
        if (mode === 'bid') {
          setCurrentWave(binSteps - 1); // Start from right for bid
          setWaveDirection('backward'); // Move left first
        } else if (mode === 'both') {
          // Start from dynamic center based on SOL percentage
          const dynamicCenter = Math.floor((solPercent / 100) * binSteps);
          setCurrentWave(dynamicCenter); // Start from dynamic center for both
          setWaveDirection('forward'); // Move right first
        } else if (mode === 'spots') {
          // Start from spot center based on SOL percentage
          const spotCenter = Math.floor((solPercent / 100) * binSteps);
          setCurrentWave(spotCenter);
          setWaveDirection('forward'); // Move right first
        } else if (mode === 'agents') {
          // Start from dynamic center based on SOL percentage (like both mode)
          const agentsDynamicCenter = Math.floor((solPercent / 100) * binSteps);
          setCurrentWave(agentsDynamicCenter); // Start from dynamic center
          setWaveDirection('forward'); // Move right first
          bounceStateRef.current = { phase: 0, goingOut: true, randomRanges: [] }; // Reset bounce state
        } else {
          setCurrentWave(0); // Start from left for ask/combined
          setWaveDirection('forward'); // Move right first
        }
      }
    }, [mode, binSteps, isAnimating, solPercent, tokenPercent]);
  
    const getBarColor = (index) => {
      const dynamicCenter = (mode === 'both' || mode === 'agents') ? (solPercent / 100) * binSteps : binSteps / 2;
      
      if (!isAnimating) {
        switch(mode) {
          case 'bid': return '#F97316';
          case 'ask': return '#A855F7';
          case 'both':
            // Left side (Bid - SOL to buy token) = Orange, Right side (Ask - Token to sell) = Purple
            return index < dynamicCenter ? '#F97316' : '#A855F7';
          case 'spots':
            // All bars are blue for spots mode
            return '#4EABD0';
          case 'agents':
            // Curved strategy: Gradient from orange (left/bid) to purple (right/ask)
            // Based on position relative to dynamic center (like both mode)
            // eslint-disable-next-line no-case-declarations
            const agentProgress = index / binSteps; // 0 to 1 across all bins
            // Orange (#F97316 = rgb(249, 115, 22)) to Purple (#A855F7 = rgb(168, 85, 247))
            // eslint-disable-next-line no-case-declarations
            const r = Math.floor(249 + (168 - 249) * agentProgress);
            // eslint-disable-next-line no-case-declarations
            const g = Math.floor(115 + (85 - 115) * agentProgress);
            // eslint-disable-next-line no-case-declarations
            const b = Math.floor(22 + (247 - 22) * agentProgress);
            return `rgb(${r}, ${g}, ${b})`;
          default: return '#8B5CF6';
        }
      }
  
      // Current wave position - bright yellow
      if (index === currentWave) return '#FCD34D';
      
      // Bid mode: starts from right, paints green going left, unpaints going right
      if (mode === 'bid') {
        // Bins on the RIGHT are painted/unpainted based on currentWave position
        if (index > currentWave) return '#4267B2';
      } else if (mode === 'both') {
        // Both mode: animation behavior based on which side of dynamic center
        if (index < dynamicCenter) {
          // Left side (Bid): paint blue gradually from center (lowest) outward as wave moves left
          // When wave is on left side (currentWave < dynamicCenter), paint from wave position to center
          if (currentWave < dynamicCenter && index >= currentWave && index < dynamicCenter) return '#4267B2';
        } else {
          // Right side (Ask): paint blue as wave passes
          if (index >= dynamicCenter && index <= currentWave) return '#4267B2';
        }
      } else if (mode === 'spots') {
        // Spots mode: purple animation going left to right
        if (index < currentWave) return '#563AC9';
      } else if (mode === 'agents') {
        // Agents mode: blue spreads from center outward
        // The blue color radiates from the center point as the wave moves
        const center = Math.floor((solPercent / 100) * binSteps);
        // Blue spreads from center - paint bins that are between center and current wave position
        const isBetweenCenterAndWave = 
          (currentWave >= center && index >= center && index <= currentWave) ||
          (currentWave <= center && index <= center && index >= currentWave);
        
        if (isBetweenCenterAndWave) {
          return '#4267B2';
        }
      } else {
        // Ask/Combined: starts from left, paints right to left  
        // Bins on the LEFT are painted/unpainted based on currentWave position
        if (index < currentWave) return '#4267B2';
      }
      
      // Default colors for bins that haven't been covered
      switch(mode) {
        case 'bid': return '#F97316';
        case 'ask': return '#A855F7';
        case 'both':
          return index < dynamicCenter ? '#F97316' : '#A855F7';
        case 'spots':
          // All bars are blue for spots mode
          return '#4EABD0';
        case 'agents':
          // Curved strategy: Gradient from orange (left/bid) to purple (right/ask)
          // Based on position relative to dynamic center (like both mode)
          // eslint-disable-next-line no-case-declarations
          const agentProgressDefault = index / binSteps; // 0 to 1 across all bins
          // Orange (#F97316 = rgb(249, 115, 22)) to Purple (#A855F7 = rgb(168, 85, 247))
          // eslint-disable-next-line no-case-declarations
          const rDefault = Math.floor(249 + (168 - 249) * agentProgressDefault);
          // eslint-disable-next-line no-case-declarations
          const gDefault = Math.floor(115 + (85 - 115) * agentProgressDefault);
          // eslint-disable-next-line no-case-declarations
          const bDefault = Math.floor(22 + (247 - 22) * agentProgressDefault);
          return `rgb(${rDefault}, ${gDefault}, ${bDefault})`;
        default: return '#8B5CF6';
      }
    };
  
    useEffect(() => {
      if (!isAnimating) return;
  
      const animate = () => {
        setCurrentWave(prev => {
          // Special bouncing animation for agents mode with random slot-like percentages
          if (mode === 'agents') {
            const center = Math.floor((solPercent / 100) * binSteps);
            const maxRight = binSteps - 1;
            const maxLeft = 0;
            const maxRightDistance = maxRight - center;
            const maxLeftDistance = center - maxLeft;
            
            // Get current bounce state
            let { phase, goingOut, randomRanges } = bounceStateRef.current;
            
            // Generate random ranges like a slot machine when we need new ones
            if (randomRanges.length === 0 || phase >= randomRanges.length) {
              // Generate random percentages (10% to 80% range for variety)
              const randomRightPercent = 0.1 + Math.random() * 0.7; // 10% to 80%
              const randomLeftPercent = 0.1 + Math.random() * 0.7; // 10% to 80%
              
              // Alternate between right and left, creating random patterns
              randomRanges = [
                { direction: 'right', range: Math.floor(maxRightDistance * randomRightPercent) },
                { direction: 'left', range: Math.floor(maxLeftDistance * randomLeftPercent) },
                { direction: 'right', range: Math.floor(maxRightDistance * (0.1 + Math.random() * 0.7)) },
                { direction: 'left', range: Math.floor(maxLeftDistance * (0.1 + Math.random() * 0.7)) },
                { direction: 'right', range: Math.floor(maxRightDistance * (0.1 + Math.random() * 0.7)) }
              ];
              bounceStateRef.current.randomRanges = randomRanges;
            }
            
            const pattern = randomRanges[phase % randomRanges.length];
            const target = pattern.direction === 'right' 
              ? Math.min(center + pattern.range, maxRight)
              : Math.max(center - pattern.range, maxLeft);
            
            let next = prev;
            let newGoingOut = goingOut;
            let newPhase = phase;
            
            if (goingOut) {
              // Moving away from center
              if (pattern.direction === 'right') {
                next = Math.min(prev + 1, target);
                if (next >= target) {
                  newGoingOut = false; // Start coming back
                }
              } else {
                next = Math.max(prev - 1, target);
                if (next <= target) {
                  newGoingOut = false; // Start coming back
                }
              }
            } else {
              // Coming back to center
              if (prev > center) {
                next = Math.max(prev - 1, center);
              } else if (prev < center) {
                next = Math.min(prev + 1, center);
              } else {
                // Reached center, move to next phase with new random range
                newPhase = phase + 1;
                // Generate new random range for this phase if needed
                if (newPhase >= randomRanges.length) {
                  const randomPercent = 0.1 + Math.random() * 0.7;
                  const direction = newPhase % 2 === 0 ? 'right' : 'left';
                  const range = direction === 'right' 
                    ? Math.floor(maxRightDistance * randomPercent)
                    : Math.floor(maxLeftDistance * randomPercent);
                  randomRanges.push({ direction, range });
                  bounceStateRef.current.randomRanges = randomRanges;
                }
                newGoingOut = true;
                // Start moving in the new direction
                const nextPattern = randomRanges[newPhase % randomRanges.length];
                if (nextPattern.direction === 'right') {
                  next = center + 1;
                } else {
                  next = center - 1;
                }
              }
            }
            
            // Update bounce state
            bounceStateRef.current = { phase: newPhase, goingOut: newGoingOut, randomRanges };
            
            const fee = bars[next].liquidity * 0.003;
            setTotalFees(total => total + fee);
            return next;
          }
          
          // Original animation for other modes
          let next;
          if (waveDirection === 'forward') {
            next = prev + 1;
            if (next >= binSteps) {
              setWaveDirection('backward');
              return binSteps - 1;
            }
          } else {
            next = prev - 1;
            if (next < 0) {
              setWaveDirection('forward');
              return 0;
            }
          }
          const fee = bars[next].liquidity * 0.003;
          setTotalFees(total => total + fee);
          
          return next;
        });
        animationRef.current = setTimeout(animate, 150);
      };
  
      animationRef.current = setTimeout(animate, 150);  
      return () => clearTimeout(animationRef.current);
    }, [isAnimating, waveDirection, binSteps, bars, mode, solPercent]);
  
    // Add keyboard event listener for Enter key
    useEffect(() => {
      const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          setIsAnimating(prev => !prev);
        }
      };
  
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };

      if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isDropdownOpen]);

    // Copy Solana address and update tooltip
    const handleCopySol = async () => {
      try {
        await navigator.clipboard.writeText('2scUApKr4Q6A8YoXdsAnHGNjFxGPvsZKvMWadkphKzR7');
        setCopiedSol(true);
        setTimeout(() => setCopiedSol(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };
  
    return (
      <div className="absolute w-full h-full top-0 left-0 z-0 py-10 bg-[#0a0b0f] flex items-center justify-center p-2 sm:p-4">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center lg:justify-evenly gap-4 lg:gap-4">
          <div className="flex flex-row lg:flex-col items-center justify-center gap-4 lg:gap-32 order-2 lg:order-1">
            <div onClick={() => window.open('https://x.com/MeteoraAG', '_blank')} className="flex items-center gap-2 cursor-pointer">
            <img src={metlogo} alt="logo" className="w-20 h-20 sm:w-30 sm:h-30" />
            <p className="text-white text-lg sm:text-[25px] font-bold">Meteora</p>
            </div>
            <div onClick={() => window.open('https://x.com/met_lparmy', '_blank')} className="flex items-center gap-2 cursor-pointer">
            <img src={lplogo} alt="logo" className="w-20 h-20 sm:w-30 sm:h-30" />
            <p className="text-white text-base sm:text-[22px] font-bold">LP Army</p>
            </div>
          </div>
          {/* Dark Enterprise Card */}
          <div className="bg-[#1a1b23] w-full max-w-[500px] rounded-2xl p-3 sm:p-4 border border-gray-800 order-1 lg:order-2"
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 0, 0, 0.1)' }}>
            
              {/* Header */}
              <div className="mb-4 sm:mb-5">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#ff4757] via-[#c44569] to-[#8b5cf6] bg-clip-text text-transparent">
                {getStrategyHeading()}
                </h1>
                {/* <p className="text-xs sm:text-sm text-white font-bold mt-1">This is just an example UI of how my Bid/Ask strategy works to make it easy to understand.</p> */}
              </div>
  
            {/* Chart - Dark */}
            <div className="h-40 sm:h-48 bg-[#0f1015] rounded-xl p-2 sm:p-3 mb-4 sm:mb-5 border border-gray-800">
              <div className="flex items-end justify-between gap-px h-full relative">
                {bars.map((bar, index) => (
                  <div
                    key={bar.id}
                    className="flex-1 transition-all duration-200 relative"
                    style={{ 
                      height: `${bar.height}%`,
                      backgroundColor: getBarColor(index),
                      borderRadius: '20px 20px 0 0',
                    }}
                  >
                    {/* Glow effect for active wave */}
                    {index === currentWave && isAnimating && (
                      <div 
                        className="absolute inset-0 animate-pulse"
                        style={{
                          backgroundColor: '#FCD34D',
                          filter: 'blur(4px)',
                          opacity: 0.6
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Volume bars - subtle */}
              <div className="flex items-end justify-between gap-px h-6 mt-2">
                {bars.map((bar) => (
                  <div
                    key={`vol-${bar.id}`}
                    className="flex-1 bg-gray-700 opacity-20"
                    style={{ 
                      // eslint-disable-next-line react-hooks/purity
                      height: `${40 + Math.random() * 60}%`,
                      borderRadius: '1px 1px 0 0'
                    }}
                  />
                ))}
              </div>
            </div>
  
            {/* Dropdown Button */}
            <div className="flex justify-center mb-4 sm:mb-5 relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                  mode === 'combined'
                    ? 'bg-gradient-to-r from-purple-600 to-orange-600 text-white'
                    : mode === 'bid'
                    ? 'bg-orange-600 text-white'
                    : mode === 'ask'
                    ? 'bg-purple-600 text-white'
                    : mode === 'spots'
                    ? 'bg-emerald-600 text-white'
                    : mode === 'agents'
                    ? 'bg-gradient-to-r from-orange-600 to-purple-600 text-white'
                    : 'bg-[#0f1015] text-gray-400 border border-gray-800'
                }`}
                style={{
                  boxShadow: isDropdownOpen 
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.6)' 
                    : '0 4px 12px -2px rgba(0, 0, 0, 0.5)'
                }}
              >
                {mode === 'combined' ? (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    <TrendingUp className="w-4 h-4" />
                    <span>Bid Ask</span>
                  </>
                ) : mode === 'bid' ? (
                  <>
                    <TrendingDown className="w-4 h-4" />
                    <span>Bid</span>
                  </>
                ) : mode === 'ask' ? (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>Ask</span>
                  </>
                ) : mode === 'spots' ? (
                  <>
                    <Target className="w-4 h-4" />
                    <span>Spots</span>
                  </>
                ) : mode === 'agents' ? (
                  <>
                    <Waves className="w-4 h-4" />
                    <span>Curved</span>
                  </>
                ) : null}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-full min-w-[200px] bg-[#1a1b23] border border-gray-800 rounded-xl overflow-hidden z-50"
                  style={{ boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8)' }}>
                  <button
                    onClick={() => {
                      setMode('both');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      mode === 'combined' || mode === 'both'
                        ? 'bg-gradient-to-r from-purple-600/20 to-orange-600/20 text-white'
                        : 'text-gray-400 hover:bg-[#15161d] hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <TrendingUp className="w-4 h-4" />
                    <span>Bid Ask</span>
                  </button>
                  <button
                    onClick={() => {
                      setMode('bid');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      mode === 'bid'
                        ? 'bg-orange-600/20 text-orange-400'
                        : 'text-gray-400 hover:bg-[#15161d] hover:text-white'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4" />
                    <span>Bid</span>
                  </button>
                  <button
                    onClick={() => {
                      setMode('ask');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      mode === 'ask'
                        ? 'bg-purple-600/20 text-purple-400'
                        : 'text-gray-400 hover:bg-[#15161d] hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Ask</span>
                  </button>
                  <button
                    onClick={() => {
                      setMode('spots');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      mode === 'spots'
                        ? 'bg-emerald-600/20 text-emerald-400'
                        : 'text-gray-400 hover:bg-[#15161d] hover:text-white'
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    <span>Spots</span>
                  </button>
                  <button
                    onClick={() => {
                      setMode('agents');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      mode === 'agents'
                        ? 'bg-gradient-to-r from-orange-600/20 to-purple-600/20 text-white'
                        : 'text-gray-400 hover:bg-[#15161d] hover:text-white'
                    }`}
                  >
                    <Waves className="w-4 h-4" />
                    <span>Curved</span>
                  </button>
                </div>
              )}
            </div>
  
            {/* Settings Panel */}
            <div className="bg-[#0f1015] rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-800">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-xs sm:text-sm font-medium">Bin Steps</label>
                    <span className="text-white text-xs sm:text-sm font-semibold">{binSteps}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={binSteps}
                    onChange={(e) => setBinSteps(parseInt(e.target.value))}
                    className="w-full"
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 ${((binSteps - 10) / 90) * 100}%, #1f2937 ${((binSteps - 10) / 90) * 100}%)`,
                      borderRadius: '4px',
                      height: '8px'
                    }}
                    disabled={isAnimating}
                  />
                </div>
  
                {/* Coin Amount - Hide for 'both', 'spots', and 'agents' mode, show SOL for 'bid', Token % for 'ask', dollar for others */}
                {mode !== 'both' && mode !== 'spots' && mode !== 'agents' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-gray-400 text-xs sm:text-sm font-medium">
                        {mode === 'bid' ? 'SOL' : mode === 'ask' ? 'Token Amount' : 'Coin Amount'}
                      </label>
                      <span className="text-white text-xs sm:text-sm font-semibold">
                        {mode === 'bid' 
                          ? `${(coinAmount / 1000).toFixed(1)} SOL`
                          : mode === 'ask'
                          ? `${Math.round((coinAmount / 20000) * 100)}%`
                          : `$${coinAmount.toLocaleString()}`
                        }
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={coinAmount}
                      onChange={(e) => setCoinAmount(parseInt(e.target.value))}
                      className="w-full"
                      style={{
                        background: `linear-gradient(to right, #c44569 ${((coinAmount - 1000) / 19000) * 100}%, #1f2937 ${((coinAmount - 1000) / 19000) * 100}%)`,
                        borderRadius: '4px',
                        height: '8px'
                      }}
                      disabled={isAnimating}
                    />
                  </div>
                )}
  
                {/* Show SOL/Token controls for 'both', 'spots', and 'agents' mode */}
                {(mode === 'both' || mode === 'spots' || mode === 'agents') && (
                  <>
                    <div className="pt-2 border-t border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-gray-400 text-xs sm:text-sm font-medium">SOL Amount</label>
                        <span className="text-xs sm:text-sm font-semibold" style={{ color: '#ff4757' }}>{solPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        step="5"
                        value={solPercent}
                        onChange={(e) => {
                          const newSol = parseInt(e.target.value);
                          setSolPercent(newSol);
                          setTokenPercent(100 - newSol);
                        }}
                        className="w-full"
                        style={{
                          background: `linear-gradient(to right, #ff4757 ${solPercent}%, #1f2937 ${solPercent}%)`,
                          borderRadius: '4px',
                          height: '8px'
                        }}
                        disabled={isAnimating}
                      />
                    </div>
  
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-gray-400 text-xs sm:text-sm font-medium">Token Amount</label>
                        <span className="text-xs sm:text-sm font-semibold" style={{ color: '#8b5cf6' }}>{tokenPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        step="5"
                        value={tokenPercent}
                        onChange={(e) => {
                          const newToken = parseInt(e.target.value);
                          setTokenPercent(newToken);
                          setSolPercent(100 - newToken);
                        }}
                        className="w-full"
                        style={{
                          background: `linear-gradient(to right, #8b5cf6 ${tokenPercent}%, #1f2937 ${tokenPercent}%)`,
                          borderRadius: '4px',
                          height: '8px'
                        }}
                        disabled={isAnimating}
                      />
                    </div>
  
                      <div className="text-[10px] sm:text-xs text-gray-500 text-center font-medium">
                      {mode === 'spots' 
                        ? 'Spot positions move based on SOL/Token ratio'
                        : mode === 'agents'
                        ? 'Curve intensity adjusts based on SOL/Token ratio'
                        : 'Price moves based on SOL/Token ratio'
                      }
                    </div>
                  </>
                )}
              </div>
            </div>
  
            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`flex-1 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isAnimating
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
                style={{ boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.5)' }}
              >
                {isAnimating ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={() => {
                  setTotalFees(0);
                  setCurrentWave(0);
                  setIsAnimating(false);
                  setMode('combined');
                  setWaveDirection('forward');
                  setSolPercent(50);
                  setTokenPercent(50);
                }}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#0f1015] hover:bg-[#15161d] text-gray-400 rounded-lg text-xs sm:text-sm font-bold transition-all border border-gray-800 cursor-pointer"
              >
                Reset
              </button>
            </div>
  
            {/* Fee Display - Dark */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs sm:text-sm font-medium">Total Fees Earned</span>
                <span className="text-emerald-400 text-base sm:text-lg font-bold">${totalFees.toFixed(2)}</span>
              </div>
            </div>

          </div>
          <div className="flex flex-col items-center gap-2 order-3 lg:order-3 relative">
            <div 
              onClick={() => window.open('https://x.com/biginthe4teen/status/1989321624215318574', '_blank')}
              className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="border-2 border-red-900 rounded-full">
                <img src={luffy} alt="logo" className="w-20 h-20 sm:w-25 sm:h-25 rounded-full" />
              </div>
              <p className="text-white text-sm sm:text-[18px] font-bold">@biginthe4teen</p>
            </div>
            
            <Tooltip
              closeDelay={0}
              content={
                copiedSol ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </span>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))' }}>
                    <circle cx="12" cy="12" r="12" fill="url(#solBgGradient)" />
                    <defs>
                      <linearGradient id="solBgGradient" x1="12" y1="0" x2="12" y2="24">
                        <stop offset="0%" stopColor="#1a0b2e" />
                        <stop offset="100%" stopColor="#2d1b4e" />
                      </linearGradient>
                      <linearGradient id="solBottomBar" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF00FF" />
                        <stop offset="100%" stopColor="#9945FF" />
                      </linearGradient>
                    </defs>
                    {/* Top bar - teal */}
                    <path d="M6 9L18 9L17.5 10.5L5.5 10.5L6 9Z" fill="#14F195" />
                    {/* Middle bar - teal */}
                    <path d="M6 11.5L18 11.5L17.5 13L5.5 13L6 11.5Z" fill="#14F195" />
                    {/* Bottom bar - gradient magenta to purple */}
                    <path d="M6 14L18 14L17.5 15.5L5.5 15.5L6 14Z" fill="url(#solBottomBar)" />
                  </svg>
                )
              }
              delay={0}
              placement="bottom"
              classNames={{
                base: "bg-transparent",
                content: "bg-transparent p-2",
              }}
              motionProps={{
                variants: {
                  exit: {
                    opacity: 0,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn",
                    },
                  },
                  enter: {
                    opacity: 1,
                    transition: {
                      duration: 0.15,
                      ease: "easeOut",
                    },
                  },
                },
              }}
            >
              <Button 
                disableRipple 
                variant="light"
                isIconOnly
                onClick={handleCopySol}
                className="mt-2 flex items-center justify-center p-3 bg-transparent hover:bg-[#15161d]/50 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Coffee className="w-5 h-5 text-[#ff4757]" />
              </Button>
            </Tooltip>
          </div>
  
        </div>
      </div>
    );
}

export default Home;