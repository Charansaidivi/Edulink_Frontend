import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileImage: null,
  enrolledSessions: [],
  teachingSessions: [],
  username: '',
  email: '',
  ratings: 0,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      return { ...state, ...action.payload };
    },
    setProfileImage(state, action) {
      state.profileImage = action.payload;
    },
    setEnrolledSessions(state, action) {
      state.enrolledSessions = action.payload;
    },
    setTeachingSessions(state, action) {
      state.teachingSessions = action.payload;
    },
  },
});

export const { setProfile, setProfileImage, setEnrolledSessions, setTeachingSessions } = profileSlice.actions;
export default profileSlice.reducer;
        