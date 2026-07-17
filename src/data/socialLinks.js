import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa6";

// Shared across the floating social bar and the footer so brand colors/URLs
// only need to be updated in one place.
export const socialLinks = [
  {
    label: "Facebook",
    icon: FaFacebookF,
    url: "https://www.facebook.com/profile.php?id=61585701170431",
    className: "bg-[#1877F2]",
  },
  {
    label: "X (Twitter)",
    icon: FaXTwitter,
    url: "https://x.com/CAAMITSINGHPAL",
    className: "bg-black",
  },
  {
    label: "LinkedIn",
    icon: FaLinkedinIn,
    url: "https://www.linkedin.com/in/ca-amit-singh-a53322378/",
    className: "bg-[#0A66C2]",
  },
  {
    label: "Instagram",
    icon: FaInstagram,
    url: "https://www.instagram.com/caamitsingh_?igsh=ZXo5ODZyY3g4bm9i",
    className: "bg-[linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)]",
  },
  {
    label: "YouTube",
    icon: FaYoutube,
    url: "https://www.youtube.com/@CA_AmitSinghofficial",
    className: "bg-[#FF0000]",
  },
];
