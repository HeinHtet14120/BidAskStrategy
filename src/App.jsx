import Home from './components/Home';
import CurvedLoop from './components/CurvedLoop';
import TextCursor from './components/TextCursor';
import { AlertTriangle, Rocket, Zap, Flame, Sparkles } from 'lucide-react';

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
    <div className="h-[120vh] bg-gray-100 relative">
      <Home />
      <div className="absolute top-0 left-0 w-full">
        <CurvedLoop 
          marqueeText="STILL IN DEVELOPMENT"
          speed={1}
          curveAmount={0}
          direction="right"
          interactive={false}
          gradient={['#ff6b35', '#ff4757', '#c44569', '#8b5cf6', '#6c5ce7']}
          className="text-[14px] sm:text-[18px] md:text-[24px] lg:text-[28px] xl:text-[32px] font-bold w-full h-full"
        />
      </div>
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
  )
}

export default App;