
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { EmailVerification } from '@/components/EmailVerification';
import { UserMinus, Mail, AlertCircle } from 'lucide-react';

interface UnsubscribeModalProps {
  onClose: () => void;
  registeredEmails: string[];
  onUnsubscribe: (email: string) => void;
}

export const UnsubscribeModal: React.FC<UnsubscribeModalProps> = ({
  onClose,
  registeredEmails,
  onUnsubscribe
}) => {
  const [email, setEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();

  const handleUnsubscribeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (!registeredEmails.includes(email)) {
      toast({
        title: "Email Not Found",
        description: "This email is not subscribed to our updates",
        variant: "destructive"
      });
      return;
    }

    setShowVerification(true);
  };

  const handleVerificationSuccess = () => {
    onUnsubscribe(email);
    setShowVerification(false);
    onClose();
    toast({
      title: "Successfully Unsubscribed",
      description: "You will no longer receive GitHub timeline updates",
    });
  };

  if (showVerification) {
    return (
      <EmailVerification
        email={email}
        onSuccess={handleVerificationSuccess}
        onClose={() => setShowVerification(false)}
      />
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <UserMinus className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">Unsubscribe from Updates</DialogTitle>
          <DialogDescription className="text-center">
            Enter your email address to unsubscribe from GitHub timeline updates.
            You'll need to verify your email address.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUnsubscribeRequest} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unsubscribe-email">Email Address</Label>
            <Input
              id="unsubscribe-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Important</p>
              <p>We'll send a verification code to confirm your unsubscribe request.</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Verification
            </Button>
          </div>
        </form>

        {registeredEmails.length > 0 && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border">
            <p className="text-sm font-medium text-slate-700 mb-2">
              Currently subscribed emails ({registeredEmails.length}):
            </p>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {registeredEmails.map((subscribedEmail, index) => (
                <p key={index} className="text-xs text-slate-600 bg-white px-2 py-1 rounded">
                  {subscribedEmail}
                </p>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
