
export async function fetchVirusTotalDemo(input: string, type: "ip" | "url" | "hash"): Promise<{ verdict: string; details: any }> {
  // Only returns fake demo data for now. Replace with real API as needed.
  // See: https://developers.virustotal.com/reference for real demo key integration

  await new Promise((res) => setTimeout(res, 900)); // Simulate API delay

  if (type === "ip") {
    return {
      verdict: "malicious",
      details: {
        sources: ["AbuseIPDB", "Spamhaus"],
        last_analysis_stats: { malicious: 2, harmless: 8, suspicious: 1 },
        country: "US",
      },
    };
  }
  if (type === "url") {
    return {
      verdict: "suspicious",
      details: {
        sources: ["Google Safebrowsing", "PhishTank"],
        last_analysis_stats: { malicious: 1, harmless: 9, suspicious: 2 },
        content_type: "text/html",
      },
    };
  }
  if (type === "hash") {
    return {
      verdict: "malicious",
      details: {
        sources: ["ESET", "Avira", "Kaspersky"],
        last_analysis_stats: { malicious: 11, harmless: 41, suspicious: 1 },
        file_type: "exe",
      },
    };
  }
  return {
    verdict: "unknown",
    details: {},
  };
}
