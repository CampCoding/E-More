import { useState } from "react";

function useImageUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const uploadImages = async (files, fileType = "image") => {
    setIsLoading(true);
    setError(null);
    const responses = [];

    try {
      // Loop through all selected images and upload them one by one
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        if (files[i] instanceof File) {
          const endPoint =
            fileType == "image"
              ? "https://camp-coding.tech/nour_maison/admin/item_img_uploader.php"
              : "https://camp-coding.tech/nour_maison/admin/video_uploader.php";
          const fileKey = fileType == "image" ? "image" : "video_file";
          formData.append(fileKey, files[i]);
          const res = await fetch(endPoint, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error(`Failed to upload image ${i + 1}`);
          }

          const data = await res.json();
          responses.push( fileType == "image" ?  data.message : data?.message?.video_url); // Collect the response of each image upload
        } else {
          responses.push(files[i]);
        }
      }

      // Set all the responses once all images are uploaded
      setResponse(responses);
      return responses; // Return the collected responses
    } catch (err) {
      setError(err.message);
      return null; // If an error occurred, return null
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadImages,
    isLoading,
    error,
    response,
  };
}

export default useImageUpload;
