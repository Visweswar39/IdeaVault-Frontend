import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useRef, useState } from "react"

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");
            if (context) {
                canvas.style.backgroundColor = "#000000";
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
            }
        }
    }, []);

    const handleSubmit = (type: string) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const formData = new FormData();
            formData.append("image", canvas?.toDataURL("image/png"));
            formData.append("type", type);
            formData.append("dict_of_vars_str", "");
            axios
                .post(`https://ideavault.yaramanediviswes.workers.dev/run`, formData)
                .then((res) => {
                    toast({
                        title: "The Response is",
                        description: res.data,
                        draggable: true,
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            console.log("Please draw something");
        }
    };

    const reset = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (x: number, y: number) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");
            if (context) {
                context.strokeStyle = "#ffffff";
                context.beginPath();
                context.moveTo(x, y);
                setIsDrawing(true);
            }
        }
    };

    const draw = (x: number, y: number) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");
            if (context) {
                context.lineTo(x, y);
                context.stroke();
            }
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        const touch = e.touches[0];
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        const touch = e.touches[0];
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            draw(touch.clientX - rect.left, touch.clientY - rect.top);
        }
    };

    const handleTouchEnd = () => {
        stopDrawing();
    };

    return (
        <>
            <div className="bg-black absolute left-0 start-0 w-full h-10 grid grid-flow-row grid-cols-12 gap-4 z-10 p-2">
                <Button variant={"destructive"} className="col-span-2" onClick={reset}>
                    reset
                </Button>
                <div className="col-span-6"></div>
                <Button
                    variant={"secondary"}
                    className="col-span-2"
                    onClick={() => handleSubmit("describe")}
                >
                    Describe
                </Button>
                <Button
                    variant={"default"}
                    className="col-span-2"
                    onClick={() => handleSubmit("calculate")}
                >
                    calculate
                </Button>
            </div>
            <canvas
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="bg-black absolute top-0 left-0 w-full h-full"
                ref={canvasRef}
            />
        </>
    );
}
