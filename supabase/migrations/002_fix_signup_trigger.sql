/*
  Fix signup failures caused by duplicate email in public.users
  Run this in Supabase SQL Editor if signup returns 500 / users_email_partial_key
*/

-- Remove public.users rows that have no matching auth user (orphaned profiles)
DELETE FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users a WHERE a.id = u.id
);

-- Replace trigger function with idempotent version
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.users
  WHERE email = NEW.email AND id != NEW.id;

  INSERT INTO public.users (id, email, name, created_at, onboarding_completed, has_seen_welcome, has_seen_privacy)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NOW(),
    false,
    false,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
