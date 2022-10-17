import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function HostTest() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Layout>
      <h1>{slug}</h1>
    </Layout>
  );
}
