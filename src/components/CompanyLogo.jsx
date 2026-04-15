import { useState } from "react";

const DOMAIN_MAP = {
  Google: "google.com",
  TCS: "tcs.com",
  Infosys: "infosys.com",
  Wipro: "wipro.com",
  HCL: "hcltech.com",
  Accenture: "accenture.com",
  Zoho: "zoho.com",
  Cognizant: "cognizant.com",
  Flipkart: "flipkart.com",
  Amazon: "amazon.com",
  Microsoft: "microsoft.com",
  Meta: "meta.com",
  Apple: "apple.com",
  Razorpay: "razorpay.com",
  CRED: "cred.club",
  Swiggy: "swiggy.com",
  Zomato: "zomato.com",
  Ola: "olacabs.com",
  Paytm: "paytm.com",
  PhonePe: "phonepe.com",
  Freshworks: "freshworks.com",
  Zepto: "zeptonow.com",
  Meesho: "meesho.com",
  Capgemini: "capgemini.com",
  IBM: "ibm.com",
  Oracle: "oracle.com",
  SAP: "sap.com",
  Salesforce: "salesforce.com",
  Adobe: "adobe.com",
  Intuit: "intuit.com",
  Uber: "uber.com",
  LinkedIn: "linkedin.com",
  Netflix: "netflix.com",
  Nvidia: "nvidia.com",
  Qualcomm: "qualcomm.com",
  Intel: "intel.com",
  Cisco: "cisco.com",
  Deloitte: "deloitte.com",
  "JP Morgan": "jpmorgan.com",
  "Goldman Sachs": "goldmansachs.com",
  "Morgan Stanley": "morganstanley.com",
  Dunzo: "dunzo.in",
  "Twitter/X": "x.com",
  EY: "ey.com",
  KPMG: "kpmg.com",
  "Byju's": "byjus.com",
  Unacademy: "unacademy.com",
  Vedantu: "vedantu.com",
  "L&T Infotech": "ltimindtree.com",
  Mphasis: "mphasis.com",
  Hexaware: "hexaware.com",
  "Mahindra Tech": "techmahindra.com",
};

// ✅ These domains return a globe icon — skip favicon, show initials directly
const BROKEN_FAVICONS = new Set([
  "tcs.com",
  "hcltech.com",
  "olacabs.com",
  "dunzo.in",
  "ltimindtree.com",
  "techmahindra.com",
  "mphasis.com",
  "hexaware.com",
  "vedantu.com",
  "byjus.com",
]);

const GRADIENT_COLORS = [
  "from-indigo-500 to-violet-600",
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-cyan-500 to-blue-600",
];

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getGradient(name) {
  const idx = name.charCodeAt(0) % GRADIENT_COLORS.length;
  return GRADIENT_COLORS[idx];
}

export default function CompanyLogo({ name, domain, size = 40, className = "" }) {
  const [failed, setFailed] = useState(false);

  const resolvedDomain = domain || DOMAIN_MAP[name];

  // Skip favicon for known broken domains
  const skipFavicon = !resolvedDomain || BROKEN_FAVICONS.has(resolvedDomain);
  const logoUrl = skipFavicon
    ? null
    : `https://www.google.com/s2/favicons?domain=${resolvedDomain}&sz=128`;

  const style = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: 8,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size * 0.35,
    fontWeight: 600,
    fontFamily: "SF Pro Display, -apple-system, sans-serif",
  };

  if (logoUrl && !failed) {
    return (
      <div style={style} className={`bg-white border border-white/10 ${className}`}>
        <img
          src={logoUrl}
          alt={name}
          width={size}
          height={size}
          style={{ objectFit: "contain", width: "80%", height: "80%" }}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      style={style}
      className={`bg-gradient-to-br ${getGradient(name)} text-white ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}