import { useEffect, useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { createTrip } from '../lib/trips';
import { reverseGeocode } from '../lib/geocode';

export default function RequestTrip() {
  const { status, coords, error, request } = useGeolocation();
  const [destination, setDestination] = useState('');
  const [address, setAddress] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Convertir coordenadas a dirección legible
  useEffect(() => {
    if (!coords) return;
    reverseGeocode(coords.lat, coords.lng).then(setAddress);
  }, [coords]);

  async function handleRequest() {
    if (!coords) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createTrip({
        origin_lat: coords.lat,
        origin_lng: coords.lng,
        origin_label: address,
        destination: destination || null,
      });
      setSuccess(true);
    } catch (e: any) {
      setSubmitError(e.message ?? 'No pudimos crear tu viaje.');
    } finally {
      setSubmitting(false);
    }
  }

  // ✅ Éxito
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">🚗</div>
        <h1 className="text-2xl font-bold text-[#0b6b4b] mb-2">
          ¡Viaje solicitado!
        </h1>
        <p className="text-gray-600">
          Un conductor viene en camino. Te avisaremos por aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-[#0b6b4b] mb-1">
        Pedir un viaje
      </h1>
      <p className="text-gray-500 mb-6">
        Un toque y listo. Nosotros nos encargamos del resto.
      </p>

      {/* Bloque de ubicación */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="text-xs uppercase text-gray-400 mb-1">Recogida</div>

        {status === 'locating' && (
          <p className="text-gray-700 animate-pulse">Buscando tu ubicación…</p>
        )}

        {(status === 'denied' || status === 'error') && (
          <div>
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={request}
              className="text-sm font-semibold text-[#0b6b4b] underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {status === 'granted' && coords && (
          <p className="text-gray-800 font-medium">
            {address ?? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`}
          </p>
        )}
      </div>

      {/* Destino opcional */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="text-xs uppercase text-gray-400 mb-1">
          Destino (opcional)
        </div>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="¿A dónde vas?"
          className="w-full outline-none text-gray-800 placeholder-gray-300"
        />
      </div>

      {submitError && (
        <p className="text-red-600 text-sm mb-3">{submitError}</p>
      )}

      {/* Botón grande */}
      <button
        disabled={status !== 'granted' || submitting}
        onClick={handleRequest}
        className="mt-auto w-full py-4 rounded-2xl text-lg font-bold text-white
                   bg-[#0b6b4b] disabled:bg-gray-300 disabled:text-gray-500
                   active:scale-[0.98] transition"
      >
        {submitting ? 'Solicitando…' : 'Pedir viaje ahora'}
      </button>
    </div>
  );
}
