import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://jtevyqaooasufpgootyo.supabase.co';


const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0ZXZ5cWFvb2FzdWZwZ29vdHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyODQ2NTAsImV4cCI6MjEwNjg2MDY1MH0.hNX_c-jIX4hgBAvYBWUAgUt12QQOyagka3Bn7EFa8r0';


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});


if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}


export async function checkSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true, message: 'Connected to Supabase' };
  } catch (err: any) {
    return { ok: false, message: err?.message ?? 'Network error' };
  }
}



