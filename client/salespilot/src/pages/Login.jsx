import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from '../components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const userData = {
        email,
        name: email.split('@')[0],
        isLoggedIn: true
      };
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: "Success",
        description: "Login successful!"
      });
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username,
          password,
          role: 'user'
        })
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Registration successful! Please log in."
        });
        setIsRegister(false);
        setEmail('');
        setUsername('');
        setPassword('');
      } else {
        toast({
          title: "Error",
          description: data.error || "Registration failed.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isRegister ? "Register for SalesPilot" : "Welcome to SalesPilot"}
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            {isRegister
              ? "Create your account to get started"
              : "Enter your credentials to access your dashboard"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? isRegister ? "Registering..." : "Signing in..."
                : isRegister ? "Register" : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setIsRegister(false)}
                  type="button"
                >
                  Login here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setIsRegister(true)}
                  type="button"
                >
                  Register here
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
