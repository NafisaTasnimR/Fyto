/**
 * Utility functions for handling image uploads in the journal
 */

/**
 * Convert file to base64 string
 * @param {File} file - The image file to convert
 * @returns {Promise<string>} - Base64 encoded string
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Compress image before upload
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width (default: 1200)
 * @param {number} maxHeight - Maximum height (default: 1200)
 * @param {number} quality - Image quality 0-1 (default: 0.8)
 * @returns {Promise<string>} - Compressed base64 image
 */
export const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };

            img.onerror = (error) => reject(error);
        };

        reader.onerror = (error) => reject(error);
    });
};

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes (default: 5MB)
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateImageFile = (file, maxSize = 5 * 1024 * 1024) => {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'File must be an image' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
    }

    return { valid: true, error: null };
};

/**
 * Get image dimensions
 * @param {string} imageUrl - The image URL or base64 string
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = reject;
        img.src = imageUrl;
    });
};

/**
 * Upload image to Cloudinary (optional - requires cloudinary setup)
 * @param {File} file - The image file to upload
 * @param {string} cloudName - Your Cloudinary cloud name
 * @param {string} uploadPreset - Your Cloudinary upload preset
 * @returns {Promise<string>} - Uploaded image URL
 */
export const uploadToCloudinary = async (file, cloudName, uploadPreset) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};
