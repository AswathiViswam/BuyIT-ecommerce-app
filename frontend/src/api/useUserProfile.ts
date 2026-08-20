import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  deleteAddress,
} from "./userApi";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/auth";
import { useAppDispatch } from "../store/hooks";
import { updateUser } from "../store/slices/authSlice";
import type { CreateAddressPayload } from "../types/user";

export const useUserProfile = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: isAuthenticated,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data: { user: User }) => {
      dispatch(updateUser(data.user));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
  });

  const addressesQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
    enabled: isAuthenticated,
  });

  const addAddressMutation = useMutation({
    mutationFn: (payload: CreateAddressPayload) => addAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    user: profileQuery.data?.user,
    addresses: addressesQuery.data?.addresses || profileQuery.data?.addresses || [],
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    addAddress: addAddressMutation.mutateAsync,
    isAddingAddress: addAddressMutation.isPending,
    deleteAddress: deleteAddressMutation.mutateAsync,
    isDeletingAddress: deleteAddressMutation.isPending,
    refetchProfile: profileQuery.refetch,
  };
};
