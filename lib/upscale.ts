const baseUrl = process.env.API_URL || "https://lexica.qewertyy.dev";

export async function upscale(image: string, outputFormat: string) {
  const payload = {
    ...(outputFormat === "url" ? { image_url:image } : { image_data:image }),
    format: outputFormat,
  };
  const response = await fetch(baseUrl + "/upscale", {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (response.status === 200 && outputFormat === "binary"){
    return await response.arrayBuffer();
  }
  const data = await response.json();
  if (response.status !== 200 || data.code === 0) {
    return -2;
  }
  return data;
}