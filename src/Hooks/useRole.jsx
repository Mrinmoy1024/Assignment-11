import React from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./axiosSecure";
import { useQuery } from "@tanstack/react-query";
const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading: isRoleLoading } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ["role", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure(`/users/role/${user?.email}`);
      return data.role;
    },
  });
  return [role, isRoleLoading];
};

export default useRole;
