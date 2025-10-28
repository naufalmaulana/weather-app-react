// src/hooks/useUserLocation.js
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchWeatherByCoords, setCity, setCoords } from "../store/appSlice";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/reverse";

// default fallback coords (Jakarta)
const FALLBACK = {
  latitude: -6.2088,
  longitude: 106.8456,
  city: "Jakarta, Indonesia",
};

export default function useUserLocation({ autoFetchWeather = true } = {}) {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    latitude: null,
    longitude: null,
    city: null,
    loading: true,
    error: null,
  });

  const isMounted = useRef(true);
  const controllerRef = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    // cleanup on unmount
    return () => {
      isMounted.current = false;
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    // Helper: do reverse-geocode
    async function reverseGeocodeAndDispatch(lat, lon) {
      // cancel previous request if exists
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      try {
        const res = await axios.get(
          `${GEOCODING_URL}?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}`,
          { signal: controllerRef.current.signal, timeout: 8000 }
        );

        const first = res.data.results?.[0];
        const cityName =
          first?.name && first?.country
            ? `${first.name}${first.admin1 ? `, ${first.admin1}` : ""}${first.country ? `, ${first.country}` : ""}`
            : first?.name || null;

        if (!isMounted.current) return;

        setState((s) => ({ ...s, city: cityName || null, loading: false, error: null }));
        // simpan ke redux
        dispatch(setCity(cityName || null));
        dispatch(setCoords({ latitude: lat, longitude: lon }));

        // fetch weather jika diinginkan
        if (autoFetchWeather) {
          const tz = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || "UTC";
          dispatch(fetchWeatherByCoords({ latitude: lat, longitude: lon, timezone: tz }));
        }
      } catch (err) {
        if (!isMounted.current) return;
        const msg = axios.isCancel?.(err) ? "Request cancelled" : err.response?.data || err.message || "Reverse geocode error";
        setState((s) => ({ ...s, city: null, loading: false, error: msg }));
        // tetap dispatch coords & weather fallback or attempt
        dispatch(setCoords({ latitude: lat, longitude: lon }));
        if (autoFetchWeather) {
          const tz = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || "UTC";
          dispatch(fetchWeatherByCoords({ latitude: lat, longitude: lon, timezone: tz }));
        }
      }
    }

    // Primary: browser geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (!isMounted.current) return;
          setState((s) => ({ ...s, latitude, longitude, loading: true, error: null }));
          reverseGeocodeAndDispatch(latitude, longitude);
        },
        (err) => {
          // kalau ditolak / gagal -> pakai fallback
          console.warn("Geolocation failed:", err.message);
          const { latitude, longitude, city } = FALLBACK;
          if (!isMounted.current) return;
          setState({ latitude, longitude, city, loading: false, error: "Izin lokasi ditolak, pakai fallback" });
          dispatch(setCity(city));
          dispatch(setCoords({ latitude, longitude }));
          if (autoFetchWeather) {
            const tz = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || "UTC";
            dispatch(fetchWeatherByCoords({ latitude, longitude, timezone: tz }));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60 * 1000,
        }
      );
    } else {
      // browser tidak support
      const { latitude, longitude, city } = FALLBACK;
      setState({ latitude, longitude, city, loading: false, error: "Browser tidak mendukung geolocation" });
      dispatch(setCity(city));
      dispatch(setCoords({ latitude, longitude }));
      if (autoFetchWeather) {
        const tz = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || "UTC";
        dispatch(fetchWeatherByCoords({ latitude, longitude, timezone: tz }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return state; // { latitude, longitude, city, loading, error }
}
