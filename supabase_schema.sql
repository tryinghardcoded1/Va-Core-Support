-- Create custom types
CREATE TYPE user_role AS ENUM ('worker', 'employer', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE job_status AS ENUM ('open', 'closed', 'draft', 'pending', 'approved', 'rejected');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'worker'::user_role,
  status user_status DEFAULT 'approved'::user_status,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Worker specific columns
  headline TEXT,
  detailed_skills JSONB DEFAULT '[]'::jsonb,
  experience_years TEXT,
  hourly_rate NUMERIC,
  monthly_salary NUMERIC,
  availability TEXT,
  portfolio_url TEXT,
  id_proof_score INTEGER DEFAULT 0,
  paypal_email TEXT,
  wise_account TEXT,
  
  -- Employer specific columns
  company_name TEXT,
  company_website TEXT,
  industry TEXT,
  subscription_plan TEXT DEFAULT 'free',
  current_period_end TIMESTAMP WITH TIME ZONE
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT,
  budget NUMERIC,
  salary_range TEXT,
  status job_status DEFAULT 'approved'::job_status,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  worker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  status application_status DEFAULT 'pending'::application_status,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(job_id, worker_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Everyone can view worker profiles
CREATE POLICY "Everyone can view worker profiles" 
  ON public.profiles FOR SELECT 
  USING (role = 'worker');

-- Everyone can view employer profiles (needed for job listings)
CREATE POLICY "Everyone can view employer profiles" 
  ON public.profiles FOR SELECT 
  USING (role = 'employer');

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Jobs Policies
-- Everyone can view open/approved jobs
CREATE POLICY "Everyone can view open jobs" 
  ON public.jobs FOR SELECT 
  USING (status IN ('open', 'approved'));

-- Employers can manage their own jobs
CREATE POLICY "Employers can manage own jobs" 
  ON public.jobs FOR ALL 
  USING (auth.uid() = employer_id);

-- Applications Policies
-- Workers can view their own applications
CREATE POLICY "Workers can view own applications" 
  ON public.applications FOR SELECT 
  USING (auth.uid() = worker_id);

-- Employers can view applications for their jobs
CREATE POLICY "Employers can view applications for their jobs" 
  ON public.applications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = applications.job_id 
      AND jobs.employer_id = auth.uid()
    )
  );

-- Workers can create applications
CREATE POLICY "Workers can create applications" 
  ON public.applications FOR INSERT 
  WITH CHECK (auth.uid() = worker_id);

-- Messages Policies
-- Users can view messages they sent or received
CREATE POLICY "Users can view their messages" 
  ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages
CREATE POLICY "Users can send messages" 
  ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Auto-Create Trigger for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'worker'::user_role),
    'approved'::user_status
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for messages
alter publication supabase_realtime add table messages;
