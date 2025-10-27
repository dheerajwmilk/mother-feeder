import { useState } from 'react';
import { Search, Filter, Clock, User, ArrowRight, BookOpen, Video, FileText, Podcast, Download, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useScrollAnimation, useStaggeredAnimation } from './hooks/useScrollAnimation';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface KnowledgeHubProps {
  showPreview?: boolean;
  onNavigate?: () => void;
}

export function KnowledgeHub({ showPreview = false, onNavigate }: KnowledgeHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { elementRef: heroRef } = useScrollAnimation();
  const { containerRef: resourcesRef } = useStaggeredAnimation(6, 150);
  const { containerRef: categoriesRef } = useStaggeredAnimation(4, 100);

  const categories = [
    { id: 'all', name: 'All Resources', count: 156 },
    { id: 'pregnancy', name: 'Pregnancy', count: 42 },
    { id: 'newborn', name: 'Newborn Care', count: 38 },
    { id: 'postpartum', name: 'Postpartum', count: 29 },
    { id: 'nutrition', name: 'Nutrition', count: 31 },
    { id: 'mental-health', name: 'Mental Health', count: 16 },
  ];

  const featuredResources = [
    {
      id: 1,
      title: 'Complete Guide to Newborn Sleep Patterns',
      description: 'Understanding your baby\'s sleep cycles and establishing healthy sleep routines from day one.',
      type: 'guide',
      icon: BookOpen,
      category: 'newborn',
      readTime: '12 min read',
      author: 'Dr. Sarah Johnson',
      image: 'sleeping baby',
      featured: true,
      downloads: 2400,
    },
    {
      id: 2,
      title: 'Postpartum Mental Health: What to Expect',
      description: 'Recognizing signs, seeking support, and building resilience during the postpartum period.',
      type: 'video',
      icon: Video,
      category: 'mental-health',
      readTime: '18 min watch',
      author: 'Maria Rodriguez, LCSW',
      image: 'mother mental health',
      featured: true,
      downloads: 1800,
    },
    {
      id: 3,
      title: 'Nutrition During Pregnancy: Essential Guidelines',
      description: 'Comprehensive nutrition guide for healthy pregnancy and fetal development.',
      type: 'pdf',
      icon: FileText,
      category: 'nutrition',
      readTime: '8 min read',
      author: 'Nutritionist Emily Chen',
      image: 'pregnancy nutrition',
      featured: true,
      downloads: 3200,
    },
    {
      id: 4,
      title: 'Breastfeeding Success Podcast Series',
      description: 'Expert tips and real stories from mothers navigating their breastfeeding journey.',
      type: 'podcast',
      icon: Podcast,
      category: 'newborn',
      readTime: '45 min listen',
      author: 'Lactation Consultant Jane Smith',
      image: 'breastfeeding',
      featured: false,
      downloads: 1600,
    },
    {
      id: 5,
      title: 'First Trimester Wellness Checklist',
      description: 'Your complete guide to staying healthy and prepared during early pregnancy.',
      type: 'checklist',
      icon: FileText,
      category: 'pregnancy',
      readTime: '5 min read',
      author: 'Dr. Michael Thompson',
      image: 'pregnancy checklist',
      featured: false,
      downloads: 2100,
    },
    {
      id: 6,
      title: 'Baby Massage Techniques Video Course',
      description: 'Learn professional massage techniques to bond with your baby and promote development.',
      type: 'video',
      icon: Video,
      category: 'newborn',
      readTime: '25 min course',
      author: 'Certified Massage Therapist Lisa Park',
      image: 'baby massage',
      featured: false,
      downloads: 980,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'video': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pdf': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'podcast': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'checklist': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredResources = featuredResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (showPreview) {
    return (
      <section className="py-20 bg-gradient-to-br from-accent/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Expert Knowledge at Your Fingertips
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Access comprehensive guides, video tutorials, expert articles, and downloadable resources covering every aspect of maternal and baby care.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>150+ Expert Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                <span>25+ Video Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" />
                <span>50+ Downloads</span>
              </div>
            </div>

            <Button 
              onClick={onNavigate}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              size="lg"
            >
              Explore Knowledge Hub
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredResources.slice(0, 3).map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Card key={resource.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg overflow-hidden">
                      <ImageWithFallback
                        src={`https://source.unsplash.com/400x250/?${encodeURIComponent(resource.image)}`}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <Badge className={`absolute top-3 right-3 ${getTypeColor(resource.type)}`}>
                      <IconComponent className="w-3 h-3 mr-1" />
                      {resource.type}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {resource.readTime}
                      <Download className="w-3 h-3 ml-2" />
                      {resource.downloads.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
              Knowledge Hub
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Expert-curated resources, guides, and insights to support you through every stage of your maternal journey.
              From pregnancy to postpartum care, find trusted information when you need it most.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search articles, guides, videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 focus:border-primary/50 bg-white/80 backdrop-blur-sm"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>150+ Expert Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                <span>25+ Video Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" />
                <span>50+ Downloads</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={categoriesRef} className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="opacity-0 transition-all duration-300"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={resourcesRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Card key={resource.id} className="opacity-0 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg overflow-hidden">
                      <ImageWithFallback
                        src={`https://source.unsplash.com/400x250/?${encodeURIComponent(resource.image)}`}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {resource.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge className={`absolute top-3 right-3 ${getTypeColor(resource.type)}`}>
                      <IconComponent className="w-3 h-3 mr-1" />
                      {resource.type}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {resource.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {resource.readTime}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {resource.downloads.toLocaleString()}
                      </div>
                    </div>
                    
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Access Resource
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
            </div>
          )}

          {/* Load More */}
          {filteredResources.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Resources
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
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8">
            Get notified when we publish new resources and expert insights.
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