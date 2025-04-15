import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const clockIn = createAsyncThunk(
  'attendance/clockIn',
  async ({ userId, formData }: { userId: number, formData: FormData }) => {
    const response = await fetch('/api/attendances/logs', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { clockInState: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(clockIn.fulfilled, (state, action) => {
      state.clockInState = true;
    });
  },
});

export default attendanceSlice.reducer;
