import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Plus, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

export default function Admin() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const { toast } = useToast();

  // Load links from localStorage on component mount
  useEffect(() => {
    const savedLinks = localStorage.getItem('admin-links');
    if (savedLinks) {
      try {
        setLinks(JSON.parse(savedLinks));
      } catch (error) {
        console.error('Error loading links:', error);
      }
    }
  }, []);

  // Save links to localStorage whenever links change
  useEffect(() => {
    localStorage.setItem('admin-links', JSON.stringify(links));
  }, [links]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both title and URL",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(newUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (including http:// or https://)",
        variant: "destructive"
      });
      return;
    }

    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url: newUrl.trim(),
      createdAt: new Date().toISOString()
    };

    setLinks(prev => [newLink, ...prev]);
    setNewTitle("");
    setNewUrl("");
    
    toast({
      title: "Link Added",
      description: "New link has been added successfully",
    });
  };

  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
    toast({
      title: "Link Deleted",
      description: "Link has been removed",
    });
  };

  const startEdit = (link: LinkItem) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const saveEdit = () => {
    if (!editTitle.trim() || !editUrl.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both title and URL",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(editUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (including http:// or https://)",
        variant: "destructive"
      });
      return;
    }

    setLinks(prev => prev.map(link => 
      link.id === editingId 
        ? { ...link, title: editTitle.trim(), url: editUrl.trim() }
        : link
    ));
    
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    
    toast({
      title: "Link Updated",
      description: "Link has been updated successfully",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
  };

  const currentActiveLink = links.length > 0 ? links[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Management</h1>
          <p className="text-gray-600">Manage links for your landing page. The most recent link will be used.</p>
        </div>

        {/* Current Active Link Display */}
        {currentActiveLink && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Current Active Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold text-green-900">{currentActiveLink.title}</p>
                <p className="text-green-700 break-all">{currentActiveLink.url}</p>
                <p className="text-sm text-green-600">
                  Added: {new Date(currentActiveLink.createdAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Link Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Link Title</Label>
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Premium Content Access"
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/your-link"
                />
              </div>
            </div>
            <Button onClick={addLink} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </CardContent>
        </Card>

        {/* Links List */}
        <Card>
          <CardHeader>
            <CardTitle>All Links ({links.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {links.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No links added yet. Add your first link above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {links.map((link, index) => (
                  <div key={link.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    {editingId === link.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`edit-title-${link.id}`}>Title</Label>
                            <Input
                              id={`edit-title-${link.id}`}
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-url-${link.id}`}>URL</Label>
                            <Input
                              id={`edit-url-${link.id}`}
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveEdit} size="sm">
                            Save
                          </Button>
                          <Button onClick={cancelEdit} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">{link.title}</h3>
                            {index === 0 && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 break-all mb-2">{link.url}</p>
                          <p className="text-xs text-gray-500">
                            Added: {new Date(link.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => startEdit(link)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => deleteLink(link.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• The most recently added link (top of the list) will be used on your landing page</li>
              <li>• Users must complete both countdown steps before accessing the link</li>
              <li>• You can edit or delete links anytime</li>
              <li>• Links are stored locally in your browser</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}