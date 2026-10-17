import { useCallback, useEffect, useState } from 'react';

export type GeoCoords = { lat: number; lng: number; accuracy: number };
export type GeoStatus = 'idle' | 'locating' | 'granted' | 'denied' | 'error';

export type GeoState = {
  status: GeoStatus;
  coords: GeoCoords | null;
  error: string | null;
};

export function useGeolocation(options?: PositionOptions) {
  const [state, setState] = useState<GeoState>({
    status: 'idle',
    coords: null,
    error: null,
  });

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({
        status: 'error',
        coords: null,
        error: 'Tu navegador no soporta geolocalización.',
      });
      return;
    }

    setState({ status: 'locating', coords: null, error: null });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: 'granted',
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          },
          error: null,
        });
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Activa el permiso de ubicación para pedir tu viaje.',
          2: 'No pudimos obtener tu ubicación. Revisa tu GPS.',
          3: 'Tardamos demasiado. Intenta de nuevo.',
        };
        setState({
          status: err.code === 1 ? 'denied' : 'error',
          coords: null,
          error: messages[err.code] ?? 'Error desconocido de ubicación.',
        });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000, ...options }
    );
  }, [options]);

  useEffect(() => {
    request();
  }, [request]);

  return { ...state, request };
}
