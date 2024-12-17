import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LoginPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  const handleSendVerificationCode = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_codes')
        .insert([
          { 
            phone_number: phoneNumber,
            verification_code: Math.floor(100000 + Math.random() * 900000).toString()
          }
        ]);

      if (error) throw error;

      toast.success("Verification code sent to your phone number");
      setShowVerification(true);
    } catch (error) {
      toast.error("Error sending verification code");
      console.error("Error:", error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_codes')
        .select()
        .eq('phone_number', phoneNumber)
        .eq('verification_code', verificationCode)
        .eq('verified', false)
        .single();

      if (error) throw error;

      if (data) {
        await supabase
          .from('verification_codes')
          .update({ verified: true })
          .eq('id', data.id);

        toast.success("Phone number verified successfully!");
        setShowVerification(false);
      } else {
        toast.error("Invalid verification code");
      }
    } catch (error) {
      toast.error("Error verifying code");
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome Back</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
          redirectTo={`${window.location.origin}/dashboard`}
          showLinks={true}
          view="sign_in"
          localization={{
            variables: {
              sign_up: {
                email_label: 'Email',
                password_label: 'Create a Password',
                button_label: 'Sign Up',
              },
              sign_in: {
                email_label: 'Email',
                password_label: 'Your Password',
                button_label: 'Sign In',
              },
            },
          }}
        />

        <div className="mt-6 pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4">Phone Verification</h2>
          <div className="space-y-4">
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button 
              className="w-full"
              onClick={handleSendVerificationCode}
              disabled={!phoneNumber}
            >
              Send Verification Code
            </Button>
          </div>
        </div>

        <Dialog open={showVerification} onOpenChange={setShowVerification}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Verification Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              <Button 
                className="w-full"
                onClick={handleVerifyCode}
                disabled={verificationCode.length !== 6}
              >
                Verify Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}