import React, { useState } from 'react';
import { Search, Clock, User, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import { BlogPost } from '../types';

interface BlogViewProps {
  onSelectTab?: (tab: any) => void;
}

export const BlogView: React.FC<BlogViewProps> = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && post.category === selectedCategory;
  });

  const handleSharePost = (post: BlogPost) => {
    const shareUrl = `${window.location.origin}/goc-phong-thuy?slug=${post.slug}`;
    const text = `📖 ${post.title}\n${post.summary}\n🔗 Đọc ngay tại: ${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Đã sao chép liên kết bài viết vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="bg-white/90 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-amber-200/90 dark:border-oriental-dark-border p-4 sm:p-6 backdrop-blur-md transition-all min-h-[70vh]">
      
      {/* Blog Article Detail Modal/View */}
      {selectedPost ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-oriental-red-900 dark:text-oriental-gold-300 font-bold text-xs sm:text-sm hover:bg-amber-200 transition-colors border border-amber-300/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách bài viết</span>
          </button>

          {/* Article Header */}
          <div className="border-b border-amber-200/80 dark:border-oriental-dark-border pb-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-oriental-red-800 text-oriental-gold-300 shadow-sm border border-oriental-gold-500/40">
                {selectedPost.category === 'lich-am'
                  ? '📜 Lịch Âm Dương'
                  : selectedPost.category === 'van-khan'
                  ? '🙏 Văn Khấn Cổ Truyền'
                  : selectedPost.category === 'tu-vi'
                  ? '🔮 Tử Vi 12 Con Giáp'
                  : '☯️ Phong Thủy Khoa Học'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {selectedPost.readTime}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400 leading-tight">
              {selectedPost.title}
            </h1>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-amber-200/70 pt-1">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-amber-600" />
                <span>Tác giả: <strong>{selectedPost.author}</strong> • Ngày đăng: {selectedPost.publishedDate}</span>
              </div>

              <button
                onClick={() => handleSharePost(selectedPost)}
                className="flex items-center gap-1 px-3 py-1 bg-amber-200 dark:bg-amber-900/60 text-oriental-red-900 dark:text-oriental-gold-300 rounded-lg font-bold hover:bg-amber-300 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>

          {/* Article Summary Quote Box */}
          <div className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/70 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-4 rounded-2xl border-l-4 border-oriental-gold-500 shadow-2xs font-medium text-xs sm:text-sm text-slate-800 dark:text-amber-100 leading-relaxed">
            💡 <strong>Tóm tắt bài viết:</strong> "{selectedPost.summary}"
          </div>

          {/* Article Structured Content Render */}
          <div className="space-y-6 text-xs sm:text-base text-slate-800 dark:text-amber-100 font-sans leading-relaxed">
            {selectedPost.sections ? (
              selectedPost.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-3 bg-amber-50/40 dark:bg-oriental-dark-bg/40 p-4 sm:p-5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
                  
                  {/* Section H2 Heading */}
                  <h2 className="text-base sm:text-xl font-serif font-extrabold text-oriental-red-900 dark:text-oriental-gold-400 border-b border-amber-200/80 dark:border-amber-900/60 pb-2">
                    {section.heading}
                  </h2>

                  {/* Section Paragraph Body */}
                  <p className="text-slate-700 dark:text-amber-100 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                    {section.body}
                  </p>

                  {/* Bullet Points if exist */}
                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="space-y-2 pt-1 pl-2">
                      {section.bulletPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-800 dark:text-amber-200">
                          <span className="text-oriental-gold-500 font-black shrink-0">❖</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Highlight Callout Box if exists */}
                  {section.callout && (
                    <div className="mt-3 p-3.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-oriental-gold-500/50 text-xs sm:text-sm font-semibold text-oriental-red-900 dark:text-oriental-gold-300 flex items-center gap-2">
                      <span className="text-lg">🌟</span>
                      <span>{section.callout}</span>
                    </div>
                  )}

                </div>
              ))
            ) : (
              <article className="prose dark:prose-invert max-w-none text-xs sm:text-base text-slate-800 dark:text-amber-100 leading-relaxed font-sans space-y-4 whitespace-pre-line">
                {selectedPost.content}
              </article>
            )}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-amber-200/60 dark:border-oriental-dark-border flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-amber-600 shrink-0" />
            {selectedPost.tags.map((t, idx) => (
              <span key={idx} className="px-3 py-1 bg-amber-100/90 dark:bg-amber-950 text-oriental-red-900 dark:text-amber-200 text-xs font-bold rounded-lg border border-amber-300/40">
                #{t}
              </span>
            ))}
          </div>

        </div>
      ) : (
        /* Blog List Main View */
        <div className="space-y-6">
          
          {/* Top Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/70 dark:border-oriental-dark-border">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center shadow-oriental text-xl shrink-0 border border-oriental-gold-400">
                📖
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide flex items-center gap-2">
                  Góc Phong Thủy & Kiến Thức Lịch Âm
                </h2>
                <p className="text-xs text-amber-900/75 dark:text-amber-200/70 mt-0.5">
                  Cẩm nang xem ngày tốt xấu, văn khấn cổ truyền và kiến thức âm dương ngũ hành giúp cuộc sống an lành
                </p>
              </div>
            </div>
          </div>

          {/* Search & Categories Toolbar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết xem ngày tốt, văn khấn mùng 1, tử vi 12 con giáp..."
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/60 dark:bg-oriental-dark-bg border border-amber-200/80 dark:border-amber-900 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 shadow-2xs font-medium"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: '🌟 Tất Cả Bài Viết' },
                { id: 'lich-am', label: '📜 Cẩm Nang Lịch Âm' },
                { id: 'van-khan', label: '🙏 Văn Khấn Cổ Truyền' },
                { id: 'tu-vi', label: '🔮 Tử Vi 12 Con Giáp' },
                { id: 'phong-thuy', label: '☯️ Phong Thủy Nhà Ở' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-oriental-red-800 text-oriental-gold-300 shadow-sm border border-oriental-gold-500/40 scale-105'
                      : 'bg-amber-100/60 dark:bg-oriental-dark-bg text-slate-700 dark:text-amber-200/80 hover:bg-amber-200 border border-amber-200/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-amber-50/50 dark:bg-oriental-dark-bg/60 rounded-2xl p-5 border border-amber-200/80 dark:border-oriental-dark-border shadow-2xs hover:shadow-xl hover:border-oriental-gold-500/80 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-oriental-red-800 text-oriental-gold-300 shadow-2xs">
                      {post.category === 'lich-am'
                        ? 'Lịch Âm Dương'
                        : post.category === 'van-khan'
                        ? 'Văn Khấn'
                        : post.category === 'tu-vi'
                        ? 'Tử Vi'
                        : 'Phong Thủy'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif font-extrabold text-base sm:text-lg text-oriental-red-900 dark:text-oriental-gold-300 group-hover:text-amber-600 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-amber-200/80 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>Bởi {post.author}</span>
                  <span className="text-oriental-red-800 dark:text-oriental-gold-400 font-bold group-hover:underline flex items-center gap-1">
                    Đọc tiếp ➔
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
