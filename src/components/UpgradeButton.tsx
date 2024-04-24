'use client'
import { FC } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { BILLING_URL } from "@/constants/stripe";
import { useRouter } from "next/navigation";

const UpgradeButton: FC = () => {

  const router = useRouter();
  const upgradePlan = async () => {
    const res = await axios.post<{url: string}>('/api/billing');
    const url = res.data.url;

    router.push(url ?? BILLING_URL);
  }

	return (
    <Button className="w-full" onClick={upgradePlan}>
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
	);
};

export default UpgradeButton;
