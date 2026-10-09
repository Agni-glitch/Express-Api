const dns = require("dns");

// On some Windows setups Node ends up with 127.0.0.1 as its only DNS server, so the SRV
// lookup behind a mongodb+srv:// URL fails with "querySrv ECONNREFUSED" although the
// system resolver works. When that happens, switch Node to public resolvers
// (override with DNS_SERVERS=ip1,ip2).
module.exports = async (connStr) => {
  if (!/^mongodb\+srv:\/\//.test(connStr || "")) return;
  try {
    const host = new URL(connStr).hostname;
    await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
  } catch (err) {
    if (err.code !== "ECONNREFUSED") return;
    const servers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    dns.setServers(servers);
    console.log(`DNS server refused the MongoDB SRV lookup, using ${servers.join(", ")} instead`);
  }
};
