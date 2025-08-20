import React from 'react';
import { FloatingWheelGame } from './index';

const demoSegments = [
  { text: "🎁 Free Gift", color: "#FF6B6B" },
  { text: "💰 $10 Cash", color: "#4ECDC4" },
  { text: "🎯 50% Off", color: "#45B7D1" },
  { text: "🎪 Try Again", color: "#96CEB4" },
  { text: "🏆 Grand Prize", color: "#FFEAA7" },
  { text: "🎨 Mystery Box", color: "#DDA0DD" }
];

export const FloatingWheelGameDemo: React.FC = () => {
  const handleSpinStart = () => {
    console.log('🎰 Spin started!');
  };

  const handleSpinEnd = (result: { text: string; color: string; value?: string }) => {
    console.log('🎉 You won:', result.text);
    alert(`Congratulations! You won: ${result.text}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Floating Wheel Game Demo
        </h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            How it works:
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Look for the floating gift icon in the bottom-right corner</li>
            <li>• Click the icon to open the wheel spin game</li>
            <li>• Spin the wheel to win prizes</li>
            <li>• Close the modal by clicking the X or pressing ESC</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Demo Configuration:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Wheel Size:</strong> 300px<br />
              <strong>Animation Duration:</strong> 3 seconds<br />
              <strong>Min Revolutions:</strong> 3<br />
              <strong>Max Revolutions:</strong> 5
            </div>
            <div>
              <strong>Title:</strong> "Spin to Win!"<br />
              <strong>Button Text:</strong> "SPIN"<br />
              <strong>Spinning Text:</strong> "Spinning..."<br />
              <strong>Segments:</strong> 6 prizes
            </div>
          </div>
        </div>
      </div>

      {/* The floating wheel game will appear in the bottom-right corner */}
      <FloatingWheelGame
        segments={demoSegments}
        wheelSize={300}
        animationDuration={3000}
        minRevolutions={3}
        maxRevolutions={5}
        title="Spin to Win!"
        buttonText="SPIN"
        spinningText="Spinning..."
        onSpinStart={handleSpinStart}
        onSpinEnd={handleSpinEnd}
      />
    </div>
  );
};
