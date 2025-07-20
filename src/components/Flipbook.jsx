import React, { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import pdf from './resouses/ByteBeatJan2024.pdf';
import flipSoundFile from './resouses/flip.mp3';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Pages = React.forwardRef(({ children, number }, ref) => {
    return (
        <div
            ref={ref}
            className="w-full h-full bg-white flex flex-col items-center justify-center"
        >
            {children}
            <p className="text-center text-sm mt-2">Page {number}</p>
        </div>
    );
});
Pages.displayName = 'Pages';

function Flipbook() {
    const [numPages, setNumPages] = useState(null);
    const bookRef = useRef();
    const audioRef = useRef(new Audio(flipSoundFile)); // create once

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleFlip = () => {
        const flipSound = audioRef.current;

        if (flipSound) {
            // if playing, reset without interrupting too hard
            if (!flipSound.paused) {
                flipSound.pause();
                flipSound.currentTime = 0;
            } else {
                flipSound.currentTime = 0;
            }

            flipSound
                .play()
                .catch(() => {
                    // Handle autoplay errors silently
                });
        }
    };

    useEffect(() => {
        // Preload sound manually
        audioRef.current.load();

        const handleKeyDown = (e) => {
            if (!bookRef.current) return;
            if (e.key === 'ArrowRight') bookRef.current.pageFlip().flipNext();
            if (e.key === 'ArrowLeft') bookRef.current.pageFlip().flipPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="w-screen h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
            <div className="flex items-center justify-center">
            <HTMLFlipBook
                width={400}
                height={570}
                minWidth={400}
                maxWidth={400}
                minHeight={570}
                maxHeight={570}
                size="fixed"
                showCover={true}
                mobileScrollSupport={true}
                drawShadow={false}
                ref={bookRef}
                onFlip={handleFlip}
                className="outline-none"
            >
                {Array.from(new Array(numPages), (_, index) => (
                    <Pages key={index} number={index + 1}>
                        <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess} loading="Loading PDF...">
                            <Page
                                pageNumber={index + 1}
                                width={400}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                            />
                        </Document>
                    </Pages>
                ))}
            </HTMLFlipBook>
            </div>
        </div>
    );
}

export default Flipbook;
