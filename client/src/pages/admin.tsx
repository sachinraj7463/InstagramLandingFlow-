import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Plus, ExternalLink, Eye, EyeOff, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

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
  const [showPreview, setShowPreview] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin-authenticated");
    if (!isAuthenticated) {
      setLocation("/");
      toast({
        title: "Access Denied",
        description: "Please login to access the admin panel",
        variant: "destructive"
      });
    }
  }, [setLocation, toast]);

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

  const togglePreview = () => {
    if (!newTitle.trim() || !newUrl.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both title and URL to preview",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(newUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL to preview",
        variant: "destructive"
      });
      return;
    }

    setShowPreview(!showPreview);
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
    setShowPreview(false);
    
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

  const handleLogout = () => {
    localStorage.removeItem("admin-authenticated");
    setLocation("/");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const currentActiveLink = links.length > 0 ? links[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Link Management Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage links for your landing page. The most recent link will be used for redirects.</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 w-fit">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
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
            
            {/* Preview Toggle & Add Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={togglePreview} 
                variant="outline" 
                className="flex-1 sm:flex-none"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? "Hide Preview" : "Preview Link"}
              </Button>
              <Button onClick={addLink} className="flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>

            {/* Link Preview Section */}
            {showPreview && newTitle.trim() && newUrl.trim() && (
              <div className="mt-6 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Link Preview</h4>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{newTitle.trim()}</h3>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Will be Active
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 break-all mb-2">{newUrl.trim()}</p>
                      <p className="text-xs text-gray-500">
                        Will be added: {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-blue-700">
                  <p>✨ This link will become the active redirect URL for your landing page once added.</p>
                </div>
              </div>
            )}
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

        {/* Analytics & Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Links</p>
                  <p className="text-2xl font-bold text-gray-900">{links.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ExternalLink className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Active Link</p>
                  <p className="text-2xl font-bold text-green-600">{currentActiveLink ? '1' : '0'}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Last Added</p>
                  <p className="text-sm font-bold text-gray-900">
                    {currentActiveLink ? new Date(currentActiveLink.createdAt).toLocaleDateString() : 'No links'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Plus className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <Card className="mt-8 mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.open('/', '_blank')}
              >
                <ExternalLink className="w-6 h-6" />
                <span className="text-sm">View Landing Page</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => {
                  const data = JSON.stringify(links, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'links-backup.json';
                  a.click();
                }}
              >
                <Eye className="w-6 h-6" />
                <span className="text-sm">Export Links</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => {
                  setLinks([]);
                  toast({
                    title: "Links Cleared",
                    description: "All links have been removed",
                  });
                }}
              >
                <Trash2 className="w-6 h-6" />
                <span className="text-sm">Clear All</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.reload()}
              >
                <Plus className="w-6 h-6" />
                <span className="text-sm">Refresh Page</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="mt-8 mb-8">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Current Session</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Login Time:</span>
                    <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Browser:</span>
                    <span className="font-medium">{navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-medium">{navigator.platform}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Storage Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage Type:</span>
                    <span className="font-medium">Local Browser</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Size:</span>
                    <span className="font-medium">{JSON.stringify(links).length} bytes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto-Save:</span>
                    <span className="font-medium text-green-600">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How it works:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-900 mb-3">Link Management</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    The most recently added link (top of the list) will be used on your landing page
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Users must complete both countdown steps before accessing the link
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    You can edit or delete links anytime using the action buttons
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-900 mb-3">Security & Storage</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    All links are stored securely in your browser's local storage
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Admin access is protected with login credentials
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Data persists across browser sessions until manually cleared
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 Link Management Dashboard. Built for efficient landing page management.</p>
        </div>
      </div>
    </div>
  );
}