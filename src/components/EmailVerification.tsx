
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onSuccess,
  onClose
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    console.log(`Verification code for ${email}: ${code}`); // In real app, this would be sent via email
  }, [email]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode === generatedCode) {
      onSuccess();
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please check your code and try again",
        variant: "destructive"
      });
    }
  };

  const handleResendCode = () => {
    setIsResending(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setTimeRemaining(300);
    console.log(`New verification code for ${email}: ${code}`);
    
    setTimeout(() => {
      setIsResending(false);
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email",
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center">Verify Your Email</DialogTitle>
          <DialogDescription className="text-center">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-slate-700">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-wider"
            />
          </div>

          <div className="text-center text-sm text-slate-600">
            {timeRemaining > 0 ? (
              <p>Code expires in {formatTime(timeRemaining)}</p>
            ) : (
              <p className="text-red-600">Code has expired</p>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending || timeRemaining > 240}
              className="flex-1"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Code'
              )}
            </Button>
            <Button
              type="submit"
              disabled={verificationCode.length !== 6 || timeRemaining === 0}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            <strong>Demo Code:</strong> {generatedCode}
          </p>
          <p className="text-xs text-blue-600 text-center mt-1">
            (In production, this would be sent via email)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
