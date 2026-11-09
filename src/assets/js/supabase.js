/* ==============================================
   The Godfather - Archivo Corleone - Supabase Client
   Conexión con base de datos para opiniones
   ============================================== */

import { createClient } from '@supabase/supabase-js';

// Variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Configuración del cliente Supabase con políticas de seguridad
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'the-godfather-bootstrap/1.0.0'
    }
  }
};

// Crear cliente Supabase solo si las credenciales son válidas
export const supabaseClient = (supabaseUrl && supabaseAnonKey && 
  supabaseAnonKey !== 'tu-clave-anon-key-publicable') ? 
  createClient(supabaseUrl, supabaseAnonKey, supabaseConfig) : null;

// Funciones de ayuda para operaciones de base de datos
export const db = {
  async getAllReviews() {
    if (!supabaseClient) {
      console.warn('Supabase no configurado');
      return [];
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('movie_reviews')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo reviews:', error);
      throw error;
    }
  },

  async addReview(reviewData) {
    if (!supabaseClient) {
      throw new Error('Supabase no configurado');
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('movie_reviews')
        .insert([reviewData])
        .select();
        
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error agregando review:', error);
      throw error;
    }
  },

  async getRandomReviews(count = 3) {
    if (!supabaseClient) return [];
    
    try {
      const { data, error } = await supabaseClient
        .from('movie_reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(count);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo reviews aleatorias:', error);
      return [];
    }
  },

  async deleteReview(id) {
    if (!supabaseClient) {
      throw new Error('Supabase no configurado');
    }
    
    try {
      const { error } = await supabaseClient
        .from('movie_reviews')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error eliminando review:', error);
      throw error;
    }
  }
};

// Función para verificar si Supabase está disponible
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseAnonKey !== 'tu-clave-anon-key-publicable');
};

// Función para obtener el estado de la conexión
export const getSupabaseStatus = async () => {
  if (!supabaseClient) {
    return { configured: false, error: 'Credenciales no configuradas' };
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('movie_reviews')
      .select('*', { count: 'exact' })
      .limit(1);
      
    if (error) throw error;
    
    return { 
      configured: true, 
      connected: true,
      error: null,
      sampleData: data?.[0] || null
    };
  } catch (error) {
    return { 
      configured: true, 
      connected: false,
      error: error.message,
      sampleData: null
    };
  }
};

// Función de respaldo para almacenamiento local
export const localStorageManager = {
  getReviews() {
    try {
      return JSON.parse(localStorage.getItem('movie_reviews') || '[]');
    } catch {
      return [];
    }
  },

  addReview(reviewData) {
    try {
      const reviews = this.getReviews();
      reviews.unshift(reviewData);
      localStorage.setItem('movie_reviews', JSON.stringify(reviews));
      return reviewData;
    } catch {
      throw new Error('Error guardando en localStorage');
    }
  },

  deleteReview(id) {
    try {
      const reviews = this.getReviews();
      const filtered = reviews.filter(r => r.id !== id);
      localStorage.setItem('movie_reviews', JSON.stringify(filtered));
      return true;
    } catch {
      throw new Error('Error eliminando de localStorage');
    }
  }
};