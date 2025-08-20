// AEM Integration Bridge for Wheel Spin Game
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function initWheelSpin() {
        const container = document.querySelector('.wheelspin-container');
        const wheelRoot = document.getElementById('wheel-root');
        
        if (!container || !wheelRoot) {
            console.warn('Wheel spin container not found');
            return;
        }
        
        // Read AEM properties from data attributes
        const aemProps = {
            prizes: parseJSON(container.dataset.prizes, []),
            colors: parseJSON(container.dataset.colors, []),
            codes: parseJSON(container.dataset.codes, {}),
            title: container.dataset.title || 'Spin the Wheel!',
            buttonText: container.dataset.buttonText || 'SPIN',
            spinningText: container.dataset.spinningText || 'Spinning...',
            wheelSize: parseInt(container.dataset.wheelSize) || 400,
            animationDuration: parseInt(container.dataset.animationDuration) || 4000,
            minRevolutions: parseInt(container.dataset.minRevolutions) || 5,
            maxRevolutions: parseInt(container.dataset.maxRevolutions) || 8,
            soundEnabled: container.dataset.soundEnabled === 'true'
        };
        
        // Validate and merge prizes with colors
        const segments = aemProps.prizes.map((prize, index) => ({
            text: prize.text,
            color: aemProps.colors[index] || prize.color || '#FFC300',
            value: prize.value
        }));
        
        // Create wheel configuration
        const wheelConfig = {
            segments: segments,
            defaults: {
                wheelSize: aemProps.wheelSize,
                animationDuration: aemProps.animationDuration,
                minRevolutions: aemProps.minRevolutions,
                maxRevolutions: aemProps.maxRevolutions,
                title: aemProps.title,
                buttonText: aemProps.buttonText,
                spinningText: aemProps.spinningText
            }
        };
        
        // Initialize the wheel spin game
        initializeWheelSpinGame(wheelRoot, wheelConfig, aemProps);
    }
    
    // Parse JSON safely
    function parseJSON(jsonString, defaultValue) {
        try {
            return jsonString ? JSON.parse(jsonString) : defaultValue;
        } catch (error) {
            console.warn('Failed to parse JSON:', jsonString, error);
            return defaultValue;
        }
    }
    
    // Initialize the wheel spin game
    function initializeWheelSpinGame(container, config, aemProps) {
        // Create a simplified wheel spin implementation for AEM
        const wheelHTML = `
            <div class="wheel-spin-game" style="max-width: ${config.defaults.wheelSize}px; margin: 0 auto;">
                <div class="wheel-header text-center mb-6">
                    <h2 class="text-2xl font-bold mb-2">${config.defaults.title}</h2>
                </div>
                
                <div class="wheel-container relative">
                    <canvas id="wheel-canvas" width="${config.defaults.wheelSize}" height="${config.defaults.wheelSize}" 
                            style="display: block; margin: 0 auto; border-radius: 50%; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                    </canvas>
                    
                    <div class="wheel-pointer absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                        <div class="w-0 h-0 border-l-8 border-l-red-500 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                    </div>
                </div>
                
                <div class="wheel-controls text-center mt-6">
                    <button id="spin-button" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        ${config.defaults.buttonText}
                    </button>
                </div>
                
                <div id="result-display" class="text-center mt-4 hidden">
                    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        <p class="font-bold">Congratulations!</p>
                        <p id="prize-text"></p>
                        <p id="code-text" class="text-sm mt-2"></p>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = wheelHTML;
        
        // Initialize wheel functionality
        initWheelCanvas(config);
    }
    
    // Initialize wheel canvas
    function initWheelCanvas(config) {
        const canvas = document.getElementById('wheel-canvas');
        const spinButton = document.getElementById('spin-button');
        const resultDisplay = document.getElementById('result-display');
        const prizeText = document.getElementById('prize-text');
        const codeText = document.getElementById('code-text');
        
        if (!canvas || !spinButton) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        let isSpinning = false;
        let currentRotation = 0;
        
        // Draw wheel
        function drawWheel(rotation = 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const segments = config.segments;
            const arcSize = (2 * Math.PI) / segments.length;
            
            // Draw segments
            segments.forEach((segment, i) => {
                const startAngle = i * arcSize + rotation;
                const endAngle = (i + 1) * arcSize + rotation;
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                ctx.closePath();
                ctx.fillStyle = segment.color;
                ctx.fill();
                ctx.strokeStyle = '#FFF';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Draw text
                const textAngle = startAngle + arcSize / 2;
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(textAngle);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#FFF';
                ctx.font = 'bold 14px Arial';
                ctx.fillText(segment.text, radius * 0.7, 0);
                ctx.restore();
            });
        }
        
        // Spin animation
        function spinWheel() {
            if (isSpinning) return;
            
            isSpinning = true;
            spinButton.disabled = true;
            spinButton.textContent = config.defaults.spinningText;
            
            const minRevolutions = config.defaults.minRevolutions;
            const maxRevolutions = config.defaults.maxRevolutions;
            const revolutions = minRevolutions + Math.random() * (maxRevolutions - minRevolutions);
            const targetRotation = currentRotation + (revolutions * 2 * Math.PI);
            const duration = config.defaults.animationDuration;
            const startTime = Date.now();
            
            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentAngle = currentRotation + (targetRotation - currentRotation) * easeOut;
                
                drawWheel(currentAngle);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Animation complete
                    currentRotation = targetRotation;
                    isSpinning = false;
                    spinButton.disabled = false;
                    spinButton.textContent = config.defaults.buttonText;
                    
                    // Determine result
                    const normalizedRotation = currentRotation % (2 * Math.PI);
                    const segmentAngle = (2 * Math.PI) / config.segments.length;
                    const winningIndex = Math.floor(((2 * Math.PI) - normalizedRotation) / segmentAngle) % config.segments.length;
                    const winningSegment = config.segments[winningIndex];
                    
                    // Show result
                    showResult(winningSegment);
                }
            }
            
            animate();
        }
        
        // Show result
        function showResult(segment) {
            prizeText.textContent = `You won: ${segment.text}!`;
            
            const code = aemProps.codes[segment.value];
            if (code) {
                codeText.textContent = `Redeem code: ${code}`;
            } else {
                codeText.textContent = '';
            }
            
            resultDisplay.classList.remove('hidden');
            
            // Hide result after 5 seconds
            setTimeout(() => {
                resultDisplay.classList.add('hidden');
            }, 5000);
        }
        
        // Event listeners
        spinButton.addEventListener('click', spinWheel);
        
        // Initial draw
        drawWheel();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWheelSpin);
    } else {
        initWheelSpin();
    }
    
})(); 