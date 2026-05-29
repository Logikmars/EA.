'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import adminStore from '@/stores/AdminStore';
import { resolveImageUrl } from '@/lib/media';

const ImageDropzone = ({
    label = 'Image',
    value,
    onUploaded,
}) => {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const previewUrl = resolveImageUrl(value);

    const handleFiles = async (fileList) => {
        const file = fileList?.[0];

        if (!file) {
            return;
        }

        const result = await adminStore.uploadImage(file);

        if (result.ok && result.url) {
            onUploaded(result.url);
        }
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        setIsDragging(false);
        await handleFiles(event.dataTransfer.files);
    };

    const handleChange = async (event) => {
        await handleFiles(event.target.files);
        event.target.value = '';
    };

    return (
        <div className='AdminField'>
            <span>{label}</span>
            <div
                className={`AdminDropzone${isDragging ? ' AdminDropzone__dragging' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDrop={handleDrop}
                role='button'
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        inputRef.current?.click();
                    }
                }}
            >
                <input
                    accept='image/*'
                    className='AdminDropzoneInput'
                    onChange={handleChange}
                    ref={inputRef}
                    type='file'
                />
                <strong>{adminStore.isUploadingFile ? 'Uploading image...' : 'Drop image here or click to choose'}</strong>
                <span>{value ? value : 'PNG, JPG, WEBP up to 8 MB'}</span>
            </div>
            {value ? (
                <div className='AdminUploadPreview'>
                    <Image
                        alt='Uploaded preview'
                        height={220}
                        sizes='(max-width: 768px) 100vw, 520px'
                        src={previewUrl}
                        unoptimized
                        width={520}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default ImageDropzone;
