"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface UploadedImage {
  filename: string;
  originalname: string;
  url: string;
  path: string;
}

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    date: "",
    tags: "",
    draft: false,
    layout: "PostLayout",
  });

  const handleUnauthorized = () => {
    localStorage.removeItem("admin_token");
    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    router.push("/admin/login");
  };

  const fetchArticle = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/articles/${articleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        const article = await response.json();
        setFormData({
          title: article.title || "",
          summary: article.summary || "",
          content: article.content || "",
          date: article.date ? article.date.split("T")[0] : "",
          tags: article.tags ? article.tags.join(", ") : "",
          draft: article.draft || false,
          layout: article.layout || "PostLayout",
        });
        if (article.images && article.images.length > 0) {
          setExistingImages(article.images);
        }
      }
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoadingArticle(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchArticle(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token = localStorage.getItem("admin_token");
    if (!token) {
      handleUnauthorized();
      return;
    }

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

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

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

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
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
    if (!token) {
      handleUnauthorized();
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    // Combine existing images with newly uploaded images
    const allImages = [
      ...existingImages,
      ...uploadedImages.map((img) => img.url),
    ];

    try {
      const response = await fetch(`${API_URL}/api/articles/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          images: allImages,
        }),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update article");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loadingArticle) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
                <CardTitle>Edit Article</CardTitle>
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
                      Tip: Click on images to insert them into content
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
                          Updating...
                        </>
                      ) : (
                        "Update Article"
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

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">
                      Current Images ({existingImages.length})
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {existingImages.map((imgUrl, index) => (
                        <div
                          key={`existing-${index}`}
                          className="relative group rounded-lg overflow-hidden border"
                        >
                          <Image
                            src={imgUrl}
                            alt={`Image ${index + 1}`}
                            width={150}
                            height={100}
                            className="w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => insertImageToContent(imgUrl)}
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newly Uploaded Images */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">
                      New Uploads ({uploadedImages.length})
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.map((img, index) => (
                        <div
                          key={`new-${index}`}
                          className="relative group rounded-lg overflow-hidden border border-green-500"
                        >
                          <Image
                            src={img.url}
                            alt={img.originalname}
                            width={150}
                            height={100}
                            className="w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => insertImageToContent(img.url)}
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs p-1 truncate">
                            NEW: {img.originalname}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Help text */}
                <div className="pt-4 border-t text-sm text-gray-500">
                  <p>• Click an image to insert into content</p>
                  <p>• First image = article thumbnail</p>
                  <p>• Hover & click X to remove</p>
                </div>
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
                  {(existingImages.length > 0 || uploadedImages.length > 0) && (
                    <div className="p-6 border-b dark:border-gray-700">
                      <div className="relative w-full aspect-video max-h-[400px] overflow-hidden rounded-xl">
                        <Image
                          src={existingImages[0] || uploadedImages[0]?.url}
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
