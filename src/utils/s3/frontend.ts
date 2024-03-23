async function fetchPresignedUrl(
    fileName: string,
    contentType: string,
): Promise<{ presignedUrl: string; imageUrl: string } | false> {
    const response = await fetch('/api/image/presigned/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, contentType }),
    });

    return response.ok ? response.json() : false;
}

export async function uploadImage(file: File) {
    const result = await fetchPresignedUrl(file.name, file.type);

    if (!result) {
        return false;
    }

    const { presignedUrl, imageUrl } = result;

    const response = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    });

    return response.ok ? imageUrl : false;
}
