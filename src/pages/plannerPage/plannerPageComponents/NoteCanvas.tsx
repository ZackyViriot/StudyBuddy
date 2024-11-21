import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Type, Eraser, RotateCcw } from 'lucide-react';

interface NotesCanvasProps {
    selectedDate: Date;
}

const NotesCanvas: React.FC<NotesCanvasProps> = ({ selectedDate }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [tool, setTool] = useState<'pen' | 'text' | 'eraser'>('pen');
    const [isTyping, setIsTyping] = useState(false);
    const [typingPosition, setTypingPosition] = useState({ x: 0, y: 0 });
    const [currentText, setCurrentText] = useState('');

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.font = '16px Arial';
                setContext(ctx);
            }
        }
    }, []);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!context || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tool === 'text') {
            setIsTyping(true);
            setTypingPosition({ x, y });
            setCurrentText('');
        } else {
            setIsTyping(false);
            context.beginPath();
            context.moveTo(x, y);
            setIsDrawing(true);
        }
    };

    const handleTextInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && context) {
            context.fillStyle = 'black';
            context.fillText(currentText, typingPosition.x, typingPosition.y);
            setIsTyping(false);
            setCurrentText('');
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !context || tool === 'text') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        context.strokeStyle = tool === 'pen' ? 'black' : 'white';
        context.lineWidth = tool === 'pen' ? 2 : 20;
        context.lineTo(x, y);
        context.stroke();
    };

    const stopDrawing = () => {
        if (!context) return;
        context.closePath();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        if (!context || !canvasRef.current) return;
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setIsTyping(false);
        setCurrentText('');
    };

    return (
        <div className="p-3">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Notes for {selectedDate.toLocaleDateString()}</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            setTool('text');
                            setIsTyping(false);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                            tool === 'text' ? 'bg-black text-white' : 'bg-gray-200'
                        }`}
                        title="Text Tool"
                    >
                        <Type size={18} />
                    </button>
                    <button
                        onClick={() => {
                            setTool('pen');
                            setIsTyping(false);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                            tool === 'pen' ? 'bg-black text-white' : 'bg-gray-200'
                        }`}
                        title="Pen Tool"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => {
                            setTool('eraser');
                            setIsTyping(false);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                            tool === 'eraser' ? 'bg-black text-white' : 'bg-gray-200'
                        }`}
                        title="Eraser"
                    >
                        <Eraser size={18} />
                    </button>
                    <button
                        onClick={clearCanvas}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                        title="Clear Canvas"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            <div className="relative">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleCanvasClick}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-[200px] border rounded-lg cursor-crosshair bg-white"
                    style={{ touchAction: 'none' }}
                />
                
                {isTyping && (
                    <input
                        type="text"
                        value={currentText}
                        onChange={(e) => setCurrentText(e.target.value)}
                        onKeyDown={handleTextInput}
                        className="absolute bg-transparent border-b border-black outline-none"
                        style={{
                            left: `${typingPosition.x}px`,
                            top: `${typingPosition.y - 10}px`,
                            minWidth: '100px'
                        }}
                        autoFocus
                        placeholder="Type and press Enter"
                    />
                )}
            </div>
        </div>
    );
};

export default NotesCanvas;