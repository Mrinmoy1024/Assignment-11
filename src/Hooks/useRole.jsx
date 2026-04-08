import React from "react";
import useAuth from "./useAuth";
import axiosSecure from "./axiosSecure";
import { useQuery } from "@tanstack/react-query";

const useRole = () => {
  const { user, loading } = useAuth();

  const { data: role, isLoading: isRoleLoading } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ["role", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/role/${user?.email}`);
      return data.role;
    },
  });

  return [role, isRoleLoading];
};

export default useRole;
