import { useState } from 'react';
import { Search, Calendar, User, ArrowRight, Heart, MessageCircle, Share2, Bookmark, TrendingUp, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useScrollAnimation, useStaggeredAnimation } from './hooks/useScrollAnimation';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BlogProps {
  showPreview?: boolean;
  onNavigate?: () => void;
}

export function Blog({ showPreview = false, onNavigate }: BlogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { elementRef: heroRef } = useScrollAnimation();
  const { containerRef: postsRef } = useStaggeredAnimation(6, 150);
  const { containerRef: featuredRef } = useStaggeredAnimation(3, 200);

  const categories = [
    { id: 'all', name: 'All Posts', count: 124 },
    { id: 'pregnancy', name: 'Pregnancy Journey', count: 32 },
    { id: 'newborn', name: 'Newborn Care', count: 28 },
    { id: 'parenting', name: 'Parenting Tips', count: 35 },
    { id: 'wellness', name: 'Maternal Wellness', count: 21 },
    { id: 'stories', name: 'Real Stories', count: 18 },
  ];

  const featuredPosts = [
    {
      id: 1,
      title: 'The First 48 Hours: A New Mother\'s Guide',
      excerpt: 'What to expect and how to prepare for those crucial first hours with your newborn.',
      content: 'A comprehensive guide covering everything from the first feeding to understanding your baby\'s cues...',
      category: 'newborn',
      author: {
        name: 'Dr. Sarah Martinez',
        avatar: 'doctor woman',
        bio: 'Pediatrician & Mother of 3'
      },
      image: 'newborn first hours',
      publishDate: '2024-08-28',
      readTime: '8 min read',
      likes: 234,
      comments: 45,
      shares: 89,
      featured: true,
      trending: true,
      tags: ['newborn', 'first-time-mom', 'hospital', 'bonding']
    },
    {
      id: 2,
      title: 'Mental Health During Pregnancy: Breaking the Silence',
      excerpt: 'Addressing the importance of mental health support throughout pregnancy and beyond.',
      content: 'Pregnancy brings joy, but it can also bring anxiety and depression. Here\'s how to recognize the signs...',
      category: 'wellness',
      author: {
        name: 'Maria Rodriguez, LCSW',
        avatar: 'therapist woman',
        bio: 'Licensed Therapist specializing in Maternal Mental Health'
      },
      image: 'pregnancy mental health',
      publishDate: '2024-08-25',
      readTime: '12 min read',
      likes: 456,
      comments: 78,
      shares: 123,
      featured: true,
      trending: false,
      tags: ['mental-health', 'pregnancy', 'support', 'wellness']
    },
    {
      id: 3,
      title: 'From Struggle to Success: Nora\'s Breastfeeding Journey',
      excerpt: 'A real mother shares her challenges and triumphs in establishing a successful breastfeeding relationship.',
      content: 'Nora thought breastfeeding would be natural and easy. Her reality was quite different...',
      category: 'stories',
      author: {
        name: 'Nora Patel',
        avatar: 'indian mother',
        bio: 'First-time Mom & Software Engineer'
      },
      image: 'breastfeeding journey',
      publishDate: '2024-08-22',
      readTime: '6 min read',
      likes: 189,
      comments: 34,
      shares: 67,
      featured: true,
      trending: true,
      tags: ['breastfeeding', 'real-stories', 'challenges', 'success']
    }
  ];

  const recentPosts = [
    {
      id: 4,
      title: 'Building Your Birth Plan: What Really Matters',
      excerpt: 'Essential elements to consider when creating a birth plan that works for you.',
      category: 'pregnancy',
      author: { name: 'Jennifer Kim, CNM', avatar: 'midwife', bio: 'Certified Nurse Midwife' },
      image: 'birth plan',
      publishDate: '2024-08-20',
      readTime: '10 min read',
      likes: 156,
      comments: 23,
      shares: 45,
      tags: ['birth-plan', 'pregnancy', 'delivery']
    },
    {
      id: 5,
      title: 'Sleep Training Methods: Finding What Works for Your Family',
      excerpt: 'Exploring different approaches to help your baby develop healthy sleep habits.',
      category: 'parenting',
      author: { name: 'Dr. Amanda Chen', avatar: 'pediatric sleep specialist', bio: 'Pediatric Sleep Specialist' },
      image: 'baby sleep training',
      publishDate: '2024-08-18',
      readTime: '15 min read',
      likes: 298,
      comments: 67,
      shares: 112,
      tags: ['sleep-training', 'baby-sleep', 'parenting']
    },
    {
      id: 6,
      title: 'Postpartum Exercise: When and How to Start',
      excerpt: 'Safe and effective ways to begin your fitness journey after childbirth.',
      category: 'wellness',
      author: { name: 'Lisa Thompson, PT', avatar: 'physical therapist', bio: 'Postpartum Fitness Specialist' },
      image: 'postpartum exercise',
      publishDate: '2024-08-15',
      readTime: '7 min read',
      likes: 203,
      comments: 41,
      shares: 78,
      tags: ['postpartum', 'exercise', 'fitness', 'recovery']
    }
  ];

  const allPosts = [...featuredPosts, ...recentPosts];

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (showPreview) {
    return (
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Expert Insights & Real Stories
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Get the latest maternal care tips, expert advice, and inspiring stories from our community of mothers and healthcare professionals.
            </p>
            <Button 
              onClick={onNavigate}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              size="lg"
            >
              Read Our Blog
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredPosts.slice(0, 3).map((post, index) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg overflow-hidden">
                  <ImageWithFallback
                    src={`https://source.unsplash.com/400x250/?${encodeURIComponent(post.image)}`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-3">{categories.find(cat => cat.id === post.category)?.name}</Badge>
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.publishDate)}
                    <Clock className="w-3 h-3 ml-2" />
                    {post.readTime}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NeoNest Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Real stories, expert advice, and practical tips for your maternal journey. 
              Written by healthcare professionals and experienced mothers who understand your path.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 focus:border-primary/50 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="transition-all duration-300"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === 'all' && (
        <section className="py-16 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Featured Stories</h2>
            </div>
            
            <div ref={featuredRef} className="grid lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <Card key={post.id} className={`opacity-0 group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                  index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                }`}>
                  <div className="relative">
                    <div className={`${index === 0 ? 'aspect-[16/9]' : 'aspect-video'} bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg overflow-hidden`}>
                      <ImageWithFallback
                        src={`https://source.unsplash.com/800x400/?${encodeURIComponent(post.image)}`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {post.trending && (
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    <Badge className="absolute top-4 right-4 bg-black/20 text-white backdrop-blur-sm">
                      {categories.find(cat => cat.id === post.category)?.name}
                    </Badge>
                  </div>
                  
                  <CardHeader className={index === 0 ? 'pb-4' : 'pb-3'}>
                    <CardTitle className={`${index === 0 ? 'text-2xl' : 'text-lg'} leading-tight group-hover:text-primary transition-colors`}>
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className={`text-muted-foreground ${index === 0 ? 'text-base' : 'text-sm'} leading-relaxed`}>
                      {post.excerpt}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Author & Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={`https://source.unsplash.com/100x100/?${encodeURIComponent(post.author.avatar)}`} />
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{post.author.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.publishDate)}
                            <Clock className="w-3 h-3 ml-2" />
                            {post.readTime}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.comments}
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          {post.shares}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="p-0 h-auto">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button className="w-full group-hover:bg-primary transition-colors">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'Latest Articles' : `${categories.find(cat => cat.id === selectedCategory)?.name} Articles`}
            </h2>
            <p className="text-muted-foreground">
              {filteredPosts.length} articles found
            </p>
          </div>
          
          <div ref={postsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="opacity-0 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg overflow-hidden">
                    <ImageWithFallback
                      src={`https://source.unsplash.com/400x250/?${encodeURIComponent(post.image)}`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Badge className="absolute top-3 right-3 bg-black/20 text-white backdrop-blur-sm text-xs">
                    {categories.find(cat => cat.id === post.category)?.name}
                  </Badge>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={`https://source.unsplash.com/100x100/?${encodeURIComponent(post.author.avatar)}`} />
                      <AvatarFallback className="text-xs">{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">{post.author.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishDate)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.comments}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <Button className="w-full group-hover:bg-primary transition-colors">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or category selection.</p>
            </div>
          )}

          {/* Load More */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Never Miss a Story</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter and get the latest articles, tips, and stories delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1"
            />
            <Button className="bg-gradient-to-r from-primary to-secondary">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}