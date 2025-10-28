import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from 'axios';

const initialState = {
    coords: null,
    city: null,
    timezone: null,
    data: null,
    status: 'idle',
    error: null,
}

export const appSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCoords(state, action) {
      state.coords = action.payload;
    },
    setCity(state, action) {
      state.city = action.payload;
    },
  },
   extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coords = action.payload.coords;
        state.timezone = action.payload.timezone;
        state.data = action.payload.data;
      })
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
})

export const { setCoords, setCity } = appSlice.actions

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
export const fetchWeatherByCoords = createAsyncThunk( 
  'weather/fetchByCoords', 
  async ({ latitude, longitude, timezone }, thunkAPI) => { 
    try { 
      const params = { 
        latitude, 
        longitude, 
        daily: 'weather_code,temperature_2m_max,temperature_2m_min', 
        hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m', 
        timezone: timezone || 'UTC', 
      }; 
      const response = await axios.get(BASE_URL, { params }); 
      // console.log(response.data);
      
      return { coords: { latitude, longitude }, timezone: params.timezone, data: response.data }; 
    } catch (err) { 
      return thunkAPI.rejectWithValue(err.response?.data || err.message); 
    } } );

export default appSlice.reducer