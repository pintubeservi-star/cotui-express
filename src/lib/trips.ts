import { supabase } from '../supabase';

export type TripRequest = {
  origin_lat: number;
  origin_lng: number;
  origin_label?: string | null;
  destination?: string | null;
};

export type TripStatus =
  | 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export type Trip = TripRequest & {
  id: string;
  user_id: string;
  status: TripStatus;
  created_at: string;
};

export async function createTrip(input: TripRequest): Promise<Trip> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('Debes iniciar sesión para pedir un viaje.');

  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: user.id,
      origin_lat: input.origin_lat,
      origin_lng: input.origin_lng,
      origin_label: input.origin_label ?? null,
      destination: input.destination?.trim() || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data as Trip;
}

export async function getActiveTrip(): Promise<Trip | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['pending', 'accepted', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as Trip) ?? null;
}
