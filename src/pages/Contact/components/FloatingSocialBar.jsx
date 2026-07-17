import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa6";

const socialLinks = [
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

export const FloatingSocialBar = () => {
  return (
    <div
      className="fixed right-0 top-[65%] z-40 flex -translate-y-1/2 flex-col gap-1.5 sm:gap-2"
      aria-label="Social media links"
    >
      {socialLinks.map(({ label, icon: Icon, url, className }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg text-white shadow-md transition-all duration-300 ease-out hover:-translate-x-1 hover:brightness-110 focus-visible:-translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-11 sm:w-11 lg:h-10 lg:w-10 ${className}`}
        >
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
};
