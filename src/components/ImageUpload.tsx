import {useState, useRef} from 'react';
import type {DragEvent, ChangeEvent} from 'react';

export interface UploadedImage {
    id: string;
    file: File;
    preview: string;
    name: string;
}

interface ImageUploadProps {
    onImagesChange?: (images: UploadedImage[]) => void;
}

export function ImageUpload({onImagesChange}: ImageUploadProps) {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const imageFiles = Array.from(files).filter((file) =>
            file.type.startsWith('image/')
        );

        const newImages: UploadedImage[] = imageFiles.map((file) => ({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file),
            name: file.name
        }));

        setUploadedImages((prev) => {
            const updated = [...prev, ...newImages];
            onImagesChange?.(updated);
            return updated;
        });
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        handleFiles(e.dataTransfer.files);
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleRemoveImage = (id: string) => {
        setUploadedImages((prev) => {
            const imageToRemove = prev.find((img) => img.id === id);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            const updated = prev.filter((img) => img.id !== id);
            onImagesChange?.(updated);
            return updated;
        });
    };

    const handleClearAll = () => {
        uploadedImages.forEach((img) => URL.revokeObjectURL(img.preview));
        setUploadedImages([]);
        onImagesChange?.([]);
    };

    return (
        <div
            style={{
                backgroundColor: '#1a1a1a',
                padding: '2rem',
                borderRadius: '12px',
                border: '2px solid #333'
            }}
        >
            <h2 style={{margin: '0 0 1.5rem 0', fontSize: '1.5rem'}}>
                🖼️ Eigene Symbole hochladen
            </h2>

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    border: `3px dashed ${isDragging ? '#646cff' : '#444'}`,
                    borderRadius: '12px',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragging
                        ? 'rgba(100, 108, 255, 0.1)'
                        : '#0a0a0a',
                    transition: 'all 0.2s',
                    marginBottom: '1.5rem'
                }}
            >
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>
                    {isDragging ? '📥' : '📁'}
                </div>
                <p
                    style={{
                        fontSize: '1.1rem',
                        margin: '0 0 0.5rem 0',
                        color: isDragging ? '#646cff' : '#fff'
                    }}
                >
                    {isDragging
                        ? 'Bilder hier ablegen...'
                        : 'Klicken oder Bilder hierher ziehen'}
                </p>
                <p style={{fontSize: '0.9rem', color: '#888', margin: 0}}>
                    Unterstützt: JPG, PNG, GIF, WebP (mehrere Dateien möglich)
                </p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                style={{display: 'none'}}
            />

            {/* Upload Stats & Clear Button */}
            {uploadedImages.length > 0 && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#0a0a0a',
                        borderRadius: '8px'
                    }}
                >
                    <div>
                        <strong style={{color: '#646cff'}}>
                            {uploadedImages.length}
                        </strong>{' '}
                        {uploadedImages.length === 1
                            ? 'Symbol hochgeladen'
                            : 'Symbole hochgeladen'}
                    </div>
                    <button
                        onClick={handleClearAll}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = '#d32f2f')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = '#f44336')
                        }
                    >
                        🗑️ Alle löschen
                    </button>
                </div>
            )}

            {/* Preview Grid */}
            {uploadedImages.length > 0 && (
                <div>
                    <h3
                        style={{
                            margin: '0 0 1rem 0',
                            fontSize: '1.1rem',
                            color: '#888'
                        }}
                    >
                        Hochgeladene Symbole:
                    </h3>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fill, minmax(100px, 1fr))',
                            gap: '1rem'
                        }}
                    >
                        {uploadedImages.map((image) => (
                            <div
                                key={image.id}
                                style={{
                                    position: 'relative',
                                    aspectRatio: '1',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    border: '3px solid #646cff',
                                    backgroundColor: '#2a2a2a',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                }}
                            >
                                <img
                                    src={image.preview}
                                    alt={image.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemoveImage(image.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '4px',
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor:
                                            'rgba(244, 67, 54, 0.9)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0,
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            '#f44336';
                                        e.currentTarget.style.transform =
                                            'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            'rgba(244, 67, 54, 0.9)';
                                        e.currentTarget.style.transform =
                                            'scale(1)';
                                    }}
                                >
                                    ×
                                </button>
                                {/* Image Name Tooltip */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        padding: '4px',
                                        fontSize: '0.7rem',
                                        textAlign: 'center',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                    title={image.name}
                                >
                                    {image.name.replace(/\.[^/.]+$/, '')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
