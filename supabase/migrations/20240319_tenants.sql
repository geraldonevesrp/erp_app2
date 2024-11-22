-- Create tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    name TEXT NOT NULL,
    subdomain TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active'::TEXT,
    settings JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT tenants_subdomain_check CHECK ((subdomain ~* '^[a-z0-9][a-z0-9-]*[a-z0-9]$'::TEXT))
);

-- Create users_tenants table
CREATE TABLE IF NOT EXISTS public.users_tenants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'user'::TEXT,
    UNIQUE(user_id, tenant_id)
);

-- Create RLS policies
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_tenants ENABLE ROW LEVEL SECURITY;

-- Tenants policies
CREATE POLICY "Tenants are viewable by authenticated users" ON public.tenants
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users_tenants ut
            WHERE ut.tenant_id = tenants.id
            AND ut.user_id = auth.uid()
        )
    );

-- Users_tenants policies
CREATE POLICY "Users can view their own tenant associations" ON public.users_tenants
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Insert example tenant
INSERT INTO public.tenants (name, subdomain) 
VALUES ('The Best Company', 'thebest')
ON CONFLICT (subdomain) DO NOTHING;
