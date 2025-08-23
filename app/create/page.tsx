"use client";

import type React from "react";

import { useState } from "react";
import { Upload, LinkIcon } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { addPin } from "@/lib/store/slices/pinsSlice";
import type { Pin } from "@/lib/store/slices/pinsSlice";

export default function CreatePage() {
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.boards);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [altText, setAltText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || (!imageUrl && activeTab === "url")) return;

    setIsLoading(true);

    try {
      const newPin: Pin = {
        id: `user-pin-${Date.now()}`,
        title: title.trim(),
        description: description.trim() || undefined,
        image_url:
          imageUrl ||
          `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(
            title
          )}`,
        source_url: sourceUrl.trim() || undefined,
        alt_text: altText.trim() || title.trim(),
        width: 300,
        height: 400,
        user_id: "demo-user",
        board_id: selectedBoard || undefined,
        created_at: new Date().toISOString(),
        user: {
          username: "you",
          display_name: "You",
          avatar_url: "/diverse-profile-avatars.png",
        },
      };

      dispatch(addPin(newPin));

      // Reset form
      setTitle("");
      setDescription("");
      setSourceUrl("");
      setImageUrl("");
      setSelectedBoard("");
      setAltText("");

      // TODO: Show success message and redirect
      console.log("Pin created successfully!");
    } catch (error) {
      console.error("Failed to create pin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Create Pin</h1>
        <p className="text-muted-foreground">Share your ideas with the world</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload/URL Section */}
        <Card className="card-theme">
          <CardHeader>
            <CardTitle>Add Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tab Selection */}
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "upload" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("upload")}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button
                variant={activeTab === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("url")}
                className="flex-1"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                From URL
              </Button>
            </div>

            {activeTab === "upload" ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  Drag and drop or click to upload
                </p>
                <p className="text-sm text-muted-foreground">
                  Recommended: 2:3 aspect ratio, less than 20MB
                </p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  Choose file
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="border-border focus:ring-primary"
                />
              </div>
            )}

            {/* Image Preview */}
            {imageUrl && (
              <div className="mt-4">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full max-w-sm mx-auto rounded-lg object-cover"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pin Details Section */}
        <Card className="card-theme">
          <CardHeader>
            <CardTitle>Pin Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Add a title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-border focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell everyone what your Pin is about"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="border-border focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="altText">Alt text</Label>
                <Input
                  id="altText"
                  placeholder="Explain what people can see in the Pin"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="border-border focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceUrl">Link (optional)</Label>
                <Input
                  id="sourceUrl"
                  type="url"
                  placeholder="Add a destination link"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="border-border focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="board">Board</Label>
                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                  <SelectTrigger className="border-border focus:ring-primary">
                    <SelectValue placeholder="Choose a board" />
                  </SelectTrigger>
                  <SelectContent>
                    {boards.map((board) => (
                      <SelectItem key={board.id} value={board.id}>
                        {board.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled={isLoading}
                >
                  Save as draft
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!title.trim() || isLoading}
                >
                  {isLoading ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
