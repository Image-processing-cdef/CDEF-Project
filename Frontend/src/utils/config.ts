
export const config = {
    url: import.meta.env.VITE_APPWRITE_URL as string,
    project_id: import.meta.env.VITE_APPWRITE_PROJECT as string,
    bucket_id: import.meta.env.VITE_APPWRITE_BUCKET as string,
    database: import.meta.env.VITE_APPWRITE_DATABASE as string,
    collection: import.meta.env.VITE_APPWRITE_COLLECTION as string,
    operations_collection: import.meta.env.VITE_APPWRITE_OPERATIONS_COLLECTION as string,
    resizing_collection: import.meta.env.VITE_APPWRITE_RESIZING_COLLECTION as string,
    restoration_collection: import.meta.env.VITE_APPWRITE_RESTORATION_COLLECTION as string,
    adjustments_collection: import.meta.env.VITE_APPWRITE_ADJUSTMENT_COLLECTION as string
}