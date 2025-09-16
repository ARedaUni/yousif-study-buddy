import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Brain, Clock, BarChart3, BookOpen, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-4">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Learning
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Smart Revision
              <span className="text-blue-600"> Timetable</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Transform your GCSE preparation with AI-generated revision schedules. 
              Perfect for UK Year 10 students seeking organized, effective study plans.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>AI-Powered Scheduling</CardTitle>
              <CardDescription>
                Smart algorithms create optimal revision timetables based on your availability and learning preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Spaced repetition</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Target className="w-4 h-4" />
                  <span>Subject rotation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Multiple Views</CardTitle>
              <CardDescription>
                Switch between week, month, and timeline views to visualize your study plan in the way that works best
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Weekly grid layout</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>Timeline visualization</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>GCSE Focused</CardTitle>
              <CardDescription>
                Pre-configured for UK Year 10 students with common subjects, school hours, and exam preparation strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Auto-block school hours</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Target className="w-4 h-4" />
                  <span>Exam countdown</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to ace your GCSEs?
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Join thousands of students who have improved their grades with smart, personalized revision planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              <Calendar className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              <BookOpen className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t bg-gray-50/50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 Smart Revision Timetable. Built for GCSE success.</p>
        </div>
      </footer>
    </div>
  );
}
