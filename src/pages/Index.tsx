
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GitHubTimeline } from '@/components/GitHubTimeline';
import { EmailVerification } from '@/components/EmailVerification';
import { UnsubscribeModal } from '@/components/UnsubscribeModal';
import { GitBranch, Mail, Users, Bell } from 'lucide-react';

const Index = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load registered emails from localStorage (simulating registered_emails.txt)
    const emails = localStorage.getItem('registered_emails');
    if (emails) {
      setRegisteredEmails(JSON.parse(emails));
    }
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (registeredEmails.includes(email)) {
      toast({
        title: "Already Subscribed",
        description: "This email is already subscribed to updates",
        variant: "destructive"
      });
      return;
    }

    setShowVerification(true);
    toast({
      title: "Verification Code Sent",
      description: "Check your email for the verification code",
    });
  };

  const handleVerificationSuccess = () => {
    const updatedEmails = [...registeredEmails, email];
    setRegisteredEmails(updatedEmails);
    localStorage.setItem('registered_emails', JSON.stringify(updatedEmails));
    setIsSubscribed(true);
    setShowVerification(false);
    toast({
      title: "Successfully Subscribed!",
      description: "You'll receive GitHub timeline updates every 5 minutes",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-800">GitHub Timeline</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Users className="h-4 w-4" />
                <span>{registeredEmails.length} subscribers</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUnsubscribe(true)}
                className="flex items-center space-x-1"
              >
                <Mail className="h-4 w-4" />
                <span>Unsubscribe</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscription Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-slate-800">
                  Stay Updated
                </CardTitle>
                <CardDescription>
                  Get the latest GitHub timeline updates delivered to your inbox every 5 minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isSubscribed ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Subscribe to Updates
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-800 font-medium">✅ Successfully Subscribed!</p>
                      <p className="text-green-600 text-sm mt-1">
                        You're receiving updates at: {email}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubscribed(false);
                        setEmail('');
                      }}
                      className="w-full"
                    >
                      Subscribe Another Email
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* GitHub Timeline */}
          <div className="lg:col-span-2">
            <GitHubTimeline />
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerification && (
        <EmailVerification
          email={email}
          onSuccess={handleVerificationSuccess}
          onClose={() => setShowVerification(false)}
        />
      )}

      {/* Unsubscribe Modal */}
      {showUnsubscribe && (
        <UnsubscribeModal
          onClose={() => setShowUnsubscribe(false)}
          registeredEmails={registeredEmails}
          onUnsubscribe={(emailToRemove) => {
            const updatedEmails = registeredEmails.filter(e => e !== emailToRemove);
            setRegisteredEmails(updatedEmails);
            localStorage.setItem('registered_emails', JSON.stringify(updatedEmails));
            if (email === emailToRemove) {
              setIsSubscribed(false);
              setEmail('');
            }
          }}
        />
      )}
    </div>
  );
};

export default Index;
