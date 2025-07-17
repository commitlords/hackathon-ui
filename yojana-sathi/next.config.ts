import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig = {};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
})(withFlowbiteReact(nextConfig));
