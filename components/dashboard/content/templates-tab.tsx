"use client";

import { useEffect, useState } from "react";
import { PlatformTabs } from "@/components/dashboard/templates/platform-tabs";
import { TemplateFilters } from "@/components/dashboard/templates/template-filters";
import { TemplateGallery } from "@/components/dashboard/templates/template-gallery";

interface Template {
  id: string;
  name: string;
  category: string;
  type: "prebuilt" | "custom";
  example?: string;
  variables: Record<string, any>;
  isFavorite: boolean;
  usageCount: number;
}

export default function TemplatesTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>("linkedin");
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const categories = [
    { id: "twitter", label: "Twitter", icon: "twitter" },
    { id: "linkedin", label: "LinkedIn", icon: "linkedin" },
    { id: "reddit", label: "Reddit", icon: "reddit" },
    { id: "youtube", label: "YouTube", icon: "youtube" },
    { id: "email_subject", label: "Email Subject", icon: "mail" },
    { id: "email_body", label: "Email Body", icon: "fileText" },
    { id: "image_prompt", label: "Image Prompts", icon: "image" },
    { id: "video_prompt", label: "Video Prompts", icon: "video" },
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          category: selectedCategory,
          ...(filterType === "favorites" && { favorites: "true" }),
          ...(filterType !== "all" && filterType !== "favorites" && { type: filterType }),
          ...(searchQuery && { search: searchQuery }),
        });

        const response = await fetch(`/api/templates?${params}`);
        const data = await response.json();

        if (response.ok) {
          setTemplates(data.templates || []);
        } else {
          console.error("Failed to fetch templates:", data.error);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [selectedCategory, filterType, searchQuery]);

  const filteredTemplates = templates.filter((template) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        template.name.toLowerCase().includes(searchLower) ||
        (template.example && template.example.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            backgroundColor: "#111",
            borderBottom: "1px solid #222",
            flexShrink: 0,
          }}
        >
          <PlatformTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            variant="topbar"
          />
        </div>

        <div style={{ padding: "24px" }}>
          <TemplateFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterType={filterType}
            onFilterChange={setFilterType}
          />

          <TemplateGallery
            templates={filteredTemplates}
            loading={loading}
            onSelectTemplate={(template) => {
              console.log("Selected template:", template);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
      <div
        style={{
          width: "240px",
          backgroundColor: "#111",
          borderRight: "1px solid #222",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <PlatformTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div style={{ flex: 1, padding: "32px" }}>
        <TemplateFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
        />

        <TemplateGallery
          templates={filteredTemplates}
          loading={loading}
          onSelectTemplate={(template) => {
            console.log("Selected template:", template);
          }}
        />
      </div>
    </div>
  );
}
