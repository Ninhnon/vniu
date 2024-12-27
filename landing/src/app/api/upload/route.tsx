/* eslint-disable @typescript-eslint/no-unused-vars */

import { utapi } from '@/lib/uploadthingServer';

export async function POST(req: Request) {
  try {
    // Parse the form data
    const formData = await req.formData();
    const images = formData.getAll('images') as File[];
    console.log('🚀 ~ POST ~ images:', images);

    // Validate the images
    if (!images || images.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No images provided.', status: 400 }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Upload images to UploadThing
    const uploadImages = await utapi.uploadFiles(images);
    console.log('🚀 ~ POST ~ uploadImages:', uploadImages);
    if (!uploadImages) {
      throw new Error('Failed to upload images.');
    }

    // Format uploaded image data
    // const formattedImages = uploadImages.map((image) => ({
    //   id: image.data.key,
    //   name: image.data.name,
    //   url: image.data.url,
    // }));

    // console.log('🚀 ~ POST ~ formattedImages:', formattedImages);

    // Respond with success
    // JSON.stringify({ data: { uploadImages: formattedImages }, status: 200 }),

    return new Response(JSON.stringify({ data: {}, status: 200 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('🚀 ~ POST ~ error:', error);
    return new Response(
      JSON.stringify({ message: 'Error processing request.', status: 500 }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
