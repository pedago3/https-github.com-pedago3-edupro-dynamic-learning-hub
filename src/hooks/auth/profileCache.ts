
import { Profile } from './types';

// Cache pour éviter les appels répétés
export let profileCache: { [userId: string]: Profile | null } = {};
export let profileFetchPromises: { [userId: string]: Promise<Profile | null> } = {};

export const clearProfileCache = () => {
  profileCache = {};
  profileFetchPromises = {};
};

export const getCachedProfile = (userId: string): Profile | null => {
  return profileCache[userId];
};

export const setCachedProfile = (userId: string, profile: Profile | null) => {
  profileCache[userId] = profile;
};

export const getProfileFetchPromise = (userId: string): Promise<Profile | null> | undefined => {
  return profileFetchPromises[userId];
};

export const setProfileFetchPromise = (userId: string, promise: Promise<Profile | null>) => {
  profileFetchPromises[userId] = promise;
};

export const deleteProfileFetchPromise = (userId: string) => {
  delete profileFetchPromises[userId];
};
