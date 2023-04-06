import axios from 'axios';
import { useMutation, UseMutationOptions } from 'react-query';

interface PostUserLocationMutationInput {
  latitude: string;
  longitude: string;
}

const postUserLocationMutationFn = async ({
  latitude,
  longitude,
}: PostUserLocationMutationInput) => {
  const url = `/api/map/user/location/`;
  const res = await axios.post(url, { latitude, longitude });
  return res.data;
};

export function usePostUserLocation(
  options?: UseMutationOptions<any, unknown, PostUserLocationMutationInput>
) {
  return useMutation(postUserLocationMutationFn, options);
}

export default usePostUserLocation;
