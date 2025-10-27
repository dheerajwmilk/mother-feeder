import { GraduationCap, Award, Users, TrendingUp, Play, BookOpen, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const trainingModules = [
  {
    id: 'newborn-basics',
    title: 'Newborn Care Fundamentals',
    duration: '4 hours',
    level: 'Beginner',
    students: 1250,
    rating: 4.9,
    description: 'Essential skills for caring for newborns including feeding, diapering, and safety.',
    progress: 85,
  },
  {
    id: 'maternal-support',
    title: 'Postpartum Maternal Support',
    duration: '6 hours',
    level: 'Intermediate',
    students: 890,
    rating: 4.8,
    description: 'Supporting mothers through recovery, breastfeeding, and emotional wellness.',
    progress: 60,
  },
  {
    id: 'emergency-response',
    title: 'Emergency Response & First Aid',
    duration: '8 hours',
    level: 'Advanced',
    students: 645,
    rating: 4.9,
    description: 'Critical response skills for infant and maternal emergencies.',
    progress: 30,
  },
];

const certifications = [
  {
    icon: Award,
    title: 'Certified Newborn Caregiver',
    description: 'Comprehensive certification in newborn care and safety',
    color: 'from-primary/20 to-primary/10',
    iconColor: 'text-primary',
  },
  {
    icon: GraduationCap,
    title: 'Maternal Support Specialist',
    description: 'Advanced training in postpartum care and support',
    color: 'from-secondary/20 to-secondary/10',
    iconColor: 'text-secondary',
  },
  {
    icon: Users,
    title: 'Family Care Coordinator',
    description: 'Leadership role managing care teams and families',
    color: 'from-accent/20 to-accent/10',
    iconColor: 'text-accent',
  },
];

type AppView = 'home' | 'auth' | 'blog' | 'knowledge' | 'caregiver-signup' | 'book-care' | 'faq' | 'legal';

interface TrainingPortalProps {
  onNavigate?: (view: AppView) => void;
}

export function TrainingPortal({ onNavigate }: TrainingPortalProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-accent/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 mb-4">
            <span className="text-sm font-medium text-primary">🎓 Professional Development</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Training & Employment
          </h2>
          <p className="text-lg text-muted-foreground">
            Join our comprehensive training program and become a certified NeoNest caregiver. 
            Build meaningful career while making a difference in families' lives.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Training Modules */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-8">Training Modules</h3>
            
            <div className="space-y-6">
              {trainingModules.map((module) => (
                <Card key={module.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {module.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {module.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {module.students.toLocaleString()} students
                          </div>
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            {module.rating}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-primary border border-primary/20"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8">
                <BookOpen className="w-4 h-4 mr-2" />
                View All Courses
              </Button>
            </div>
          </div>

          {/* Certifications & Benefits */}
          <div className="space-y-8">
            {/* Certifications */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Certifications Available</h3>
              
              <div className="space-y-4">
                {certifications.map((cert) => {
                  const Icon = cert.icon;
                  return (
                    <Card key={cert.title} className="group hover:shadow-lg transition-all duration-300 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`w-6 h-6 ${cert.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {cert.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">{cert.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Benefits */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Why Join NeoNest?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-foreground">Flexible Schedule</p>
                      <p className="text-sm text-muted-foreground">Work when it suits your lifestyle</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-foreground">Competitive Pay</p>
                      <p className="text-sm text-muted-foreground">$25-45/hour based on certification</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-foreground">Ongoing Support</p>
                      <p className="text-sm text-muted-foreground">Mentorship and community network</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-chart-4 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-foreground">Career Growth</p>
                      <p className="text-sm text-muted-foreground">Leadership and specialization opportunities</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1">500+</div>
                <div className="text-xs text-muted-foreground">Trained Caregivers</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl">
                <div className="text-2xl font-bold text-secondary mb-1">95%</div>
                <div className="text-xs text-muted-foreground">Job Placement Rate</div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground py-6 rounded-xl font-medium"
                onClick={() => onNavigate?.('caregiver-signup')}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Become a Caregiver
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Free training • Flexible schedule • Meaningful work
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}