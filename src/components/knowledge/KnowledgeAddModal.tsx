
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdded: () => void;
  categories: { id: string; name: string; }[];
}

const FILE_ACCEPT =
  ".pdf,.doc,.docx,.md,.txt,.csv,.pptx,.xlsx,.json,.zip";

export const KnowledgeAddModal: React.FC<Props> = ({
  open,
  onOpenChange,
  onAdded,
  categories,
}) => {
  const { toast } = useToast();
  const [tab, setTab] = useState("file");
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [fileCategory, setFileCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  // Link state
  const [linkTitle, setLinkTitle] = useState("");
  const [linkDescription, setLinkDescription] = useState("");
  const [linkCategory, setLinkCategory] = useState("");
  const [url, setUrl] = useState("");
  const [submittingLink, setSubmittingLink] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const reset = () => {
    setFile(null);
    setFileTitle("");
    setFileDescription("");
    setFileCategory("");
    setLinkTitle("");
    setLinkDescription("");
    setLinkCategory("");
    setUrl("");
    setUploading(false);
    setSubmittingLink(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !fileTitle) {
      toast({ title: "Please provide a title and choose a file.", variant: "destructive" });
      return;
    }
    setUploading(true);
    const storagePath = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("knowledge_docs")
      .upload(storagePath, file, { upsert: false });
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { error: dbErr } = await supabase.from("knowledge_documents").insert([
      {
        title: fileTitle,
        description: fileDescription,
        file_path: storagePath,
        category_id: fileCategory || null,
        file_type: file.type,
        tags: [],
      },
    ]);
    if (dbErr) {
      toast({ title: "Database error", description: dbErr.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    toast({ title: "Uploaded!", description: "File added to knowledge base." });
    reset();
    setUploading(false);
    onAdded();
    onOpenChange(false);
  }

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!url || !linkTitle) {
      toast({ title: "Please provide a title and a valid URL.", variant: "destructive" });
      return;
    }
    setSubmittingLink(true);
    const { error: dbErr } = await supabase.from("knowledge_documents").insert([
      {
        title: linkTitle,
        description: linkDescription,
        url,
        category_id: linkCategory || null,
        file_path: null,
        file_type: null,
        tags: [],
      },
    ]);
    if (dbErr) {
      toast({ title: "Database error", description: dbErr.message, variant: "destructive" });
      setSubmittingLink(false);
      return;
    }
    toast({ title: "Link added!", description: "Link saved in knowledge base." });
    reset();
    setSubmittingLink(false);
    onAdded();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { reset(); } onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Document</DialogTitle>
          <DialogDescription>Add a file or a link to the knowledge base.</DialogDescription>
        </DialogHeader>
        <Tabs value={tab} onValueChange={v => setTab(v)}>
          <TabsList className="flex mb-3 gap-2">
            <TabsTrigger value="file" className={`px-4 py-1 rounded ${tab === "file" ? "bg-cyber-red text-white" : "bg-cyber-gunmetal text-white/60"}`}>File</TabsTrigger>
            <TabsTrigger value="link" className={`px-4 py-1 rounded ${tab === "link" ? "bg-cyber-red text-white" : "bg-cyber-gunmetal text-white/60"}`}>Link</TabsTrigger>
          </TabsList>
          <TabsContent value="file">
            <form className="flex flex-col gap-3" onSubmit={handleUpload}>
              <Input
                required
                placeholder="Title"
                value={fileTitle}
                onChange={e => setFileTitle(e.target.value)}
                className="bg-cyber-gunmetal border-cyber-gunmetal text-white"
              />
              <select
                className="rounded-md p-2 bg-cyber-gunmetal border-cyber-gunmetal text-white"
                value={fileCategory}
                onChange={e => setFileCategory(e.target.value)}
              >
                <option value="">No category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <Input
                ref={fileInputRef}
                type="file"
                required
                accept={FILE_ACCEPT}
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="bg-cyber-gunmetal border-cyber-gunmetal text-white"
              />
              <Input
                placeholder="Description"
                value={fileDescription}
                onChange={e => setFileDescription(e.target.value)}
                className="bg-cyber-gunmetal border-cyber-gunmetal text-white"
              />
              <DialogFooter>
                <Button type="submit" disabled={uploading} className="bg-cyber-red text-white hover:bg-cyber-red-dark w-full">
                  {uploading ? "Uploading..." : "Add File"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value="link">
            <form className="flex flex-col gap-3" onSubmit={handleAddLink}>
              <Input
                required
                placeholder="Title"
                value={linkTitle}
                onChange={e => setLinkTitle(e.target.value)}
                className="bg-cyber-gunmetal border-cyber-gunmetal text-white"
              />
              <select
                className="rounded-md p-2 bg-cyber-gunmetal border-cyber-gunmetal text-white"
                value={linkCategory}
                onChange={e => setLinkCategory(e.target.value)}
              >
                <option value="">No category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <Input
                required
                placeholder="Paste link here (https://...)"
                value={url}
                type="url"
                pattern="https?://.+"
                onChange={e => setUrl(e.target.value)}
                className="bg-cyber-gunmetal border-cyber-gunmetal text-white"
              />
              <Input
                placeholder="Description"
                value={linkDescription}
                onChange={e => setLinkDescription(e.target.value)}
                className="bg-cyber-gunmetal border-cyber-gunmetal text-white"
              />
              <DialogFooter>
                <Button type="submit" disabled={submittingLink} className="bg-cyber-red text-white hover:bg-cyber-red-dark w-full">
                  {submittingLink ? "Adding..." : "Add Link"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
