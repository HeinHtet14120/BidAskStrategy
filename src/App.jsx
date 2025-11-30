import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Curve from './components/Curve';
import ComingSoon from './components/ComingSoon';
import DevelopmentBanner from './components/DevelopmentBanner';
import TextCursor from './components/TextCursor';
import { AlertTriangle, Rocket, Zap, Flame, Sparkles } from 'lucide-react';
import { HeroUIProvider } from '@heroui/react';

const App = () => {
  // You can mix emojis and JSX icons
  // const customIcons = [
  //   // "⚠️", // Emoji
  //   // "🚀", // Emoji
  //   <AlertTriangle key="alert" className="w-6 h-6 text-yellow-500" />, // Lucide icon
  //   <Rocket key="rocket" className="w-6 h-6 text-blue-500" />, // Lucide icon
  //   <Zap key="zap" className="w-6 h-6 text-yellow-400" />, // Lucide icon
  //   <Flame key="flame" className="w-6 h-6 text-orange-500" />, // Lucide icon
  //   <Sparkles key="sparkles" className="w-6 h-6 text-purple-500" />, // Lucide icon
  //   // Add your custom JSX icons here
  //   // <div key="custom1" className="w-6 h-6 bg-red-500 rounded-full" />,
  //   // <div key="custom2" className="w-6 h-6 bg-blue-500 rounded-lg rotate-45" />,
  //   // <Met1 key="met1" />,
  // ];

  return (
    <HeroUIProvider>
      <Routes>
        <Route 
          path="/" 
          element={
    <div className="h-[120vh] bg-gray-100 relative">
      <DevelopmentBanner />
      <Home />
      {/* <div className="fixed inset-0 z-50 text-cursor-wrapper">
        <TextCursor
          icons={customIcons}
          delay={0.01}
          radius={100}
          spawnInterval={150}
          randomFloat={true}
          exitDuration={0.5}
          removalInterval={2000}
          maxPoints={12}
          minDistance={20}
        />
      </div> */}
    </div>
          } 
        />
        <Route path="/curve" element={<Curve />} />
        <Route 
          path="/bid" 
          element={
            <ComingSoon 
              strategyName="Bid" 
              strategyColor="#F97316"
              strategyGradient="linear-gradient(135deg, #F97316, #FF6B35)"
            />
          } 
        />
        <Route 
          path="/ask" 
          element={
            <ComingSoon 
              strategyName="Ask" 
              strategyColor="#A855F7"
              strategyGradient="linear-gradient(135deg, #A855F7, #8B5CF6)"
            />
          } 
        />
        <Route 
          path="/bidask" 
          element={
            <ComingSoon 
              strategyName="Bid/Ask" 
              strategyColor="#8B5CF6"
              strategyGradient="linear-gradient(135deg, #F97316, #A855F7)"
            />
          } 
        />
        <Route 
          path="/spots" 
          element={
            <ComingSoon 
              strategyName="Spots" 
              strategyColor="#10B981"
              strategyGradient="linear-gradient(135deg, #10B981, #059669)"
            />
          } 
        />
      </Routes>
    </HeroUIProvider>
  )
}

export default App;