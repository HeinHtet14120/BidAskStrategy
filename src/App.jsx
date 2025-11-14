import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, TrendingDown, BarChart3, X } from 'lucide-react';
import metlogo from './assets/metlogo.png';
import luffy from './assets/luggy.JPG';
import lplogo from './assets/lplogo.png';

export default function App() {
  const [mode, setMode] = useState('combined');
  const [binSteps, setBinSteps] = useState(20);
  const [coinAmount, setCoinAmount] = useState(5000);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentWave, setCurrentWave] = useState(0);
  const [waveDirection, setWaveDirection] = useState('forward');
  const [totalFees, setTotalFees] = useState(0);
  const [solPercent, setSolPercent] = useState(50); // SOL percentage for 'both' mode
  const [tokenPercent, setTokenPercent] = useState(50); // Token percentage for 'both' mode
  
  const animationRef = useRef(null);

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
      } else {
        setCurrentWave(0); // Start from left for ask/combined
        setWaveDirection('forward'); // Move right first
      }
    }
  }, [mode, binSteps, isAnimating, solPercent]);

  const getBarColor = (index) => {
    const dynamicCenter = mode === 'both' ? (solPercent / 100) * binSteps : binSteps / 2;
    
    if (!isAnimating) {
      switch(mode) {
        case 'bid': return '#F97316';
        case 'ask': return '#A855F7';
        case 'both':
          // Left side (Bid - SOL to buy token) = Orange, Right side (Ask - Token to sell) = Purple
          return index < dynamicCenter ? '#F97316' : '#A855F7';
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
      default: return '#8B5CF6';
    }
  };

  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      setCurrentWave(prev => {
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
  }, [isAnimating, waveDirection, binSteps, bars]);

  return (
    <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center p-4">
      <div className="w-full  flex items-center justify-evenly gap-4">
        <div className="flex flex-col items-center gap-32">
          <div className="flex items-center gap-2">
          <img src={metlogo} alt="logo" className="w-30 h-30" />
          <p className="text-white text-[25px] font-bold ">Meteora</p>
          </div>
          <div className="flex items-center gap-2">
          <img src={lplogo} alt="logo" className="w-30 h-30" />
          <p className="text-white text-[22px] font-bold ">LP Army</p>
          </div>
        </div>
        {/* Dark Enterprise Card */}
        <div className="bg-[#1a1b23] w-[500px] rounded-2xl p-6 shadow-2xl border border-gray-800"
          style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)' }}>
          
            {/* Header */}
            <div className="mb-5">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-800 via-red-500 to-orange-900 bg-clip-text text-transparent">
                BidAsk for GIGA DEGAN
              </h1>
              <p className="text-sm text-white font-bold mt-1">This is just an example UI of how my Bid/Ask strategy works to make it easy to understand.</p>
            </div>

          {/* Chart - Dark */}
          <div className="h-48 bg-[#0f1015] rounded-xl p-3 mb-5 border border-gray-800">
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

          {/* Buttons - Dark style */}
          <div className="flex justify-center gap-2 mb-5">
            {mode === 'combined' ? (
              <button
                onClick={() => setMode('both')}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white rounded-lg text-sm font-semibold transition-all shadow-lg"
              >
                <BarChart3 className="w-4 h-4" />
                <TrendingUp className="w-4 h-4" />
                <span>Bid Ask</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setMode('bid')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'bid'
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-[#0f1015] text-gray-400 hover:bg-[#15161d] border border-gray-800'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>Bid</span>
                </button>
                <button
                  onClick={() => setMode('ask')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'ask'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-[#0f1015] text-gray-400 hover:bg-[#15161d] border border-gray-800'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Ask</span>
                </button>
              </>
            )}
          </div>

          {/* Settings Panel */}
          <div className="bg-[#0f1015] rounded-xl p-4 mb-4 border border-gray-800">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-400 text-sm font-medium">Bin Steps</label>
                  <span className="text-white text-sm font-semibold">{binSteps}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={binSteps}
                  onChange={(e) => setBinSteps(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  disabled={isAnimating}
                />
              </div>

              {/* Coin Amount - Hide for 'both' mode, show SOL for 'bid', Token % for 'ask', dollar for others */}
              {mode !== 'both' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-sm font-medium">
                      {mode === 'bid' ? 'SOL' : mode === 'ask' ? 'Token Amount' : 'Coin Amount'}
                    </label>
                    <span className="text-white text-sm font-semibold">
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
                    className={`w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer ${
                      mode === 'bid' ? 'accent-orange-500' : 'accent-purple-500'
                    }`}
                    disabled={isAnimating}
                  />
                </div>
              )}

              {/* Show SOL/Token controls only in 'both' mode */}
              {mode === 'both' && (
                <>
                  <div className="pt-2 border-t border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-gray-400 text-sm font-medium">SOL Amount</label>
                      <span className="text-orange-400 text-sm font-semibold">{solPercent}%</span>
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
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      disabled={isAnimating}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-gray-400 text-sm font-medium">Token Amount</label>
                      <span className="text-purple-400 text-sm font-semibold">{tokenPercent}%</span>
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
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      disabled={isAnimating}
                    />
                  </div>

                  <div className="text-xs text-gray-500 text-center font-medium">
                    Price moves based on SOL/Token ratio
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all shadow-lg cursor-pointer ${
                isAnimating
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isAnimating ? 'Stop' : 'Start'}
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
              className="px-6 py-3 bg-[#0f1015] hover:bg-[#15161d] text-gray-400 rounded-lg text-sm font-bold transition-all border border-gray-800 cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Fee Display - Dark */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm font-medium">Total Fees Earned</span>
              <span className="text-emerald-400 text-lg font-bold">${totalFees.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
        <div className="border-2 border-red-900 rounded-full">
          <img src={luffy} alt="logo" className="w-25 h-25 rounded-full" />
        </div>
        <p className="text-white text-[18px] font-bold ">@biginthe4teen</p>
        </div>

      </div>
    </div>
  );
}