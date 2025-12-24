"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Edit, Trash2 } from "lucide-react";

interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  draft: boolean;
  slug: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const userData = localStorage.getItem("admin_user");

    if (!token || !userData) {
      router.push("/admin/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchArticles(token);
  }, [router]);

  const fetchArticles = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/articles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/articles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setArticles(articles.filter((article) => article.id !== id));
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome, {user?.name || user?.email}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/articles/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Article
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{article.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {article.summary || "No summary"}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                      <span>{article.draft ? "Draft" : "Published"}</span>
                      <span>Slug: {article.slug}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/articles/${article.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
              {articles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No articles found. Create your first article!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

