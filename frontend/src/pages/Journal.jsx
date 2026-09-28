import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, FileText, LayoutGrid, List } from 'lucide-react';
import { postsApi } from '../services/api';
import { ArticleCard } from '../components/articles/ArticleCard';
import { TechTag } from '../components/ui/TechTag';
import { NeuralSkeletonLoader } from '../components/ui/NeuralSkeletonLoader';
import { ColdStartBanner } from '../components/ui/ColdStartBanner';

const CONTENT_TYPES = ['ALL', 'BUILD', 'THINK', 'LEARN', 'EXPLORE', 'INDUSTRY'];

export function Journal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = searchParams.get('type') || 'ALL';
  const activeTag = searchParams.get('tag') || '';
  const [searchQuery, setSearchQuery] = useState('');
  
  // Default to 'grid' view for square / box cards layout
  const [viewMode, setViewMode] = useState('grid');
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    postsApi.getAll({
      type: activeType,
      tag: activeTag,
      query: searchQuery
    }).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, [activeType, activeTag, searchQuery]);

  const handleTypeSelect = (type) => {
    const params = new URLSearchParams(searchParams);
    if (type === 'ALL') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    setSearchParams(params);
  };

  const handleTagClick = (tag) => {
    const params = new URLSearchParams(searchParams);
    if (activeTag === tag) {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    setSearchParams(params);
  };

  // Collect all unique tags
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));

  return (
    <div className="space-y-12">
      {/* Cold Start Banner Notification */}
      <ColdStartBanner />

      {/* Page Header */}
      <div className="space-y-4 max-w-5xl">
        <span className="text-xs font-mono text-[#6C8CFF] uppercase tracking-wider block">
          ENGINEERING ARCHIVE
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7FA]">
          THE JOURNAL
        </h1>
        <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
          Ideas, experiments, systems, and technical breakdowns documented as I build and explore.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-6 pt-4 border-t border-[#1D222B]">
        {/* Content Type Tabs & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {CONTENT_TYPES.map((type) => {
              const isActive = activeType === type;
              return (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-[#6C8CFF] text-[#08090B] font-bold shadow-md shadow-[#6C8CFF]/20'
                      : 'bg-[#11141A] text-[#9CA3AF] hover:text-[#F5F7FA] border border-[#1D222B] hover:border-[#2E3646]'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* Grid vs List View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#11141A] border border-[#1D222B] rounded-lg shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              title="Square Box Grid View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#6C8CFF] text-[#08090B] font-bold shadow-sm'
                  : 'text-[#9CA3AF] hover:text-[#F5F7FA]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              title="List Rectangle View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                viewMode === 'list'
                  ? 'bg-[#6C8CFF] text-[#08090B] font-bold shadow-sm'
                  : 'text-[#9CA3AF] hover:text-[#F5F7FA]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>

        {/* Search & Active Filters Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles by title, tag, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#11141A] border border-[#1D222B] rounded-lg text-sm text-[#F5F7FA] placeholder-[#6B7280] focus:outline-none focus:border-[#6C8CFF]/50 transition-colors font-sans"
            />
          </div>

          {/* Active Filter Indicators */}
          {(activeTag || searchQuery) && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF]">
              <span>Filtering by:</span>
              {activeTag && (
                <button
                  onClick={() => handleTagClick(activeTag)}
                  className="px-2 py-0.5 bg-[#6C8CFF]/20 text-[#6C8CFF] rounded border border-[#6C8CFF]/40"
                >
                  #{activeTag} ✕
                </button>
              )}
              {searchQuery && (
                <span className="text-[#F5F7FA]">"{searchQuery}"</span>
              )}
            </div>
          )}
        </div>

        {/* Tags Cloud */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-xs font-mono text-[#6B7280] mr-2">Tags:</span>
            {allTags.map((t) => (
              <TechTag
                key={t}
                active={activeTag === t}
                onClick={() => handleTagClick(t)}
              >
                {t}
              </TechTag>
            ))}
          </div>
        )}
      </div>

      {/* Articles Container (Grid Boxes vs List Rectangles) */}
      <div>
        {loading ? (
          <NeuralSkeletonLoader count={6} message="DECODING NEURAL SIGNAL ARCHIVE..." />
        ) : posts.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#0D1117] rounded-xl border border-[#1D222B] p-8">
            <FileText className="w-8 h-8 text-[#6B7280] mx-auto" />
            <div className="font-mono text-base text-[#F5F7FA]">No signals found.</div>
            <div className="text-sm text-[#9CA3AF]">
              Try adjusting your search query or content type filter.
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <ArticleCard key={post.id} post={post} index={idx} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, idx) => (
              <ArticleCard key={post.id} post={post} index={idx} variant="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
