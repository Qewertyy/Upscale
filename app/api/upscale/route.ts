import { NextRequest } from "next/server";
import {upscale as imageUpscale } from "@/lib/upscale";


async function handler(req: NextRequest) {
  let response = await upscale(req);
  if (response instanceof ArrayBuffer) {
    return new Response(
      response,
      { status: 200,statusText:"upscaled",headers: { "Content-Type": "image/png" },}
    );
  }
  const { status, ...rest } = response;
  return Response.json(rest, { status: status });
}

async function upscale(req: NextRequest) {
  const { image, format } = await req.json();
  if (!image) {
    return { message: "Bad Request", status: 400,code:0 };
  }
  const response = await imageUpscale(image, format ? format : "binary");
  if (response === -2) {
    return { message: "Internal Server Error", status: 500,code:0 };
  }
  if (response instanceof ArrayBuffer){
    return response
  }else{
    return { ...response, status: 200,code:2 };
  }
}

export { handler as POST};
export const runtime = 'edge';