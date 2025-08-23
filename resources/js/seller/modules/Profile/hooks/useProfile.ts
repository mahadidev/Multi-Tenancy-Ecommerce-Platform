import useToast from "@seller/_hooks/useToast";
import { useAppSelector } from "@seller/store/store";
import { useNavigate } from "react-router-dom";
import {
    PasswordUpdatePayload,
    ProfileUpdatePayload,
    useFetchProfileQuery,
    useUpdatePasswordMutation,
    useUpdateProfileMutation,
} from "../store/profileApi";

const useProfile = () => {
  const { toaster } = useToast();
  const navigate = useNavigate();

  // Fetch profile data
  const { data: profileData, isLoading: isFetchingProfile, error: fetchProfileError } = useFetchProfileQuery();

  // Select profile from auth state (since profile data is shared with auth)
  const { userProfileData } = useAppSelector((state) => state.auth);

  // Update profile
  const [
    handleUpdateProfile,
    {
      isLoading: isUpdateProfileLoading,
      isError: isUpdateProfileError,
      error: updateProfileError,
      data: updateProfileData,
    },
  ] = useUpdateProfileMutation();

  const updateProfile = ({
    formData,
    onSuccess,
  }: {
    formData: ProfileUpdatePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdateProfile(formData).then((response) => {
      if (response.data?.status === 200) {
        toaster({
          text: "Profile updated successfully",
          status: "success",
        });
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Update password
  const [
    handleUpdatePassword,
    {
      isLoading: isUpdatePasswordLoading,
      isError: isUpdatePasswordError,
      error: updatePasswordError,
      data: updatePasswordData,
    },
  ] = useUpdatePasswordMutation();

  const updatePassword = ({
    formData,
    onSuccess,
  }: {
    formData: PasswordUpdatePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdatePassword(formData).then((response) => {
      if (response.data?.status === 200) {
        toaster({
          text: "Password updated successfully",
          status: "success",
          description: "You will be redirected to login",
        });
        // Redirect to login after password change
        setTimeout(() => {
          navigate("/login?guidAlertMessage=Your password has been changed. Please login again.");
        }, 2000);
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  return {
    // Profile data
    profileData: userProfileData || profileData?.data?.user,
    isFetchingProfile,
    fetchProfileError,

    // Update profile
    updateProfile: {
      submit: updateProfile,
      isLoading: isUpdateProfileLoading,
      isError: isUpdateProfileError,
      error: updateProfileError,
      data: updateProfileData,
    },

    // Update password
    updatePassword: {
      submit: updatePassword,
      isLoading: isUpdatePasswordLoading,
      isError: isUpdatePasswordError,
      error: updatePasswordError,
      data: updatePasswordData,
    },
  };
};

export default useProfile;
