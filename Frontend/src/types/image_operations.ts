export interface Operations {
    restoration: {
        upscale: upscale_type;
        polish: boolean;
    };
    resizing: {
        width: string;
        height: string;
        smart_cropping: cropping_type;
    };
    adjustments: {
        hdr: number;
    };
    background_removal: boolean;
    object_detection: boolean;
}

export type cropping_type = 'smart' | 'center' | 'none';
export type upscale_type = 'none' | 'smart_enhance' |'digital_art' | 'smart_resize' | 'photo' | 'faces';


// Example of creating a default operations object
export const defaultOperations: Operations = {
    restoration: {
        upscale: "photo",
        polish: false,
    },
    resizing: {
        width: "100%",
        height: "100%",
        smart_cropping: "center",
    },
    adjustments: {
        hdr: 0,
    },
    background_removal: false,
    object_detection: false,
};
