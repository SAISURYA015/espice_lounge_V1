"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import pb from "../_lib/pb";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Handle authentication
  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return <div>Dashboard</div>;
};

export default Dashboard;
