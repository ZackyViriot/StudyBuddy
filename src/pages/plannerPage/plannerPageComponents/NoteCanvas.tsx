import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Type, Eraser, RotateCcw, Square, Circle, Undo, Maximize2, Minimize2 } from 'lucide-react';

interface NotesCanvasProps {
    selectedDate: Date;
}

const NotesCanvas: React.FC<NotesCanvasProps> = ({ selectedDate }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [tool, setTool] = useState<'pen' | 'text' | 'eraser' | 'rectangle' | 'circle'>('pen');
    const [isTyping, setIsTyping] = useState(false);
    const [typingPosition, setTypingPosition] = useState({ x: 0, y: 0 });
    const [currentText, setCurrentText] = useState('');
    const [startPosition, setStartPosition] = useState<{ x: number, y: number } | null>(null);
    const [lastDrawnShape, setLastDrawnShape] = useState<ImageData | null>(null);
    const [undoStack, setUndoStack] = useState<ImageData[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [canvasHeight, setCanvasHeight] = useState(200);

    const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canvasRef.current) return;
        const startY = e.clientY;
        const startHeight = canvasHeight;

        const doDrag = (e: MouseEvent) => {
            const newHeight = startHeight + (e.clientY - startY);
            setCanvasHeight(Math.max(200, newHeight)); // Minimum height of 200px
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            // Trigger canvas resize
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                canvas.height = canvasHeight;
                if (context) {
                    // Restore context properties after resize
                    context.strokeStyle = 'black';
                    context.lineWidth = 2;
                    context.lineCap = 'round';
                    context.font = '16px Arial';
                }
            }
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const resizeCanvas = () => {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvasHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';
                    ctx.font = '16px Arial';
                    setContext(ctx);
                    const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    setUndoStack([initialState]);
                }
            };
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            return () => window.removeEventListener('resize', resizeCanvas);
        }
    }, [canvasHeight]);

    const saveToUndoStack = () => {
        if (!context || !canvasRef.current) return;
        const currentState = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        setUndoStack(prev => [...prev, currentState]);
    };

    const handleUndo = () => {
        if (!context || !canvasRef.current || undoStack.length === 0) return;
        
        const previousState = undoStack[undoStack.length - 2]; // Get second-to-last state
        if (previousState) {
            context.putImageData(previousState, 0, 0);
            setUndoStack(prev => prev.slice(0, -1)); // Remove the last state
        } else {
            // If no previous state, clear the canvas
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            setUndoStack([]);
        }
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!context || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        if (tool === 'text') {
            setIsTyping(true);
            setTypingPosition({ x, y });
            setCurrentText('');
        } else {
            setIsTyping(false);
            if (['rectangle', 'circle'].includes(tool)) {
                setLastDrawnShape(context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
            }
            context.beginPath();
            context.moveTo(x, y);
            setIsDrawing(true);
            setStartPosition({ x, y });
        }
    };

    const handleTextInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && context) {
            context.fillStyle = 'black';
            context.fillText(currentText, typingPosition.x, typingPosition.y);
            setIsTyping(false);
            setCurrentText('');
            saveToUndoStack();
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !context || !canvasRef.current || tool === 'text') return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        if (['rectangle', 'circle'].includes(tool)) {
            if (!startPosition) return;

            if (lastDrawnShape) {
                context.putImageData(lastDrawnShape, 0, 0);
            }

            if (tool === 'rectangle') {
                context.beginPath();
                context.strokeRect(
                    startPosition.x,
                    startPosition.y,
                    x - startPosition.x,
                    y - startPosition.y
                );
            } else if (tool === 'circle') {
                const radius = Math.sqrt(
                    Math.pow(x - startPosition.x, 2) + Math.pow(y - startPosition.y, 2)
                );
                context.beginPath();
                context.arc(startPosition.x, startPosition.y, radius, 0, 2 * Math.PI);
                context.stroke();
            }
        } else {
            context.strokeStyle = tool === 'pen' ? 'black' : 'white';
            context.lineWidth = tool === 'pen' ? 2 : 20;
            context.lineTo(x, y);
            context.stroke();
        }
    };

    const stopDrawing = () => {
        if (!context) return;
        context.closePath();
        setIsDrawing(false);
        setStartPosition(null);
        if (['rectangle', 'circle', 'pen', 'eraser'].includes(tool)) {
            saveToUndoStack();
        }
    };

    const clearCanvas = () => {
        if (!context || !canvasRef.current) return;
        saveToUndoStack();
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setIsTyping(false);
        setCurrentText('');
        setLastDrawnShape(null);
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
                        onClick={() => {
                            setTool('rectangle');
                            setIsTyping(false);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                            tool === 'rectangle' ? 'bg-black text-white' : 'bg-gray-200'
                        }`}
                        title="Rectangle"
                    >
                        <Square size={18} />
                    </button>
                    <button
                        onClick={() => {
                            setTool('circle');
                            setIsTyping(false);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                            tool === 'circle' ? 'bg-black text-white' : 'bg-gray-200'
                        }`}
                        title="Circle"
                    >
                        <Circle size={18} />
                    </button>
                    <button
                        onClick={handleUndo}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                        title="Undo"
                        disabled={undoStack.length <= 1}
                    >
                        <Undo size={18} className={undoStack.length <= 1 ? 'opacity-50' : ''} />
                    </button>
                    <button
                        onClick={clearCanvas}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                        title="Clear Canvas"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={() => {
                            setIsExpanded(!isExpanded);
                            setCanvasHeight(isExpanded ? 200 : 500);
                        }}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                        title={isExpanded ? "Minimize" : "Maximize"}
                    >
                        {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                </div>
            </div>

            <div className="relative">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleCanvasClick}
                    onTouchStart={handleCanvasClick}
                    onMouseMove={draw}
                    onTouchMove={draw}
                    onMouseUp={stopDrawing}
                    onTouchEnd={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchCancel={stopDrawing}
                    className="w-full border rounded-lg cursor-crosshair bg-white transition-all duration-300"
                    style={{ 
                        touchAction: 'none',
                        height: `${canvasHeight}px`
                    }}
                />
                
                {/* Resize handle */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-transparent hover:bg-gray-200 transition-colors"
                    onMouseDown={handleResize}
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