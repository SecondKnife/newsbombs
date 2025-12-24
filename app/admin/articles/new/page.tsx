"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X, Image as ImageIcon, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

// Dynamically import RichTextEditor to avoid SSR issues with CKEditor
const RichTextEditor = dynamic(
  () => import("@/components/RichTextEditor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-md p-4 bg-gray-100 dark:bg-gray-800 animate-pulse h-64 flex items-center justify-center">
        <span className="text-gray-500">Loading editor...</span>
      </div>
    ),
  }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? '/api' : 'http://localhost:3001');

interface UploadedImage {
  filename: string;
  originalname: string;
  url: string;
  path: string;
}

export default function NewArticle() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    draft: true, // Default to draft
    layout: "PostLayout",
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token = localStorage.getItem("admin_token");
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/api/articles/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUploadedImages((prev) => [...prev, data]);
        } else {
          const error = await response.json();
          alert(`Failed to upload ${file.name}: ${error.message || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("An error occurred while uploading");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const insertImageToContent = (url: string) => {
    const imageMarkdown = `\n![Image](${url})\n`;
    setFormData((prev) => ({
      ...prev,
      content: prev.content + imageMarkdown,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("admin_token");
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    try {
      const response = await fetch(`${API_URL}/api/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          images: uploadedImages.map((img) => img.url),
        }),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to create article");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Create New Article</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter article title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) =>
                        setFormData({ ...formData, summary: e.target.value })
                      }
                      placeholder="Brief description of the article"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(value) =>
                        setFormData({ ...formData, content: value })
                      }
                      placeholder="Write your article content here..."
                      minHeight="400px"
                    />
                    <p className="text-sm text-gray-500">
                      Tip: Click on uploaded images to insert them into content
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="layout">Layout</Label>
                      <select
                        id="layout"
                        value={formData.layout}
                        onChange={(e) =>
                          setFormData({ ...formData, layout: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="PostLayout">Post Layout</option>
                        <option value="PostSimple">Simple Layout</option>
                        <option value="PostBanner">Banner Layout</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="news, technology, vietnam"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="draft"
                      checked={formData.draft}
                      onChange={(e) =>
                        setFormData({ ...formData, draft: e.target.checked })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="draft">Save as draft (not published)</Label>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : formData.draft ? (
                        "Save Draft"
                      ) : (
                        "Publish Article"
                      )}
                    </Button>
                    <Link href="/admin/dashboard">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Image Upload Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Button */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {uploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-500">
                      {uploading ? "Uploading..." : "Click to upload images"}
                    </span>
                    <span className="text-xs text-gray-400">
                      JPG, PNG, GIF, WebP (max 10MB)
                    </span>
                  </label>
                </div>

                {/* Uploaded Images */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">
                      Uploaded ({uploadedImages.length})
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.map((img, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden border"
                        >
                          <Image
                            src={img.url}
                            alt={img.originalname}
                            width={150}
                            height={100}
                            className="w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => insertImageToContent(img.url)}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                            {img.originalname}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Click an image to insert into content
                    </p>
                  </div>
                )}

                {/* First image as featured */}
                {uploadedImages.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Featured image:</strong> First uploaded image will be used as the article thumbnail.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show Preview
                  </>
                )}
              </Button>
            </CardHeader>
            {showPreview && (
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                  {/* Article Header */}
                  <div className="p-6 border-b dark:border-gray-700">
                    <div className="text-center space-y-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {dayjs(formData.date).format("dddd, MMMM DD, YYYY")}
                      </p>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                        {formData.title || "Article Title"}
                      </h1>
                      {formData.summary && (
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                          {formData.summary}
                        </p>
                      )}
                      {formData.tags && (
                        <div className="flex flex-wrap justify-center gap-2">
                          {formData.tags.split(",").map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Featured Image */}
                  {uploadedImages.length > 0 && (
                    <div className="p-6 border-b dark:border-gray-700">
                      <div className="relative w-full aspect-video max-h-[400px] overflow-hidden rounded-xl">
                        <Image
                          src={uploadedImages[0].url}
                          alt="Featured"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-6">
                    <div
                      className="prose prose-lg dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: formData.content || "<p class='text-gray-400'>Content will appear here...</p>",
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
