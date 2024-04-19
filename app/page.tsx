"use client";
import { Dropzone } from "@/components/ui/dropzone";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { encodeUInt8ArraytoB4 } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast/useToast";
import { LoadImage } from "@/components/loadImage";

export default function HomeLayout() {
  return (
    <div className="flex sm:flex-row flex-col items-start sm:gap-12 gap-4 w-full p-[40px]">
      <div className="w-full">
        <Upscale />
        <p className="text-center mb-3">Source -&gt; <a target="_blank" className=" text-blue-200 hover:underline" href="https://github.com/Qewertyy/Upscale">Github</a></p>
      </div>
    </div>
  );
}

function Upscale() {
  const [files, setFiles] = useState<FileList | []>([]);
  const [image, setImage] = useState<string | null>(null);
  const [format, setFormat] = useState<"url" | "binary">("binary");
  const [loading, setLoading] = useState<boolean>(false);
  const [upscaledImage, setUpscaledImage] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();
  const { toast } = useToast();
  async function handleUpscale(a?: string) {
    const response = await fetch("/api/upscale", {
      method: "POST",
      body: JSON.stringify({
        image: image ? image : a,
        format: format,
      }),
    });
    if (response.status === 200) {
      toast({
        title: "Upscaled",
        description: "Image upscaled successfully",
      });
      if (format === "binary") {
        setUpscaledImage(
          "data:image/png;base64," +
            encodeUInt8ArraytoB4(new Uint8Array(await response.arrayBuffer()))
        );
      } else {
        const data = await response.json();
        setUpscaledImage(data.url);
      }
      setLoading(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to upscale image",
      });
    }
  }
  function validate() {
    if (format === "binary") {
      if (files.length === 0) {
        return false;
      }
    } else {
      if (!image) {
        return false;
      }
    }
    return true;
  }
  async function handleImage(e: any) {
    if (!validate()) {
      toast({
        title: "Error",
        description: "Please provide an image",
      });
      return;
    }
    setLoading(true);
    toast({
      title: "Upscaling...",
      description: "This may take a few minutes",
    });
    if (files?.length > 0 && format === "binary") {
      const file = files[0];
      if (file) {
        let fReader = new FileReader();
        fReader.readAsDataURL(file);
        fReader.onload = async function (event) {
          if (event.target) {
            const a = event.target.result?.toString().split(",")[1] as string;
            setImage(a);
            await handleUpscale(a);
          }
        };
      }
    } else {
      await handleUpscale();
    }
  }
  function downloadImage() {
    if (!upscaledImage) return;
    const a = document.createElement("a");
    a.href = upscaledImage;
    a.download = "upscaled.png";
    a.click();
    router.refresh();
  }
  return (
    <div className="flex justify-center flex-col items-center min-h-[80vh] align-middle">
      <Tabs
        defaultValue="file"
        className="w-[100%] flex justify-center flex-col items-center gap-1"
      >
        <TabsList className="w-[100%] md:w-[55%]" defaultValue="file">
          <TabsTrigger
            className="w-[100%] dark:data-[state=active]:text-white dark:data-[state=inactive]:text-black data-[state=active]:text-black data-[state=inactive]:text-white"
            value="file"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              setFormat("binary");
              e.persist();
            }}
          >
            File
          </TabsTrigger>
          <TabsTrigger
            className="w-[100%] dark:data-[state=active]:text-white dark:data-[state=inactive]:text-black data-[state=active]:text-black data-[state=inactive]:text-white"
            value="url"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              setFormat("url");
              e.persist();
            }}
          >
            URL
          </TabsTrigger>
        </TabsList>
        <TabsContent value="file" className="w-[100%] flex justify-center">
          <Dropzone
            onChange={setFiles}
            className="w-[100%] md:w-[40%]"
            fileTypes={["image/png", "image/jpeg"]}
          />
        </TabsContent>
        <TabsContent
          value="url"
          className="w-[100%] flex justify-center flex-col items-center"
        >
          <Input
            type="url"
            className="w-[90%] md:w-[45%] dark:bg-black dark:text-white mb-4"
            placeholder="Image URL"
            onChange={(e) => {
              setImage(e.target.value);
            }}
          />
        </TabsContent>
      </Tabs>
      <Button onClick={handleImage}>Upscale</Button>
      <div className="flex flex-col items-center gap-4 mt-7 mb-10">
        {loading ? (
          <LoadImage />
        ) : upscaledImage ? (
          <>
            <img
              src={upscaledImage}
              alt="Upscaled Image"
              className="w-[90%] md:w-[45%]"
            />
            <Button onClick={() => downloadImage()}>Download</Button>
          </>
        ): null}
      </div>
    </div>
  );
}
